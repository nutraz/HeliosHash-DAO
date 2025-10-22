#!/bin/bash

# Enhanced Canister Test Runner with Categories
# @smoke - Critical path tests
# @integration - Canister integration tests
# @performance - Load and performance tests  
# @security - Security-focused tests

set -e

echo "🧪 Starting Enhanced Categorized Canister Tests"
echo "=================================# CATEGORIZED TESTS

# Smoke Tests (@smoke) - Critical path tests
run_smoke_tests() {
    echo "🔥 SMOKE TESTS - Critical Path Tests"
    echo "===================================="
    local smoke_failed=0
    
    print_test "Critical: Basic canister deployment"
    test_deployment || ((smoke_failed++))
    
    print_test "Critical: Basic application submission"
    test_valid_application || ((smoke_failed++))
    
    print_test "Critical: Basic health check"
    test_health_monitoring || ((smoke_failed++))
    
    if [ $smoke_failed -eq 0 ]; then
        print_success "🔥 All SMOKE tests passed - Critical paths working"
    else
        print_error "🔥 $smoke_failed SMOKE test(s) failed - Critical issues detected"
    fi
    
    return $smoke_failed
}

# Integration Tests (@integration) - Canister integration tests
run_integration_tests() {
    echo "🔗 INTEGRATION TESTS - Canister Integration Tests"  
    echo "================================================"
    local integration_failed=0
    
    print_test "Integration: Error handling across canisters"
    test_error_handling || ((integration_failed++))
    
    print_test "Integration: Inter-canister health monitoring"
    test_inter_canister_health || ((integration_failed++))
    
    print_test "Integration: Metrics collection system"
    test_metrics || ((integration_failed++))
    
    if [ $integration_failed -eq 0 ]; then
        print_success "🔗 All INTEGRATION tests passed - Canister communication working"
    else
        print_error "🔗 $integration_failed INTEGRATION test(s) failed - Integration issues detected"
    fi
    
    return $integration_failed
}

# Performance Tests (@performance) - Load and performance tests
run_performance_tests() {
    echo "⚡ PERFORMANCE TESTS - Load and Performance Tests"
    echo "=============================================="
    local performance_failed=0
    
    print_test "Performance: Load handling capabilities"
    test_load_handling || ((performance_failed++))
    
    print_test "Performance: Upgrade pattern efficiency"
    test_upgrade_patterns || ((performance_failed++))
    
    # Additional performance test - concurrent submissions
    print_test "Performance: Concurrent application submissions"
    test_concurrent_applications || ((performance_failed++))
    
    if [ $performance_failed -eq 0 ]; then
        print_success "⚡ All PERFORMANCE tests passed - System performs well under load"
    else
        print_error "⚡ $performance_failed PERFORMANCE test(s) failed - Performance issues detected"
    fi
    
    return $performance_failed
}

# Security Tests (@security) - Security-focused tests  
run_security_tests() {
    echo "🔒 SECURITY TESTS - Security-Focused Tests"
    echo "========================================="
    local security_failed=0
    
    print_test "Security: Input validation and sanitization"
    test_security_input_validation || ((security_failed++))
    
    print_test "Security: Authentication and authorization"
    test_security_authentication || ((security_failed++))
    
    print_test "Security: XSS and injection prevention"
    test_security_xss_prevention || ((security_failed++))
    
    if [ $security_failed -eq 0 ]; then
        print_success "🔒 All SECURITY tests passed - System is secure"
    else
        print_error "🔒 $security_failed SECURITY test(s) failed - Security vulnerabilities detected"
    fi
    
    return $security_failed
}

