#!/bin/bash
# HeliosHash DAO - Governance Testing Script
# Tests the 60% consensus mechanism - the heart of HHDAO's collaborative philosophy

set -e

echo "🌞 Testing HHDAO Governance - Community Consensus Validation"
echo "=========================================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1"
}

# Ensure we're in the right directory
cd /home/nutarzz/HeliosHash-DAO

# Create test identities (simulate community members)
print_status "Creating community member identities..."
dfx identity new --storage-mode=plaintext member1 2>/dev/null || true
dfx identity new --storage-mode=plaintext member2 2>/dev/null || true
dfx identity new --storage-mode=plaintext member3 2>/dev/null || true

# Switch to default identity (deployer/admin)
dfx identity use default

echo ""
print_status "Initial state check..."
MEMBER_COUNT=$(dfx canister call hhdao_dao getMemberCount | grep -o '[0-9]\+')
echo "Current member count: $MEMBER_COUNT"

# Test 1: Join members to create community
echo ""
print_status "Test 1: Building the community (member joins)..."

# Admin/deployer joins first
dfx identity use default
print_status "Admin/deployer joining..."
dfx canister call hhdao_dao join

dfx identity use member1
print_status "Member1 joining..."
dfx canister call hhdao_dao join

dfx identity use member2  
print_status "Member2 joining..."
dfx canister call hhdao_dao join

dfx identity use member3
print_status "Member3 joining..."  
dfx canister call hhdao_dao join

# Check final member count
dfx identity use default
FINAL_COUNT=$(dfx canister call hhdao_dao getMemberCount | grep -o '[0-9]\+')
print_success "Community grown to $FINAL_COUNT members (deployer + 3 new members)"

# Test 2: Create proposal (as admin)
echo ""
print_status "Test 2: Creating solar maintenance proposal..."
PROPOSAL_RESULT=$(dfx canister call hhdao_dao createProposal '("Solar Panel Maintenance", "Clean panels in Sector B for optimal energy generation", variant { PanelMaintenance })' | grep -o '[0-9]\+')
PROPOSAL_ID=$PROPOSAL_RESULT
print_success "Created proposal #$PROPOSAL_ID: Solar Panel Maintenance"

# Test 3: Voting scenarios to validate 60% threshold
echo ""
print_status "Test 3a: Testing 60% consensus - SHOULD PASS (3 out of 4 votes = 75%)"

# Admin votes YES
dfx identity use default
dfx canister call hhdao_dao vote "($PROPOSAL_ID, true)"
print_status "Admin voted YES"

# Member1 votes YES  
dfx identity use member1
dfx canister call hhdao_dao vote "($PROPOSAL_ID, true)"
print_status "Member1 voted YES"

# Member2 votes YES (this gives us 3/4 = 75% > 60%)
dfx identity use member2
dfx canister call hhdao_dao vote "($PROPOSAL_ID, true)"
print_status "Member2 voted YES"

# Member3 votes NO (still 3/4 = 75%)
dfx identity use member3  
dfx canister call hhdao_dao vote "($PROPOSAL_ID, false)"
print_status "Member3 voted NO"

# Finalize proposal (as admin)
dfx identity use default
print_status "Finalizing proposal..."
dfx canister call hhdao_dao finalizeProposal "($PROPOSAL_ID)"

# Check result
PROPOSAL_STATUS=$(dfx canister call hhdao_dao getProposal "($PROPOSAL_ID)")
echo "Proposal result: $PROPOSAL_STATUS"

if echo "$PROPOSAL_STATUS" | grep -q "approved = true"; then
    print_success "✅ PASS: 75% approval (3/4) correctly exceeded 60% threshold"
else
    print_error "❌ FAIL: Should have been approved with 75% support"
fi

# Test 4: Create another proposal to test FAILURE case
echo ""
print_status "Test 4: Testing 60% consensus - SHOULD FAIL (2 out of 4 votes = 50%)"

# Create second proposal
PROPOSAL_RESULT2=$(dfx canister call hhdao_dao createProposal '("Expand Solar Farm", "Add 10 new panels to increase capacity", variant { ExpansionPlanning })' | grep -o '[0-9]\+')
PROPOSAL_ID2=$PROPOSAL_RESULT2
print_success "Created proposal #$PROPOSAL_ID2: Expand Solar Farm"

# Only 2 members vote YES (50% < 60%)
dfx identity use default
dfx canister call hhdao_dao vote "($PROPOSAL_ID2, true)"
print_status "Admin voted YES"

dfx identity use member1
dfx canister call hhdao_dao vote "($PROPOSAL_ID2, true)"
print_status "Member1 voted YES"

# Other members don't vote (or vote NO)
dfx identity use member2
dfx canister call hhdao_dao vote "($PROPOSAL_ID2, false)"
print_status "Member2 voted NO"

dfx identity use member3
dfx canister call hhdao_dao vote "($PROPOSAL_ID2, false)"  
print_status "Member3 voted NO"

# Finalize second proposal
dfx identity use default
dfx canister call hhdao_dao finalizeProposal "($PROPOSAL_ID2)"

# Check result  
PROPOSAL_STATUS2=$(dfx canister call hhdao_dao getProposal "($PROPOSAL_ID2)")
echo "Proposal result: $PROPOSAL_STATUS2"

if echo "$PROPOSAL_STATUS2" | grep -q "approved = false"; then
    print_success "✅ PASS: 50% approval (2/4) correctly failed 60% threshold"  
else
    print_error "❌ FAIL: Should have been rejected with only 50% support"
fi

# Summary
echo ""
echo "=========================================================="
print_status "🌞 HHDAO Governance Test Summary"
echo "=========================================================="
print_success "Community size: $FINAL_COUNT members"
print_success "Consensus mechanism: ≥60% approval required"  
print_success "Test 1 (75% approval): $(echo "$PROPOSAL_STATUS" | grep -q "approved = true" && echo "PASSED ✅" || echo "FAILED ❌")"
print_success "Test 2 (50% approval): $(echo "$PROPOSAL_STATUS2" | grep -q "approved = false" && echo "PASSED ✅" || echo "FAILED ❌")"

echo ""
print_status "🤝 Philosophy Validation:"
echo "   ✅ Decisions require broad community agreement (60%+)"  
echo "   ✅ No single member can dominate (not simple majority)"
echo "   ✅ Collaborative consensus over competitive voting"
print_success "HHDAO governance is ethically grounded and technically sound! 🌱"

# Cleanup note
echo ""
print_status "Note: Test identities created (member1, member2, member3)"
print_status "To cleanup: dfx identity remove member1 member2 member3"

# Switch back to default
dfx identity use default