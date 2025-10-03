#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <proposal-json> [--network <network>]" >&2
  exit 1
fi

PROPOSAL_FILE="$1"; shift || true
NETWORK="local"
while [[ $# -gt 0 ]]; do
  case $1 in
    --network) NETWORK="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

if [[ ! -f "$PROPOSAL_FILE" ]]; then
  echo "Proposal file not found: $PROPOSAL_FILE" >&2
  exit 1
fi

# Extract minimal fields (using jq assumptions; may adjust with real DAO schema)
TITLE=$(jq -r '.title' "$PROPOSAL_FILE")
DESC=$(jq -r '.description' "$PROPOSAL_FILE")
AMOUNT=$(jq -r '.budget.owpRewardAtomic' "$PROPOSAL_FILE")

if [[ -z "$TITLE" || -z "$DESC" || -z "$AMOUNT" ]]; then
  echo "Missing required fields (title/description/budget.owpRewardAtomic)" >&2
  exit 1
fi

echo "[proposal] Submitting proposal: $TITLE (reward atomic: $AMOUNT)"

# Placeholder call; adapt to actual DAO canister method signature
# Example expected: createProposal(title:text, description:text, reward:nat)
set +e
OUT=$(dfx canister --network "$NETWORK" call hhdao_dao createProposal "(\"$TITLE\", \"$DESC\", $AMOUNT)" 2>&1)
RC=$?
set -e

if [[ $RC -ne 0 ]]; then
  echo "[proposal] Error submitting proposal:" >&2
  echo "$OUT" >&2
  exit $RC
fi

echo "$OUT" | sed 's/^/[proposal] /'

echo "[proposal] Done."
