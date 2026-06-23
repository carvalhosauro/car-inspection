# Design — Refinamento do plano `apps/mobile` (alinhamento com a API construída)

- **Data:** 2026-06-21
- **Status:** Aprovado (design) — pronto para aplicar no plano
- **Alvo:** `docs/superpowers/plans/2026-06-10-03-mobile.md`
- **Spec-fonte:** `docs/superpowers/specs/2026-06-10-vistoria-locadoras-monolito-design.md` (§5 IA, §6 auth, §7 API, §8.3 telas)

---

## 1. Contexto

O plano `apps/mobile` foi escrito em 2026-06-10, **antes** de a API existir. Desde então `foundation`, `api` e `web` foram implementados e commitados. Ao validar o plano contra o código **realmente construído** (`apps/api`, `packages/api-client`, `packages/contracts`), surgiram divergências: formatos de resposta, rotas, e contratos que o plano assumiu não batem com o que existe. `apps/mobile` é a última peça; este documento congela as correções antes da implementação.

Princípio: o plano segue válido em arquitetura e cobertura de telas (§8.3). As mudanças são **correções de aderência** ao que a API expõe, mais duas decisões de escopo aprovadas pelo usuário.

---

## 2. Decisões aprovadas

| Decisão | Escolha | Razão |
|---|---|---|
| Refresh de token / persistência de sessão | **Completo** | API já tem `POST /v1/auth/refresh` (público); access token ~15min. App de campo não pode perder sessão no meio da vistoria nem exigir login a cada cold start. Sem isso, guardar o refresh token no secure-store (§6.1) é inútil e a resiliência §5.7 quebra. |
| SDK Expo + execução das verificações manuais | **SDK estável mais recente + Expo Go** | Hoje é 2026-06-21. Expo Go em celular atual roda **somente o SDK mais recente**; os passos de verificação manual do plano dizem "abrir no Expo Go". Versões native hand-pinned para SDK 52 arriscam quebra de install/runtime. |

---

## 3. Achados de divergência (plano vs. construído)

Fatos verificados lendo o código (file:line nas Files of record, §8):

