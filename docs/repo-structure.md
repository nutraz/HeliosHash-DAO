# Repository Structure Guide

## Overview

This document outlines the organized structure of the HeliosHash DAO repository, following best practices for maintainability, scalability, and developer experience.

## Root Directory Structure

```
HeliosHash-DAO/
├── 📁 .github/                 # GitHub configuration and workflows
├── 📁 .husky/                  # Git hooks
├── 📁 app/                     # Next.js application (App Router)
├── 📁 app-release/             # Mobile app release builds
├── 📁 assets/                  # Static assets (images, icons, etc.)
├── 📁 canisters/               # Internet Computer canisters (Motoko)
├── 📁 contracts/               # Ethereum/Solidity smart contracts
├── 📁 docs/                    # Documentation
├── 📁 e2e/                     # End-to-end tests
├── 📁 extensions/              # Browser extensions
├── 📁 flutter/                 # Flutter mobile application
├── 📁 lib/                     # Shared libraries
├── 📁 pages/                   # Legacy Next.js pages (if any)
├── 📁 prisma/                  # Database schema (if used)
├── 📁 public/                  # Static public assets
├── 📁 scripts/                 # Utility scripts and automation
├── 📁 src/                     # Legacy source code (if any)
├── 📁 test/                    # Additional test files
├── 📁 test-results/            # Test output and reports
├── 📄 .gitignore               # Git ignore patterns
├── 📄 .pre-commit-config.yaml  # Pre-commit hooks configuration
├── 📄 package.json             # Node.js dependencies and scripts
├── 📄 pnpm-lock.yaml           # pnpm lock file
├── 📄 tsconfig.json            # TypeScript configuration
├── 📄 next.config.ts           # Next.js configuration
├── 📄 tailwind.config.ts       # Tailwind CSS configuration
├── 📄 playwright.config.ts     # Playwright E2E configuration
├── 📄 vitest.config.ts         # Vitest unit test configuration
├── 📄 dfx.json                 # Internet Computer configuration
├── 📄 docker-compose.yml       # Docker services configuration
├── 📄 Dockerfile               # Container build configuration
└── 📄 README.md                # Project documentation
```

## Directory Details

### 🔧 Configuration Files (Root Level)

**Essential Configuration:**
- `package.json` - Node.js project metadata, dependencies, and scripts
- `tsconfig.json` - TypeScript compiler options
- `next.config.ts` - Next.js framework configuration
- `tailwind.config.ts` - Tailwind CSS design system configuration
- `dfx.json` - Internet Computer canister deployment configuration

**Development Tools:**
- `eslint.config.mjs` - Code linting rules
- `playwright.config.ts` - E2E testing configuration
- `vitest.config.ts` - Unit testing configuration
- `.pre-commit-config.yaml` - Pre-commit hook configuration

**Deployment & Infrastructure:**
- `docker-compose.yml` - Multi-service container orchestration
- `Dockerfile` - Application containerization
- `hardhat.config.js` - Ethereum development environment

### 📁 .github/ - GitHub Integration

```
.github/
├── 📁 workflows/           # CI/CD pipeline definitions
│   ├── ci.yml             # Main CI pipeline
│   ├── deploy.yml         # IC deployment
│   ├── test.yml           # Unit tests
│   ├── e2e-smoke.yml      # Smoke tests
│   └── ...                # Additional workflows
├── 📄 copilot-instructions.md    # AI assistant guidelines
├── 📄 PULL_REQUEST_TEMPLATE.md   # PR template
└── 📁 ISSUE_TEMPLATE/            # Issue templates
```

### 📁 app/ - Next.js Application

```
app/
├── 📁 api/                # API routes (/api/*)
├── 📁 auth/               # Authentication pages
├── 📁 bridge/             # Cross-chain bridge interface
├── 📁 community/          # Community features
├── 📁 components/         # Reusable React components
├── 📁 dashboard/          # User dashboard
├── 📁 governance/         # DAO governance interface
├── 📁 job-board/          # Job marketplace
├── 📁 mobile/             # Mobile-optimized pages
├── 📁 payment/            # Payment processing
├── 📁 profile/            # User profiles
├── 📁 projects/           # Project management
├── 📁 rewards/            # Reward system
├── 📁 wallet/             # Wallet integration
├── 📄 globals.css         # Global styles
├── 📄 layout.tsx          # Root layout component
├── 📄 page.tsx            # Home page
└── 📄 providers.tsx       # React context providers
```

