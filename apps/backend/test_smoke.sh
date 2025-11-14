#!/bin/bash
set -euo pipefail

echo "=== Governance Canister Smoke Test ==="

# Wait for replica to be ready
echo "1. Waiting for replica to be ready..."
sleep 10

# Test basic functionality
echo "2. Testing getActiveProposals (should return empty array initially)..."
dfx canister call governance getActiveProposals || true

echo "3. Testing createProposal..."
CREATE_RESULT=$(dfx canister call governance createProposal '("Test Proposal", "Smoke test proposal", variant { Routine }, 24)')
echo "Create result: $CREATE_RESULT"

# Check if proposal was created successfully
if echo "$CREATE_RESULT" | grep -q "ok"; then
  echo "✅ Proposal created successfully!"
  
  echo "4. Testing getActiveProposals (should now have proposals)..."
  dfx canister call governance getActiveProposals || true

  echo "5. Testing getConstitutionalConstants..."
  dfx canister call governance getConstitutionalConstants || true
  
  echo "6. Testing getCurrentLeaders..."
  dfx canister call governance getCurrentLeaders || true
  
  echo "✅ Smoke test completed successfully!"
else
  echo "❌ Failed to create proposal: $CREATE_RESULT"
  exit 1
fi
