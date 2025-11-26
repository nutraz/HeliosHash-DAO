#!/bin/bash
set -e

echo "🚀 HeliosHash DAO Complete E2E Test Suite"
echo "=========================================="

cd "$(pwd)/apps/web"

# Clean previous results
rm -rf test-results/ playwright-report/

# Start services
echo "Starting frontend..."
pnpm dev &
FRONTEND_PID=$!

echo "Waiting for frontend to start..."
sleep 15

# Run test suites
echo "Running component tests..."
npx playwright test e2e/tests/component-specific.spec.ts --project=chromium

echo "Running backend integration tests..."
npx playwright test e2e/tests/backend-integration.spec.ts --project=chromium

echo "Running performance tests..."
npx playwright test e2e/tests/performance.spec.ts --project=chromium

echo "Running social hub tests..."
npx playwright test e2e/tests/social-hub.spec.ts --project=chromium

echo "Running governance tests..."
npx playwright test e2e/tests/dao-governance.spec.ts --project=chromium

# Final comprehensive run
echo "Running full test suite..."
npx playwright test e2e/tests/ --project=chromium --reporter=html

# Cleanup
kill $FRONTEND_PID 2>/dev/null || true

echo ""
echo "✅ E2E Test Suite Completed!"
echo "📊 View detailed report: npx playwright show-report"
echo "📸 Screenshots saved in: test-results/"
