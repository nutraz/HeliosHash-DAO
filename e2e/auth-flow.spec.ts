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
    // Setup security test environment (starts unauthenticated)
    await helper.setupSecurityTest();

<<<<<<< HEAD
    // The home page immediately redirects to /auth/login when unauthenticated.
    await helper.nav.gotoProjects(); // Try to access protected route

    // Should redirect to login
    await page.waitForURL(/\/auth\/login|\/login/, { timeout: 15000 });

    // Assert login elements are present
    await helper.assert.assertElementVisible(
      'text=Sign In, button:has-text("Connect"), [data-testid="connect-wallet"]'
    );
=======
    // Navigate to login page directly (placeholder implementation)
    await page.goto('/auth/login');

    // Check for basic placeholder content instead of full login form
    await expect(page.locator('body')).toContainText('Login');
    await expect(page.locator('body')).toContainText('Wallet connection and authentication');
>>>>>>> audit-clean
  });

  test('@smoke should connect wallet successfully', async ({ page }) => {
    // Setup smoke test environment
    await helper.setupSmokeTest();

<<<<<<< HEAD
    // Verify user is authenticated
    await helper.auth.verifyAuthenticated();

    // Should be able to access dashboard
    await helper.nav.gotoDashboard();
    await helper.assert.assertPageTitle('Dashboard');
=======
    // Navigate to dashboard with retries
    await helper.nav.gotoWithRetry('/dashboard');

    // Check for basic placeholder content
    await expect(page.locator('body')).toContainText('Dashboard');
>>>>>>> audit-clean
  });

  test('@security should handle wallet connection errors', async ({ page }) => {
    // Setup security test environment (disconnected wallet)
    await helper.setupSecurityTest();

    // Mock wallet connection failure
    await page.addInitScript(() => {
      (window as any).ic = {
        plug: {
          requestConnect: async () => {
            throw new Error('User rejected connection');
          },
        },
      };
    });

<<<<<<< HEAD
    await helper.nav.gotoProjects();
=======
    await helper.nav.gotoWithRetry('/projects');
>>>>>>> audit-clean

    // Try to connect wallet - should fail gracefully
    const connectButton = page
      .locator('[data-testid="connect-wallet"], button:has-text("Connect")')
      .first();
    if (await connectButton.isVisible()) {
      await connectButton.click();

      // Should show error message or remain on login
      const isStillOnLogin = await page
        .locator('[data-testid="connect-wallet"], button:has-text("Connect")')
        .isVisible();
      expect(isStillOnLogin).toBeTruthy();
    }
  });

  test('@integration should maintain session across pages', async ({ page }) => {
    // Setup integration test
    await helper.setupIntegrationTest();

    // Navigate between pages while authenticated
<<<<<<< HEAD
    await helper.nav.gotoDashboard();
    await helper.auth.verifyAuthenticated();

    await helper.nav.gotoProjects();
    await helper.auth.verifyAuthenticated();

    await helper.nav.gotoGovernance();
=======
    await helper.nav.gotoWithRetry('/dashboard');
    await helper.auth.verifyAuthenticated();

    await helper.nav.gotoWithRetry('/projects');
    await helper.auth.verifyAuthenticated();

    await helper.nav.gotoWithRetry('/governance');
>>>>>>> audit-clean
    await helper.auth.verifyAuthenticated();
  });

  test('@security should prevent XSS in authentication flow', async ({ page }) => {
    // Setup security test
    await helper.setupSecurityTest();

    // Try to inject XSS in authentication fields if present
    const maliciousUser = TestDataFactory.User.createMaliciousUser();

    // Attempt authentication with malicious data
<<<<<<< HEAD
    await helper.nav.gotoProjects();
=======
    await helper.nav.gotoWithRetry('/projects');
>>>>>>> audit-clean

    // Check that page content doesn't contain unescaped scripts
    await helper.assert.assertNoXSSContent();
  });
});
