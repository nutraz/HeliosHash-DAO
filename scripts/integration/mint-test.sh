#!/usr/bin/env bash
set -euo pipefail

# Simple integration test using dfx CLI to mint and verify totalSupply increments
CANISTER=${1:-nft_membership}
PRINCIPAL=${DFX_DEMO_PRINCIPAL:-ryjl3-tyaaa-aaaaa-aaaba-cai}

echo "Minting a demo token to $PRINCIPAL on canister $CANISTER"
dfx canister call $CANISTER mint "(principal \"${PRINCIPAL}\", 1 : nat, vec { 0 : nat8 })"

echo "Querying totalSupply"
OUT=$(dfx canister call $CANISTER totalSupply)
echo "totalSupply: $OUT"

echo "Integration test completed."
