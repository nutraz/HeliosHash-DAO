#!/usr/bin/env bash
set -euo pipefail

# Quick local dev helper: starts dfx, deploys, generates a server identity,
# writes .env.local and starts Next.js dev server.

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

HOST=${NEXT_PUBLIC_IC_HOST:-http://localhost:4943}

echo "Starting dfx local replica..."
dfx start --background --clean

echo "Deploying canisters..."
dfx deploy

DAO_ID=$(dfx canister id dao 2>/dev/null || true)
if [ -z "$DAO_ID" ]; then
  echo "Warning: could not resolve dao canister id. Ensure your canister is named 'dao'."
fi

echo "Generating server identity (base64 raw secret)..."
if [ -f ./scripts/generate_server_identity.cjs ]; then
  KEY_B64=$(node ./scripts/generate_server_identity.cjs)
else
  KEY_B64=$(node ./scripts/generate_server_identity.js)
fi

cat > .env.local <<EOF
NEXT_PUBLIC_IC_HOST=$HOST
NEXT_PUBLIC_DAO_CANISTER_ID=$DAO_ID
DFINITY_SERVER_KEY_B64=$KEY_B64
DAO_BINDINGS_PATH='./src/declarations/dao'
EOF

echo ".env.local written (NEXT_PUBLIC_IC_HOST, NEXT_PUBLIC_DAO_CANISTER_ID, DFINITY_SERVER_KEY_B64)"
echo "Starting Next.js dev server..."
pnpm dev
