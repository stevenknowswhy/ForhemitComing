#!/usr/bin/env bash
# Resolve Convex CLI env: prefer packages/convex/.env.local, else admin/marketing app .env.local.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
ENV_FILE=""
for candidate in "$ROOT/.env.local" "$ROOT/../../apps/admin/.env.local" "$ROOT/../../apps/marketing/.env.local"; do
  if [[ -f "$candidate" ]]; then
    ENV_FILE="$candidate"
    break
  fi
done
if [[ -z "${ENV_FILE}" ]]; then
  echo "Convex CLI needs CONVEX_DEPLOYMENT (and CONVEX_DEPLOY_KEY to deploy)."
  echo "Create packages/convex/.env.local (see .env.example) or apps/admin/.env.local / apps/marketing/.env.local."
  exit 1
fi
# codegen does not support --env-file; load vars for it.
if [[ "${1:-}" == "codegen" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
  exec convex "$@"
fi
exec convex "$@" --env-file "$ENV_FILE"