- **Upload — formato.** `POST /v1/uploads/sign` (prefixo `/v1/uploads`, rota `/sign`) responde `201 { filePath, signedUrl, token }` via Supabase `createSignedUploadUrl` (`uploads/route.ts:18-22`, `core/storage/index.ts:14-28`). O `signedUrl` é **absoluto e já contém o `token` na query string** (`@supabase/storage-js@2.108.2`: `signedUrl = this.url + path + ?token`). O plano assume `{ uploadUrl, filePath }` + `PUT uploadUrl` com `body: blob` — nome de campo errado **e mecânica errada**.
- **Upload — mecânica (corrigido após revisão).** O upload ao `signedUrl` é **`PUT` com corpo `multipart/form-data`**, não bytes crus com `content-type: image/jpeg`. O `uploadToSignedUrl` do storage-js, para um Blob, embrulha em `FormData` (campo `cacheControl` + arquivo no campo `''`) e manda header `x-upsert` (`StorageFileApi.ts:274-341`). Um `PUT` de bytes crus pode ser rejeitado pelo Storage. Não há anon key no ambiente (só `SUPABASE_SERVICE_KEY`, server-side) — mas como o `signedUrl` absoluto já vem pronto e o `token` autoriza, o mobile sobe via `FormData` para o `signedUrl` **sem cliente Supabase nem env extra** (detalhe em §4.A).
- **api-client.** O arquivo atual `packages/api-client/src/index.ts` já tem `auth.login/me`, `vehicles`, `templates`, `inspections.{create,get,myToday,start,items,finish}`, `evidences.create`, além de `export type { TokenGetter }` e o alias `Page<T>`. O **web depende** de `vehicles`/`templates` via `api.base.*` (verificado: `vehicles/page.tsx:9`, `checklists/page.tsx:11`, `template-editor.tsx:41`). O plano (Task 10) manda **substituir o arquivo inteiro** — apagaria essas seções e exports. Tem que ser **append-only**.
- **`myToday` vs `history`.** `GET /v1/me/inspections` (date opcional) responde `{ items }` **sem cursor** (`inspections/route.ts:141-148`) — **mantém** `{ items }`. `GET /v1/me/inspections/history` responde `pageSchema(inspectionDto)` = `{ items, nextCursor }` e aceita querystring de paginação (`route.ts:150-157`) — o plano tipa só `{ items }`. **Só o `history` vira `Page`.**
- **Rota de evidência.** `POST /v1/inspection-items/:id/evidences`, body `createEvidenceInput` com **`idempotencyKey: z.string().min(1)` obrigatório** (`contracts/src/inspection.ts:71`) — chave ausente é **400**, não no-op de dedup. Resposta `201` + `evidenceDto` (`accepted: boolean|null`, `validation: record|null`). Dedup por `(inspectionItemId, idempotencyKey)` (`evidences/repo.ts:29-45`, `service.ts:33-34`); se `accepted === true` → item `conforme`. O `422` da spec-fonte §8.4 foi superado (sempre `201` + corpo). Bate com o plano.
- **`createChild`.** `POST /v1/inspection-items/:id/children` aceita `{ labelSnapshot, order(default 0) }` e **ignora `justification`** (`evidences/route.ts:42`; `service.addChild` não lê esse campo). O plano envia `{ labelSnapshot, justification }`.
- **`patchItem`.** `PATCH /v1/inspection-items/:id` aceita `{ status?, justification? }`. Bate com o plano.
- **`auth.refresh`.** `POST /v1/auth/refresh` é público (`app.ts:25` `PUBLIC_ROUTES`), body `{ refreshToken }`, resposta `{ accessToken }` (`auth/route.ts:23-30`). Access TTL **15min** / refresh **7 dias** (`core/auth/tokens.ts:4-5`). O api-client **não** expõe `refresh`; o auth-context do plano guarda o refresh token mas **nunca o usa** (bootstrap é no-op).
- **http compartilhado.** `packages/api-client/src/http.ts:11` (`createHttp.request`) chama `await getToken()` em **toda** requisição para montar o header `authorization`, e é consumido por **web e mobile** (web via `WebApi.base` com `TokenGetter` que lê o cookie). **Não** se adiciona interceptor de 401 no http compartilhado — mudaria o comportamento do web. (Correção factual: o web **não** faz refresh — `session/route.ts` só grava access+refresh num cookie httpOnly no login e nunca chama `/auth/refresh`; a justificativa para não tocar o http é simplesmente *não alterar o cliente compartilhado*.)

---

## 4. Refinamentos

Cada item lista a mudança concreta e as tasks do plano afetadas.

### A. Upload (Tasks 5, 10, 15, 16)

Caminho **primário** (decidido): `PUT` com `multipart/form-data` ao `signedUrl` absoluto, espelhando o branch de Blob do `uploadToSignedUrl` do storage-js — usando `FormData` nativo do RN (parte de arquivo `{ uri, name, type }`), **sem** `fetch(uri).blob()` (que é instável no Android/Expo Go) e **sem** dependência `@supabase/*` nem env Supabase no mobile.

- `api-client`: `uploads.sign(b: { contentType: string }) => http.post<SignUploadResponse>("/v1/uploads/sign", b)` onde `SignUploadResponse = { filePath: string; signedUrl: string; token: string }`.
- `src/lib/upload.ts` — `signAndUpload(localUri, sign)`:
  1. `const resized = await manipulateAsync(localUri, [{ resize: { width: 1280 } }], { compress: 0.7, format: SaveFormat.JPEG });`
  2. `const { signedUrl, filePath } = await sign({ contentType: "image/jpeg" });`
  3. monta o corpo multipart (espelha o SDK — campo `cacheControl` + arquivo no campo `''`):
     ```ts
     const fd = new FormData();
     fd.append("cacheControl", "3600");
     fd.append("", { uri: resized.uri, name: "photo.jpg", type: "image/jpeg" } as any);
     ```
  4. `const put = await fetch(signedUrl, { method: "PUT", body: fd, headers: { "x-upsert": "false" } });` — **não** setar `content-type` manualmente (o RN gera o boundary do multipart).
  5. `if (!put.ok) throw new Error(\`Upload failed (status ${put.status})\`); return filePath;`
