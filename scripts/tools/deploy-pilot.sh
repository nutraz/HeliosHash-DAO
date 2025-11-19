#!/usr/bin/env bash
set -euo pipefail

NETWORK="local"
AUTO_PROPOSAL="false"
PROPOSAL_FILE="examples/proposals/microgrid-urgam-001.json"
AUTO_VOTE="false"
VOTE_COUNT=0
while [[ $# -gt 0 ]]; do
  case $1 in
    --network)
      NETWORK="$2"; shift 2;;
    --auto-proposal)
      AUTO_PROPOSAL="true"; shift 1;;
    --proposal-file)
      PROPOSAL_FILE="$2"; shift 2;;
    --auto-vote)
      AUTO_VOTE="true"; VOTE_COUNT="$2"; shift 2;;
    *) echo "Unknown arg: $1"; exit 1;;
  esac
done

root_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$root_dir"

mkdir -p .pilot
ADDR_FILE=.pilot/addresses.json

echo "[pilot] Deploying canisters to network=$NETWORK"

# Ensure dfx started locally if needed
if [[ "$NETWORK" == "local" ]]; then
  if ! pgrep -f "dfx replica" >/dev/null 2>&1; then
    echo "[pilot] Starting local dfx background..."; dfx start --background --clean
  fi
fi

dfx deploy --network "$NETWORK" --no-wallet || { echo "[pilot] deploy failed"; exit 1; }

# Capture principals
DAO_ID=$(dfx canister --network "$NETWORK" id hhdao_dao)
TREASURY_ID=$(dfx canister --network "$NETWORK" id hhdao_treasury)
IDENTITY_ID=$(dfx canister --network "$NETWORK" id hhdao_identity || true)

jq -n --arg dao "$DAO_ID" --arg treasury "$TREASURY_ID" --arg identity "$IDENTITY_ID" '{dao:$dao, treasury:$treasury, identity:$identity}' > "$ADDR_FILE"

echo "[pilot] Addresses saved to $ADDR_FILE"

# Authorize treasury links
echo "[pilot] Setting treasury dao + identity links"
dfx canister --network "$NETWORK" call hhdao_treasury setDaoCanister '(principal"'$DAO_ID'")'
if [[ -n "$IDENTITY_ID" ]]; then
  dfx canister --network "$NETWORK" call hhdao_treasury setIdentityCanister '(principal"'$IDENTITY_ID'")'
fi

echo "[pilot] Deployment + auth complete."

if [[ "$AUTO_PROPOSAL" == "true" ]]; then
  if [[ ! -f "$PROPOSAL_FILE" ]]; then
    echo "[pilot] Proposal file not found: $PROPOSAL_FILE" >&2
  else
    echo "[pilot] Auto-submitting proposal $PROPOSAL_FILE"
    ./scripts/create-proposal.sh "$PROPOSAL_FILE" --network "$NETWORK" || echo "[pilot] Proposal submission failed (check DAO method signature)."
  fi
fi

if [[ "$AUTO_VOTE" == "true" ]]; then
  echo "[pilot] Auto-vote requested ($VOTE_COUNT votes) -- placeholder logic."
  echo "[pilot] NOTE: Implement actual vote casting with distinct principals if supported."
fi

echo "[pilot] Done."
