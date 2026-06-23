# Vistoria — setup rápido

Monorepo de vistorias veiculares para locadoras. Stack: **Fastify API**, **PostgreSQL + Drizzle**, storage local ou **Supabase**.

## Pré-requisitos

- Node.js 20+
- pnpm 9 (`corepack enable`)
- PostgreSQL 16 (local ou via Docker)

## Opção A — Docker (recomendado)

```bash
cp .env.example .env
docker compose up -d postgres
export $(grep -v '^#' .env | xargs)
pnpm install
pnpm db:setup
docker compose up api
```

API em `http://localhost:3333` · docs em `http://localhost:3333/docs`

## Opção B — PostgreSQL local

```bash
cp .env.example .env
# Ajuste DATABASE_URL no .env (ex.: postgresql://postgres:postgres@127.0.0.1:5432/vistoria)
pnpm install
pnpm db:setup
pnpm dev:api
```

## Credenciais de demo (após seed)

| Papel        | Email              | Senha    |
|-------------|--------------------|----------|
| Gestor      | gestor@demo.dev    | senha123 |
| Vistoriador | vistoriador@demo.dev | senha123 |
| Superadmin  | super@vistoria.dev | senha123 |

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `STORAGE_DRIVER` | `local` (padrão) ou `supabase` |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Tokens de autenticação |
| `SUPABASE_*` | Obrigatório só com `STORAGE_DRIVER=supabase` |

Ver `.env.example` para a lista completa.

## Comandos úteis

```bash
pnpm db:migrate    # aplica migrations
pnpm db:seed       # dados de demonstração
pnpm db:setup      # migrate + seed
pnpm test          # testes
pnpm build         # build de todos os pacotes
```

## Produção com Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie `DATABASE_URL` (pooler), `SUPABASE_URL` e `service_role` key
3. Crie bucket `vistoria-photos` (público para leitura, se necessário)
4. Configure `.env`:

```env
STORAGE_DRIVER=supabase
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
```

5. `pnpm db:setup` e deploy da API (Dockerfile em `apps/api/Dockerfile`)

Detalhes: [docs/setup-supabase.md](docs/setup-supabase.md)

## Health check

`GET /health` retorna `{ status: "ok", db: "connected" }` quando o banco está acessível.
