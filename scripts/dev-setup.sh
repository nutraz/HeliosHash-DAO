#!/bin/bash

echo "=== HeliosHash DAO Development Setup ==="

# Check Node.js version
echo "Node.js version: $(node --version)"
echo "pnpm version: $(pnpm --version)"

# Create environment files
if [ ! -f .env.local ]; then
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
