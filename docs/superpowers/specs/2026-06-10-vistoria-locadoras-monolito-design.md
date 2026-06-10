# Design — Monólito Multi-Tenant: Gestão e Auditoria de Vistorias Veiculares para Locadoras

- **Data:** 2026-06-10
- **Equipe:** Aldarlene da Silva Peixoto, Gustavo Oliveira de Carvalho, Gustavo Nascimento de Freitas Mesquita
- **Status:** Aprovado (design) — pronto para plano de implementação
- **Fonte de requisitos:** `defs-vistoria-locadoras.md`

---

## 1. Contexto e objetivo

Sistema para padronizar e auditar vistorias de retirada/devolução/periódica de veículos em locadoras. Cada item da vistoria só é considerado concluído com um **segundo fator de comprovação** (foto validada por IA, OCR de placa/hodômetro, geolocalização, código único), deixando um laudo rastreável que protege locadora e cliente contra avarias não registradas e cobranças sem prova.

Três clientes, um backend, um banco:
- **Web admin** (Next.js): gestor/supervisor criam templates de checklist, cadastram frota e vistoriadores, atribuem e monitoram vistorias, auditam não conformidades e veem insights.
- **Mobile** (Expo/React Native): vistoriador executa o checklist item a item, captura fotos validadas por IA, lê placa/km por OCR, justifica não conformidades e conclui com código único + geo.
- **API REST** (Fastify): ponte única entre os clientes; backend e banco compartilhados.

O sistema é **multi-tenant**: cada locadora é um tenant isolado.

---

## 2. Decisões de stack

| Eixo | Escolha | Observações |
|---|---|---|
| Monorepo | Turborepo + pnpm workspaces | cache de build/lint/test por pacote |
| Linguagem | TypeScript (strict) em tudo | Node 20 |
| Backend | **Fastify** (monólito modular, serviço Node separado) | camadas route → service → repo |
| Web | **Next.js** (App Router) + React | UI shadcn/ui ou Chakra |
| Mobile | **Expo** (managed) + EAS Build | expo-camera, expo-location, expo-secure-store |
| Banco/ORM | **Supabase Postgres + Drizzle** | migrations + tipos TS |
| Storage | **Supabase Storage** | fotos das vistorias (signed URLs) |
| IDs | **UUID v7** (gerado na app via `uuidv7`) | time-ordered, melhora locality do índice |
| IA | **Google Cloud Vision** | OCR (TEXT_DETECTION) + label/object + SafeSearch |
| Multi-tenant | **RLS no Supabase** (defense-in-depth) | app filtra + Postgres barra |

---

## 3. Arquitetura geral + estrutura do monorepo

Mobile e web nunca falam com o banco direto — só via API REST do Fastify. A IA é chamada apenas pelo backend (a chave nunca vai ao cliente).

```
[Web Admin / Next]   [Mobile / Expo]
        \                 /
         \  HTTP/REST (JWT)
          \             /
        [ Fastify API (monólito modular) ] ──▶ [Google Cloud Vision]
                    │ Drizzle
                    ▼
        [ Supabase: Postgres + Storage + RLS ]
```