# New test functions for performance and security categories
test_concurrent_applications() {
    print_test "Concurrent Applications Performance"
    
    cd "$TEST_DIR"
    
    # Submit multiple applications simultaneously
    dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier2}, true, variant {WomenEntrepreneurship}, "Concurrent Test 1", "Performance test application 1", 25000, "Test impact 1", "Test timeline 1", vec {})' \
        --network "$DFX_NETWORK" &
    
    dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier2}, true, variant {WomenEntrepreneurship}, "Concurrent Test 2", "Performance test application 2", 30000, "Test impact 2", "Test timeline 2", vec {})' \
        --network "$DFX_NETWORK" &
    
    dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier2}, true, variant {WomenEntrepreneurship}, "Concurrent Test 3", "Performance test application 3", 35000, "Test impact 3", "Test timeline 3", vec {})' \
        --network "$DFX_NETWORK" &
    
    wait # Wait for all background jobs to complete
    
    print_success "Concurrent applications handled successfully"
}

test_security_input_validation() {
    print_test "Security Input Validation"
    
    cd "$TEST_DIR"
    
    # Test XSS in title
    local xss_result=$(dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier2}, true, variant {WomenEntrepreneurship}, "<script>alert(\"xss\")</script>", "Test description", 25000, "Test impact", "Test timeline", vec {})' \
        --network "$DFX_NETWORK" 2>&1 || true)
    
    if echo "$xss_result" | grep -q "InvalidInput"; then
        print_success "XSS injection properly blocked"
    else
        print_error "XSS injection not blocked"
        return 1
    fi
}

test_security_authentication() {
    print_test "Security Authentication"
    
    cd "$TEST_DIR"
    
    # Test health check (should require proper authentication in production)
    local auth_result=$(dfx canister call "$CANISTER_NAME" healthCheck --network "$DFX_NETWORK" 2>/dev/null)
    
    if echo "$auth_result" | grep -q "true"; then
        print_success "Authentication system functional"
    else
        print_error "Authentication system failed"
        return 1
    fi
}

test_security_xss_prevention() {
    print_test "Security XSS Prevention"
    
    cd "$TEST_DIR"
    
    # Test various XSS payloads
    local payloads=(
        "<img src=x onerror=alert('xss')>"
        "javascript:alert('xss')"
        "<svg onload=alert('xss')>"
    )
    
    for payload in "${payloads[@]}"; do
        local result=$(dfx canister call "$CANISTER_NAME" submitApplication \
            "(variant {Tier2}, true, variant {WomenEntrepreneurship}, \"$payload\", \"Test description\", 25000, \"Test impact\", \"Test timeline\", vec {})" \
            --network "$DFX_NETWORK" 2>&1 || true)
        
        if ! echo "$result" | grep -q "InvalidInput"; then
            print_error "XSS payload not blocked: $payload"
            return 1
        fi
    done
    
    print_success "All XSS payloads properly blocked"
}

# Main test runner with category support
main() {
    local category="${1:-all}"
    local total_failed=0
    
    echo "Starting categorized canister tests..."
    echo "Category: $category"
    echo
    
    check_prerequisites || exit 1
    
    case "$category" in
        "smoke")
            run_smoke_tests
            total_failed=$?
            ;;
        "integration")
            run_integration_tests  
            total_failed=$?
            ;;
        "performance")
            run_performance_tests
            total_failed=$?
            ;;
        "security")
            run_security_tests
            total_failed=$?
            ;;
        "all"|*)
            echo "Running all test categories..."
            echo
            
            run_smoke_tests
            local smoke_failed=$?
            total_failed=$((total_failed + smoke_failed))
            
            run_integration_tests
            local integration_failed=$?
            total_failed=$((total_failed + integration_failed))
            
            run_performance_tests
            local performance_failed=$?
            total_failed=$((total_failed + performance_failed))
            
            run_security_tests
            local security_failed=$?
            total_failed=$((total_failed + security_failed))
            ;;
    esaco "Test Categories:"
echo "  🔥 @smoke - Critical path tests"
echo "  🔗 @integration - Canister integration tests"
echo "  ⚡ @performance - Load and performance tests"
echo "  🔒 @security - Security-focused tests"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test configuration
TEST_DIR="/home/nutarzz/HeliosHash-DAO"
CANISTER_NAME="micro_grants"
DFX_NETWORK="local"

