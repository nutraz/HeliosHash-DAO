#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./scripts/demo/seed.sh [PRINCIPAL] [AMOUNT]
# If PRINCIPAL omitted, will use `dfx identity get-principal`.

PRINCIPAL=${1:-}
AMOUNT=${2:-10000}

if [ -z "$PRINCIPAL" ]; then
  echo "No principal provided — reading from dfx identity"
  PRINCIPAL=$(dfx identity get-principal)
fi

echo "Demo principal: $PRINCIPAL"
echo "Demo amount: $AMOUNT"

# Example: mint HHU to demo principal (local replica) — adjust canister name if different
# This assumes there's a canister named `hhu_token` in your dfx.json and it exposes `mint`.

MINT_CMD="dfx canister call hhu_token mint \"(principal \"${PRINCIPAL}\", ${AMOUNT})\""

echo "Running: $MINT_CMD"
# Note: use eval so quoting reaches dfx correctly
if eval "$MINT_CMD"; then
  echo "mint OK"
else
  echo "mint failed — check hhu_token canister name and interface"
fi

echo "Fetching balance_of..."
dfx canister call hhu_token balance_of "(principal \"${PRINCIPAL}\")" || true

# Generate a small members.json fixture — this is used by the web app when in mock mode
mkdir -p scripts/demo
cat > scripts/demo/members.json <<EOF
[
  {"principal": "${PRINCIPAL}", "tier": 1, "tokenId": 1},
  {"principal": "ryjl3-tyaaa-aaaaa-aaaba-cai", "tier": 2, "tokenId": 2},
  {"principal": "rkp4c-7iaaa-aaaaa-aaaca-cai", "tier": 3, "tokenId": 3}
]
EOF

echo "Wrote scripts/demo/members.json"

echo "Demo seed finished."
