import { test, expect } from '@playwright/test';

test.describe('Dashboard Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should verify dashboard structure', async ({ page }) => {
    // Check for common dashboard elements
    const dashboardSelectors = [
      '[data-testid="dashboard"]',
      '.dashboard',
      'main',
      'section',
      '.grid',
      '.card',
      '.stat'
    ];

    for (const selector of dashboardSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found dashboard element: ${selector} (${count} elements)`);
      }
    }

    // Take comprehensive dashboard screenshot
    await page.screenshot({ 
      path: 'test-results/dashboard-overview.png',
      fullPage: true 
    });
  });

  test('should check for RWA monitoring elements', async ({ page }) => {
    const rwaSelectors = [
      'text=*RWA*',
      'text=*Real World Asset*',
      'text=*Solar*',
      'text=*Mining*',
      'text=*Energy*',
      'text=*Yield*',
      'text=*Treasury*'
    ];

    for (const selector of rwaSelectors) {
      const elements = page.locator(selector, { ignoreCase: true });
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found RWA element: ${selector} (${count} elements)`);
      }
    }
  });

  test('should test navigation between sections', async ({ page }) => {
    // Get all links on the page
    const links = page.locator('a[href]');
    const linkCount = await links.count();
    console.log(`Found ${linkCount} links on the page`);

    // Test a few links (if safe to do so)
    for (let i = 0; i < Math.min(linkCount, 5); i++) {
      const href = await links.nth(i).getAttribute('href');
      if (href && !href.startsWith('http') && href !== '/' && href !== '#') {
        console.log(`Testing navigation to: ${href}`);
        await links.nth(i).click();
        await page.waitForTimeout(1000);
        
        // Go back to homepage for next test
        await page.goto('/');
        break;
      }
    }
  });
});