### 📁 canisters/ - Internet Computer Canisters

```
canisters/
├── 📄 main.mo             # Main application canister
├── 📁 dao/                # DAO governance canister
├── 📁 dispute-resolution/ # Conflict resolution system
├── 📁 documents/          # Document management
├── 📁 governance/         # Voting and proposals
├── 📁 hhdao/              # HeliosHash DAO core
├── 📁 identity/           # Identity management
├── 📁 meeting-management/ # Meeting coordination
├── 📁 micro_grants/       # Grant distribution
├── 📁 nft/                # NFT functionality
├── 📁 nft_membership/     # Membership NFTs
├── 📁 owp_token/          # OWP token canister
├── 📁 project_funding/    # Project funding
├── 📁 telemetry/          # Analytics and monitoring
├── 📁 test-runner/        # Test utilities
├── 📁 token_rewards/      # Reward token system
├── 📁 treasury/           # Treasury management
└── 📁 womens_incentive/   # Women's empowerment program
```

### 📁 contracts/ - Ethereum Smart Contracts

```
contracts/
├── 📄 Bridge.sol          # Cross-chain bridge
├── 📄 EnergyOracle.sol    # Energy data oracle
├── 📄 Governance.sol      # Governance contracts
├── 📄 HeliosHashDAOProxy.sol  # Upgradeable proxy
├── 📄 HeliosToken.sol     # Native token
└── 📄 SimpleTest.sol      # Test contracts
```

### 📁 docs/ - Documentation

```
docs/
├── 📄 index.md            # Documentation index
├── 📄 architecture.md     # System architecture
├── 📄 ci-cd.md           # CI/CD pipeline documentation
├── 📄 repo-structure.md  # This file
├── 📄 development-setup.md # Development environment
├── 📄 security.md         # Security guidelines
├── 📄 testing.md          # Testing procedures
├── 📁 compliance/         # Regulatory compliance docs
├── 📁 deployment/         # Deployment guides
├── 📁 development/        # Development documentation
├── 📁 governance/         # Governance documentation
├── 📁 guides/             # User guides
├── 📁 mobile/             # Mobile development docs
├── 📁 pilot/              # Pilot program documentation
├── 📁 security/           # Security documentation
├── 📁 status/             # Project status reports
└── 📁 testing/            # Testing documentation
```

### 📁 scripts/ - Utility Scripts

```
scripts/
├── 📄 activate_real_hhdao.sh     # Production activation
├── 📄 analyze-consensus.sh       # Consensus analysis
├── 📄 clean_and_push.sh          # Repository cleanup
├── 📄 complete_build.js          # Build automation
├── 📄 debug-threshold.sh         # Debug utilities
├── 📄 deploy.sh                  # Deployment script
├── 📄 dev.sh                     # Development server
├── 📄 final-proof.sh             # Final verification
├── 📄 generate_mobile_qr.js      # QR code generation
├── 📄 install_dfx.sh             # DFX installation
├── 📄 mobile_diagnostics.js      # Mobile diagnostics
├── 📄 mobile_hhdao_server.js    # Mobile server
├── 📄 mobile_qr.sh               # Mobile QR utilities
├── 📄 mobile-setup.sh            # Mobile setup
├── 📄 mobile_test_server.js     # Mobile test server
├── 📄 multilingual-demo.sh       # Multilingual demo
├── 📄 reorganize.sh              # Repository reorganization
├── 📄 simple-mobile.sh           # Simple mobile setup
├── 📄 start-mobile-dev.sh        # Mobile dev server
├── 📄 start-mobile.sh            # Mobile server
├── 📄 test-server.js             # Test server utilities
└── 📄 verify-math.sh             # Mathematical verification
```

### 📁 e2e/ - End-to-End Tests

