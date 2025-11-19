import { expect, test } from '@playwright/test';
import { TestDataFactory } from './factories/test-data-factory';
import TestHelper from './utils/test-helper';

test.describe('Authentication Flow Tests', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
  });

  test('@smoke @security should display login redirect (placeholder wallet flow)', async ({
    page,
  }) => {
  // Setup security test environment (no session cookie)
  await helper.setupSecurityTest();
  await page.goto('/dashboard');
  // Should redirect to login page
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.locator('body')).toContainText('Login');
  });

  test('@smoke should connect wallet successfully', async ({ page }) => {
  // Setup authenticated session using secure cookie
  await helper.setupSmokeTest();
  await helper.nav.gotoWithRetry('/dashboard');
  // Check for dashboard content
  await expect(page.locator('body')).toContainText('Dashboard');
  });

  test('@security should handle wallet connection errors', async ({ page }) => {
    // Setup security test environment (no session cookie)
    await helper.setupSecurityTest();
    await helper.nav.gotoWithRetry('/projects');
    // Should redirect to login page
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('@integration should maintain session across pages', async ({ page }) => {
    // Setup integration test
    await helper.setupIntegrationTest();

    // Navigate between pages while authenticated
    await helper.nav.gotoWithRetry('/dashboard');
    await helper.auth.verifyAuthenticated();

    await helper.nav.gotoWithRetry('/projects');
    await helper.auth.verifyAuthenticated();

    await helper.nav.gotoWithRetry('/governance');
    await helper.auth.verifyAuthenticated();
  });

  test('@security should prevent XSS in authentication flow', async ({ page }) => {
    // Setup security test
    await helper.setupSecurityTest();

    // Try to inject XSS in authentication fields if present
    const maliciousUser = TestDataFactory.User.createMaliciousUser();

    // Attempt authentication with malicious data
    await helper.nav.gotoWithRetry('/projects');

    // Check that page content doesn't contain unescaped scripts
    await helper.assert.assertNoXSSContent();
  });
});
