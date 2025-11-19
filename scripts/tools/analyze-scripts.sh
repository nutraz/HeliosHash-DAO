#!/bin/bash
# Purpose: 
# Location: scripts/tools/
echo "🔍 HHDAO-FUSION Script Analysis Report"
echo "======================================"

TOTAL_SCRIPTS=$(find . -name "*.sh" -type f | wc -l)
echo "Total .sh files found: $TOTAL_SCRIPTS"

echo -e "\n📁 Script Categories:"
echo "-------------------"

# Categorize by directory
echo "1. Root directory scripts:"
find . -maxdepth 1 -name "*.sh" -type f | grep -v "^\./scripts/" | while read script; do
  size=$(stat -c%s "$script" 2>/dev/null || echo "0")
  executable=$([ -x "$script" ] && echo "✅" || echo "❌")
  echo "   $executable $(basename "$script") ($((size/1024))KB)"
done

echo -e "\n2. Scripts directory:"
find scripts/ -name "*.sh" -type f 2>/dev/null | while read script; do
  size=$(stat -c%s "$script" 2>/dev/null || echo "0")
  executable=$([ -x "$script" ] && echo "✅" || echo "❌")
  echo "   $executable $script ($((size/1024))KB)"
done

echo -e "\n3. Tools directory:"
find tools/ -name "*.sh" -type f 2>/dev/null | while read script; do
  size=$(stat -c%s "$script" 2>/dev/null || echo "0")
  executable=$([ -x "$script" ] && echo "✅" || echo "❌")
  echo "   $executable $script ($((size/1024))KB)"
done

echo -e "\n4. Other directories:"
find . -name "*.sh" -type f | grep -v "^\./scripts/" | grep -v "^\./tools/" | grep -v "^\./[^/]*\.sh$" | while read script; do
  size=$(stat -c%s "$script" 2>/dev/null || echo "0")
  executable=$([ -x "$script" ] && echo "✅" || echo "❌")
  echo "   $executable $script ($((size/1024))KB)"
done

echo -e "\n🚨 RECOMMENDATIONS:"
echo "-----------------"

# Check for potentially unused scripts
echo "1. Consider removing:"
find . -name "*.sh" -type f ! -executable | while read script; do
  size=$(stat -c%s "$script" 2>/dev/null || echo "0")
  if [ "$size" -lt 100 ]; then
    echo "   ❓ $script (small & not executable)"
  fi
done

echo -e "\n2. Organize into scripts/ directory:"
find . -maxdepth 1 -name "*.sh" -type f | grep -v "^\./scripts/" | while read script; do
  echo "   📦 $(basename "$script")"
done

echo -e "\n3. Verify these critical scripts are needed:"
critical_scripts=("build-complete.sh" "build-minimal.sh" "fix.sh" "guaranteed-structure.sh")
for script in "${critical_scripts[@]}"; do
  if [ -f "$script" ]; then
    echo "   🔍 $script"
  fi
done
