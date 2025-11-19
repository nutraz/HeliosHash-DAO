# HHDAO-FUSION Scripts Directory

This directory contains all shell scripts organized by category.

## 📁 Categories

### Build Scripts (`build/`)
- Build and compilation scripts
- `build-complete.sh` - Complete project build
- `build-minimal.sh` - Minimal build for testing
- `build-production.sh` - Production build
- `build-unified.sh` - Unified build process

### Fix Scripts (`fix/`)
- Repair and maintenance scripts
- `fix.sh` - Main fix script for common issues
- `fix-web-app.sh` - Web application fixes
- `fix-motoko-*.sh` - Motoko/DFX specific fixes

### DFX Scripts (`dfx/`)
- Internet Computer/DFX related scripts
- `install_dfx.sh` - DFX installation
- `repair-dfx.sh` - DFX repair and maintenance

### Docker Scripts (`docker/`)
- Container and Docker related scripts
- `docker.sh` - Docker management
- `docker-compose.yml` - Docker compose configuration

### Mobile Scripts (`mobile/`)
- Mobile application scripts
- Development and testing scripts for mobile apps

### Security Scripts (`security/`)
- Security and hardening scripts
- External setup and security automation

### Development Scripts (`dev/`)
- Development environment scripts
- `dev.sh` - Development server startup
- `start-mobile-dev.sh` - Mobile development

### Deployment Scripts (`deploy/`)
- Deployment and release scripts
- `deploy.sh` - Main deployment script
- Environment specific deployments

### Testing Scripts (`test/`)
- Test automation scripts
- `test-dao-governance.sh` - DAO governance tests
- `test-server.js` - Test servers

### Analysis Scripts (`analysis/`)
- Analysis and debugging scripts
- Performance and consensus analysis

### Maintenance Scripts (`maintenance/`)
- System maintenance and backups
- `cleanup_repo.sh` - Repository cleanup
- `backup-dev-files.sh` - Development backups

### Tool Scripts (`tools/`)
- Utility and helper scripts (66 scripts)
- `guaranteed-structure.sh` - Project structure verification
- `health-check.sh` - System health checks
- Various development utilities

### Additional Categories
- `devcontainer/` - Dev container scripts
- `canisters/` - Canister specific scripts  
- `packages/` - Package management scripts
- `env/` - Environment configuration scripts
- `utils/` - Utility scripts and helpers

## 🚀 Usage

All scripts are executable and can be run from the project root:

```bash
./scripts/build/build-complete.sh
./scripts/fix/fix.sh
./scripts/tools/health-check.sh  Place scripts in the appropriate category directory

Ensure they have execute permissions: chmod +x script.sh

Add proper header comments with purpose and location

Update this README if adding a new category (See <attachments> above for file contents. You may not need to search or read the file again.)
```
# HHDAO-FUSION Scripts Directory

This directory contains all shell scripts organized by category.

## Categories

### 📁 build/ - Build and compilation scripts
$(ls -1 scripts/build/ 2>/dev/null | while read script; do echo "- \`$script\` - Build script"; done || echo "No build scripts")

### 📁 fix/ - Fix and repair scripts  
$(ls -1 scripts/fix/ 2>/dev/null | while read script; do echo "- \`$script\` - Fix script"; done || echo "No fix scripts")

### 📁 dfx/ - DFX and Motoko scripts
$(ls -1 scripts/dfx/ 2>/dev/null | while read script; do echo "- \`$script\` - DFX/Motoko script"; done || echo "No DFX scripts")

### 📁 docker/ - Docker and container scripts
$(ls -1 scripts/docker/ 2>/dev/null | while read script; do echo "- \`$script\` - Docker script"; done || echo "No Docker scripts")

### 📁 tools/ - Utility and tool scripts
$(ls -1 scripts/tools/ 2>/dev/null | while read script; do echo "- \`$script\` - Utility script"; done || echo "No tool scripts")

## Usage

All scripts are executable and can be run from the project root:

\`\`\`bash
./scripts/build/build-complete.sh
./scripts/fix/fix-web.sh
\`\`\`

## Adding New Scripts

1. Place scripts in the appropriate category directory
2. Ensure they have execute permissions: \`chmod +x script.sh\`
3. Update this README if adding a new category
