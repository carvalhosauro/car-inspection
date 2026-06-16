# Supabase setup

1. Create a project at supabase.com. Copy: Project URL, `service_role` key, and the
   pooled `DATABASE_URL` (Settings → Database → Connection string, "URI").
2. Create a public-read **Storage bucket** named `vistoria-photos`.
3. Put the values into `.env` (see `.env.example`):
   DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_STORAGE_BUCKET.
4. Apply schema: `export $(grep -v '^#' .env | xargs) && pnpm --filter @vistoria/db db:migrate`
5. Seed: `pnpm --filter @vistoria/db db:seed`
6. For Google Vision: create a GCP service account with "Cloud Vision API User",
   download the JSON to `apps/api/gcp-vision.json`, set GOOGLE_APPLICATION_CREDENTIALS.
