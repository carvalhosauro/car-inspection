#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — review before production use."
fi

set -a
# shellcheck disable=SC1091
source <(grep -v '^#' .env | grep -v '^$' | sed 's/^/export /')
set +a

pnpm --filter @vistoria/api dev
