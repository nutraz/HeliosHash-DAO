#!/bin/bash
set -e

echo "=== Running Governance Canister Smoke Test ==="

# Wait for replica to be ready
sleep 5

# Test basic functionality
echo "1. Testing getProposals (should return empty array initially)..."
dfx canister call governance getProposals

echo "2. Testing createProposal..."
CREATE_RESULT=$(dfx canister call governance createProposal '(record { title = "Test Proposal"; description = "Smoke test proposal" })')
echo "Create result: $CREATE_RESULT"

# Extract proposal ID from result (format: (ok : nat64) or similar)
PROPOSAL_ID=$(echo "$CREATE_RESULT" | grep -o '[0-9]\+' | head -1)
echo "Proposal ID: $PROPOSAL_ID"

echo "3. Testing getProposals (should now have one proposal)..."
dfx canister call governance getProposals

echo "4. Testing getProposal..."
dfx canister call governance getProposal "($PROPOSAL_ID : nat)"

echo "✅ Smoke test completed successfully!"
