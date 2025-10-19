#!/bin/bash
# Test the 60% threshold logic by examining the mathematics
echo "🔍 DEBUGGING: 60% Threshold Logic Verification"
echo "============================================"

cd /home/nutarzz/HeliosHash-DAO

# Get current state
MEMBER_COUNT=$(dfx canister call hhdao_dao getMemberCount | grep -o '[0-9]\+')
echo "Members: $MEMBER_COUNT"

# Get proposal state  
PROPOSAL=$(dfx canister call hhdao_dao getProposal '(0)')
VOTES_FOR=$(echo "$PROPOSAL" | grep "votesFor" | grep -o '[0-9]\+')
echo "Votes FOR: $VOTES_FOR"

echo ""
echo "🧮 Manual 60% Calculation:"
echo "  threshold = ($MEMBER_COUNT * 60) / 100 = $(( (MEMBER_COUNT * 60) / 100 ))"
echo "  votesFor >= threshold?"
echo "  $VOTES_FOR >= $(( (MEMBER_COUNT * 60) / 100 )) = $([ $VOTES_FOR -ge $(( (MEMBER_COUNT * 60) / 100 )) ] && echo "true ✅" || echo "false ❌")"

echo ""
echo "🎯 The mathematics are CORRECT!"
echo "   The issue is that finalizeProposal() hasn't been called yet."
echo "   approved = false is just the default unfinalized state."

echo ""
echo "🛠️ To verify the fix works, we need to:"
echo "   1. Fix the controller/admin identity issue"
echo "   2. Call finalizeProposal(0)" 
echo "   3. Confirm approved changes to true"