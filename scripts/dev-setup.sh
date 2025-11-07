#!/bin/bash
# HeliosHash DAO Development Environment Setup

set -e

echo "🚀 Setting up HeliosHash DAO development environment..."

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."

    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi

    if ! command -v dfx &> /dev/null; then
        echo "❌ DFX is not installed. Please install DFX SDK first."
        echo "   Run: sh -ci \"\$(curl -fsSL https://internetcomputer.org/install.sh)\""
        exit 1
    fi

    if ! command -v pnpm &> /dev/null; then
        echo "📦 Installing pnpm..."
        npm install -g pnpm
    fi

    echo "✅ Prerequisites check passed"
}

# Install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    pnpm install
    echo "✅ Dependencies installed"
}

# Setup Internet Computer local environment
setup_ic() {
    echo "🌐 Setting up Internet Computer local environment..."

    # Start DFX in background if not already running
    if ! dfx ping > /dev/null 2>&1; then
        echo "Starting DFX local replica..."
        dfx start --background --clean
        sleep 5
    else
        echo "DFX is already running"
    fi

    # Deploy canisters
    echo "🚀 Deploying canisters..."
    dfx deploy

    # Generate type declarations
    echo "📝 Generating type declarations..."
    dfx generate

    echo "✅ Internet Computer environment ready"
}

# Setup environment file
setup_environment() {
    if [ ! -f ".env.local" ]; then
        echo "📄 Creating local environment file..."
        cp .env.example .env.local
        echo "✅ Created .env.local - please configure it for your environment"
    else
        echo "✅ .env.local already exists"
    fi
}

# Main setup flow
main() {
    check_prerequisites
    install_dependencies
    setup_ic
    setup_environment

    echo ""
    echo "🎉 Development environment setup complete!"
    echo ""
    echo "Next steps:"
    echo "  1. Configure .env.local with your settings"
    echo "  2. Run 'pnpm dev' to start the development server"
    echo "  3. Visit http://localhost:3001 to see your app"
    echo ""
    echo "Available commands:"
    echo "  pnpm dev          - Start development server"
    echo "  pnpm build        - Build for production"
    echo "  pnpm test:run     - Run all tests"
    echo "  dfx deploy        - Deploy canisters"
    echo "  dfx generate      - Generate type declarations"
}

main "$@"
    cp .env.example .env.local 2>/dev/null || echo "No .env.example found"
    echo "✅ Created .env.local"
fi

# Create necessary directories
mkdir -p logs tmp uploads

# Set up git hooks if needed
if [ -d .git ]; then
    echo "Setting up git hooks..."
    cp scripts/git-hooks/* .git/hooks/ 2>/dev/null || echo "No git hooks found"
fi

echo "✅ Development environment ready"