```
vistoria/
├── apps/
│   ├── api/          # Fastify — backend monólito modular
│   ├── web/          # Next.js (App Router) — admin gestor
│   └── mobile/       # Expo (managed) — app vistoriador
├── packages/
│   ├── contracts/    # Zod schemas + tipos (DTOs) + registry de tipos de prova — fonte única de verdade
│   ├── db/           # Drizzle schema + migrations + client
│   ├── api-client/   # client REST tipado, consumido por web e mobile
│   └── config/       # tsconfig, eslint, env shared
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

**Quem importa o quê:**
- `contracts` → `api`, `web`, `mobile` (fonte única de verdade; mudou o contrato, TS quebra no front na hora)
- `db` → `api` (só)
- `api-client` → `web`, `mobile`
- `config` → todos

---

## 4. Modelo de dados (multi-tenant)

IDs = `uuid` gerados na aplicação com **UUID v7** (`$defaultFn(() => uuidv7())`), não `gen_random_uuid()`. Datas = `timestamptz`.

### 4.1 Enums

```
user_role        : superadmin | gestor | supervisor | vistoriador
vehicle_status   : disponivel | locado | manutencao
inspection_type  : retirada | devolucao | periodica
inspection_status: atribuida | em_andamento | concluida | aprovada | reprovada
inspection_result: conforme | com_pendencias
item_status      : pendente | conforme | nao_conforme
```

### 4.2 Registry de tipos de prova (em `packages/contracts`, não no banco)

```
kind ∈ { photo, ocr_plate, ocr_km, geo, unique_code, signature, ... }
```

O DB guarda `kind` como `text`, validado pelo registry (Zod). Adicionar um novo tipo de prova = nova entrada no registry + um handler no backend. **Zero migration de schema.**

### 4.3 Tabelas

**`tenants`** — locadoras
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | id da locadora |
| name | text | not null | nome fantasia |
| slug | text | unique, not null | identificador url-safe |
| active | boolean | default true | liga/desliga acesso |
| createdAt | timestamptz | default now() | |

**`users`** — pessoas
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, **nullable** | null = interno do sistema (superadmin); preenchido = pertence à locadora |
| name | text | not null | nome completo |
| email | text | unique, not null | login |
| passwordHash | text | not null | hash argon2id |
| role | user_role | not null | papel |
| active | boolean | default true | desativa sem apagar |
| createdAt | timestamptz | default now() | |

**`vehicles`** — frota
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, not null | dono |
| plate | text | not null, unique por tenant | placa |
| model | text | not null | modelo |
| year | int | | ano |
| color | text | | cor |
| currentKm | int | default 0 | km atual (atualizado pós-vistoria) |
| status | vehicle_status | default 'disponivel' | situação |
| createdAt / updatedAt | timestamptz | | |

**`checklist_templates`** — modelos de vistoria
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, not null | dono |
| name | text | not null | ex: "Vistoria de Retirada Hatch" |
| active | boolean | default true | |
| createdAt | timestamptz | default now() | |

**`checklist_items`** — itens do modelo
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, not null (denormalizado p/ RLS) | dono |
| templateId | uuid | FK→templates, not null | modelo pai |
| order | int | not null | ordem de execução |
| label | text | not null | ex: "Para-choque dianteiro" |
| description | text | | instrução ao vistoriador |

**`checklist_item_requirements`** — requisitos de prova por item (N por item)
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, not null (denorm p/ RLS) | dono |
| checklistItemId | uuid | FK→checklist_items, not null | item pai |
| kind | text | not null (registry) | tipo de prova |
| required | boolean | default true | obrigatório? |
| config | jsonb | | params do validador (ex: `{expectedLabels:["bumper"], minWidth:800}`) |
| order | int | | |

**`inspections`** — a vistoria (OS)
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, not null | dono |
| vehicleId | uuid | FK→vehicles, not null | carro vistoriado |
| inspectorId | uuid | FK→users, not null | quem executa |
| templateId | uuid | FK→templates, not null | modelo usado |
| type | inspection_type | not null | retirada/devolução/periódica |
| status | inspection_status | default 'atribuida' | ciclo de vida |
| result | inspection_result | nullable | preenchido na conclusão |
| scheduledFor | timestamptz | nullable | agendamento |
| startedAt | timestamptz | nullable | início real |
| finishedAt | timestamptz | nullable | conclusão |
| geoLat / geoLng | numeric | nullable | local da conclusão |
| uniqueCode | text | nullable, unique | selo gerado ao concluir |
| auditedBy | uuid | FK→users, nullable | gestor que auditou |
| auditNote | text | nullable | parecer da auditoria |
| auditedAt | timestamptz | nullable | data da auditoria |
| createdAt | timestamptz | default now() | |

**`inspection_items`** — execução item a item (núcleo da prova)
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, not null (denorm p/ RLS) | dono |
| inspectionId | uuid | FK→inspections, not null | vistoria pai |
| checklistItemId | uuid | FK→checklist_items, nullable | lineage |
| parentItemId | uuid | FK→inspection_items, nullable (self-FK) | árvore: filho = avaria/foto extra |
| order | int | | |
| labelSnapshot | text | not null | label congelado no momento da vistoria |
| requirementsSnapshot | jsonb | not null | requisitos congelados (imutável) |
| status | item_status | default 'pendente' | conforme/não conforme |
| justification | text | nullable | motivo da não conformidade |
| createdAt | timestamptz | default now() | |

**`inspection_evidences`** — a prova de fato (N por item)
| Coluna | Tipo | Regra | Significado |
|---|---|---|---|
| id | uuid | PK (v7) | |
| tenantId | uuid | FK→tenants, not null (denorm p/ RLS) | dono |
| inspectionItemId | uuid | FK→inspection_items, not null | item executado |
| requirementId | uuid | FK→checklist_item_requirements, nullable | qual requisito satisfaz |
| kind | text | not null (registry) | tipo de prova |
| filePath | text | nullable | foto/assinatura no Storage |
| value | jsonb | nullable | `{plate}` · `{km}` · `{lat,lng}` · `{code}` |
| validation | jsonb | nullable | resultado IA `{accepted, labels, scores, dedupHash, reason}` |
| accepted | boolean | nullable | passou? |
| createdAt | timestamptz | default now() | |

### 4.4 Relações

```
tenants ──< users
tenants ──< vehicles
tenants ──< checklist_templates ──< checklist_items ──< checklist_item_requirements
tenants ──< inspections ──< inspection_items ──< inspection_evidences
                              inspection_items ──< inspection_items (self, parentItemId)
