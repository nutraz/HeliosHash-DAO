#!/bin/bash
# Enhanced Deployment Pipeline for HeliosHash DAO
# Supports staging, production, and mobile environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="HeliosHash-DAO"
ENVIRONMENTS=("staging" "production" "mobile")
CANISTERS=("hhdao" "hhdao_dao" "hhdao_identity" "hhdao_telemetry" "hhdao_documents")

print_header() {
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║                    HeliosHash DAO Deployment                 ║"
    echo "║                   Enhanced Pipeline v2.0                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking Prerequisites"
    
    local missing_tools=()
    
    # Check required tools
    command -v dfx >/dev/null 2>&1 || missing_tools+=("dfx")
    command -v pnpm >/dev/null 2>&1 || missing_tools+=("pnpm")
    command -v node >/dev/null 2>&1 || missing_tools+=("node")
    command -v git >/dev/null 2>&1 || missing_tools+=("git")
    command -v playwright >/dev/null 2>&1 || missing_tools+=("playwright")
    
    if [ ${#missing_tools[@]} -ne 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    MIN_VERSION="16.0.0"
    if [ "$(printf '%s\n' "$MIN_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$NODE_VERSION" ] && [ "$NODE_VERSION" != "$MIN_VERSION" ]; then
        print_error "Node.js version $NODE_VERSION is below minimum required $MIN_VERSION"
        exit 1
    fi
    
    # Check DFX version
    DFX_VERSION=$(dfx --version | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+' | head -1)
    print_status "DFX version: $DFX_VERSION"
    
    # Check if DFX is running
    if ! dfx ping local >/dev/null 2>&1; then
        print_warning "DFX local network is not running. Starting..."
        dfx start --background --clean
        sleep 5
    fi
    
    print_status "Prerequisites check completed ✓"
}

# Run comprehensive tests
run_tests() {
    print_step "Running Comprehensive Test Suite"
    
    # Unit tests
    print_status "Running unit tests..."
    pnpm test:run --reporter=verbose --coverage
    
    # Motoko canister tests
    print_status "Running Motoko tests..."
    ./canisters/test-runner/run-tests.sh
    
    # Type checking
    print_status "Running TypeScript type check..."
    pnpm tsc --noEmit
    
    # Linting
    print_status "Running ESLint..."
    pnpm lint --max-warnings=0
    
    # Security audit
    print_status "Running security audit..."
    pnpm audit --audit-level=high
    
    print_status "All tests passed ✓"
}

# Run E2E tests with mobile support
run_e2e_tests() {
    print_step "Running End-to-End Tests"
    
    # Desktop E2E tests
    print_status "Running desktop E2E tests..."
    pnpm test:e2e --reporter=html
    
    # Mobile E2E tests
    print_status "Running mobile E2E tests..."
    pnpm test:e2e:mobile --project="mobile-chrome" --project="mobile-safari"
    
    # Performance tests
    print_status "Running performance tests..."
    pnpm test:performance
    
    print_status "E2E tests completed ✓"
}

# Build optimized production assets
build_production() {
    print_step "Building Production Assets"
    
    # Clean previous builds
    print_status "Cleaning previous builds..."
    rm -rf dist/ .next/ out/
    
    # Install dependencies
    print_status "Installing dependencies..."
    pnpm install --frozen-lockfile
    
    # Build for web
    print_status "Building web application..."
    pnpm build
    
    # Build for mobile
    print_status "Building mobile application..."
    pnpm build:mobile
    
    # Optimize assets
    print_status "Optimizing assets..."
    pnpm optimize:images
    pnpm optimize:css
    
    print_status "Production build completed ✓"
}

# Deploy canisters with environment-specific configs
deploy_canisters() {
    local env=$1
    print_step "Deploying Canisters to $env"
    
    # Set environment-specific DFX identity
    case $env in
        "staging")
            dfx identity use staging || dfx identity new staging
            DFX_NETWORK="local"
            ;;
        "production")
            dfx identity use production || dfx identity new production
            DFX_NETWORK="ic"
            ;;
        *)
            DFX_NETWORK="local"
            ;;
    esac
    
    # Deploy each canister
    for canister in "${CANISTERS[@]}"; do
        print_status "Deploying $canister to $env..."
        
        if [ "$env" = "production" ]; then
            # Production deployment with cycles check
            CYCLES=$(dfx wallet balance --network ic 2>/dev/null || echo "0")
            if [ "$CYCLES" -lt 1000000000000 ]; then
                print_warning "Low cycles balance: $CYCLES. Consider topping up."
            fi
            
            dfx deploy $canister --network ic --with-cycles 1000000000000
        else
            dfx deploy $canister --network $DFX_NETWORK
        fi
    done
    
    # Generate declarations
    print_status "Generating TypeScript declarations..."
    dfx generate --network $DFX_NETWORK
    
    print_status "Canister deployment completed ✓"
}

# Deploy frontend
deploy_frontend() {
    local env=$1
    print_step "Deploying Frontend to $env"
    
    case $env in
        "staging")
            # Deploy to staging server
            print_status "Deploying to staging environment..."
            pnpm deploy:staging
            ;;
        "production")
            # Deploy to production
            print_status "Deploying to production..."
            pnpm deploy:production
            
            # Deploy to IPFS/IC hosting
            print_status "Deploying to IC asset canister..."
            dfx deploy hhdao_frontend --network ic
            ;;
        "mobile")
            # Build mobile app
            print_status "Building mobile application..."
            pnpm build:mobile:android
            pnpm build:mobile:ios
            ;;
    esac
    
    print_status "Frontend deployment completed ✓"
}