```
e2e/
├── 📄 color-test.spec.ts     # Visual regression tests
├── 📄 community.spec.ts      # Community feature tests
├── 📄 dashboard.spec.ts      # Dashboard E2E tests
└── 📁 playwright/            # Playwright test assets
```

### 📁 public/ - Static Assets

```
public/
├── 📁 locales/              # Internationalization files
│   └── 📁 en/
│       └── 📄 translation.json
└── 📁 assets/               # Static files served at /
```

## File Naming Conventions

### Scripts and Utilities
- Shell scripts: `lowercase-with-dashes.sh`
- JavaScript utilities: `camelCase.js`
- Python scripts: `snake_case.py`

### Configuration Files
- JSON/YAML: `kebab-case.ext`
- TypeScript config: `camelCase.config.ts`
- Environment files: `.env.example`

### Documentation
- Markdown files: `kebab-case.md`
- Directory names: `kebab-case/`

## Code Organization Principles

### Separation of Concerns
- **Frontend:** `app/` directory with clear feature boundaries
- **Backend:** `canisters/` with modular canister architecture
- **Infrastructure:** `scripts/` for automation and utilities
- **Configuration:** Root level for global settings

### Scalability Considerations
- **Feature-based organization:** Related code grouped together
- **Shared components:** Reusable code in dedicated directories
- **Test co-location:** Tests near the code they test
- **Documentation proximity:** Docs near relevant code

### Developer Experience
- **Clear naming:** Descriptive names for files and directories
- **Consistent structure:** Predictable organization patterns
- **Minimal nesting:** Shallow directory hierarchies where possible
- **Logical grouping:** Related functionality together

## Maintenance Guidelines

### Adding New Features
1. **Identify appropriate directory** based on feature type
2. **Follow naming conventions** for new files
3. **Update documentation** if structure changes
4. **Consider impact** on existing organization

### Refactoring Structure
1. **Plan changes** comprehensively
2. **Update all references** to moved files
3. **Test thoroughly** after reorganization
4. **Document changes** in commit messages and docs

### Regular Cleanup
- **Remove obsolete files** and directories
- **Archive unused code** rather than deleting
- **Update .gitignore** for new temporary files
- **Review scripts/** for consolidation opportunities

## Tooling Integration

### IDE Support
- **VS Code workspace:** `.vscode/` settings (gitignored)
- **Extensions:** Recommended extensions in workspace file
- **Settings:** Project-specific IDE configuration

### Development Scripts
- **npm/pnpm scripts:** Defined in `package.json`
- **Shell scripts:** Organized in `scripts/` directory
- **Automation:** CI/CD workflows in `.github/workflows/`

### Version Control
- **Git hooks:** Pre-commit validation via Husky
- **Branch protection:** Main branch CI requirements
- **Release process:** Automated via GitHub Actions

## Troubleshooting

### Common Issues
- **Import errors:** Check relative path accuracy after moves
- **Script failures:** Verify execution permissions on moved scripts
- **CI failures:** Update workflow paths for reorganized files
- **Documentation links:** Update references to moved docs

### Recovery Procedures
- **File moves:** Use `git log --follow` to track file history
- **Broken imports:** Search for affected files with ripgrep
- **Script dependencies:** Check for hardcoded paths in scripts
- **Documentation updates:** Use find/replace for bulk updates

---

## Quick Reference

### Finding Files
```bash
# Find all TypeScript config files
find . -name "*.config.ts"

# Find all shell scripts
find scripts/ -name "*.sh"

# Find all test files
find . -name "*.spec.ts" -o -name "*.test.ts"
```

### Directory Navigation
```bash
# Jump to application code
cd app/

# Jump to canister development
cd canisters/

# Jump to documentation
cd docs/

# Jump to utilities
cd scripts/
```

### File Creation Guidelines
- **Components:** `app/components/ComponentName.tsx`
- **Pages:** `app/feature/page.tsx`
- **Canisters:** `canisters/feature/main.mo`
- **Scripts:** `scripts/utility-name.sh`
- **Docs:** `docs/topic-name.md`

---

*Last Updated: October 2025*
*Maintained by: Development Team*
