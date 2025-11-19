# CI/CD Pipeline Documentation

## Overview

HeliosHash DAO uses GitHub Actions for comprehensive continuous integration and deployment. The CI/CD setup includes automated testing, security scanning, deployment to Internet Computer, and quality assurance processes.

## Workflow Architecture

### Core Workflows

#### 1. `ci.yml` - Main CI Pipeline
**Triggers:** Push/PR to `main` and `mvp-testers` branches
**Purpose:** Comprehensive testing and validation
**Jobs:**
- **test:** JS unit/integration & E2E tests
  - Node.js 18 setup with pnpm
  - Vitest unit tests with coverage
  - Canister tests
  - Playwright E2E tests
  - Artifact uploads for reports
- **flutter-analyze:** Flutter code analysis
- **flutter-test:** Flutter unit tests
- **node-checks:** Quick Node.js validation

#### 2. `deploy.yml` - Internet Computer Deployment
**Triggers:** Push to `main` branch
**Purpose:** Automated deployment to IC networks
**Jobs:**
- **build-and-deploy:** Full deployment pipeline
  - Dependency installation
  - Linting and testing
  - Application build
  - DFX deployment to local and mainnet

#### 3. `test.yml` - Unit Tests with Coverage
**Triggers:** Push/PR to `main` branch
**Purpose:** Focused unit testing with coverage reporting
**Jobs:**
- **test:** Unit tests with coverage
  - pnpm setup with Node.js 20
  - Dependency installation
  - Linting (non-blocking)
  - Coverage generation and artifact upload

#### 4. `node.js.yml` - Node.js Matrix Testing
**Triggers:** Push/PR to `main` branch
**Purpose:** Cross-version Node.js compatibility testing
**Jobs:**
- **build:** Matrix testing across Node versions
  - Node.js 18.x, 20.x, 22.x
  - npm-based build and test

#### 5. `motoko-tests.yml` - Motoko Canister Tests
**Triggers:** Push/PR to `main`, `chore/**`, `feat/**`, `fix/**` branches
**Purpose:** Internet Computer canister testing
**Jobs:**
- **motoko-tests:** Canister validation
  - DFX installation and setup
  - Canister test execution

#### 6. `e2e-smoke.yml` - E2E Smoke Tests
**Triggers:** Push to `mvp-testers` branch
**Purpose:** Quick smoke testing for MVP releases
**Jobs:**
- **smoke:** Mobile-focused E2E tests
  - Development server startup
  - Playwright smoke test execution

#### 7. `enhanced-test-suite.yml` - Comprehensive Testing Suite
**Triggers:** Push/PR to `main`/`develop`, scheduled daily, manual dispatch
**Purpose:** Advanced testing with analytics and reporting
**Jobs:**
- **setup:** Environment validation and matrix generation
- **test-matrix:** Parallel test execution (smoke/integration/performance/security)
- **canister-tests:** Parallel canister testing
- **analyze-results:** Test result analysis and reporting
- **performance-monitoring:** Performance trend analysis
- **security-analysis:** Security result analysis

### Security & Quality Workflows

#### 8. `security-audit.yml` - Security Auditing
**Purpose:** Automated security vulnerability scanning

#### 9. `smart-contract-security.yml` - Smart Contract Security
**Purpose:** Specialized security testing for Solidity/Motoko contracts

#### 10. `dependency-audit.yml` - Dependency Security
**Purpose:** Third-party dependency vulnerability scanning

#### 11. `gitleaks.yml` - Secret Detection
**Purpose:** Automated detection of leaked secrets and credentials

#### 12. `snyk.yml` - Snyk Security Scanning
**Purpose:** Container and dependency security analysis

#### 13. `currency-scan.yml` - Currency/Fraud Detection
**Purpose:** Specialized scanning for financial security

## Pipeline Features

### Testing Strategy
- **Unit Tests:** Vitest framework with 82+ tests
- **Integration Tests:** Canister-to-canister communication
- **E2E Tests:** Playwright with mobile and desktop browsers
- **Canister Tests:** Motoko-specific testing
- **Cross-Platform:** Node.js matrix testing (18.x, 20.x, 22.x)
- **Mobile Testing:** Flutter and React Native compatibility