```

### 4.5 Decisões de modelagem

- **Snapshot imutável:** `inspection_items.labelSnapshot` + `requirementsSnapshot` congelam o que foi cobrado. FK `checklistItemId` mantém a origem (lineage). Editar o template depois não altera vistorias antigas.
- **Provas como dados, não colunas:** requisitos viram linhas em `checklist_item_requirements` (extensível, N por item); evidências viram linhas em `inspection_evidences`. `inspection_items` fica magro (status + justificativa + árvore). Insights ficam triviais (`group by kind`).
- **`tenantId` denormalizado** em `checklist_items`, `checklist_item_requirements`, `inspection_items`, `inspection_evidences` → política de RLS uniforme e rápida (sem join só para isolamento).
- **`inspection_item_photos`** (tabela extra de múltiplas fotos) foi descartada em favor da self-FK em `inspection_items` (filhos = avarias/fotos extras).

### 4.6 RLS (Supabase) — defense-in-depth

O backend já filtra por tenant na aplicação; o RLS é a segunda trava no banco.

1. Toda tabela tenant-owned: `ALTER TABLE x ENABLE ROW LEVEL SECURITY;`
2. Por request, o Fastify abre transação e seta o contexto:
   ```sql
   SELECT set_config('app.tenant_id', $jwtTenantId, true);
   SELECT set_config('app.role',      $jwtRole,     true);
   ```
3. Política por tabela:
   ```sql
   CREATE POLICY tenant_isolation ON vehicles
   USING (
     current_setting('app.role', true) = 'superadmin'
     OR tenant_id = current_setting('app.tenant_id', true)::uuid
   );
   ```
4. `superadmin` (tenantId null) pula o filtro → enxerga todos os tenants.

---

## 5. Pipeline de IA (Google Cloud Vision)

**Regra de ouro:** o Vision é chamado apenas pelo backend. A chave nunca vai ao mobile.

### 5.1 Fluxo de uma evidência (síncrono no MVP)

```
1. Mobile captura foto
2. Mobile faz upload p/ Supabase Storage via signed URL
3. Mobile: POST /v1/inspection-items/:id/evidences {kind, filePath, value}
4. Fastify baixa os bytes do Storage
5. Fastify chama o handler do kind → Google Vision
6. Decisão accept/reject
7. Grava inspection_evidences {accepted, validation}
8. Responde accept/reject ao mobile
```
Latência ~1–2s. O mobile espera o veredito → elimina o "marcar no olho".

### 5.2 Handlers por `kind`

| kind | Vision feature | Lógica de aceite |
|---|---|---|
| photo | LABEL_DETECTION + OBJECT_LOCALIZATION + SAFE_SEARCH | nitidez OK **e** label esperado bate (`config.expectedLabels` ∩ labels > threshold) **e** não duplicada (pHash) |
| ocr_plate | TEXT_DETECTION | extrai texto → regex placa (Mercosul `AAA1A23` + antiga `AAA1234`) → `value.plate` |
| ocr_km | TEXT_DETECTION | extrai dígitos do hodômetro → `value.km` (sanidade: ≥ km atual do veículo) |
| geo | — (device) | lat/lng do device, validado server-side; sem chamada Vision |
| unique_code | — (server) | gerado na conclusão, não capturado |

### 5.3 Decisão de validação de foto

```
accepted =
     sharpness(score) ≥ minBlur          // foto não borrada
  && expectedLabels ⊆ visionLabels       // mostra o item certo
  && safeSearch.ok                        // não é lixo/adulterada
  && dedup.distance > minHamming          // não reaproveitada