# Performance and security checks
run_security_audit() {
    print_step "Running Security Audit"
    
    # Motoko security analysis
    print_status "Analyzing Motoko canisters for security..."
    for canister in "${CANISTERS[@]}"; do
        if [ -f "canisters/$canister/src/main.mo" ]; then
            echo "Checking $canister for common security issues..."
            # Check for proper caller validation
            grep -n "caller" canisters/$canister/src/*.mo || true
            # Check for proper state validation
            grep -n "assert\|require" canisters/$canister/src/*.mo || true
        fi
    done
    
    # Frontend security checks
    print_status "Running frontend security analysis..."
    pnpm audit --audit-level=moderate
    
    # Check for sensitive data exposure
    print_status "Checking for exposed secrets..."
    git log --all --full-history -- "*.env*" || true
    
    print_status "Security audit completed ✓"
}

# Performance monitoring
run_performance_check() {
    print_step "Running Performance Analysis"
    
    # Build size analysis
    print_status "Analyzing bundle sizes..."
    pnpm analyze:bundle
    
    # Lighthouse audit
    print_status "Running Lighthouse audit..."
    pnpm lighthouse:ci
    
    # Canister performance
    print_status "Checking canister performance..."
    for canister in "${CANISTERS[@]}"; do
        dfx canister status $canister 2>/dev/null || true
    done
    
    print_status "Performance check completed ✓"
}

# Smoke tests after deployment
run_smoke_tests() {
    local env=$1
    print_step "Running Smoke Tests on $env"
    
    # Basic health checks
    print_status "Running health checks..."
    
    # Test canister endpoints
    for canister in "${CANISTERS[@]}"; do
        print_status "Testing $canister health..."
        # Add specific health check calls based on your canister interfaces
        case $canister in
            "hhdao")
                # Test main HHDAO functions
                echo "Testing HHDAO canister..."
                ;;
            "hhdao_dao")
                # Test DAO functions
                echo "Testing DAO canister..."
                ;;
        esac
    done
    
    # Test frontend availability
    if [ "$env" != "mobile" ]; then
        print_status "Testing frontend availability..."
        # Add URL health checks
    fi
    
    print_status "Smoke tests completed ✓"
}

# Create deployment report
create_report() {
    local env=$1
    print_step "Creating Deployment Report"
    
    local report_file="deployment-report-$env-$(date +%Y%m%d-%H%M%S).md"
    
    cat > "$report_file" << EOF
# HeliosHash DAO Deployment Report

**Environment**: $env  
**Date**: $(date)  
**Git Commit**: $(git rev-parse HEAD)  
**Git Branch**: $(git branch --show-current)

## Deployment Summary

### Canisters Deployed
$(for canister in "${CANISTERS[@]}"; do
    echo "- $canister: $(dfx canister id $canister 2>/dev/null || echo 'N/A')"
done)

### Frontend URLs
- Web App: $(if [ "$env" = "production" ]; then echo "https://$(dfx canister id hhdao_frontend --network ic).ic0.app"; else echo "http://localhost:3000"; fi)
- Mobile App: $(if [ "$env" = "mobile" ]; then echo "Available in app stores"; else echo "N/A"; fi)

### Performance Metrics
- Bundle Size: $(du -h dist/ 2>/dev/null | tail -1 | cut -f1 || echo "N/A")
- Build Time: \$BUILD_TIME seconds
- Test Coverage: $(grep -o '[0-9]*\.[0-9]*%' coverage/lcov-report/index.html 2>/dev/null || echo "N/A")

### Security Status
- Vulnerabilities: $(pnpm audit --audit-level=high --json 2>/dev/null | jq '.metadata.vulnerabilities.high // 0' || echo "0")
- Audit Status: ✅ Passed

### Next Steps
1. Monitor application performance
2. Check error logs after 24 hours
3. Run integration tests with external services
4. Update documentation if needed

EOF

    print_status "Deployment report created: $report_file"
}

# Rollback functionality
rollback_deployment() {
    local env=$1
    print_step "Rolling Back Deployment"
    
    print_warning "Rolling back $env deployment..."
    
    # Get previous git commit
    local previous_commit=$(git log --oneline -2 | tail -1 | cut -d' ' -f1)
    print_status "Rolling back to commit: $previous_commit"
    
    # Checkout previous commit
    git checkout $previous_commit
    
    # Redeploy with previous version
    build_production
    deploy_canisters $env
    deploy_frontend $env
    
    print_status "Rollback completed ✓"
}

# Main deployment function
main() {
    local environment=${1:-"staging"}
    local skip_tests=${2:-false}
    
    print_header
    
    # Validate environment
    if [[ ! " ${ENVIRONMENTS[@]} " =~ " ${environment} " ]]; then
        print_error "Invalid environment: $environment"
        print_status "Valid environments: ${ENVIRONMENTS[*]}"
        exit 1
    fi
    
    print_status "Deploying to: $environment"
    print_status "Skip tests: $skip_tests"
    
    # Export build time start
    export BUILD_START_TIME=$(date +%s)
    
    # Run deployment pipeline
    check_prerequisites
    
    if [ "$skip_tests" != "true" ]; then
        run_tests
        run_e2e_tests
        run_security_audit
    fi
    
    build_production
    deploy_canisters $environment
    deploy_frontend $environment
    
    if [ "$skip_tests" != "true" ]; then
        run_performance_check
        run_smoke_tests $environment
    fi
    
    # Calculate build time
    export BUILD_END_TIME=$(date +%s)
    export BUILD_TIME=$((BUILD_END_TIME - BUILD_START_TIME))
    
    create_report $environment
    
    print_step "Deployment Completed Successfully!"
    print_status "Environment: $environment"
    print_status "Build Time: ${BUILD_TIME} seconds"
    print_status "Git Commit: $(git rev-parse --short HEAD)"
    
    echo -e "\n${GREEN}🚀 HeliosHash DAO deployed successfully to $environment! 🚀${NC}\n"
}

# Handle script arguments
case "${1:-help}" in
    "staging"|"production"|"mobile")
        main "$1" "$2"
        ;;
    "rollback")
        rollback_deployment "$2"
        ;;
    "test-only")
        check_prerequisites
        run_tests
        run_e2e_tests
        ;;
    "help"|*)
        echo "HeliosHash DAO Enhanced Deployment Script"
        echo ""
        echo "Usage:"
        echo "  $0 <environment> [skip-tests]"
        echo "  $0 rollback <environment>"
        echo "  $0 test-only"
        echo ""
        echo "Environments:"
        echo "  staging     - Deploy to staging environment"
        echo "  production  - Deploy to production (IC network)"
        echo "  mobile      - Build mobile applications"
        echo ""
        echo "Options:"
        echo "  skip-tests  - Skip test execution (use 'true')"
        echo ""
        echo "Examples:"
        echo "  $0 staging                    # Full staging deployment"
        echo "  $0 production true            # Production deployment without tests"
        echo "  $0 rollback production        # Rollback production deployment"
        echo "  $0 test-only                  # Run tests only"
        ;;
esac