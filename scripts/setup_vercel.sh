#!/usr/bin/env bash
set -euo pipefail

# Minimal helper script to configure a Vercel project using the Vercel CLI or API.
# This script does not run automatically; it provides the commands you can use.

if [ "$#" -lt 1 ]; then
  echo "Usage: VERCEL_TOKEN=... ./scripts/setup_vercel.sh <project-name> [team-id]"
  exit 1
fi

PROJECT_NAME="$1"
TEAM_ID="${2:-}"

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "Please set VERCEL_TOKEN environment variable with a token that has project write access."
  echo "You can generate a token at https://vercel.com/account/tokens"
  exit 1
fi

echo "This script will:
  - create or link a Vercel project named '$PROJECT_NAME'
  - show sample API calls to set environment variables via the Vercel API
"

echo "Attempting to link/create project via Vercel CLI (you must have 'vercel' installed)..."
if command -v vercel >/dev/null 2>&1; then
  if [ -n "$TEAM_ID" ]; then
    vercel link --name "$PROJECT_NAME" --team "$TEAM_ID"
  else
    vercel link --name "$PROJECT_NAME"
  fi
  echo "Project linked. Use the Vercel dashboard to set environment variables or use the API (examples below)."
else
  echo "Vercel CLI not found. Install with: npm i -g vercel"
fi

cat <<'API_EXAMPLES'
curl -X POST "https://api.vercel.com/v9/projects/PROJECT_ID/env" \
  -H "Authorization: Bearer ${VERCEL_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"key":"NEXTAUTH_SECRET","value":"your_secret","target":["production"]}'

# Repeat for other environment variables from .env.vercel.example
API_EXAMPLES

echo "Done. Review the commands above to finish environment setup on Vercel."
