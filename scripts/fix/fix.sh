#!/bin/bash
# Purpose: Main fix script for common issues
# Location: scripts/fix/

echo "🔧 Running main fix script..."
cd "$(dirname "$0")/../.."

# Run common fixes
echo "Fixing common issues..."
npm run fix 2>/dev/null || echo "No npm fix script found"

echo "✅ Main fixes applied!"
