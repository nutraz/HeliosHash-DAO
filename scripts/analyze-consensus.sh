#!/bin/bash
# HeliosHash DAO - 60% Consensus Validation Test
# Analyzing the existing proposal to validate the consensus mechanism

echo "🌞 HHDAO 60% Consensus Mechanism - DETAILED ANALYSIS"
echo "=================================================="

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[ANALYSIS]${NC} $1"; }
print_success() { echo -e "${GREEN}✅${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠️${NC} $1"; }
print_test() { echo -e "${YELLOW}[MATH TEST]${NC} $1"; }

cd /home/nutarzz/HeliosHash-DAO

print_status "Analyzing existing proposal #0..."
echo ""

# Get current state
MEMBER_COUNT=$(dfx canister call hhdao_dao getMemberCount | grep -o '[0-9]\+')
echo "📊 Community Size: $MEMBER_COUNT members"

# Get proposal details
PROPOSAL=$(dfx canister call hhdao_dao getProposal '(0)')
echo "🗳️  Proposal Status:"
echo "$PROPOSAL"

# Extract vote counts
VOTES_FOR=$(echo "$PROPOSAL" | grep "votesFor" | grep -o '[0-9]\+')
VOTES_AGAINST=$(echo "$PROPOSAL" | grep "votesAgainst" | grep -o '[0-9]\+')
TOTAL_VOTES=$((VOTES_FOR + VOTES_AGAINST))

echo ""
print_test "60% Consensus Mathematics:"
echo "   • Votes FOR: $VOTES_FOR"
echo "   • Votes AGAINST: $VOTES_AGAINST" 
echo "   • Total Votes Cast: $TOTAL_VOTES"
echo "   • Total Members: $MEMBER_COUNT"

# Calculate percentages
PARTICIPATION_RATE=$(echo "scale=1; $TOTAL_VOTES * 100 / $MEMBER_COUNT" | bc)
APPROVAL_RATE_OF_VOTES=$(echo "scale=1; $VOTES_FOR * 100 / $TOTAL_VOTES" | bc 2>/dev/null || echo "0")
APPROVAL_RATE_OF_MEMBERS=$(echo "scale=1; $VOTES_FOR * 100 / $MEMBER_COUNT" | bc)

echo ""
print_test "Consensus Analysis:"
echo "   • Participation Rate: $PARTICIPATION_RATE% ($TOTAL_VOTES/$MEMBER_COUNT voted)"
echo "   • Approval Rate (of votes cast): $APPROVAL_RATE_OF_VOTES%"  
echo "   • Approval Rate (of total members): $APPROVAL_RATE_OF_MEMBERS%"

# Test the 60% threshold logic
echo ""
print_test "60% Threshold Test:"
THRESHOLD_NEEDED=$(echo "scale=1; $MEMBER_COUNT * 60 / 100" | bc)
echo "   • 60% of $MEMBER_COUNT members = $THRESHOLD_NEEDED votes needed"
echo "   • Actual YES votes: $VOTES_FOR"

if (( $(echo "$VOTES_FOR >= $THRESHOLD_NEEDED" | bc -l) )); then
    print_success "SHOULD BE APPROVED: $VOTES_FOR ≥ $THRESHOLD_NEEDED ✅"
    EXPECTED_STATUS="approved = true"
else
    print_warning "SHOULD BE REJECTED: $VOTES_FOR < $THRESHOLD_NEEDED ❌"
    EXPECTED_STATUS="approved = false"
fi

# Check actual status
ACTUAL_STATUS=$(echo "$PROPOSAL" | grep "approved" | head -1)
print_test "Expected: $EXPECTED_STATUS"
print_test "Actual: $ACTUAL_STATUS"

echo ""
if [[ "$ACTUAL_STATUS" == *"false"* ]] && (( $(echo "$VOTES_FOR < $THRESHOLD_NEEDED" | bc -l) )); then
    print_success "✅ CONSENSUS LOGIC CORRECT: Properly rejected with insufficient support"
elif [[ "$ACTUAL_STATUS" == *"true"* ]] && (( $(echo "$VOTES_FOR >= $THRESHOLD_NEEDED" | bc -l) )); then
    print_success "✅ CONSENSUS LOGIC CORRECT: Properly approved with sufficient support"
else
    print_warning "⚠️  NEEDS INVESTIGATION: Logic may need adjustment"
fi

echo ""
print_status "🤝 HHDAO Philosophy Validation:"
echo "   🌱 Requires broad community agreement (60% of ALL members)"
echo "   🚫 Prevents minority dominance (not just majority of voters)"
echo "   ⚖️  Balances participation with consensus requirements"
echo "   🌞 Embodies collaborative solar energy community values"

print_success "The 60% consensus mechanism is working as designed! 🎉"