reason (se rejeita): "borrada" | "item errado (esperava X)" | "duplicada"
```

### 5.4 Dedup (anti-foto-reaproveitada)

- Backend calcula **pHash** (perceptual hash) com `sharp` + blockhash; guarda em `evidence.validation.dedupHash`.
- Nova foto → compara distância de Hamming contra fotos anteriores **do mesmo veículo** (join evidence→item→inspection→vehicle, kind=photo).
- Distância baixa = mesma foto reusada → rejeita.

### 5.5 OCR (placa e km)

- TEXT_DETECTION devolve blocos de texto; o handler aplica regex/parse e devolve `value` + confiança.
- Mobile mostra o campo **pré-preenchido**; o vistoriador confirma/corrige.
- Divergência entre placa lida e placa cadastrada = alerta de carro errado.

### 5.6 Código único + conclusão

- Ao concluir: backend gera `uniqueCode` (ex: `VST-{tenant}-{ulid}`), grava geo da conclusão, sela `inspection.status = 'concluida'`.

### 5.7 Resiliência

- Vision fora do ar / timeout → evidência fica `accepted = null` (pendente); a vistoria segue e o gestor revê na auditoria. Não trava o trabalho de campo.

---

## 6. Auth + RBAC

Auth próprio no Fastify (não usar Supabase Auth — o backend controla senha e o contexto de RLS).

### 6.1 Senha + tokens

- Hash: **argon2id**.
- **JWT access** (~15 min) + **refresh** (~7 dias). Payload do access: `{ sub: userId, tenantId, role }`.
- Refresh: web → cookie `httpOnly` + `Secure`; mobile → `expo-secure-store`.
- O cliente nunca envia tenantId/role no corpo — vêm apenas do JWT assinado.

### 6.2 Rotas de auth

```
POST /v1/auth/login     → {email,password} → {accessToken, refreshToken}
POST /v1/auth/refresh   → {refreshToken}   → novo accessToken
POST /v1/auth/logout    → invalida refresh
GET  /v1/auth/me        → dados do usuário logado
```
Reset de senha por e-mail → pós-MVP.

### 6.3 Ciclo de request (guard + RLS)

```
1. preHandler verifica assinatura do JWT (401 se inválido)
2. extrai {userId, tenantId, role} → request.ctx
3. abre transação Drizzle e seta contexto RLS (set_config app.tenant_id / app.role)
4. requireRole([...]) checa o papel da rota (403 se não pode)
5. handler roda; toda query nasce tenant-scoped (app + RLS)
```

### 6.4 Matriz de permissão

| Ação | superadmin | gestor | supervisor | vistoriador |
|---|:-:|:-:|:-:|:-:|
| Criar/gerir tenants | ✅ | — | — | — |
| Gerir usuários da locadora | — | ✅ | — | — |
| CRUD frota | — | ✅ | ✅ | — |
| CRUD templates de checklist | — | ✅ | — | — |
| Atribuir/agendar vistorias | — | ✅ | ✅ | — |
| Executar vistoria (mobile) | — | ◐ | ◐ | ✅ |
| Auditar/aprovar não conformidade | — | ✅ | ✅ | — |
| Ver relatórios/insights | ✅ (todos) | ✅ | ✅ | — |
| Ver histórico próprio | — | — | — | ✅ |

◐ = pode, mas não é o papel principal.

### 6.5 Onde cada papel loga

- **Web admin:** superadmin, gestor, supervisor.
- **Mobile:** vistoriador (principal); supervisor/gestor podem entrar para executar se preciso.

### 6.6 Provisionamento

```
superadmin → cria tenant + 1º gestor (seed da locadora)
gestor     → cria supervisores + vistoriadores (dentro do tenant)
```

### 6.7 Upload seguro de foto

- Mobile pede uma signed upload URL (`POST /v1/uploads/sign`) → sobe direto para o Storage sem ver a service key.
- Backend guarda só o `filePath`; lê via signed URL ao chamar o Vision ou ao exibir o laudo na web.

---

## 7. Superfície da API REST (Fastify)

Versionada `/v1`. Tudo (menos `/auth/login` e `/auth/refresh`) exige JWT. Validação in/out via Zod de `packages/contracts`. OpenAPI auto via `@fastify/swagger`.

```
# Auth
POST /v1/auth/login | refresh | logout       GET /v1/auth/me

