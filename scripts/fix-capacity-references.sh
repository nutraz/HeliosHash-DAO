#!/bin/bash

# Script to fix 5kW references to 50kW
# Run with --dry-run to preview changes

DRY_RUN=false
if [ "$1" = "--dry-run" ]; then
  DRY_RUN=true
fi

echo "🔍 Starting capacity reference alignment..."
echo "Mode: $([ $DRY_RUN = true ] && echo 'DRY RUN' || echo 'LIVE')"
echo

# Files to check/update
MARKDOWN_FILES=$(find . -name "*.md" ! -path "*/node_modules/*" ! -path "*/.dfx/*")
JSON_FILES=$(find . -name "*.json" ! -path "*/node_modules/*" ! -path "*/.dfx/*")
TS_FILES=$(find . \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.dfx/*")
MO_FILES=$(find . -name "*.mo" ! -path "*/node_modules/*" ! -path "*/.dfx/*")

update_file() {
  local file="$1"
  local count=0
  if [ "${DRY_RUN}" = true ]; then
    count=$(grep -E -c '5([.][0-9]+)?[[:space:]]*kW' "${file}" || true)
    if [ "${count}" -gt 0 ]; then
      echo "Would update ${file} (${count} matches)"
      grep -E -H '5([.][0-9]+)?[[:space:]]*kW' "${file}" || true
    fi
  else
    # Replace 5kW, 5 kW, 5.0kW etc. with 50kW
    sed -i -E 's/5([.][0-9]+)?[[:space:]]*kW/50kW/g' "${file}"
    count=$(grep -E -c '5([.][0-9]+)?[[:space:]]*kW' "${file}" || true)
    if [ "${count}" -gt 0 ]; then
      echo "Updated ${file} (${count} references aligned)"
    fi
  fi
}

echo "📑 Checking Markdown files..."
for file in $MARKDOWN_FILES; do
  update_file "${file}"
done

echo -e "\n📊 Checking JSON files..."
for file in $JSON_FILES; do
  update_file "${file}"
done

echo -e "\n💻 Checking TypeScript files..."
for file in $TS_FILES; do
  update_file "${file}"
done

echo -e "\n🔧 Checking Motoko files..."
for file in $MO_FILES; do
  update_file "${file}"
done

echo -e "\n✅ Capacity reference alignment complete!"
if [ "$DRY_RUN" = true ]; then
  echo "Run without --dry-run to apply changes"
fi