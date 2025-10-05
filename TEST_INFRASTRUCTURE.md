# 🧪 Enhanced Test Infrastructure

This document describes the comprehensive test infrastructure implemented for HeliosHash DAO, including test data factories, API mocking, and shared utilities.

## 📁 Infrastructure Overview

```
e2e/
├── factories/
│   └── test-data-factory.ts     # Test data generation
├── mocks/
│   └── api-mocker.ts           # API mocking system
├── utils/
│   └── test-helper.ts          # Shared test utilities
└── *.spec.ts                   # Test files using infrastructure
```

## 🏭 Test Data Factories

### Purpose

Generate consistent, realistic test data for all test scenarios including edge cases and security testing.

### Available Factories

#### 1. UserFactory

```typescript
import { TestDataFactory } from './factories/test-data-factory';

// Create different user types
const womenEntrepreneur = TestDataFactory.User.createWomenEntrepreneur();
const communityLeader = TestDataFactory.User.createCommunityLeader();
const technicalExpert = TestDataFactory.User.createTechnicalExpert();

// Batch creation
const users = TestDataFactory.User.createBatch(10, 'women');

// Security testing
const maliciousUser = TestDataFactory.User.createMaliciousUser();
```

#### 2. ApplicationFactory

```typescript
// Create realistic applications
const womensApp = TestDataFactory.Application.createWomensEmpowermentApp();
const techApp = TestDataFactory.Application.createTechnicalTrainingApp();
const communityApp = TestDataFactory.Application.createCommunityDevelopmentApp();

// Batch creation for load testing
const applications = TestDataFactory.Application.createBatch(100, 'women');

// Security/edge case testing
const maliciousApp = TestDataFactory.Application.createMaliciousApp();
const emptyApp = TestDataFactory.EdgeCase.createEmptyApplication();
const maxLengthApp = TestDataFactory.EdgeCase.createMaxLengthApplication();
```

#### 3. ProjectFactory & ProposalFactory

```typescript
// Solar projects
const project = TestDataFactory.Project.createSolarProject();
const projects = TestDataFactory.Project.createBatch(50);

// DAO proposals
const fundingProposal = TestDataFactory.Proposal.createFundingProposal();
const policyProposal = TestDataFactory.Proposal.createPolicyProposal();
```

#### 4. Performance & Edge Case Factories

```typescript
// Large datasets for performance testing
const concurrentApps = TestDataFactory.Performance.createConcurrentApplications(100);
const stressUsers = TestDataFactory.Performance.createConcurrentUsers(50);

// Edge cases for robustness testing
const unicodeApp = TestDataFactory.EdgeCase.createUnicodeApplication();
```

### Features

- **Realistic Data**: Uses faker.js for authentic-looking test data
- **Seeded Generation**: Consistent data across test runs
- **Edge Cases**: Comprehensive edge case coverage
- **Security Testing**: Malicious input patterns for XSS/injection testing
- **Performance Data**: Large datasets for load testing
- **Internationalization**: Unicode and multi-language support

---

## 🎭 API Mocking System

### Purpose

Comprehensive mocking for external dependencies including IC canisters, wallet connections, and HTTP APIs.

### Available Mockers

#### 1. CanisterMocker

```typescript
import { MockManager } from './mocks/api-mocker';

// Setup specific canister mocks
const mockManager = new MockManager();
const { canister } = mockManager.getMockers();

// Add custom mock responses
canister.addMockCall('micro_grants', 'submitApplication', {
  status: 'success',
  data: { ok: 123 },
});

// Pre-configured mock setups
canister.setupMicroGrantsMocks();
canister.setupWomensIncentiveMocks();
canister.setupDAOMocks();
```

**Mock Capabilities:**

- Health checks and system status
- Application submission/retrieval
- Error responses with detailed error codes
- Performance simulation with delays
- Security error responses

#### 2. WalletMocker

```typescript
const { wallet } = mockManager.getMockers();

// Setup connected wallet
wallet.setConnected({
  principal: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
  accountId: '2vxsx-fae',
  balance: 1000000,
});

// Apply to page context
await wallet.setupInPage(page);
```

**Mock Features:**

- IC Plug wallet simulation
- dfinity agent mocking
- Connection state management
- Balance and account information

#### 3. HTTPMocker

