import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should find authentication elements', async ({ page }) => {
    const authSelectors = [
      '[data-testid="login-button"]',
      '[data-testid="sign-in"]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Connect")',
      'button:has-text("Authenticate")',
      'a[href*="login"]',
      'a[href*="auth"]'
    ];

    for (const selector of authSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found auth element: ${selector}`);
        
        // Test click interaction
        await elements.first().click();
        await page.waitForTimeout(2000);
        
        // Check if we're still on the same page or redirected
        const currentUrl = page.url();
        console.log(`Current URL after auth click: ${currentUrl}`);
        
        // Take screenshot of auth state
        await page.screenshot({ path: 'test-results/auth-flow.png' });
        break;
      }
    }
  });

  test('should check for Internet Identity integration', async ({ page }) => {
    // Look for II-specific elements
    const iiSelectors = [
      'button:has-text("Internet Identity")',
      'button:has-text("II")',
      '[data-testid="internet-identity"]',
      'text=Internet Identity'
    ];

    for (const selector of iiSelectors) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        console.log(`✅ Found Internet Identity: ${selector}`);
        break;
      }
    }
  });
});