### Deployment Strategy
- **Staged Deployment:** Local testing → Mainnet deployment
- **Environment Separation:** Clear separation of testnet/mainnet
- **Rollback Capability:** Version-controlled deployments
- **Health Checks:** Post-deployment validation

### Security Integration
- **Automated Scanning:** Multiple security tools integrated
- **Secret Detection:** Pre-commit and CI secret scanning
- **Dependency Auditing:** Regular vulnerability assessments
- **Smart Contract Analysis:** Specialized blockchain security tools

### Analytics & Reporting
- **Test Analytics:** Performance and success metrics
- **Coverage Reporting:** Code coverage tracking
- **Artifact Management:** Test reports and logs preservation
- **Dashboard Integration:** Real-time monitoring dashboards

## Configuration

### Environment Variables
```yaml
NODE_VERSION: '20'
PNPM_VERSION: '8'
DFX_VERSION: '0.15.0'
```

### Cache Strategy
- **Dependencies:** pnpm and npm cache optimization
- **DFX:** Internet Computer SDK caching
- **Playwright:** Browser binary caching
- **Node Modules:** Cross-job dependency sharing

### Artifact Management
- **Test Reports:** Playwright, Vitest, and coverage reports
- **Build Artifacts:** Compiled canisters and frontend bundles
- **Security Reports:** Vulnerability scan results
- **Performance Data:** Benchmarking and analytics data

## Branch Strategy

### Protected Branches
- **`main`:** Production-ready code, full CI/CD pipeline
- **`mvp-testers`:** MVP testing branch with smoke tests
- **`develop`:** Development branch with enhanced testing

### Feature Branches
- **Pattern:** `feat/**`, `fix/**`, `chore/**`
- **Testing:** Motoko tests on feature branches
- **Merging:** Requires passing CI checks

## Monitoring & Alerts

### Success Criteria
- All tests passing (unit, integration, E2E)
- Security scans clean (no critical vulnerabilities)
- Code coverage above threshold (target: 95%)
- Deployment successful to test environments

### Failure Handling
- **Test Failures:** Detailed reporting with screenshots/logs
- **Security Issues:** Immediate alerts and blocking
- **Deployment Failures:** Rollback procedures
- **Performance Regressions:** Trend analysis and alerts

## Maintenance

### Regular Tasks
- **Dependency Updates:** Automated via Dependabot
- **Security Patches:** Regular security scanning
- **Performance Monitoring:** Continuous benchmarking
- **Documentation Updates:** Pipeline documentation maintenance

### Troubleshooting
- **Cache Issues:** Clear caches and rebuild
- **Test Flakiness:** Retry mechanisms and investigation
- **Deployment Blocks:** Environment validation and fixes
- **Security Alerts:** Immediate investigation and remediation

## Integration Points

### External Services
- **Internet Computer:** Main deployment target
- **One World Project:** Treasury and governance integration
- **Security Tools:** Multiple scanning services
- **Analytics Platforms:** Test and performance monitoring

### Internal Systems
- **Canister Backend:** Motoko smart contracts
- **Frontend Application:** Next.js React application
- **Mobile Apps:** Flutter and React Native
- **Documentation:** Automated docs generation

## Future Enhancements

### Planned Improvements
- **Parallel Testing:** Increased job parallelism
- **Performance Benchmarking:** Automated performance regression detection
- **Chaos Engineering:** Fault injection testing
- **Load Testing:** Automated scalability testing
- **Multi-Environment:** Staging environment deployment

### Advanced Features
- **AI-Powered Testing:** Intelligent test generation
- **Predictive Analytics:** Failure prediction and prevention
- **Automated Remediation:** Self-healing pipeline features
- **Compliance Automation:** Regulatory compliance checking

---

## Quick Reference

### Running Tests Locally
```bash
# All tests
pnpm test:all

# Unit tests
pnpm test:run

# E2E tests
pnpm test:e2e

# Canister tests
pnpm test:canister
```

### Manual Deployment
```bash
# Local deployment
dfx start --clean --background
dfx deploy

# Mainnet deployment (requires credentials)
dfx deploy --network ic
```

### Pipeline Status
- View GitHub Actions tab for real-time status
- Check branch protection rules for merge requirements
- Review security scans in Security tab

---

*Last Updated: October 2025*
*Maintained by: Development Team*
