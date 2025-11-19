import { expect, test } from '@playwright/test';
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

  });

  test('@security should prevent XSS in project display', async ({ page }) => {
    // Setup security test
    await helper.setupSecurityTest();

    // Inject malicious content
    await page.addInitScript(() => {
      // Use a cookie to mock testProject state instead of sessionStorage
      document.cookie = `testProject=${encodeURIComponent(JSON.stringify({
        name: '<script>alert(\"XSS\")</script>Malicious Project',
        description: '<img src=x onerror=alert(\"XSS\")>Description'
      }))}; path=/`;
    });

    await page.goto('/projects');

    // Verify page content is safe
    await helper.assert.assertNoXSSContent();

    // Check that any dynamic content is properly escaped
    const pageContent = await page.content();
    expect(pageContent).not.toMatch(/<script[^>]*>.*alert.*<\/script>/i);
  });
});
