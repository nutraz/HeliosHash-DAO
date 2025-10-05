# 🧪 Test Categories Documentation

This document describes the four test categories implemented in the HeliosHash DAO project for comprehensive quality assurance.

## 📋 Test Category Overview

### 🔥 **@smoke** - Critical Path Tests

**Purpose**: Validate core functionality that must work for the system to be operational.
**Criteria**: Fast execution, essential features only, system health verification.

**Frontend Tests** (`playwright test --grep="@smoke"`):

- ✅ Basic authentication flow
- ✅ Critical navigation paths
- ✅ Essential UI component rendering
- ✅ Core wallet connection

**Canister Tests** (`./scripts/enhanced-canister-tests.sh smoke`):

- ✅ Basic canister deployment
- ✅ Health check functionality
- ✅ Critical application submission flow
- ✅ Essential API endpoints

**Example Usage**:

```bash
# Run frontend smoke tests
pnpm test:smoke

# Run canister smoke tests
./scripts/enhanced-canister-tests.sh smoke
```

---

### 🔗 **@integration** - Canister Integration Tests

**Purpose**: Verify inter-canister communication and system integration.
**Criteria**: Cross-component interaction, data flow validation, service integration.

**Frontend Tests** (`playwright test --grep="@integration"`):

- ✅ Complete user workflows (project creation, submission, approval)
- ✅ Multi-component interactions
- ✅ Canister integration through UI
- ✅ End-to-end data flow testing

**Canister Tests** (`pnpm test:integration`):

- ✅ Inter-canister communication
- ✅ Cross-canister error handling
- ✅ System health monitoring integration
- ✅ Metrics collection across services
- ✅ Data persistence validation

**Example Usage**:

```bash
# Run all integration tests (frontend + canisters)
pnpm test:integration

# Run canister integration tests only
./scripts/enhanced-canister-tests.sh integration
```

---

### ⚡ **@performance** - Load and Performance Tests

**Purpose**: Validate system performance under load and stress conditions.
**Criteria**: Response times, memory usage, concurrent operations, scalability.

**Frontend Tests** (`playwright test --project=performance --grep="@performance"`):

- ✅ Core Web Vitals (FCP, LCP, FID, CLS, TTFB)
- ✅ Page load performance
- ✅ Memory usage monitoring
- ✅ Network request optimization
- ✅ UI responsiveness under load

**Canister Tests** (`./scripts/enhanced-canister-tests.sh performance`):

- ✅ Concurrent application submissions
- ✅ Load handling capabilities
- ✅ Memory usage under stress
- ✅ Upgrade pattern efficiency
- ✅ Heartbeat performance monitoring

**Performance Thresholds**:

- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- Time to First Byte (TTFB): < 600ms

**Example Usage**:

```bash
# Run frontend performance tests
pnpm test:performance

# Run canister performance tests
./scripts/enhanced-canister-tests.sh performance
```

---

### 🔒 **@security** - Security-Focused Tests

**Purpose**: Validate security measures and protect against common vulnerabilities.
**Criteria**: Input validation, XSS prevention, authentication, authorization.

**Frontend Tests** (`playwright test --project=security --grep="@security"`):

- ✅ XSS prevention in user inputs
- ✅ CSRF protection validation
- ✅ Input sanitization testing
- ✅ Authentication bypass attempts
- ✅ Authorization boundary testing

**Canister Tests** (`./scripts/enhanced-canister-tests.sh security`):

- ✅ Input validation and sanitization
- ✅ Authentication and authorization checks
- ✅ XSS and injection prevention
- ✅ Principal-based security validation
- ✅ Malicious payload rejection

**Security Test Cases**:

- Script injection attempts: `<script>alert('xss')</script>`
- Image XSS: `<img src=x onerror=alert('xss')>`
- SVG XSS: `<svg onload=alert('xss')>`
- JavaScript URLs: `javascript:alert('xss')`
- SQL injection patterns (where applicable)

**Example Usage**:

```bash
# Run frontend security tests
pnpm test:security

# Run canister security tests
./scripts/enhanced-canister-tests.sh security
```

---

## 🏃‍♂️ Running Test Categories

### Individual Categories

```bash
# Smoke tests - Critical paths only
pnpm test:smoke
./scripts/enhanced-canister-tests.sh smoke

# Integration tests - Full integration testing
pnpm test:integration
./scripts/enhanced-canister-tests.sh integration

# Performance tests - Load and performance validation
pnpm test:performance
./scripts/enhanced-canister-tests.sh performance

# Security tests - Security vulnerability testing
pnmp test:security
./scripts/enhanced-canister-tests.sh security
```

### All Categories

```bash
# Run all test categories
pnpm test:all

# Run all canister test categories
./scripts/enhanced-canister-tests.sh all
```

### Test Category Information

```bash
# Display available test categories
pnpm test:categories
```

---

## 📊 Test Results and Reporting

### Frontend Test Reports

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

### Canister Test Reports

- **Console Output**: Detailed categorized results
- **Exit Codes**: 0 = success, >0 = failure count
- **Category Breakdown**: Pass/fail status per category

### CI/CD Integration

```yaml
# Example GitHub Actions usage
- name: Run Smoke Tests
  run: pnpm test:smoke

- name: Run Integration Tests
  run: pnpm test:integration

- name: Run Performance Tests
  run: pnpm test:performance

- name: Run Security Tests
  run: pnpm test:security
```

---

## 🔧 Configuration

### Playwright Configuration (`playwright.config.ts`)

```typescript
projects: [
  {
    name: 'smoke',
    grep: /@smoke/,
    timeout: 30000,
  },
  {
    name: 'integration',
    grep: /@integration/,
    timeout: 60000,
  },
  {
    name: 'performance',
    grep: /@performance/,
    timeout: 120000,
  },
  {
    name: 'security',
    grep: /@security/,
    timeout: 90000,
  },
];
```

### Package.json Scripts

```json
{
  "test:smoke": "playwright test --grep=\"@smoke\"",
  "test:integration": "playwright test --grep=\"@integration\" && pnpm test:canister",
  "test:performance": "playwright test --project=performance --grep=\"@performance\"",
  "test:security": "playwright test --project=security --grep=\"@security\"",
  "test:categories": "echo 'Available test categories...'"
}
```

---

## 📈 Best Practices

### Test Category Guidelines

1. **@smoke**: Keep minimal and fast (< 30s total)
2. **@integration**: Focus on data flow and component interaction
3. **@performance**: Include realistic load scenarios and thresholds
4. **@security**: Test all input vectors and attack surfaces

### Writing Categorized Tests

```typescript
// Frontend example
test('@smoke @security should handle authentication', async ({ page }) => {
  // Test both critical path (smoke) and security validation
});

// Multiple categories when applicable
test('@integration @performance should handle concurrent users', async ({ page }) => {
  // Test integration with performance considerations
});
```

```motoko
// Canister example with category comments
// @smoke - Critical path test
public func smokeTest_BasicHealth() : async Bool {
    // Essential health check
};

// @security - Security validation
public func securityTest_InputValidation() : async Bool {
    // Input sanitization validation
};
```

---

## 🎯 Success Criteria

### Category Success Thresholds

- **@smoke**: 100% pass rate (critical for deployment)
- **@integration**: 95%+ pass rate (allows for minor integration issues)
- **@performance**: Meets defined performance thresholds
- **@security**: 100% pass rate (no security vulnerabilities)

### Continuous Monitoring

- Daily smoke test runs
- Integration tests on every PR
- Performance tests on release candidates
- Security tests on every code change

---

_This test categorization ensures comprehensive coverage while enabling targeted testing based on development phase and deployment requirements._
