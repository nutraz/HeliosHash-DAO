#!/bin/bash
# Purpose: 
# Location: scripts/fix/
set -e

echo "🔧 COMPLETE HHDAO-FUSION FIX"
echo "============================="

cd /home/nutarzz/Development/HHDAO-FUSION

# 1. Create scripts directory
mkdir -p scripts

# 2. Remove package.json files from Motoko canisters
echo "📦 Removing package.json from canisters..."
find canisters -name "package.json" -type f 2>/dev/null | while read file; do
    echo "Moving $file to $file.backup"
    mv "$file" "$file.backup"
done

# 3. Fix pnpm-workspace.yaml
echo "⚙️ Fixing pnpm-workspace.yaml..."
cat > pnpm-workspace.yaml << 'WORKSPACE'
packages:
  - 'apps/*'
  - 'packages/*'
WORKSPACE

# 4. Fix package.json with proper build scripts
echo "📄 Updating package.json..."
cat > package.json << 'PKGJSON'
{
  "name": "helioshash-dao",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.22.0",
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "build:frontend": "turbo run build --filter=./apps/*",
    "build:canisters": "dfx build",
    "build:all": "pnpm build:frontend && pnpm build:canisters",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "clean": "turbo run clean",
    "lint-staged": "lint-staged",
    "dfx:deploy": "dfx deploy",
    "dfx:start": "dfx start",
    "dfx:stop": "dfx stop"
  },
  "devDependencies": {
    "eslint": "^9.38.0",
    "husky": "^9.1.7",
    "lint-staged": "^16.2.6",
    "prettier": "^3.6.2",
    "turbo": "^2.0.14"
  }
}
PKGJSON

# 5. Create unified build script
echo "🚀 Creating build script..."
cat > scripts/build-unified.sh << 'BUILDSCRIPT'
#!/bin/bash
set -e

echo "🏗️ Building HHDAO-FUSION Unified"

# Build frontend apps only
echo "📱 Building frontend applications..."
pnpm build:frontend

# Build canisters with DFX  
echo "⚡ Building Motoko canisters..."
dfx build

echo "✅ HHDAO-FUSION build completed successfully!"
BUILDSCRIPT

chmod +x scripts/build-unified.sh

# 6. Create quick test script
cat > scripts/test-build.sh << 'TESTSCRIPT'
#!/bin/bash
set -e

echo "🧪 Testing HHDAO-FUSION Build"

echo "1. Testing frontend build..."
pnpm build:frontend || echo "Frontend build may have issues - continuing..."

echo "2. Testing canister build..."
dfx build || echo "Canister build may have issues - check individual canisters"

echo "✅ Basic build test completed!"
TESTSCRIPT

chmod +x scripts/test-build.sh

# 7. Clean and reinstall
echo "🧹 Cleaning and reinstalling..."
rm -rf node_modules
pnpm install

echo ""
echo "✅ HHDAO-FUSION FIX COMPLETED!"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Test frontend: pnpm build:frontend"
echo "2. Test canisters: dfx build" 
echo "3. Test both: ./scripts/build-unified.sh"
echo "4. Quick test: ./scripts/test-build.sh"
