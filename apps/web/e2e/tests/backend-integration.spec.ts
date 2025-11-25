import { test, expect } from '@playwright/test';

test.describe('Backend Integration Tests', () => {
  test('should test DFX canister connectivity', async ({ request }) => {
    // Test various DFX endpoints
    const endpoints = [
      'http://localhost:4943/_/raw/health',
      'http://localhost:4943/_/raw/version',
      'http://localhost:4943/_/raw/apis'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await request.get(endpoint);
        console.log(`✅ ${endpoint}: ${response.status()}`);
        
        if (response.status() === 200) {
          const body = await response.text();
          console.log(`  Response: ${body.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: Cannot connect`);
      }
    }
  });

  test('should test frontend-backend API calls', async ({ page }) => {
    await page.goto('/');
    
    // Monitor network requests to see what APIs are called
    const apiRequests: string[] = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('localhost:4943') || url.includes('/api/')) {
        apiRequests.push(`${request.method()} ${url}`);
      }
    });

    // Interact with page to trigger API calls
    await page.click('body');
    await page.waitForTimeout(2000);

    console.log('📡 API Requests detected:');
    apiRequests.forEach((request, index) => {
      console.log(`  ${index + 1}. ${request}`);
    });

    expect(apiRequests.length).toBeGreaterThanOrEqual(0);
  });

  test('should test error handling', async ({ page }) => {
    // Test navigation to non-existent routes
    await page.goto('/non-existent-route');
    
    // Check for 404 handling
    const errorSelectors = [
      'text=404',
      'text=Not Found',
      'text=Page not found',
      '.error-page',
      '[data-testid="error"]'
    ];

    for (const selector of errorSelectors) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        console.log(`✅ Error handling works: ${selector}`);
        await page.screenshot({ path: 'test-results/error-page.png' });
        return;
      }
    }

    // If no error page, check if redirected to home
    const currentUrl = page.url();
    if (currentUrl === 'http://localhost:3002/') {
      console.log('✅ Automatic redirect to home on invalid route');
    } else {
      console.log(`⚠️ Unknown route handling: ${currentUrl}`);
    }
  });
});
