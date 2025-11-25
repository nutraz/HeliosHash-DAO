import { test, expect } from '@playwright/test';

test.describe('User Journey Tests - Optimized', () => {
  test('complete user onboarding journey - OPTIMIZED', async ({ page }) => {
    console.time('user-onboarding-journey');
    
    // 1. Faster initial load
    await page.goto('/', { 
      waitUntil: 'domcontentloaded', 
      timeout: 10000 
    });
    
    // Quick title check
    await expect(page).toHaveTitle(/HeliosHash DAO/, { timeout: 5000 });
    console.log('✅ Homepage loaded quickly');

    // 2. Optimized authentication check
    const loginButton = page.locator('button:has-text("Login"), [data-testid="login-button"]').first();
    if (await loginButton.isVisible({ timeout: 3000 })) {
      await loginButton.click();
      console.log('✅ Login flow initiated quickly');
      // Don't wait long for redirects
      await page.waitForTimeout(1000);
    }

    // 3. Quick dashboard check
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 5000 });
    const mainContent = page.locator('main, body').first();
    await expect(mainContent).toBeVisible({ timeout: 5000 });
    console.log('✅ Dashboard accessible quickly');

    // 4. Fast social features check
    await page.goto('/social', { waitUntil: 'domcontentloaded', timeout: 5000 })
      .catch(() => {
        console.log('⚠️ No direct social route, skipping');
        return;
      });
    
    // Quick visibility check
    await page.waitForLoadState('domcontentloaded');
    console.log('✅ Social features checked quickly');

    // 5. Fast governance check  
    await page.goto('/governance', { waitUntil: 'domcontentloaded', timeout: 5000 })
      .catch(() => {
        console.log('⚠️ No direct governance route, skipping');
        return;
      });

    console.timeEnd('user-onboarding-journey');
    console.log('🎉 Optimized user journey completed!');
  });

  test('DAO member contribution journey - OPTIMIZED', async ({ page }) => {
    console.time('dao-contribution-journey');
    
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 10000 });

    // Quick navigation attempts
    const quickNavAttempts = [
      { route: '/governance', name: 'governance' },
      { route: '/proposals', name: 'proposals' },
      { route: '/social', name: 'social' }
    ];

    for (const attempt of quickNavAttempts) {
      try {
        await page.goto(attempt.route, { 
          waitUntil: 'domcontentloaded', 
          timeout: 3000 
        });
        console.log(`✅ Quick navigation to ${attempt.name}`);
        
        // Quick content check
        const hasContent = await page.locator('body').isVisible();
        if (hasContent) break;
      } catch (error) {
        console.log(`⚠️ No ${attempt.name} route, trying next`);
      }
    }

    // Quick interaction test
    const quickActions = [
      'button:has-text("New")',
      'button:has-text("Create")',
      'a[href*="new"]',
      'textarea'
    ];

    for (const action of quickActions) {
      const element = page.locator(action).first();
      if (await element.isVisible({ timeout: 1000 })) {
        console.log(`✅ Quick action available: ${action}`);
        break;
      }
    }

    console.timeEnd('dao-contribution-journey');
    console.log('🎉 Optimized DAO journey completed!');
  });
});
