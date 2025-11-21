#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/governance/approve_publish.sh <collectionId> <cid>
COLLECTION=${1:-example-collection}
CID=${2:-bafybeiexamplecid}

echo "Proposing publish for $COLLECTION -> $CID"
PROPOSE_OUT=$(dfx canister call metadata_governance proposeMetadataPublish "(\"${COLLECTION}\", \"${CID}\", \"auto-publish\")")
echo "Propose output: $PROPOSE_OUT"

# Extract numeric proposal id from output — depends on dfx output format
# We'll just print instruction for manual next step
echo "To execute the proposal, run:"
echo "  dfx canister call metadata_governance executeMetadataPublish '(<proposalId>)'"