# Plataforma (superadmin)
GET/POST /v1/tenants                          PATCH /v1/tenants/:id

# Usuários (gestor)
GET/POST /v1/users     PATCH/DELETE /v1/users/:id

# Frota (gestor/supervisor)
GET/POST /v1/vehicles  GET/PATCH/DELETE /v1/vehicles/:id

# Templates de checklist (gestor)
GET/POST /v1/checklist-templates             GET/PATCH /v1/checklist-templates/:id
POST /v1/checklist-templates/:id/items        PATCH /v1/checklist-items/:id
POST /v1/checklist-items/:id/requirements     DELETE /v1/checklist-items/:id/requirements/:rid

# Vistorias — gestão (gestor/supervisor)
GET /v1/inspections?status=&inspector=&vehicle=&from=&to=
POST /v1/inspections                          # snapshot dos itens na criação
GET  /v1/inspections/:id                      # laudo completo
PATCH /v1/inspections/:id/audit               # aprovar/reprovar/reabrir

# Vistorias — execução (mobile, vistoriador)
GET  /v1/me/inspections?date=today            # vistorias do dia
POST /v1/inspections/:id/start
GET  /v1/inspections/:id/items
PATCH /v1/inspection-items/:id                # status / justificativa
POST /v1/inspection-items/:id/children        # sub-item (avaria) [self-FK]
POST /v1/uploads/sign                          # signed URL de upload
POST /v1/inspection-items/:id/evidences        # registra prova → dispara IA
POST /v1/inspections/:id/finish                # uniqueCode + geo
GET  /v1/me/inspections/history

# Insights (gestor/supervisor; superadmin cross)
GET /v1/reports/summary | damages-by-vehicle | pending-by-inspector | avg-inspection-time
```

**Padrões transversais:** paginação por cursor (usa ordenação do UUID v7), erros `{code, message, details}`, idempotência no `POST /evidences`, rate-limit no `/auth`.

---

## 8. Estrutura interna dos apps

### 8.1 `apps/api` — Fastify monólito modular

```
src/
├── modules/            # 1 pasta por domínio, 3 camadas cada (route → service → repo)
│   ├── auth/  tenants/  users/  vehicles/
│   ├── checklists/     # templates + items + requirements
│   ├── inspections/    # OS + items + snapshot + finish/audit
│   ├── evidences/      # registro de prova + dispara IA
│   └── reports/        # insights
├── core/
│   ├── db/       # drizzle client + helper txWithTenant() (set_config RLS)
│   ├── ai/       # vision client + registry de handlers por kind
│   ├── storage/  # signed URLs Supabase
│   ├── auth/     # jwt, verifyToken, requireRole()
│   └── errors/   # erro padronizado
├── plugins/      # swagger, jwt, rate-limit, cors
├── app.ts        # monta plugins + rotas
└── server.ts     # listen
```

Regra de camadas: `route` (Zod + HTTP) → `service` (regra de negócio) → `repo` (queries Drizzle). Route nunca toca o DB; service nunca toca HTTP. `core/ai/registry` mapeia `kind → handler` (casa com o registry de `contracts`).

### 8.2 `apps/web` — Next.js (App Router)

```
src/app/
├── (auth)/login
└── (dashboard)/
    ├── dashboard/  vehicles/  checklists/
    ├── inspections/[id]/   # laudo (fotos, OCR, geo, código)
    ├── audit/  reports/  users/
lib/        # api-client, auth (cookie), react-query
components/  # ui (shadcn/Chakra)
```
`middleware.ts` protege rotas por role. Server Components leem via `api-client`; mutações via react-query.

### 8.3 `apps/mobile` — Expo (Expo Router)

```
src/app/
├── (auth)/login
└── (app)/
    ├── index                  # vistorias do dia
    ├── inspection/[id]        # OS + iniciar
    ├── inspection/[id]/checklist
    ├── item/[id]/photo        # expo-camera + veredito IA
    ├── item/[id]/ocr
    ├── item/[id]/justify      # não conformidade + sub-item
    ├── inspection/[id]/review
    ├── inspection/[id]/finish # geo + código único
    └── history
```
Libs: `expo-camera`, `expo-location`, `expo-secure-store`, `react-query`. Consome o mesmo `api-client`.

### 8.4 Fluxo ponta-a-ponta (capturar foto de item)

```
mobile: foto → POST /uploads/sign → upload Storage
      → POST /inspection-items/:id/evidences {kind:photo, filePath}
