#!/bin/bash
# Purpose: Analyze Motoko compilation issues
# Location: scripts/analysis/

echo "🔍 Motoko Code Analysis"
echo "======================"

cd "$(dirname "$0")/../.."

# Find Motoko files
echo "📁 Searching for Motoko files..."
MO_FILES=$(find . -name "*.mo" -type f | grep -v node_modules | head -10)

if [ -z "$MO_FILES" ]; then
    echo "❌ No .mo files found"
    exit 1
fi

echo "Found files:"
echo "$MO_FILES"

for FILE in $MO_FILES; do
    echo ""
    echo "📊 Analyzing: $FILE"
    echo "-------------------"
    
    # Basic file info
    echo "Size: $(wc -l < "$FILE") lines"
    
    # Check actor declarations
    echo -e "\n🔎 Actor Declarations:"
    grep -n "actor" "$FILE" | head -5
    
    # Check for persistence issues
    echo -e "\n🚨 Persistence Analysis:"
    if grep -q "actor class" "$FILE"; then
        if grep -q "persistent actor class" "$FILE"; then
            echo "✅ Persistent actor class found"
        else
            echo "❌ Actor class needs 'persistent' keyword"
            echo "   Current declaration:"
            grep "actor class" "$FILE" | head -1
        fi
    fi
    
    # Check stable variables
    echo -e "\n📝 Stable Variables:"
    grep -n "stable" "$FILE" || echo "  No stable variables found"
    
    # Show first 15 lines for context
    echo -e "\n📄 First 15 lines:"
    head -15 "$FILE"
done
