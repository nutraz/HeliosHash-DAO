#!/bin/bash

# HeliosHash DAO Automated Cleanup Script
# This script reorganizes your project structure following Web3 best practices

set -e  # Exit on error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_ROOT="$HOME/HeliosHash-DAO"

echo -e "${BLUE}🚀 HeliosHash DAO Project Cleanup & Reorganization${NC}"
echo -e "${YELLOW}⚠️  This will reorganize your project structure${NC}"
echo ""

# Safety check
read -p "Have you committed all changes to Git? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}❌ Please commit your changes first!${NC}"
    exit 1
fi

cd "$PROJECT_ROOT"

echo -e "${GREEN}📦 Creating backup...${NC}"
tar -czf "../hhdao-backup-$(date +%Y%m%d-%H%M%S).tar.gz" .

echo -e "${GREEN}📁 Creating new directory structure...${NC}"

# Create main directories
mkdir -p apps/{web,mobile}
mkdir -p packages/{contracts,ui,utils}
mkdir -p scripts/{deploy,test,utils,dev}
mkdir -p docs/{guides,architecture,compliance,api}
mkdir -p tests/{e2e,unit,integration}
mkdir -p config/{eslint,typescript,prettier}
mkdir -p tools/cli

echo -e "${GREEN}🧹 Cleaning up root directory...${NC}"

# Remove stray files
rm -f ./-H ./-p 2>/dev/null || true
rm -rf .vscode.bak 2>/dev/null || true

echo -e "${GREEN}📝 Moving configuration files...${NC}"

# Move config files
[ -f eslint.config.mjs ] && mv eslint.config.mjs config/eslint/
[ -f .prettierrc ] && mv .prettierrc config/prettier/
[ -f .lintstagedrc.js ] && mv .lintstagedrc.js config/
[ -f .nycrc ] && mv .nycrc config/
[ -f jest.config.js ] && mv jest.config.js config/
[ -f jest.setup.js ] && mv jest.setup.js config/
[ -f playwright.config.ts ] && mv playwright.config.ts config/
[ -f vitest.config.ts ] && mv vitest.config.ts config/
[ -f hardhat.config.js ] && mv hardhat.config.js config/

# Move TypeScript configs
mkdir -p config/typescript
[ -f tsconfig.json ] && cp tsconfig.json config/typescript/tsconfig.base.json
[ -f tsconfig.node.json ] && mv tsconfig.node.json config/typescript/

echo -e "${GREEN}🔧 Moving scripts...${NC}"

# Move deployment scripts
mv deploy.sh scripts/deploy/ 2>/dev/null || true
mv install_dfx.sh scripts/deploy/ 2>/dev/null || true

# Move test scripts
mv test-*.sh scripts/test/ 2>/dev/null || true
mv *test*.js scripts/test/ 2>/dev/null || true
mv debug-*.sh scripts/test/ 2>/dev/null || true

# Move dev scripts
mv dev.sh scripts/dev/ 2>/dev/null || true
mv dev-start-all.sh scripts/dev/ 2>/dev/null || true
mv start-mobile*.sh scripts/dev/ 2>/dev/null || true

# Move utility scripts
mv clean_and_push.sh scripts/utils/ 2>/dev/null || true
mv analyze-consensus.sh scripts/utils/ 2>/dev/null || true
mv verify-math.sh scripts/utils/ 2>/dev/null || true
mv reorganize.sh scripts/utils/ 2>/dev/null || true
mv activate_real_hhdao.sh scripts/utils/ 2>/dev/null || true

# Move mobile-specific scripts
mv simple-mobile.sh scripts/dev/ 2>/dev/null || true
mv multilingual-demo.sh scripts/dev/ 2>/dev/null || true

echo -e "${GREEN}📱 Organizing mobile app...${NC}"

# Move Flutter app to apps/mobile
if [ -d "lib" ] && [ -f "pubspec.yaml" ]; then
    [ -d "android" ] && mv android apps/mobile/ 2>/dev/null || true
    [ -d "ios" ] && mv ios apps/mobile/ 2>/dev/null || true
    mv lib apps/mobile/ 2>/dev/null || true
    mv pubspec.* apps/mobile/ 2>/dev/null || true
    [ -f "analysis_options.yaml" ] && mv analysis_options.yaml apps/mobile/
    [ -f "l10n.yaml" ] && mv l10n.yaml apps/mobile/
    [ -f "devtools_options.yaml" ] && mv devtools_options.yaml apps/mobile/
    [ -f ".metadata" ] && mv .metadata apps/mobile/
    [ -d ".dart_tool" ] && mv .dart_tool apps/mobile/
    [ -f ".flutter-plugins-dependencies" ] && mv .flutter-plugins-dependencies apps/mobile/
fi

echo -e "${GREEN}🌐 Organizing web app...${NC}"

