#!/bin/bash
set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 HeliosHash DAO File Reorganization Script${NC}"
echo -e "${YELLOW}⚠️  This will reorganize your project structure${NC}"
echo ""

# Verify we're in the right directory
if [ ! -f "package.json" ] || [ ! -f "dfx.json" ]; then
    echo -e "${RED}❌ Error: Run this script from the HeliosHash-DAO root directory${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo -e "${YELLOW}⚠️  You have uncommitted changes!${NC}"
    echo -e "${YELLOW}   Commit or stash them before proceeding.${NC}"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Create backup branch
echo -e "${GREEN}📦 Creating backup branch...${NC}"
git branch backup-pre-reorg-$(date +%Y%m%d-%H%M%S) || true

# Create new directory structure
echo -e "${GREEN}📁 Creating new directory structure...${NC}"
mkdir -p docs/{deployment,development,governance,status,testing,pilot,compliance}
mkdir -p scripts/{deployment,mobile,testing,pilot,analysis,utils}
mkdir -p assets/{qr-codes,screenshots,svg}
mkdir -p temp

# Function to safely move file with git
safe_move() {
    local source="$1"
    local dest="$2"
    if [ -f "$source" ]; then
        git mv "$source" "$dest" 2>/dev/null || mv "$source" "$dest"
        echo "  ✓ Moved $source → $dest"
    else
        echo "  ⊘ Skipped $source (not found)"
    fi
}

# Move documentation files
echo -e "${GREEN}📚 Moving documentation files...${NC}"
safe_move "DEPLOYMENT_GUIDE.md" "docs/deployment/"
safe_move "MOBILE_CONNECTION_GUIDE.md" "docs/deployment/"
safe_move "MOBILE-README.md" "docs/deployment/"
safe_move "MOBILE-README-2025.md" "docs/deployment/"
safe_move "PRODUCTION_READY.md" "docs/deployment/"

safe_move "COPILOT_CONTEXT.md" "docs/development/"
safe_move "MOTOKO_REFERENCE.md" "docs/development/"
safe_move "TODO.md" "docs/development/"
safe_move "CRITICAL_FIXES_TODO.md" "docs/development/"

safe_move "DAO_GOVERNANCE_FRAMEWORK.md" "docs/governance/"
safe_move "DISPUTE_RESOLUTION_FRAMEWORK.md" "docs/governance/"
safe_move "GOVERNANCE_INTEGRATION.md" "docs/governance/"

safe_move "CURRENT_SYSTEM_STATUS.md" "docs/status/"
safe_move "PHASE_STATUS.md" "docs/status/"
safe_move "SYSTEM_HEALTH_ANALYSIS.md" "docs/status/"
safe_move "SYSTEM_VERIFICATION_REPORT.md" "docs/status/"
safe_move "STATUS_REPORT_E2E.md" "docs/status/"
safe_move "FULL_TECH_STATUS_REPORT.md" "docs/status/"

safe_move "MANUAL_TESTING_GUIDE.md" "docs/testing/"
safe_move "TEST_CATEGORIES.md" "docs/testing/"
safe_move "TEST_INFRASTRUCTURE.md" "docs/testing/"
safe_move "THOROUGH_MOBILE_TESTING_PLAN.md" "docs/testing/"

safe_move "PILOT.md" "docs/pilot/"
safe_move "TESTERS.md" "docs/pilot/"
safe_move "TESTER_FEEDBACK.md" "docs/pilot/"

safe_move "COMPLIANCE_ANALYSIS_REPORT.md" "docs/compliance/"
safe_move "HINDI_ONBOARDING_SCRIPT.md" "docs/compliance/"

# Move script files
echo -e "${GREEN}🔧 Moving script files...${NC}"
safe_move "deploy.sh" "scripts/deployment/"
safe_move "install_dfx.sh" "scripts/deployment/"
safe_move "activate_real_hhdao.sh" "scripts/deployment/"

safe_move "generate_mobile_qr.js" "scripts/mobile/"
safe_move "mobile_hhdao_server.js" "scripts/mobile/"
safe_move "mobile_test_server.js" "scripts/mobile/"
safe_move "mobile_diagnostics.js" "scripts/mobile/"
safe_move "start-mobile.sh" "scripts/mobile/"
safe_move "mobile-setup.sh" "scripts/mobile/"
safe_move "start-mobile-dev.sh" "scripts/mobile/"
safe_move "simple-mobile.sh" "scripts/mobile/"
safe_move "mobile-qr.sh" "scripts/mobile/"

safe_move "test-dao-governance.sh" "scripts/testing/"
safe_move "test-dao-simple.sh" "scripts/testing/"
safe_move "verify-math.sh" "scripts/testing/"
safe_move "test-server.js" "scripts/testing/"

safe_move "launch_pilot.py" "scripts/pilot/"
safe_move "test_proximity_system.js" "scripts/pilot/"
safe_move "test_current_proximity.js" "scripts/pilot/"

safe_move "analyze-consensus.sh" "scripts/analysis/"
safe_move "debug-threshold.sh" "scripts/analysis/"
safe_move "final-proof.sh" "scripts/analysis/"