- `SignFn` retorna `{ filePath, signedUrl, token }` (token já embutido no `signedUrl`; faz parte do contrato).
- `upload.test.ts`: mock de `sign` retorna `{ signedUrl, filePath, token }`; asserção: segundo `fetch` mira `signedUrl`, `method "PUT"`, `body instanceof FormData`. `manipulateAsync` mockado (Task 2).
- Verificação manual (Task 15/16): o `PUT` vai ao bucket homolog real (`vistoria-homolog`) para confirmar contra o Storage de verdade. **Fallback documentado** (se o multipart cru for recusado): `@supabase/storage-js` `uploadToSignedUrl(filePath, token, file)` — exige `EXPO_PUBLIC_SUPABASE_URL` + bucket no mobile (token autoriza, sem anon key) e a dep extra. Registrar o resultado do passo manual; só adotar o fallback se necessário.

### B. api-client — extensão cirúrgica (Task 10)

**Descartar o bloco de código de substituição-de-arquivo-inteiro da Task 10 do plano** (linhas ~1424-1483, que recriam `auth/vehicles/templates/...`). Em vez disso, **adicionar** ao objeto existente em `packages/api-client/src/index.ts`, preservando `vehicles`, `templates`, `export type { TokenGetter }`, `Page<T>` e tudo mais. Adições:

```ts
auth: {
  // ...login, me
  refresh: (refreshToken: string) =>
    http.post<{ accessToken: string }>("/v1/auth/refresh", { refreshToken }),
},
inspections: {
  // ...create, get, myToday, start, items, finish
  history: () => http.get<Page<InspectionDto>>("/v1/me/inspections/history"),
},
inspectionItems: {
  update: (id: string, b: { status?: ItemStatus; justification?: string }) =>
    http.patch<InspectionItemDto>(`/v1/inspection-items/${id}`, b),
  createChild: (id: string, b: { labelSnapshot: string; order?: number }) =>
    http.post<InspectionItemDto>(`/v1/inspection-items/${id}/children`, b),
},
uploads: {
  sign: (b: { contentType: string }) =>
    http.post<SignUploadResponse>("/v1/uploads/sign", b),
},
```

- Importar `ItemStatus` de `@vistoria/contracts`. Declarar e exportar `SignUploadResponse`.
- Verificação: `pnpm --filter @vistoria/api-client typecheck` **e** `pnpm --filter @vistoria/web typecheck` (garante que web não regrediu).

### C. Auth refresh completo (Task 6) — react-on-401 + bootstrap

**Decisão de design (revisada):** refresh **reativo a 401** + refresh no bootstrap. **Sem decodificar JWT no device** (não há primitivo base64url garantido no Hermes; `atob`/`Buffer` não confiáveis — e um teste verde no Jest/Node daria falsa confiança). Sem interceptor no http compartilhado. Isto dissolve de uma vez os riscos de recursão e de decode-no-Hermes.

Peças:

- **Memória do access token** (`auth/token-memory.ts`): `getAccess()/setAccess(t|null)` num módulo simples, compartilhado por `getToken`, pelo bootstrap e pelo handler de erro do React Query — sem precisar passar por React context.
- **`getToken`** (passado a `createApiClient`): **apenas lê** `getAccess()`. Nunca dispara refresh (sem recursão).
- **`ensureFreshAccess()`** (`auth/refresh.ts`): refresh via **cliente bare** `createApiClient(baseUrl, () => null)` — getter que sempre retorna `null`, então a chamada de refresh **não re-entra** no `getToken` autenticado (mesmo padrão de `apps/web/src/app/api/session/route.ts:31`, que usa `() => null` para a chamada não autenticada). Lê o refresh token do secure-store, chama `bareClient.auth.refresh(rt)`, faz `setAccess(novo)`. **Singleton in-flight**: uma única Promise compartilhada para N chamadas concorrentes (evita estampida de refresh quando várias queries 401 juntas). Falha (refresh inválido/expirado) → limpa tokens + `setAccess(null)` → `/login`.
- **Reativo (React Query)** (`lib/query-client.ts`): `QueryCache`/`MutationCache` com `onError` que, ao ver `ApiError` status `401`, chama `ensureFreshAccess()` e re-busca (`invalidateQueries`). Mutations: default `retry: (n, e) => n < 1 && isUnauthorized(e)` para que a re-tentativa única carregue o access fresco.
- **Bootstrap** (substitui o no-op): ao iniciar, se há refresh token no secure-store → `ensureFreshAccess()` → logado; senão → `/login`. `bootstrapped` libera o gate só após a tentativa.
- **`login`**: grava os dois tokens (refresh no secure-store, access via `setAccess`). **`logout`**: limpa secure-store + `setAccess(null)`.
- **Sinal reativo para o gate:** `token-memory` não dispara re-render. O `auth-context` mantém um estado React `isAuthenticated: boolean` (+ `bootstrapped`) atualizado em login/logout/bootstrap/refresh-falho; o `AuthGate` (Task 6) e o `(app)/_layout` (Task 7) roteiam por esse sinal, enquanto `getToken`/React Query leem o `token-memory`. (O plano hoje expõe `token: string|null` no contexto — substituir por `isAuthenticated`/`bootstrapped`.)
- Testes (Jest, sem device): 
  - `ensureFreshAccess`: com refresh token salvo → `auth.refresh` (no bare client) chamado → `getAccess()` populado; chamadas concorrentes → `auth.refresh` chamado **uma vez** (singleton); refresh rejeitado → tokens limpos.
  - `auth-context`/bootstrap: refresh token salvo → fica logado; sem refresh token → deslogado.
  - mantém o teste de login existente.
- **Não** usar `jwt-decode` nem decodificar `exp` — não é necessário no modelo reativo.

### D. Justificativa de não conformidade (Task 17)

- `createChild` no api-client: body `{ labelSnapshot, order? }` (sem `justification`).
- Tela justify mantém o PATCH no pai: `update(id, { status: "nao_conforme", justification })` (justificativa fica no pai). Depois `createChild(id, { labelSnapshot: "Avaria" })`. Rota para `/item/{child.id}/photo`.
- `justify.test`: a asserção de `createChild` (plano **linha 2557**, hoje `{ labelSnapshot: "Avaria", justification }`) passa a esperar `{ labelSnapshot: "Avaria" }` (remove `justification`). PATCH segue com `{ status, justification }`.

### E. OCR re-captura sem dedup-stale (Task 16)

- Bug atual: nem `capture()` (plano **linha 2386**, `buildIdempotencyKey(id, ocrKind, attempt)`) nem `confirm()` (plano **linha 2405**, `...attempt + 1`) chamam `setAttempt`. Re-apertar "Capturar e ler" reusa `attempt 0` para sempre → servidor devolve a leitura **antiga** (dedup), impedindo re-scan.
- Correção (exata, para não dar duplo-bump):
  1. **Remover** o `+ 1` da linha 2405 — `confirm()` usa `buildIdempotencyKey(id, ocrKind, attempt)` (sem `+1`).
  2. **Adicionar** `setAttempt((a) => a + 1)` **após** cada `create` bem-sucedido (tanto em `capture()` quanto em `confirm()`).
- Regra resultante: todo POST bem-sucedido incrementa `attempt` → cada ação ganha chave única. Reusa `buildIdempotencyKey(itemId, kind, attempt)` de 3 args (Task 4), assinatura intacta.
- Sequência sem re-captura: `capture` posta `attempt 0` (→1), `confirm` posta `attempt 1` (valor corrigido, evidência própria). Com re-captura: `capture#1` 0 (→1), `capture#2` 1 (leitura fresca, não deduplicada) (→2), `confirm` 2.
- Confirmação re-posta o `value` corrigido como evidência própria (não há rota de update de evidência; auditor vê leitura + confirmação).
- `ocr.test`: validar pré-preenchimento, confirmação corrigida, **e** que duas capturas seguidas usam idempotency keys distintas.