```typescript
const { http } = mockManager.getMockers();

// Add API endpoint mocks
http.addRoute('/api/health', {
  status: 'healthy',
  timestamp: new Date().toISOString(),
});

// Apply to page
await http.applyToPage(page);
```

#### 4. PerformanceMocker

```typescript
import { PerformanceMocker } from './mocks/api-mocker';

// Simulate network conditions
await PerformanceMocker.setupSlowNetwork(page);
await PerformanceMocker.setupFastNetwork(page);
await PerformanceMocker.setupOffline(page);
```

### Category-Specific Mock Setups

```typescript
// Smoke tests - basic functionality
await mockManager.setupSmokeTestMocks(page);

// Integration tests - full inter-canister communication
await mockManager.setupIntegrationTestMocks(page);

// Performance tests - with delays and large datasets
await mockManager.setupPerformanceTestMocks(page);

// Security tests - with vulnerability testing
await mockManager.setupSecurityTestMocks(page);
```

---

## 🛠️ Shared Test Utilities

### Purpose

Common operations for authentication, navigation, form handling, and assertions across all test categories.

### TestHelper Class

Central utility class providing access to all test utilities:

```typescript
import TestHelper from './utils/test-helper';

test('example test', async ({ page }) => {
  const helper = new TestHelper(page);

  // Quick setup by category
  await helper.setupSmokeTest();
  await helper.setupIntegrationTest();
  await helper.setupPerformanceTest();
  await helper.setupSecurityTest();

  // Use utilities
  await helper.auth.connectWallet();
  await helper.nav.gotoDashboard();
  await helper.form.fillApplicationForm(testApp);
  await helper.assert.assertSuccessMessage();
});
```

### Available Utilities

#### 1. AuthUtils

```typescript
// Authentication operations
await helper.auth.connectWallet(testUser);
await helper.auth.disconnectWallet();
await helper.auth.verifyAuthenticated();
await helper.auth.verifyUnauthenticated();
```

#### 2. NavigationUtils

```typescript
// Page navigation
await helper.nav.gotoDashboard();
await helper.nav.gotoProjects();
await helper.nav.gotoGovernance();
await helper.nav.navigateViaMenu('Projects');
await helper.nav.waitForPageLoad();
```

#### 3. FormUtils

```typescript
// Form operations
await helper.form.fillApplicationForm(testApplication);
await helper.form.submitForm(expectSuccess);
await helper.form.clearForm();
await helper.form.verifyValidationError('title', 'Title is required');
```

#### 4. DataUtils

```typescript
// Test data management
const appId = await helper.data.createTestApplication();
const appIds = await helper.data.createBatchApplications(5, 'women');
await helper.data.setupTestEnvironment({
  applications: 3,
  authenticateUser: true,
  mockType: 'integration',
});
```

#### 5. AssertUtils

```typescript
// Specialized assertions
await helper.assert.assertPageTitle('Dashboard');
await helper.assert.assertSuccessMessage('Application submitted');
await helper.assert.assertErrorMessage('Validation failed');
await helper.assert.assertApplicationInList('Test Application');
await helper.assert.assertPerformanceThresholds();
await helper.assert.assertNoXSSContent();
```

#### 6. WaitUtils

```typescript
// Enhanced waiting operations
await helper.wait.waitForCanisterResponse();
await helper.wait.waitForNetworkIdle();
await helper.wait.waitForElementWithRetry('[data-testid="results"]');
await helper.wait.waitForAnimation();
```

---

## 🧩 Integration with Test Categories

### @smoke Tests

```typescript
test('@smoke should load dashboard', async ({ page }) => {
  const helper = new TestHelper(page);
  await helper.setupSmokeTest(); // Auto-mocks + auth

  await helper.nav.gotoDashboard();
  await helper.assert.assertPageTitle('Dashboard');
});
```

### @integration Tests

```typescript
test('@integration should create and display application', async ({ page }) => {
  const helper = new TestHelper(page);
  await helper.setupIntegrationTest(2); // With pre-existing data

  const testApp = TestDataFactory.Application.createWomensEmpowermentApp();
  const appId = await helper.data.createTestApplication(testApp);

  await helper.nav.gotoProjects();
  await helper.assert.assertApplicationInList(testApp.title);
});
```

### @performance Tests

