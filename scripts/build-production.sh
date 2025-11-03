#!/bin/bash

echo "=== Building for Production ==="

# Build all packages and apps
pnpm build

# Run tests
pnpm test

# Security audit
pnpm audit

# Create production bundle
if [ -d "dist" ]; then
    echo "Production build created in dist/"
    ls -la dist/
else
    echo "No dist directory found. Check build process."
fi

echo "✅ Production build completed"
