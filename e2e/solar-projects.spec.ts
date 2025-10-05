import { expect, test } from '@playwright/test';
import { TestDataFactory } from './factories/test-data-factory';
import TestHelper from './utils/test-helper';

test.describe('Solar Projects Tests', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
  });

  test.afterEach(async () => {
    await helper.cleanup();
  });

  test('@smoke @integration should create new solar project application', async ({ page }) => {
    // Setup integration test with authentication
    await helper.setupIntegrationTest();

    // Generate test application data
    const testApplication = TestDataFactory.Application.createWomensEmpowermentApp({
      title: 'Test Solar Farm Cooperative',
      description: 'Women-led solar installation project for rural electrification',
    });

    // Navigate to application form
    await helper.nav.gotoApplicationForm();

    // Fill and submit application
    await helper.form.fillApplicationForm(testApplication);
    await helper.form.submitForm(true);

    // Verify success
    await helper.assert.assertSuccessMessage('Application submitted successfully');
  });

  test('@integration should display existing applications', async ({ page }) => {
    // Setup with pre-existing applications
    await helper.setupIntegrationTest(3);

    // Navigate to projects page
    await helper.nav.gotoProjects();

    // Should display applications list
    await helper.assert.assertElementVisible(
      '[data-testid="applications-list"], .applications-grid'
    );
  });

  test('@performance should handle multiple application submissions', async ({ page }) => {
    // Setup performance test environment
    await helper.setupPerformanceTest();

    const startTime = Date.now();

    // Create multiple applications in sequence
    const applications = TestDataFactory.Application.createBatch(5, 'women');

    for (const app of applications) {
      await helper.nav.gotoApplicationForm();
      await helper.form.fillApplicationForm(app);
      await helper.form.submitForm(true);
      await helper.wait.waitForNetworkIdle();
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Performance assertion: should complete within reasonable time
    expect(totalTime).toBeLessThan(30000); // 30 seconds for 5 applications

    // Check performance metrics
    await helper.assert.assertPerformanceThresholds();
  });

  test('@security should validate application input fields', async ({ page }) => {
    // Setup security test
    await helper.setupSecurityTest();
    await helper.auth.connectWallet(); // Connect for form access

    // Navigate to application form
    await helper.nav.gotoApplicationForm();

    // Try to submit malicious application
    const maliciousApp = TestDataFactory.Application.createMaliciousApp();

    await helper.form.fillApplicationForm(maliciousApp);
    await helper.form.submitForm(false); // Expect failure

    // Should show validation errors
    await helper.assert.assertErrorMessage();

    // Verify no XSS content made it to the page
    await helper.assert.assertNoXSSContent();
  });

  test('@security should prevent XSS in project display', async ({ page }) => {
    // Setup security test
    await helper.setupSecurityTest();

    // Navigate to projects page
    await helper.nav.gotoProjects();

    // Verify page content is safe
    await helper.assert.assertNoXSSContent();

    // Check that any dynamic content is properly escaped
    const pageContent = await page.content();
    expect(pageContent).not.toMatch(/<script[^>]*>.*alert.*<\/script>/i);
  });

  test('@integration should handle form validation correctly', async ({ page }) => {
    // Setup integration test
    await helper.setupIntegrationTest();

    // Navigate to application form
    await helper.nav.gotoApplicationForm();

    // Test empty form submission
    await helper.form.submitForm(false);
    await helper.form.verifyValidationError('title', 'Title is required');

    // Test invalid amount
    await helper.form.fillApplicationForm({
      ...TestDataFactory.Application.createWomensEmpowermentApp(),
      requestedAmount: -1000,
    });
    await helper.form.submitForm(false);
    await helper.form.verifyValidationError('requestedAmount', 'Amount must be positive');
  });

  test('@performance should load projects page quickly', async ({ page }) => {
    // Setup performance test
    await helper.setupPerformanceTest();

    // Measure page load performance
    const startTime = Date.now();
    await helper.nav.gotoProjects();
    const loadTime = Date.now() - startTime;

    // Should load within reasonable time
    expect(loadTime).toBeLessThan(5000); // 5 seconds max

    // Check Core Web Vitals
    await helper.assert.assertPerformanceThresholds();
  });

  test('@smoke should display project statistics', async ({ page }) => {
    // Setup smoke test with some data
    await helper.setupSmokeTest();

    // Navigate to projects/dashboard
    await helper.nav.gotoProjects();

    // Should display basic project information
    await helper.assert.assertElementVisible('[data-testid="projects-stats"], .project-statistics');
  });
});
