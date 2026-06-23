# Supabase setup (produção)

Para ambiente de produção com storage na nuvem:

1. Create a project at supabase.com. Copy: Project URL, `service_role` key, and the
   pooled `DATABASE_URL` (Settings → Database → Connection string, "URI").
2. Create a public-read **Storage bucket** named `vistoria-photos`.
3. Put the values into `.env`:

```env
STORAGE_DRIVER=supabase
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_STORAGE_BUCKET=vistoria-photos
JWT_SECRET=<strong-random>
JWT_REFRESH_SECRET=<strong-random>
```

4. Apply schema: `pnpm db:setup` (or `pnpm db:migrate` + `pnpm db:seed`)
5. For Google Vision: create a GCP service account with "Cloud Vision API User",
   download the JSON to `apps/api/gcp-vision.json`, set `GOOGLE_APPLICATION_CREDENTIALS`.

## Desenvolvimento local (sem Supabase)

Use `STORAGE_DRIVER=local` no `.env` — arquivos ficam em `./storage` e uploads
usam `PUT /v1/uploads/local/:token`. Não é necessário criar conta Supabase.
