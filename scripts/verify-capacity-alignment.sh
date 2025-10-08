#!/bin/bash

# Script to verify capacity alignment after fixes
# This script checks for any remaining 5kW references and validates 50kW alignment

echo "🔍 Starting capacity alignment verification..."

# Files to check
MARKDOWN_FILES=$(find . -name "*.md" ! -path "*/node_modules/*" ! -path "*/.dfx/*")
JSON_FILES=$(find . -name "*.json" ! -path "*/node_modules/*" ! -path "*/.dfx/*")
TS_FILES=$(find . \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.dfx/*")
MO_FILES=$(find . -name "*.mo" ! -path "*/node_modules/*" ! -path "*/.dfx/*")

check_file() {
  local file=$1
  local incorrect_count=$(grep -c '\b5\(\.[0-9]\)\?\s*kW\b' "$file" || true)
  local correct_count=$(grep -c '\b50\(\.[0-9]\)\?\s*kW\b' "$file" || true)
  
  if [ "$incorrect_count" -gt 0 ]; then
    echo "❌ Found $incorrect_count incorrect references in $file:"
    grep -H '\b5\(\.[0-9]\)\?\s*kW\b' "$file" || true
  fi
  
  if [ "$correct_count" -gt 0 ]; then
    echo "✅ Found $correct_count correct references in $file"
  fi
}

echo "📑 Verifying Markdown files..."
for file in $MARKDOWN_FILES; do
  check_file "$file"
done

echo -e "\n📊 Verifying JSON files..."
for file in $JSON_FILES; do
  check_file "$file"
done

echo -e "\n💻 Verifying TypeScript files..."
for file in $TS_FILES; do
  check_file "$file"
done

echo -e "\n🔧 Verifying Motoko files..."
for file in $MO_FILES; do
  check_file "$file"
done

echo -e "\n✅ Verification complete!"