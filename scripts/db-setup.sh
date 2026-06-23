#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source <(grep -v '^#' .env | grep -v '^$' | sed 's/^/export /')
  set +a
fi

: "${DATABASE_URL:?DATABASE_URL is required — copy .env.example to .env and adjust}"

echo "→ Running migrations..."
pnpm --filter @vistoria/db db:migrate

echo "→ Seeding database..."
pnpm --filter @vistoria/db db:seed

echo "✓ Database ready."
