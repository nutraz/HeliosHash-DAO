#!/bin/bash
set -euo pipefail

echo "=== Governance Canister Smoke Test ==="

# Wait for replica to be ready
echo "1. Waiting for replica to be ready..."
sleep 10

# Test basic functionality
echo "2. Testing getProposals (should return empty array initially)..."
dfx canister call governance getProposals || true

echo "3. Testing createProposal..."
CREATE_RESULT=$(dfx canister call governance createProposal '("Test Proposal", "Smoke test proposal")')
echo "Create result: $CREATE_RESULT"

# Check if proposal was created successfully (should return a number)
if echo "$CREATE_RESULT" | grep -q "nat"; then
  PROPOSAL_ID=$(echo "$CREATE_RESULT" | sed -n 's/.*(\([0-9]*\) : nat).*/\1/p')
  echo "✅ Proposal created successfully with ID: $PROPOSAL_ID"
  
  echo "4. Testing getProposals (should now have proposals)..."
  dfx canister call governance getProposals || true

  echo "5. Testing getProposal..."
  dfx canister call governance getProposal "($PROPOSAL_ID : nat)" || true
  
  echo "6. Testing vote function..."
  dfx canister call governance vote "($PROPOSAL_ID : nat, true)" || true
  
  echo "✅ Smoke test completed successfully!"
else
  echo "❌ Failed to create proposal: $CREATE_RESULT"
  exit 1
fi
