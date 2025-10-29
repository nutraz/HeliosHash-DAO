#!/bin/bash

# HeliosHash DAO Deployment Script
# This script handles the complete deployment process for the HeliosHash DAO platform

set -e  # Exit on any error

echo "🚀 Starting HeliosHash DAO deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."

    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi

    if ! command -v dfx &> /dev/null; then
        print_error "DFX is not installed. Please install the Internet Computer SDK"
        exit 1
    fi

    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Docker deployment will be skipped."
    fi

    print_success "Dependencies check passed"
}

# Install npm dependencies
install_dependencies() {
    print_status "Installing npm dependencies..."

    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi

    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."

    if npm test; then
        print_success "All tests passed"
    else
        print_error "Tests failed. Deployment aborted."
        exit 1
    fi
}

# Build the application
build_application() {
    print_status "Building application..."

    if npm run build; then
        print_success "Application built successfully"
    else
        print_error "Build failed. Deployment aborted."
        exit 1
    fi
}

# Deploy canisters to Internet Computer
deploy_canisters() {
    print_status "Deploying canisters to Internet Computer..."

    # Check if local network is running
    if ! dfx ping; then
        print_status "Starting local Internet Computer network..."
        dfx start --clean --background
        sleep 5
    fi

    # Deploy all canisters
    if dfx deploy --network local; then
        print_success "Canisters deployed successfully"

        # Extract canister IDs and update environment
        print_status "Updating environment with canister IDs..."
        dfx canister id hhdao --network local > .canister-ids-local.txt
        dfx canister id dao --network local >> .canister-ids-local.txt
        dfx canister id identity --network local >> .canister-ids-local.txt
        dfx canister id telemetry --network local >> .canister-ids-local.txt
        dfx canister id documents --network local >> .canister-ids-local.txt

        print_success "Canister IDs updated"
    else
        print_error "Canister deployment failed"
        exit 1
    fi
}

# Set up database
setup_database() {
    print_status "Setting up database..."

    if npm run db:generate && npm run db:push; then
        print_success "Database setup completed"
    else
        print_error "Database setup failed"
        exit 1
    fi
}

# Create Docker image
build_docker_image() {
    if command -v docker &> /dev/null; then
        print_status "Building Docker image..."

        if docker build -t helioshash-dao .; then
            print_success "Docker image built successfully"
        else
            print_warning "Docker image build failed, but continuing deployment"
        fi
    else
        print_warning "Docker not available, skipping Docker build"
    fi
}

# Run health check
run_health_check() {
    print_status "Running health check..."

    # Start the application in background for health check
    npm run build
    npm start &
    APP_PID=$!

    # Wait for application to start
    sleep 10

    # Check health endpoint
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "Health check passed"
    else
        print_warning "Health check failed, but application may still be running"
    fi

    # Stop the application
    kill $APP_PID 2>/dev/null || true
}

# Main deployment function
main() {
    print_status "Starting comprehensive deployment process..."

    check_dependencies
    install_dependencies
    run_tests
    build_application
    setup_database
    deploy_canisters
    build_docker_image
    run_health_check

    print_success "🎉 Deployment completed successfully!"
    print_status "You can now start the application with: npm run dev"
    print_status "Or deploy to production with: npm start"
}

# Handle command line arguments
case "${1:-}" in
    "local")
        print_status "Deploying to local network only..."
        check_dependencies
        install_dependencies
        setup_database
        deploy_canisters
        print_success "Local deployment completed!"
        ;;
    "test")
        print_status "Running tests only..."
        check_dependencies
        install_dependencies
        run_tests
        print_success "Tests completed!"
        ;;
    "build")
        print_status "Building application only..."
        check_dependencies
        install_dependencies
        build_application
        print_success "Build completed!"
        ;;
    "docker")
        print_status "Building Docker image only..."
        check_dependencies
        install_dependencies
        build_application
        build_docker_image
        print_success "Docker build completed!"
        ;;
    *)
        main
        ;;
esac
