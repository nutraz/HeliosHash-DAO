#!/bin/bash

# Enhanced Test Infrastructure Demo Script
# Demonstrates the new test infrastructure capabilities

set -e

echo "🧪 HeliosHash DAO Enhanced Test Infrastructure"
echo "============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_section() { echo -e "${YELLOW}=== $1 ===${NC}"; }

# Check if dependencies are installed
check_dependencies() {
    log_section "Checking Dependencies"
    
    if ! command -v pnpm &> /dev/null; then
        echo "Installing pnpm..."
        npm install -g pnpm
    fi
    
    log_info "Installing test infrastructure dependencies..."
    pnpm install @faker-js/faker
    
    log_success "Dependencies ready"
}

# Demonstrate test categories
demo_test_categories() {
    log_section "Test Categories Available"
    
    echo "📋 Enhanced test categorization:"
    pnpm test:categories
    echo ""
    
    log_info "Test category files created:"
    echo "  📁 e2e/factories/test-data-factory.ts - Comprehensive test data generation"
    echo "  📁 e2e/mocks/api-mocker.ts - Complete API mocking system"
    echo "  📁 e2e/utils/test-helper.ts - Shared test utilities"
    echo ""
}

# Demonstrate test data factories
demo_test_factories() {
    log_section "Test Data Factories"
    
    log_info "Available factory methods:"
    echo ""
    echo "👩 UserFactory:"
    echo "  - createWomenEntrepreneur() - Realistic women-led business profiles"
    echo "  - createCommunityLeader() - Rural community leader profiles"
    echo "  - createTechnicalExpert() - Solar technology expert profiles"
    echo "  - createMaliciousUser() - Security testing with XSS patterns"
    echo "  - createBatch(count, type) - Bulk user generation"
    echo ""
    
    echo "📝 ApplicationFactory:"
    echo "  - createWomensEmpowermentApp() - Women-focused solar applications"
    echo "  - createTechnicalTrainingApp() - Technical skill development apps"
    echo "  - createCommunityDevelopmentApp() - Community-wide solar projects"
    echo "  - createMaliciousApp() - XSS/injection testing applications"
    echo "  - createBatch(count, type) - Performance testing datasets"
    echo ""
    
    echo "🏗️ ProjectFactory & Others:"
    echo "  - createSolarProject() - Solar farm project data"
    echo "  - createFundingProposal() - DAO funding proposals"
    echo "  - EdgeCase factories for robustness testing"
    echo "  - Performance factories for load testing"
    echo ""
    
    log_success "Factories provide realistic, consistent test data"
}

# Demonstrate API mocking
demo_api_mocking() {
    log_section "API Mocking System"
    
    log_info "Comprehensive mocking capabilities:"
    echo ""
    echo "🎭 CanisterMocker:"
    echo "  - micro_grants canister (submitApplication, getApplication, healthCheck)"
    echo "  - womens_incentive canister (processTierPurchase, getTokenBalance)"
    echo "  - hhdao_dao canister (getAllProposals, submitProposal, vote)"
    echo "  - Custom mock responses with error simulation"
    echo ""
    
    echo "💰 WalletMocker:"
    echo "  - IC Plug wallet simulation"
    echo "  - dfinity agent mocking"
    echo "  - Connection state management"
    echo "  - Balance and principal mocking"
    echo ""
    
    echo "🌐 HTTPMocker:"
    echo "  - REST API endpoint mocking"
    echo "  - External service simulation"
    echo "  - Performance condition simulation"
    echo ""
    
    echo "⚡ PerformanceMocker:"
    echo "  - Network condition simulation (slow/fast/offline)"
    echo "  - Load testing support"
    echo "  - Response delay simulation"
    echo ""
    
    log_success "Complete external dependency mocking"
}

