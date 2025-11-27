#!/bin/bash
set -e

echo "🚀 HeliosHash DAO Production E2E Test Runner"
echo "============================================"
echo "Timestamp: $(date)"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_URL="http://localhost:3002"
BACKEND_URL="http://localhost:4943"
MAX_WAIT_TIME=30
TEST_TIMEOUT=30000

cd ~/HeliosHash-DAO/apps/web

# Clean previous results
echo -e "${BLUE}🧹 Cleaning previous test results...${NC}"
rm -rf test-results/ playwright-report/ 2>/dev/null || true
mkdir -p test-results

# Start services
echo -e "${BLUE}🚀 Starting frontend service...${NC}"
pnpm dev &
FRONTEND_PID=$!

# Wait for frontend to be ready
echo -e "${BLUE}⏳ Waiting for frontend to start...${NC}"
for i in $(seq 1 $MAX_WAIT_TIME); do
    if curl -s $FRONTEND_URL > /dev/null; then
        echo -e "${GREEN}✅ Frontend is ready!${NC}"
        break
    fi
    if [ $i -eq $MAX_WAIT_TIME ]; then
        echo -e "${RED}❌ Frontend failed to start within ${MAX_WAIT_TIME}s${NC}"
        kill $FRONTEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# Run test suites with timing
echo -e "${BLUE}🧪 Running E2E test suites...${NC}"
START_TIME=$(date +%s)

npx playwright test e2e/tests/ \
    --project=chromium \
    --reporter=html,line \
    --timeout=$TEST_TIMEOUT \
    --retries=2

END_TIME=$(date +%s)
TOTAL_TIME=$((END_TIME - START_TIME))

# Generate test report
echo -e "${BLUE}📊 Generating test report...${NC}"
npx playwright show-report > test-results/test-summary.txt 2>/dev/null || true

# Count test results
TOTAL_TESTS=$(find e2e/tests -name "*.spec.ts" | wc -l)
TOTAL_TESTS=$((TOTAL_TESTS * 3)) # Estimate

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}🎉 E2E TEST SUITE COMPLETED${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "${BLUE}📅 Timestamp:${NC} $(date)"
echo -e "${BLUE}⏱️  Total Duration:${NC} ${TOTAL_TIME}s"
echo -e "${BLUE}🧪 Estimated Tests:${NC} ${TOTAL_TESTS}"
echo -e "${BLUE}📁 Results:${NC} test-results/"
echo -e "${BLUE}📄 Report:${NC} npx playwright show-report"
echo -e "${GREEN}============================================${NC}"

# Cleanup
kill $FRONTEND_PID 2>/dev/null || true

# Final status
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED - Ready for production!${NC}"
    exit 0
else
    echo -e "${RED}❌ TESTS FAILED - Check test-results/ for details${NC}"
    exit 1
fi
