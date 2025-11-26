#!/bin/bash

echo "=== Running HeliosHash DAO E2E Tests ==="

# Clean up any existing processes
pkill -f "next dev" 2>/dev/null || true
sleep 2

# Start the web app in background
echo "Starting web application..."
cd apps/web
pnpm run dev &
WEB_PID=$!
cd ../..

# Wait for server to be ready
echo "Waiting for web server to start on port 3000..."
for i in {1..30}; do
    if curl -s http://localhost:3000 >/dev/null; then
        echo "✅ Web server is ready!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Web server failed to start within 30 seconds"
        kill $WEB_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# Run the Playwright tests
echo "Running E2E tests..."
npx playwright test --reporter=line

TEST_EXIT_CODE=$?

# Report results
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "🎉 ALL E2E TESTS PASSED!"
else
    echo "⚠️  Some E2E tests failed (exit code: $TEST_EXIT_CODE)"
fi

# Cleanup
echo "Stopping web server..."
kill $WEB_PID 2>/dev/null || true

exit $TEST_EXIT_CODE
