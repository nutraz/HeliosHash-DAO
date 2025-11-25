import { test, expect } from '@playwright/test';

test.describe('Performance and UX Tests', () => {
  test('should measure page load performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    const loadTime = Date.now() - startTime;
    console.log(`⏱️  Page load time: ${loadTime}ms`);
    
    // Performance should be under 5 seconds
    expect(loadTime).toBeLessThan(5000);
    
    // Test time to interactive
    await page.waitForLoadState('networkidle');
    const interactiveTime = Date.now() - startTime;
    console.log(`🔄 Time to interactive: ${interactiveTime}ms`);
  });

  test('should test responsive design', async ({ page }) => {
    await page.goto('/');
    
    const viewports = [
      { width: 1920, height: 1080, name: 'desktop' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 375, height: 667, name: 'mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(500);
      
      await page.screenshot({ 
        path: `test-results/responsive-${viewport.name}.png` 
      });
      
      console.log(`📱 ${viewport.name} viewport (${viewport.width}x${viewport.height}): screenshot saved`);
      
      // Check if page is still functional
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('should test accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Check for important accessibility attributes
    const accessibilityChecks = [
      { selector: 'img', attribute: 'alt', description: 'image alt text' },
      { selector: 'input', attribute: 'aria-label', description: 'input labels' },
      { selector: 'button', attribute: 'aria-label', description: 'button labels' },
      { selector: 'nav', attribute: 'role', description: 'navigation roles' }
    ];

    for (const check of accessibilityChecks) {
      const elements = page.locator(check.selector);
      const count = await elements.count();
      
      let elementsWithAttribute = 0;
      for (let i = 0; i < count; i++) {
        const element = elements.nth(i);
        const attribute = await element.getAttribute(check.attribute);
        if (attribute) elementsWithAttribute++;
      }
      
      console.log(`♿ ${check.description}: ${elementsWithAttribute}/${count} elements`);
    }
  });
});
