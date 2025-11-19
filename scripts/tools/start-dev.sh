#!/bin/bash

echo "=== Starting HeliosHash DAO Development ==="

# Start development servers based on project structure
if [ -f "package.json" ]; then
    echo "Available scripts:"
    pnpm run | head -20
    
    # Start dev servers if scripts exist
    if pnpm run | grep -q "dev"; then
        echo "Starting development servers..."
        pnpm dev
    elif pnpm run | grep -q "start:dev"; then
        pnpm start:dev
    else
        echo "No dev script found. Please check package.json"
    fi
else
    echo "No package.json found in current directory"
fi