# Move Next.js app to apps/web
if [ -d "src" ]; then
    mv src apps/web/ 2>/dev/null || true
    [ -d "public" ] && mv public apps/web/ 2>/dev/null || true
    mv next.config.* apps/web/ 2>/dev/null || true
    [ -f "next-env.d.ts" ] && mv next-env.d.ts apps/web/
    [ -f "middleware.ts" ] && mv middleware.ts apps/web/
    [ -f "tailwind.config.ts" ] && mv tailwind.config.ts apps/web/
    [ -f "postcss.config.*" ] && mv postcss.config.* apps/web/
    [ -d ".next" ] && mv .next apps/web/
    [ -f "components.json" ] && mv components.json apps/web/
    [ -f "i18n.ts" ] && mv i18n.ts apps/web/
fi

echo -e "${GREEN}📚 Organizing documentation...${NC}"

# Move documentation
mv README.md docs/ 2>/dev/null || true
mv VISION.md docs/ 2>/dev/null || true
mv PILOT.md docs/guides/ 2>/dev/null || true
mv COPILOT_CONTEXT.md docs/architecture/ 2>/dev/null || true
mv LOCAL_DEVELOPMENT_GUIDE.md docs/guides/ 2>/dev/null || true
mv DEVELOPMENT_SECURITY_RULES.md docs/guides/ 2>/dev/null || true
mv CANISTERS.md docs/architecture/ 2>/dev/null || true

# Compliance docs
mv COMPLIANCE.md docs/compliance/ 2>/dev/null || true
mv PRIVACY.md docs/compliance/ 2>/dev/null || true
mv SECURITY.md docs/compliance/ 2>/dev/null || true
mv SECURITY_POLICY.md docs/compliance/ 2>/dev/null || true
mv TERMS_OF_SERVICE.md docs/compliance/ 2>/dev/null || true

# Reports
mv *REPORT*.md docs/ 2>/dev/null || true
mv *TODO*.md docs/ 2>/dev/null || true
mv TESTER_FEEDBACK.md docs/ 2>/dev/null || true
mv CONTRIBUTING.md docs/guides/ 2>/dev/null || true

echo -e "${GREEN}🧪 Organizing tests...${NC}"

# Move tests
[ -d "e2e" ] && mv e2e tests/
[ -d "playwright" ] && mv playwright tests/e2e/
[ -d "playwright-report" ] && mv playwright-report tests/e2e/
[ -d "test-results" ] && mv test-results tests/e2e/
[ -d "cypress" ] && mv cypress tests/e2e/
[ -d "test" ] && mv test tests/unit/
[ -d "tests" ] && mv tests/* tests/unit/ 2>/dev/null || true

echo -e "${GREEN}🔗 Organizing smart contracts...${NC}"

# Keep existing contracts directory or move to packages
if [ -d "contracts" ]; then
    # Contracts already exists, just organize it
    echo "Contracts directory already organized"
fi

# Move canisters (already in good place)
# canisters/ stays at root for IC development

echo -e "${GREEN}🗂️  Organizing shared packages...${NC}"

# Move backend if exists
[ -d "backend" ] && echo "Backend directory already organized"

# Move shared code
[ -d "shared" ] && mv shared packages/

echo -e "${GREEN}🧰 Organizing other directories...${NC}"

# Keep critical directories in place
# - canisters/ (IC specific)
# - node_modules/ (dependencies)
# - .git/ (version control)

# Move build artifacts
[ -d "build" ] && echo "Build directory present (will be in .gitignore)"

echo -e "${GREEN}✨ Creating updated configuration files...${NC}"

# Create root tsconfig that extends base
cat > tsconfig.json << 'EOF'
{
  "extends": "./config/typescript/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/apps/*": ["apps/*"],
      "@/packages/*": ["packages/*"],
      "@/config/*": ["config/*"]
    }
  },
  "include": ["apps/**/*", "packages/**/*", "canisters/**/*"],
  "exclude": ["node_modules", "**/dist", "**/.next"]
}
EOF

# Update .gitignore
cat >> .gitignore << 'EOF'

# Build outputs
**/build/
**/dist/
**/.next/
**/out/

# Dependencies
**/node_modules/

# Environment files
**/.env.local
**/.env.*.local

# Testing
**/coverage/
**/test-results/
**/playwright-report/

# Stray files
-H
-p
EOF

echo -e "${GREEN}🏠 Cleaning home directory...${NC}"

cd "$HOME"

# Remove duplicate folders
rm -rf "modernization " 2>/dev/null || true

# Move stray project files
[ -f "hhdao-context.txt" ] && mv hhdao-context.txt "$PROJECT_ROOT/docs/"
[ -f "package.json" ] && [ ! -s "package.json" ] && rm package.json  # Only if empty

echo ""
echo -e "${GREEN}✅ Cleanup complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Review changes: cd $PROJECT_ROOT && git status"
echo "2. Update import paths in your code"
echo "3. Test builds:"
echo "   - Web: cd apps/web && npm run dev"
echo "   - Mobile: cd apps/mobile && flutter run"
echo "4. Commit changes: git add . && git commit -m 'refactor: reorganize project structure'"
echo ""
echo -e "${YELLOW}⚠️  Note: You'll need to update:${NC}"
echo "  - Import paths in your code"
echo "  - CI/CD workflows (.github/workflows)"
echo "  - Build scripts that reference old paths"
echo ""
echo -e "${GREEN}🎉 Your project is now organized following Web3 best practices!${NC}"