# Demonstrate test utilities
demo_test_utilities() {
    log_section "Shared Test Utilities"
    
    log_info "TestHelper class provides unified access to:"
    echo ""
    echo "🔐 AuthUtils:"
    echo "  - connectWallet(user) - Mock wallet authentication"
    echo "  - disconnectWallet() - Wallet disconnection"
    echo "  - verifyAuthenticated() - Authentication state verification"
    echo ""
    
    echo "🧭 NavigationUtils:"
    echo "  - gotoDashboard() - Navigate to dashboard"
    echo "  - gotoProjects() - Navigate to projects"
    echo "  - navigateViaMenu(item) - Menu-based navigation"
    echo "  - waitForPageLoad() - Comprehensive page load waiting"
    echo ""
    
    echo "📝 FormUtils:"
    echo "  - fillApplicationForm(data) - Intelligent form filling"
    echo "  - submitForm(expectSuccess) - Form submission with validation"
    echo "  - verifyValidationError(field, message) - Error validation"
    echo ""
    
    echo "📊 DataUtils:"
    echo "  - createTestApplication(app) - UI-based application creation"
    echo "  - setupTestEnvironment(options) - Complete test environment setup"
    echo "  - createBatchApplications(count) - Bulk data creation"
    echo ""
    
    echo "✅ AssertUtils:"
    echo "  - assertPageTitle(title) - Page title verification"
    echo "  - assertSuccessMessage(message) - Success message validation"
    echo "  - assertPerformanceThresholds() - Core Web Vitals validation"
    echo "  - assertNoXSSContent() - XSS prevention verification"
    echo ""
    
    log_success "Comprehensive utility coverage for all test scenarios"
}

# Show enhanced test examples
show_test_examples() {
    log_section "Enhanced Test Examples"
    
    log_info "Updated test files now use enhanced infrastructure:"
    echo ""
    echo "📁 auth-flow.spec.ts:"
    echo "  ✅ @smoke @security - Login redirect with TestHelper"
    echo "  ✅ @smoke - Wallet connection with mocked authentication"
    echo "  ✅ @security - XSS prevention in auth flow"
    echo "  ✅ @integration - Session persistence across pages"
    echo ""
    
    echo "📁 solar-projects.spec.ts:"
    echo "  ✅ @smoke @integration - Application creation with factories"
    echo "  ✅ @integration - Form validation with realistic data"
    echo "  ✅ @performance - Multiple application load testing"
    echo "  ✅ @security - Input validation and XSS prevention"
    echo ""
    
    log_info "Quick test setup examples:"
    echo ""
    echo "// Smoke test setup"
    echo "await helper.setupSmokeTest();"
    echo ""
    echo "// Integration test with data"
    echo "await helper.setupIntegrationTest(3);"
    echo ""
    echo "// Performance test environment"
    echo "await helper.setupPerformanceTest();"
    echo ""
    echo "// Security test environment"  
    echo "await helper.setupSecurityTest();"
    echo ""
    
    log_success "Tests are now more maintainable and comprehensive"
}

# Show usage commands
show_usage() {
    log_section "Usage Commands"
    
    log_info "Run tests by category:"
    echo ""
    echo "🔥 Smoke Tests (Critical paths):"
    echo "  pnpm test:smoke"
    echo ""
    echo "🔗 Integration Tests (Canister integration):"
    echo "  pnpm test:integration"
    echo ""
    echo "⚡ Performance Tests (Load & performance):"
    echo "  pnpm test:performance"
    echo ""
    echo "🔒 Security Tests (Security-focused):"
    echo "  pnpm test:security"
    echo ""
    echo "📋 All Categories:"
    echo "  pnpm test:all"
    echo ""
    echo "ℹ️  Category Information:"
    echo "  pnpm test:categories"
    echo ""
    
    log_success "Enhanced test infrastructure is ready for use!"
}

# Main execution
main() {
    check_dependencies
    demo_test_categories
    demo_test_factories
    demo_api_mocking
    demo_test_utilities
    show_test_examples
    show_usage
    
    echo ""
    log_success "🎉 Enhanced Test Infrastructure Successfully Implemented!"
    echo ""
    echo "📚 Documentation available:"
    echo "  - TEST_INFRASTRUCTURE.md - Complete infrastructure guide"
    echo "  - TEST_CATEGORIES.md - Test category documentation"
    echo ""
    echo "🚀 Ready for comprehensive testing with:"
    echo "  ✅ Test Data Factories - Realistic, consistent test data"
    echo "  ✅ API Mocking System - Complete external dependency mocking"
    echo "  ✅ Shared Test Utilities - Common operations abstraction"
    echo "  ✅ Category Integration - Enhanced @smoke, @integration, @performance, @security tests"
    echo ""
}

# Run demo
main "$@"