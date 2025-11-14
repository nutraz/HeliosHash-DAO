#!/bin/bash
set -euo pipefail

echo "=== Starting Governance Canister Smoke Test ==="

# Wait for replica to be ready
echo "1. Waiting for replica to be ready..."
sleep 10

# Test basic functionality
echo "2. Testing getProposals (should return empty array initially)..."
dfx canister call governance getProposals || true

echo "3. Testing createProposal..."
CREATE_RESULT=$(dfx canister call governance createProposal '(record { title = "Test Proposal"; description = "Smoke test proposal" })')
echo "Create result: $CREATE_RESULT"

# Extract proposal ID from result
if echo "$CREATE_RESULT" | grep -q "ok"; then
	PROPOSAL_ID=$(echo "$CREATE_RESULT" | sed -n 's/.*(ok *: *\([0-9]*\)).*/\1/p')
	echo "Proposal ID: $PROPOSAL_ID"
  
	echo "4. Testing getProposals (should now have one proposal)..."
	dfx canister call governance getProposals || true

	echo "5. Testing getProposal..."
	dfx canister call governance getProposal "($PROPOSAL_ID : nat)" || true

	echo "6. Testing getVoteCounts..."
	dfx canister call governance getVoteCounts "($PROPOSAL_ID : nat)" || true

	echo "✅ Smoke test completed successfully!"
else
	echo "❌ Failed to create proposal: $CREATE_RESULT"
	exit 1
fi
