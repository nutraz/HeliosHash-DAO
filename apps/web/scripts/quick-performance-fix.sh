#!/bin/bash
echo "🔧 Applying quick performance fixes..."

cd ~/HeliosHash-DAO/apps/web

# 1. Use optimized config for all tests
cp playwright.config.optimized.ts playwright.config.ts

# 2. Run only optimized tests
echo "Running optimized test suite..."
npx playwright test e2e/tests/*optimized.spec.ts --project=chromium

# 3. Compare results
echo ""
echo "🎯 PERFORMANCE IMPROVEMENTS APPLIED:"
echo "  - Reduced timeouts"
echo "  - Faster navigation" 
echo "  - Optimized selectors"
echo "  - Early exit patterns"
echo ""
echo "Run './scripts/quick-performance-fix.sh' anytime tests get slow!"