safe_move "chat_fallback.py" "scripts/utils/"
safe_move "interactive_local_chat.py" "scripts/utils/"
safe_move "complete_build.js" "scripts/utils/"
safe_move "ussd_gateway_server.js" "scripts/utils/"
safe_move "multilingual-demo.sh" "scripts/utils/"

# Move asset files
echo -e "${GREEN}🎨 Moving asset files...${NC}"
for file in *.png; do
    [ -f "$file" ] && safe_move "$file" "assets/screenshots/"
done

for file in *.svg; do
    [ -f "$file" ] && safe_move "$file" "assets/svg/"
done

# Move temporary/generated files
echo -e "${GREEN}🗑️  Moving temporary files...${NC}"
safe_move "test-analytics.json" "temp/"
safe_move "proximity_test_2025-10-03.json" "temp/"
safe_move "current_proximity_2025-10-03.json" "temp/"
safe_move "mobile_diagnostics.json" "temp/"
safe_move "hhdao_mobile_access.json" "temp/"
safe_move "diff-report.txt" "temp/"
safe_move "production-enhancement-report-20251005-181919.md" "temp/"

# Update .gitignore
echo -e "${GREEN}📝 Updating .gitignore...${NC}"
cat >> .gitignore << 'GITIGNORE_EOF'

# Temporary and generated files
temp/
*.log
*_diagnostics.json
test-analytics*.json
proximity_test_*.json
current_proximity_*.json
GITIGNORE_EOF

# Create documentation index
echo -e "${GREEN}📖 Creating documentation index...${NC}"
cat > docs/README.md << 'DOC_EOF'
# HeliosHash DAO Documentation

## 📚 Documentation Index

### 🚀 Deployment
- [Deployment Guide](./deployment/DEPLOYMENT_GUIDE.md)
- [Mobile Connection Guide](./deployment/MOBILE_CONNECTION_GUIDE.md)
- [Production Ready Checklist](./deployment/PRODUCTION_READY.md)

### 💻 Development
- [Copilot Context](./development/COPILOT_CONTEXT.md)
- [Motoko Reference](./development/MOTOKO_REFERENCE.md)
- [TODO List](./development/TODO.md)

### 🏛️ Governance
- [DAO Governance Framework](./governance/DAO_GOVERNANCE_FRAMEWORK.md)
- [Dispute Resolution](./governance/DISPUTE_RESOLUTION_FRAMEWORK.md)
- [Governance Integration](./governance/GOVERNANCE_INTEGRATION.md)

### 🧪 Testing
- [Testing Guide](./testing/MANUAL_TESTING_GUIDE.md)
- [Test Categories](./testing/TEST_CATEGORIES.md)
- [Test Infrastructure](./testing/TEST_INFRASTRUCTURE.md)

### 🔬 Pilot Program
- [Pilot Overview](./pilot/PILOT.md)
- [Testers Guide](./pilot/TESTERS.md)
- [Tester Feedback](./pilot/TESTER_FEEDBACK.md)

### 📊 Project Status
- [Current Status](./status/CURRENT_SYSTEM_STATUS.md)
- [Phase Status](./status/PHASE_STATUS.md)
- [System Health](./status/SYSTEM_HEALTH_ANALYSIS.md)

### 📋 Compliance
- [Compliance Analysis](./compliance/COMPLIANCE_ANALYSIS_REPORT.md)
- [Hindi Onboarding](./compliance/HINDI_ONBOARDING_SCRIPT.md)

---

**Navigation**: [Back to Main README](../README.md)
DOC_EOF

# Create scripts README
cat > scripts/README.md << 'SCRIPTS_EOF'
# Scripts Directory

## 📁 Organization

- **deployment/** - Deployment and infrastructure scripts
- **mobile/** - Mobile testing and QR code generation
- **testing/** - Test execution scripts
- **pilot/** - Pilot program automation
- **analysis/** - Analysis and debugging tools
- **utils/** - Utility scripts

## 🚀 Quick Reference

### Deployment
```bash
./deployment/deploy.sh              # Deploy to IC
./deployment/install_dfx.sh         # Install DFX SDK
```

### Mobile Testing
```bash
node mobile/mobile_hhdao_server.js  # Start mobile server
node mobile/generate_mobile_qr.js   # Generate QR codes
```

### Testing
```bash
./testing/test-dao-governance.sh    # Test DAO governance
./testing/verify-math.sh            # Verify calculations
```

### Pilot Program
```bash
python3 pilot/launch_pilot.py       # Launch pilot program
```

---

**Navigation**: [Back to Main README](../README.md) | [View Documentation](../docs/)
SCRIPTS_EOF

echo ""
echo -e "${GREEN}✅ File reorganization complete!${NC}"
echo -e "${GREEN}📊 Summary:${NC}"
echo "  • Documentation organized in docs/"
echo "  • Scripts organized in scripts/"
echo "  • Assets organized in assets/"
echo "  • Temp files moved to temp/"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "  1. Review changes: git status"
echo "  2. Test functionality: pnpm dev"
echo "  3. Commit changes: git add . && git commit -m 'refactor: reorganize project structure'"
echo "  4. Push to remote: git push origin main"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "  • Update any scripts that reference old paths"
echo "  • Update CI/CD workflows if needed"
echo "  • Notify team members of new structure"
