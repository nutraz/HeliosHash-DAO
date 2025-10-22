#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <proposalId> <yesVotes> [--network <network>]" >&2
  exit 1
fi

PROPOSAL_ID="$1"; shift
YES_VOTES="$1"; shift
NETWORK="local"
while [[ $# -gt 0 ]]; do
  case $1 in
    --network) NETWORK="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

echo "[simulate] Casting $YES_VOTES yes votes on proposal $PROPOSAL_ID (network=$NETWORK)"

for i in $(seq 1 "$YES_VOTES"); do
  echo "[simulate] Vote #$i"
  # Placeholder: adjust method name + candid args
  dfx canister --network "$NETWORK" call hhdao_dao vote "($PROPOSAL_ID, true)" || {
    echo "[simulate] vote failed on attempt $i"; exit 1; }
  sleep 1
  # Optional: fetch status
  dfx canister --network "$NETWORK" call hhdao_dao getProposal "($PROPOSAL_ID)" || true
 done

echo "[simulate] Complete"
