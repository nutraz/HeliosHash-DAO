#!/bin/bash
echo "🚀 Deploying HHDAO DApp to production..."

# Build static frontend
pnpm build

# Deploy to Fleek (IPFS) - Requires Fleek CLI: npm install -g @fleekhq/fleek-cli
# fleek sites deploy --dir=./dist

# OR: Deploy ICP canisters to mainnet
# dfx deploy --network ic

echo "✅ Deployment script ready. Customize with your Fleek/ICP settings."