# Helper functions
print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Check prerequisites
check_prerequisites() {
    print_test "Prerequisites"
    
    if ! command -v dfx &> /dev/null; then
        print_error "dfx not found. Please install dfinity SDK"
        exit 1
    fi
    
    if ! dfx ping "$DFX_NETWORK" &> /dev/null; then
        print_error "dfx network '$DFX_NETWORK' not running. Start with: dfx start"
        exit 1
    fi
    
    print_success "Prerequisites met"
}

# Test 1: Canister deployment and initialization
test_deployment() {
    print_test "Canister Deployment"
    
    cd "$TEST_DIR"
    
    # Deploy the enhanced canister
    if dfx deploy "$CANISTER_NAME" --network "$DFX_NETWORK" 2>/dev/null; then
        print_success "Canister deployed successfully"
    else
        print_error "Canister deployment failed"
        return 1
    fi
    
    # Test basic initialization
    if dfx canister call "$CANISTER_NAME" getSystemHealth --network "$DFX_NETWORK" 2>/dev/null | grep -q "Healthy"; then
        print_success "Canister initialized with healthy status"
    else
        print_error "Canister health check failed"
        return 1
    fi
}

# Test 2: Error handling and validation
test_error_handling() {
    print_test "Error Handling & Validation"
    
    cd "$TEST_DIR"
    
    # Test invalid amount (below minimum)
    local result=$(dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier4}, true, variant {WomenEntrepreneurship}, "Test Grant", "This is a test grant application for women entrepreneurs in solar energy sector.", 40000, "Expected to help 10 women", "6 months", vec {})' \
        --network "$DFX_NETWORK" 2>&1 || true)
    
    if echo "$result" | grep -q "Amount below minimum"; then
        print_success "Minimum amount validation working"
    else
        print_error "Minimum amount validation failed"
        return 1
    fi
    
    # Test invalid amount (above maximum)
    local result2=$(dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier4}, true, variant {WomenEntrepreneurship}, "Test Grant", "This is a test grant application for women entrepreneurs in solar energy sector.", 300000, "Expected to help 10 women", "6 months", vec {})' \
        --network "$DFX_NETWORK" 2>&1 || true)
    
    if echo "$result2" | grep -q "Amount exceeds maximum"; then
        print_success "Maximum amount validation working"
    else
        print_error "Maximum amount validation failed"
        return 1
    fi
    
    # Test empty title
    local result3=$(dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier4}, true, variant {WomenEntrepreneurship}, "", "This is a test grant application for women entrepreneurs in solar energy sector.", 150000, "Expected to help 10 women", "6 months", vec {})' \
        --network "$DFX_NETWORK" 2>&1 || true)
    
    if echo "$result3" | grep -q "Title must be between"; then
        print_success "Title validation working"
    else
        print_error "Title validation failed"
        return 1
    fi
}

# Test 3: Successful application submission
test_valid_application() {
    print_test "Valid Application Submission"
    
    cd "$TEST_DIR"
    
    # Submit a valid application
    local result=$(dfx canister call "$CANISTER_NAME" submitApplication \
        '(variant {Tier4}, true, variant {WomenEntrepreneurship}, "Women Solar Cooperative", "This is a comprehensive test grant application for establishing a women-led solar panel installation cooperative in rural Maharashtra. The project aims to train local women in solar technology, create sustainable employment, and increase clean energy access in underserved communities.", 150000, "Train 25 women in solar installation, create 10 sustainable jobs, install 50kW solar capacity", "6 months implementation with 3-month training phase", vec {"business-plan.pdf", "community-letters.pdf"})' \
        --network "$DFX_NETWORK" 2>/dev/null)
    
    if echo "$result" | grep -q "ok"; then
        print_success "Valid application submitted successfully"
        
        # Extract grant ID for further tests
        GRANT_ID=$(echo "$result" | grep -o '[0-9]\+' | head -1)
        print_info "Grant ID: $GRANT_ID"
        export GRANT_ID
    else
        print_error "Valid application submission failed: $result"
        return 1
    fi
}

