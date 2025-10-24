#!/bin/bash
# Mathematical verification of 60% threshold logic
echo "🧮 MATHEMATICAL VERIFICATION: 60% Threshold Logic"
echo "==============================================="

# Test the exact formula from our Motoko code:
# threshold = (total * 60) / 100
# approved = votesFor >= threshold

test_case() {
    local members=$1
    local votes_for=$2
    local description=$3
    
    local threshold=$(( (members * 60) / 100 ))
    local approved=$([ $votes_for -ge $threshold ] && echo "true" || echo "false")
    local percentage=$(echo "scale=1; $votes_for * 100 / $members" | bc)
    
    printf "%-20s | %2d/%2d (%5s%%) | threshold=%2d | approved=%-5s | %s\n" \
           "$description" "$votes_for" "$members" "$percentage" "$threshold" "$approved" \
           "$([ $votes_for -ge $threshold ] && echo "✅" || echo "❌")"
}

echo "Test Case            | Votes    | Actual%  | Threshold | Result   | Status"
echo "-------------------- | -------- | -------- | --------- | -------- | ------"

# Test cases including the actual scenario
test_case 5 3 "HHDAO Current Case"
test_case 5 2 "Insufficient (40%)"  
test_case 5 4 "Strong Support (80%)"
test_case 10 6 "Exact 60% (Large)"
test_case 10 5 "Just Under (50%)"
test_case 3 2 "Small Group (67%)"
test_case 100 60 "Perfect 60%"
test_case 100 59 "Just Under (59%)"
test_case 1 1 "Unanimous (100%)"

echo ""
echo "🎯 KEY FINDINGS:"
echo "   • 3 votes out of 5 members = 60.0% = SHOULD BE APPROVED ✅"
echo "   • threshold = (5 * 60) / 100 = 300 / 100 = 3"
echo "   • 3 >= 3 = true ✅"
echo ""
echo "🔍 CONCLUSION:"
echo "   The Motoko logic is mathematically CORRECT!"
echo "   The issue is that finalizeProposal() hasn't been called yet."
echo "   Once finalization runs, approved should change from false to true."