### F. History (Task 12)

- `inspections.history()` tipado `Page<InspectionDto>`; a tela já lê `data?.items ?? []` — só muda o tipo de retorno. `history.test` segue válido (mock pode retornar `{ items: [...] }`; `nextCursor` opcional não afeta a asserção).

### G. Scaffold Expo (Tasks 1–2)

- Scaffold com `create-expo-app` no **SDK estável mais recente**; adicionar módulos nativos com `npx expo install expo-router expo-camera expo-location expo-secure-store expo-image-manipulator expo-status-bar react-native-safe-area-context react-native-screens` — sem versões hand-pinned no `package.json`.
- Manter o `metro.config.js` monorepo (watchFolders + nodeModulesPaths + symlinks), o `tsconfig.json` (paths `@/*`), e a config `jest` com `jest-expo` — usando a versão de `jest-expo` correspondente ao SDK instalado.
- **Sem** env Supabase no mobile: o upload usa o `signedUrl` absoluto. `.env.example` mantém só `EXPO_PUBLIC_API_URL`.
- Os blocos de versão exatos no plano (expo ~52, RN 0.76, etc.) passam a ser ilustrativos; a fonte de verdade é o que `expo install` resolver.

---

## 5. O que NÃO muda

- Cobertura de telas §8.3 e o mapeamento tela→task (Self-Review do plano) seguem válidos.
- Fluxo §5 captura→sign→upload→evidence→veredito IA (helpers Task 5/9 + tela Task 15).
- `VerdictBanner` com `accepted === null` → "Validação pendente" (§5.7).
- `buildIdempotencyKey` (Task 4), secure-token-store (Task 3), evidence helper (Task 9), componentes de lista/status (Task 8).
- Estrutura de rotas Expo Router `(auth)`/`(app)`, React Query, gate de auth.
- Contratos `@vistoria/contracts` consumidos verbatim (sem redefinir DTOs).

---

## 6. Verificação global (pós-aplicação)

- `pnpm --filter @vistoria/api-client typecheck` **e** `pnpm --filter @vistoria/web typecheck` — api-client estendido (append-only) não regride o web.
- `pnpm --filter @vistoria/mobile test` — suítes verdes, incluindo os testes novos/ajustados: `ensureFreshAccess` (singleton in-flight + bootstrap), `upload` (FormData PUT→`signedUrl`), `ocr` (re-captura com chaves distintas), `justify` (sem `justification` no child).
- `pnpm --filter @vistoria/mobile typecheck`.
- Verificações manuais via Expo Go (login round-trip, foto+IA, OCR prefill, finish+uniqueCode, walkthrough completo) — no SDK mais recente. O passo de foto **confirma o upload contra o bucket homolog real** (resolve a incerteza multipart vs. raw do §4.A).

### 6.1 Pontos a verificar durante a implementação (não-bloqueantes)

- **Banner "Validação pendente" (§5.7):** depende de algum handler de IA retornar `accepted: null`. Confirmar no `core/ai/registry` da API que o caminho de fallback (Vision fora/timeout) devolve `null` — senão o estado pendente do `VerdictBanner` nunca aparece em campo.
- **Fallback de upload:** se o multipart cru ao `signedUrl` falhar no passo manual, adotar `@supabase/storage-js` `uploadToSignedUrl` (+ `EXPO_PUBLIC_SUPABASE_URL` + bucket). Registrar a decisão.

---

## 7. Handoff

Próximo passo: aplicar estes deltas **diretamente** no plano `2026-06-10-03-mobile.md` (editar Tasks 1, 2, 5, 6, 10, 12, 16, 17 e os passos de verificação), sem reescrever o plano inteiro. As tasks não citadas seguem como estão. Pontos de atenção do executor: **(B)** descartar o bloco de substituição-de-arquivo da Task 10 (append-only); **(C)** refresh no cliente bare `() => null`, sem decodificar JWT; **(A)** upload é `FormData` PUT, não bytes crus; **(E)** remover o `+1` da linha 2405 e incrementar `attempt` pós-POST.
