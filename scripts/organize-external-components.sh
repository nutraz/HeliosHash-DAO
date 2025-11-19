#!/bin/bash
echo "🚀 Organizing external components into HeliosHash DAO..."

# Create necessary directories if they don't exist
mkdir -p scripts/{deployment,maintenance,security}
mkdir -p docs/external
mkdir -p security/external-setup
mkdir -p tools/external

# Copy external scripts to organized locations
echo "📦 Copying external scripts..."
cp ~/hhdao-setup.sh scripts/deployment/ 2>/dev/null && echo "  ✅ hhdao-setup.sh"
cp ~/start-hhdao-dev.sh scripts/deployment/ 2>/dev/null && echo "  ✅ start-hhdao-dev.sh"
cp ~/sys-maintain.sh scripts/maintenance/ 2>/dev/null && echo "  ✅ sys-maintain.sh"
cp ~/update-dev-tools.sh scripts/maintenance/ 2>/dev/null && echo "  ✅ update-dev-tools.sh"
cp ~/backup-dev-files*.sh scripts/maintenance/ 2>/dev/null && echo "  ✅ backup scripts"
cp ~/fix-uuid.sh scripts/maintenance/ 2>/dev/null && echo "  ✅ fix-uuid.sh"
cp ~/fedora_diagnostic.sh scripts/maintenance/ 2>/dev/null && echo "  ✅ fedora_diagnostic.sh"
cp ~/maintenance-monitor.sh scripts/maintenance/ 2>/dev/null && echo "  ✅ maintenance-monitor.sh"
cp ~/cleanup_repo.sh scripts/maintenance/ 2>/dev/null && echo "  ✅ cleanup_repo.sh"

# Copy external documentation
echo "📄 Copying external documentation..."
cp ~/hhdao-*.md docs/external/ 2>/dev/null && echo "  ✅ hhdao markdown files"
cp ~/hhdao_*.txt docs/external/ 2>/dev/null && echo "  ✅ hhdao text files"
cp ~/TODO.md docs/external/ 2>/dev/null && echo "  ✅ TODO.md"
cp ~/security-setup-final-report.md docs/external/ 2>/dev/null && echo "  ✅ security report"

# Copy security components
echo "🔒 Copying security components..."
cp -r ~/dev-security-setup/* security/external-setup/ 2>/dev/null && echo "  ✅ dev-security-setup"
cp -r ~/security_scan/* security/external-setup/ 2>/dev/null && echo "  ✅ security_scan"

# Handle Z2HHDAO if it exists
if [ -d ~/Z2HHDAO ]; then
    echo "📦 Merging Z2HHDAO components..."
    cp -r ~/Z2HHDAO/* tools/external/ 2>/dev/null && echo "  ✅ Z2HHDAO"
fi

echo "✅ Organization complete!"
echo ""
echo "📁 Updated structure:"
echo "scripts/deployment/    - Setup and deployment scripts"
echo "scripts/maintenance/   - System maintenance scripts"  
echo "docs/external/         - External documentation"
echo "security/external-setup/ - Security configurations"
echo "tools/external/        - External tools and components"