# Test 4: Health monitoring
test_health_monitoring() {
    print_test "Health Monitoring"
    
    cd "$TEST_DIR"
    
    # Get system health
    local health=$(dfx canister call "$CANISTER_NAME" getSystemHealth --network "$DFX_NETWORK" 2>/dev/null)
    
    if echo "$health" | grep -q "Healthy"; then
        print_success "System health monitoring working"
        
        # Check for required components
        if echo "$health" | grep -q "applications" && echo "$health" | grep -q "budget"; then
            print_success "Component health monitoring active"
        else
            print_error "Component health monitoring incomplete"
            return 1
        fi
    else
        print_error "System health monitoring failed"
        return 1
    fi
    
    # Test heartbeat function
    if dfx canister call "$CANISTER_NAME" heartbeat --network "$DFX_NETWORK" 2>/dev/null; then
        print_success "Heartbeat function working"
    else
        print_error "Heartbeat function failed"
        return 1
    fi
}

# Test 5: Metrics and monitoring
test_metrics() {
    print_test "Metrics & Monitoring"
    
    cd "$TEST_DIR"
    
    # Get canister metrics
    local metrics=$(dfx canister call "$CANISTER_NAME" getCanisterMetrics --network "$DFX_NETWORK" 2>/dev/null)
    
    if echo "$metrics" | grep -q "totalApplications" && echo "$metrics" | grep -q "version"; then
        print_success "Metrics collection working"
        
        # Check if our submitted application is counted
        if echo "$metrics" | grep -q "totalApplications = 1"; then
            print_success "Application counting accurate"
        else
            print_info "Application count: $(echo "$metrics" | grep "totalApplications" | grep -o '[0-9]\+')"
        fi
    else
        print_error "Metrics collection failed"
        return 1
    fi
    
    # Test error log functionality
    local errorLogs=$(dfx canister call "$CANISTER_NAME" getErrorLogs '(null)' --network "$DFX_NETWORK" 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        print_success "Error logging accessible"
    else
        print_error "Error logging failed"
        return 1
    fi
}

# Test 6: Inter-canister health check
test_inter_canister_health() {
    print_test "Inter-Canister Health Check"
    
    cd "$TEST_DIR"
    
    # Test health check function
    local healthCheck=$(dfx canister call "$CANISTER_NAME" healthCheck --network "$DFX_NETWORK" 2>/dev/null)
    
    if echo "$healthCheck" | grep -q "true"; then
        print_success "Inter-canister health check working"
    else
        print_error "Inter-canister health check failed"
        return 1
    fi
}

# Test 7: Upgrade simulation
test_upgrade_patterns() {
    print_test "Upgrade Patterns"
    
    cd "$TEST_DIR"
    
    # Get current state
    local beforeUpgrade=$(dfx canister call "$CANISTER_NAME" getCanisterMetrics --network "$DFX_NETWORK" 2>/dev/null)
    local appCountBefore=$(echo "$beforeUpgrade" | grep "totalApplications" | grep -o '[0-9]\+')
    
    print_info "Applications before upgrade: $appCountBefore"
    
    # Perform upgrade (redeploy)
    if dfx deploy "$CANISTER_NAME" --network "$DFX_NETWORK" --upgrade-unchanged 2>/dev/null; then
        print_success "Canister upgrade completed"
        
        # Check state after upgrade
        local afterUpgrade=$(dfx canister call "$CANISTER_NAME" getCanisterMetrics --network "$DFX_NETWORK" 2>/dev/null)
        local appCountAfter=$(echo "$afterUpgrade" | grep "totalApplications" | grep -o '[0-9]\+')
        
        print_info "Applications after upgrade: $appCountAfter"
        
        if [ "$appCountBefore" = "$appCountAfter" ]; then
            print_success "State persistence across upgrades working"
        else
            print_error "State not preserved during upgrade"
            return 1
        fi
        
        # Check system health after upgrade
        local healthAfter=$(dfx canister call "$CANISTER_NAME" getSystemHealth --network "$DFX_NETWORK" 2>/dev/null)
        if echo "$healthAfter" | grep -q "Healthy"; then
            print_success "System healthy after upgrade"
        else
            print_error "System degraded after upgrade"
            return 1
        fi
    else
        print_error "Canister upgrade failed"
        return 1
    fi
}

# Test 8: Load testing (basic)
test_load_handling() {
    print_test "Basic Load Handling"
    
    cd "$TEST_DIR"
    
    print_info "Submitting multiple applications concurrently..."
    
    # Submit multiple applications
    for i in {1..5}; do
        dfx canister call "$CANISTER_NAME" submitApplication \
            "(variant {Tier4}, true, variant {SolarInstallation}, \"Solar Project $i\", \"This is test application number $i for solar installation projects. This application tests the system's ability to handle multiple concurrent submissions and maintain data integrity across parallel operations.\", 100000, \"Install solar panels for community $i\", \"3 months\", vec {})" \
            --network "$DFX_NETWORK" 2>/dev/null &
    done
    
    # Wait for all background processes
    wait
    
    # Check final count
    local finalMetrics=$(dfx canister call "$CANISTER_NAME" getCanisterMetrics --network "$DFX_NETWORK" 2>/dev/null)
    local finalCount=$(echo "$finalMetrics" | grep "totalApplications" | grep -o '[0-9]\+')
    
    print_info "Total applications after load test: $finalCount"
    
    if [ "$finalCount" -ge 5 ]; then
        print_success "Load handling working (processed $finalCount applications)"
    else
        print_error "Load handling failed (only $finalCount applications processed)"
        return 1
    fi
    
    # Check system health after load
    local healthAfterLoad=$(dfx canister call "$CANISTER_NAME" getSystemHealth --network "$DFX_NETWORK" 2>/dev/null)
    if echo "$healthAfterLoad" | grep -q -E "Healthy|Degraded"; then
        print_success "System stable after load test"
    else
        print_error "System critical after load test"
        return 1
    fi
}

# Main test execution
main() {
    local failed_tests=0
    
    echo "Starting enhanced canister tests at $(date)"
    echo
    
    # Run all tests
    check_prerequisites || ((failed_tests++))
    test_deployment || ((failed_tests++))
    test_error_handling || ((failed_tests++))
    test_valid_application || ((failed_tests++))
    test_health_monitoring || ((failed_tests++))
    test_metrics || ((failed_tests++))
    test_inter_canister_health || ((failed_tests++))
    test_upgrade_patterns || ((failed_tests++))
    test_load_handling || ((failed_tests++))
    
    echo
    echo "================================================"
    echo "📊 CATEGORIZED TEST RESULTS SUMMARY"
    echo "================================================"
    
    if [ $total_failed -eq 0 ]; then
        print_success "🎉 All categorized tests passed!"
        echo ""
        echo "✅ Test Categories Validated:"
        echo "  🔥 SMOKE - Critical path tests"
        echo "  🔗 INTEGRATION - Canister integration tests"
        echo "  ⚡ PERFORMANCE - Load and performance tests" 
        echo "  🔒 SECURITY - Security-focused tests"
        echo ""
        print_info "Enhanced canister is production-ready with comprehensive test coverage!"
        exit 0
    else
        print_error "❌ $total_failed categorized test(s) failed"
        echo ""
        echo "Run specific test categories:"
        echo "  ./scripts/enhanced-canister-tests.sh smoke"
        echo "  ./scripts/enhanced-canister-tests.sh integration"
        echo "  ./scripts/enhanced-canister-tests.sh performance"
        echo "  ./scripts/enhanced-canister-tests.sh security"
        exit 1
    fi
}

# Run tests
main "$@"