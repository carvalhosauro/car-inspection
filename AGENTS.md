# Vistoria

Monorepo (pnpm + turbo) for a vehicle-inspection SaaS for car-rental companies.

- `apps/api` — Fastify API (TypeScript, Drizzle/Postgres). Dev port `3333`.
- `apps/web` — Next.js 15 admin dashboard. Dev port `3000`.
- `apps/mobile` — Expo / React Native app (field inspectors).
- `packages/*` — `contracts` (zod DTOs), `db` (Drizzle schema/migrations/seed), `api-client`, `ui`, `config`.

Standard commands live in the root `package.json` (`pnpm dev|lint|test|typecheck|build`, all via turbo) and each package's `package.json`. Per-app dev: `pnpm --filter @vistoria/api dev`, `pnpm --filter @vistoria/web dev`.

## Cursor Cloud specific instructions

These notes capture non-obvious setup/run caveats. Dependency install is handled by the startup update script (`pnpm install`).

### Postgres
- A local PostgreSQL 16 cluster runs on **port 54322** (not the default 5432) to match `.env` defaults and `apps/api/.env.test`. It is **not auto-started on boot** — start it with `sudo pg_ctlcluster 16 main start`.
- Connection: `postgresql://postgres:postgres@localhost:54322/postgres`. The `postgres` role is a superuser with `BYPASSRLS`; this matches Supabase's `postgres` role and is **required** for seeding/tests because every tenant table has `FORCE ROW LEVEL SECURITY`.
- The DB is already migrated and seeded in the snapshot. Seeded logins (all password `senha123`): `super@vistoria.dev` (superadmin), `gestor@demo.dev` (gestor), `vistoriador@demo.dev` (vistoriador).

### Migrations gotcha
- `pnpm --filter @vistoria/db db:migrate` is a **no-op** on the provisioned DB (drizzle's `drizzle.__drizzle_migrations` tracking table is populated). Do **not** drop/recreate the schema and re-run migrate from scratch: migration `0004_material_matthew_murdock.sql` re-adds the same `inspection_evidences_item_idempotency_key` constraint as `0003`, so a fresh `db:migrate` fails (duplicate object, whole run rolls back). If you must rebuild, apply `0000`–`0003` directly with `psql` (skip `0004`).

### Env files
- `.env`, `apps/api/.env`, `apps/web/.env.local`, `apps/mobile/.env` are gitignored and already present with dev placeholders.
- `SUPABASE_*` and `GOOGLE_APPLICATION_CREDENTIALS` are placeholders. Read/CRUD flows work fully; photo-upload (Supabase Storage) and AI/OCR (Google Vision) flows on mobile evidence need real credentials.

### Testing caveats
- `pnpm test` (turbo, strict env) **strips `DATABASE_URL`**, so `@vistoria/db` DB tests fail with `ECONNREFUSED`. Run them directly: `cd packages/db && DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres pnpm test`.
- `@vistoria/mobile` jest leaves an open handle; under turbo the `test` task **hangs**. Run it directly: `pnpm --filter @vistoria/mobile test` (exits cleanly).
- `apps/api` tests load `apps/api/.env.test` themselves and need Postgres running. One **pre-existing** failure: `reports.test.ts > summary returns inspection counts by status` (asserts `byStatus`/`total`, but the route returns `{ inspections, pending, ... }`) — a test/code mismatch, not an environment issue.

### Known app bug (dev server)
- Authenticated routes that call `reply.send()` (e.g. `POST /v1/vehicles`, `DELETE /v1/vehicles/:id`) combined with the per-request deferred-transaction `onSend` hook crash the real dev server with `ERR_HTTP_HEADERS_SENT` **after** the response is sent (the write still persists). `GET` and `PATCH` routes return a value and are unaffected. `tsx watch` does not auto-restart after a crash — re-run `pnpm --filter @vistoria/api dev`. (This is the same double-send that shows up as `ERR_HTTP_HEADERS_SENT` unhandled errors in the api test run.)
