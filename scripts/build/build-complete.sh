#!/bin/bash
# Purpose: Complete build script for HHDAO-FUSION
# Location: scripts/build/

echo "🏗️  Starting complete build..."
cd "$(dirname "$0")/../.."

# Run build using turbo
npm run build

echo "✅ Complete build finished!"