```typescript
test('@performance should handle concurrent submissions', async ({ page }) => {
  const helper = new TestHelper(page);
  await helper.setupPerformanceTest();

  // Test with large dataset
  const apps = TestDataFactory.Performance.createConcurrentApplications(50);
  // ... test concurrent operations

  await helper.assert.assertPerformanceThresholds();
});
```

### @security Tests

```typescript
test('@security should prevent XSS injection', async ({ page }) => {
  const helper = new TestHelper(page);
  await helper.setupSecurityTest();

  const maliciousApp = TestDataFactory.Application.createMaliciousApp();

  await helper.auth.connectWallet();
  await helper.nav.gotoApplicationForm();
  await helper.form.fillApplicationForm(maliciousApp);
  await helper.form.submitForm(false); // Expect failure

  await helper.assert.assertErrorMessage();
  await helper.assert.assertNoXSSContent();
});
```

---

## 📊 Usage Examples

### Complete Test Flow Example

```typescript
import { test } from '@playwright/test';
import TestHelper from './utils/test-helper';
import { TestDataFactory } from './factories/test-data-factory';

test('@integration should complete full application lifecycle', async ({ page }) => {
  const helper = new TestHelper(page);

  // 1. Setup test environment
  await helper.setupIntegrationTest();

  // 2. Generate test data
  const testApplication = TestDataFactory.Application.createWomensEmpowermentApp({
    title: 'Rural Women Solar Cooperative',
    requestedAmount: 75000,
  });

  // 3. Perform operations
  await helper.nav.gotoApplicationForm();
  await helper.form.fillApplicationForm(testApplication);
  await helper.form.submitForm(true);

  // 4. Verify results
  await helper.assert.assertSuccessMessage('Application submitted successfully');

  await helper.nav.gotoProjects();
  await helper.assert.assertApplicationInList(testApplication.title);

  // 5. Cleanup
  await helper.cleanup();
});
```

### Performance Testing Example

```typescript
test('@performance should meet load requirements', async ({ page }) => {
  const helper = new TestHelper(page);
  await helper.setupPerformanceTest();

  // Measure page load time
  const startTime = Date.now();
  await helper.nav.gotoProjects();
  const loadTime = Date.now() - startTime;

  expect(loadTime).toBeLessThan(5000); // 5 second max
  await helper.assert.assertPerformanceThresholds();
});
```

### Security Testing Example

```typescript
test('@security should validate all inputs', async ({ page }) => {
  const helper = new TestHelper(page);
  await helper.setupSecurityTest();

  // Test various malicious inputs
  const attackVectors = [
    TestDataFactory.Application.createMaliciousApp(),
    TestDataFactory.EdgeCase.createEmptyApplication(),
    TestDataFactory.EdgeCase.createMaxLengthApplication(),
  ];

  await helper.auth.connectWallet();

  for (const maliciousApp of attackVectors) {
    await helper.nav.gotoApplicationForm();
    await helper.form.fillApplicationForm(maliciousApp);
    await helper.form.submitForm(false);
    await helper.assert.assertErrorMessage();
  }

  await helper.assert.assertNoXSSContent();
});
```

---

## 🔧 Configuration

### Dependencies Added

```json
{
  "devDependencies": {
    "@faker-js/faker": "^9.0.3"
  }
}
```

### Import Paths

```typescript
// Test data factories
import { TestDataFactory } from './factories/test-data-factory';

// API mocking
import { MockManager } from './mocks/api-mocker';

// Test utilities
import TestHelper from './utils/test-helper';
```

---

## 🎯 Benefits

### For Developers

- **Consistent Test Data**: Reproducible test scenarios
- **Reduced Boilerplate**: Common operations abstracted
- **Better Coverage**: Edge cases and security scenarios included
- **Faster Development**: Quick test setup with helper methods

### For Testing

- **Reliable Mocks**: Comprehensive external dependency mocking
- **Category Support**: Optimized setups for each test category
- **Performance Testing**: Built-in performance measurement
- **Security Testing**: XSS/injection prevention validation

### For Maintenance

- **Centralized Utilities**: Single location for common operations
- **Type Safety**: Full TypeScript support
- **Extensible**: Easy to add new factories and utilities
- **Documentation**: Comprehensive inline documentation

---

This enhanced test infrastructure provides a solid foundation for comprehensive testing across all categories while maintaining consistency and reducing test maintenance overhead.
