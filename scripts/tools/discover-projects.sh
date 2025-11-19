#!/bin/bash

echo "=== HeliosHash DAO Project Discovery ==="
echo "Current directory: $(pwd)"

# Find all package.json files and their locations
echo ""
echo "📦 All Packages Found:"
find . -name "package.json" -type f | grep -v node_modules | while read pkg; do
    dir=$(dirname "$pkg")
    echo "  📁 $dir"
    # Show available scripts
    if command -v jq >/dev/null; then
        scripts=$(jq -r '.scripts | keys[]' "$pkg" 2>/dev/null | tr '\n' ' ')
        [ -n "$scripts" ] && echo "     🛠️  Scripts: $scripts"
    fi
done

# Check for common app patterns
echo ""
echo "🔍 Looking for common application patterns:"
patterns=("web" "frontend" "mobile" "app" "client" "backend" "api" "server")
for pattern in "${patterns[@]}"; do
    found=$(find . -type d -name "*$pattern*" ! -path "*/node_modules/*" | head -5)
    if [ -n "$found" ]; then
        echo "  🎯 $pattern: $found"
    fi
done

# Check for turbo.json in different locations
echo ""
echo "⚡ Looking for Turbo configuration:"
find . -name "turbo.json" -type f 2>/dev/null | while read turbo; do
    echo "  📍 Found at: $turbo"
    cat "$turbo" | head -10
done
