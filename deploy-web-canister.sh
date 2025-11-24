#!/bin/bash

set -e

echo "🚀 Deploying HeliosHash DAO Frontend"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}📦 Preparing frontend assets...${NC}"

# Create minimal frontend if Next.js build fails
create_minimal_frontend() {
    rm -rf frontend-assets
    mkdir -p frontend-assets
    
    cat > frontend-assets/index.html << 'HTML'
<!DOCTYPE html>
<html>
<head>
    <title>HeliosHash DAO</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
        .container { max-width: 800px; margin: 0 auto; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 HeliosHash DAO</h1>
        <p>Decentralized Governance Platform</p>
        <p><strong>Canister:</strong> <span id="canisterId"></span></p>
    </div>
    <script>
        document.getElementById('canisterId').textContent = window.location.hostname;
    </script>
</body>
</html>
HTML
}

# Try Next.js build first, fallback to minimal frontend
cd apps/web
if pnpm build 2>/dev/null; then
    echo -e "${GREEN}✅ Next.js build successful${NC}"
    cd ../..
    mkdir -p frontend-assets
    cp -r apps/web/out/* frontend-assets/ 2>/dev/null || cp -r apps/web/.next/output/static/* frontend-assets/ 2>/dev/null
else
    echo -e "${YELLOW}⚠️ Next.js build failed, using minimal frontend${NC}"
    cd ../..
    create_minimal_frontend
fi

echo -e "${YELLOW}🔧 Deploying to Internet Computer...${NC}"
dfx deploy frontend

CANISTER_ID=$(dfx canister id frontend)
echo -e "${GREEN}🎉 Frontend deployed successfully!${NC}"
echo -e "${GREEN}🌐 URL: http://$CANISTER_ID.localhost:4943/${NC}"