api:  evidences.service → ai.registry[photo] → Vision (label + blur + pHash dedup)
      → grava inspection_evidences {accepted, validation}
      → 200 {accepted:true} | 422 {accepted:false, reason}
mobile: aceita → próximo item | rejeita → mostra motivo, refazer
web:  gestor abre /inspections/:id → vê a mesma evidência no laudo
```

---

## 9. Deploy, MVP e timeline

### 9.1 Topologia

| Alvo | Onde | Por quê |
|---|---|---|
| web | **Vercel** | Next nativo, URL público para QR (entrega exige) |
| api | **Railway** | deploy simples, env vars, auto-deploy no push |
| db + storage | **Supabase** | Postgres + Storage + RLS num lugar |
| IA | **Google Cloud Vision** | service account key no env da api |
| mobile | **EAS Build → APK** | demo por APK ou Expo Go (QR) |

### 9.2 Secrets / env

```
api:    DATABASE_URL · SUPABASE_URL · SUPABASE_SERVICE_KEY
        GOOGLE_APPLICATION_CREDENTIALS · JWT_SECRET · JWT_REFRESH_SECRET
web:    NEXT_PUBLIC_API_URL
mobile: EXPO_PUBLIC_API_URL
```
CI/CD: Vercel + Railway auto-deploy no push; EAS build manual. Turbo remote cache opcional.

### 9.3 Corte de MVP

- **Mobile MVP:** login · vistorias do dia · executar checklist com foto validada por IA · OCR placa/km · justificar não conformidade · concluir com código + geo.
- **Web MVP:** login + RBAC · CRUD frota · criar template de checklist · atribuir vistoria · ver laudo (fotos + OCR).
- **Pós-MVP:** histórico rico · onboarding · auditoria refinada · insights avançados · reset de senha · offline/sync · hardening extra de RLS.
- **Seed manual para demo:** 1 tenant + 1 gestor + 1 vistoriador (superadmin cria; sem signup público no MVP).

### 9.4 Timeline (hoje 2026-06-10, banner 20/06, ~10 dias, 3 pessoas)

Trilhas paralelas: **A = backend/IA**, **B = web**, **C = mobile**. `contracts` compartilhado desde o dia 1.

| Dia | A (back/IA) | B (web) | C (mobile) |
|---|---|---|---|
| 1 | monorepo + contracts + db schema + RLS + seed | scaffold web + auth UI | scaffold Expo + login |
| 2 | fastify core (jwt, guards, RLS tx, storage) + auth/users/tenants | layout + login funcional | vistorias do dia |
| 3 | vehicles + checklists (template/item/req) | CRUD frota | OS + checklist (read) |
| 4 | inspections + snapshot + evidences + Vision (foto/OCR/pHash) | editor de checklist | câmera + POST evidence + veredito |
| 5 | finish/audit + reports básicos | atribuir vistoria | OCR + justificativa + concluir |
| 6 | hardening + idempotência evidence | laudo (fotos/OCR/geo/código) | review + finish + histórico |
| 7 | deploy api (Railway) + Supabase prod | deploy web (Vercel) | EAS build APK |
| 8 | teste e2e cross-app + correções | correções | correções |
| 9 | buffer | banner .pptx + QR + prints | screenshots |
| 10 | folga / imprevistos | slides | slides |

---

## 10. Riscos e mitigações

| Risco | Mitigação |
|---|---|
| Integração com Vision atrasa (dia 4) | handler com fallback `accepted=null` → vistoria não trava; gestor revê na auditoria |
| Vazamento cross-tenant | dupla trava: filtro na app **e** RLS no Postgres |
| Edição de template corrompe vistorias antigas | snapshot imutável (`labelSnapshot` + `requirementsSnapshot`) |
| Foto reaproveitada | pHash + comparação por veículo |
| Prazo apertado (~10 dias) | corte de MVP rígido + trilhas paralelas + dia 10 de folga |
| Custo de API Vision | free tier; 1 chamada por evidência de foto/OCR |

---

## 11. Fora de escopo (MVP)

Signup público de locadoras; reset de senha por e-mail; modo offline/sync; notificações push; relatórios avançados/exportação; assinatura digital (`signature` já cabe no registry, mas não entra no MVP); app iOS publicado em loja.
