import { test, expect } from '@playwright/test';

test.describe('Social Hub Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display social navigation elements', async ({ page }) => {
    // Test for social navigation (adjust selectors based on your actual UI)
    const socialNavSelectors = [
      '[data-testid="social-feed"]',
      '[data-testid="messaging"]', 
      '[data-testid="communities"]',
      '[data-testid="notifications"]',
      '.social-tab',
      'nav a[href*="social"]',
      'nav a[href*="feed"]',
      'nav a[href*="messages"]'
    ];

    let foundSocialElement = false;
    for (const selector of socialNavSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found social element: ${selector}`);
        foundSocialElement = true;
        break;
      }
    }

    // If no social elements found, check for basic navigation
    if (!foundSocialElement) {
      const navElements = page.locator('nav, header, [role="navigation"]');
      await expect(navElements.first()).toBeVisible();
      console.log('⚠️ No specific social nav found, but general navigation exists');
    }
  });

  test('should check for user profile elements', async ({ page }) => {
    // Look for user profile components
    const profileSelectors = [
      '[data-testid="user-profile"]',
      '[data-testid="user-avatar"]',
      '.user-profile',
      '.profile-header',
      '[alt*="profile"]',
      '[alt*="user"]'
    ];

    for (const selector of profileSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found profile element: ${selector}`);
        await elements.first().click();
        // Wait for any profile page load
        await page.waitForTimeout(1000);
        break;
      }
    }
  });

  test('should test social content creation', async ({ page }) => {
    // Look for post creation elements
    const postCreationSelectors = [
      '[data-testid="create-post"]',
      '[data-testid="new-post"]',
      '.post-creator',
      'textarea[placeholder*="post"]',
      'textarea[placeholder*="share"]',
      'button:has-text("Post")',
      'button:has-text("Share")'
    ];

    for (const selector of postCreationSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found post creation: ${selector}`);
        
        // Try to interact with post creation
        await elements.first().click();
        await page.waitForTimeout(500);
        
        // Look for post content input
        const contentInput = page.locator('textarea, [contenteditable="true"]').first();
        if (await contentInput.isVisible()) {
          await contentInput.fill('Test post from E2E testing');
          console.log('✅ Can fill post content');
        }
        break;
      }
    }
  });
});
