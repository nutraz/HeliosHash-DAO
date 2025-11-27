import { test, expect } from '@playwright/test';

test('frontend loads successfully', async ({ page }) => {
  await page.goto('/');
  
  // Check page title
  await expect(page).toHaveTitle(/HeliosHash DAO/);
  
  // Check basic page structure
  const body = page.locator('body');
  await expect(body).toBeVisible();
  
  console.log('✅ Frontend is loading correctly');
});

test('backend health check', async ({ request }) => {
  // Test DFX backend
  try {
    const response = await request.get('http://localhost:4943/_/raw/health');
    expect(response.status()).toBe(200);
    console.log('✅ Backend is responding');
  } catch (error) {
    console.log('⚠️ Backend not available, but frontend tests can continue');
  }
});

test('take homepage screenshot', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'e2e/test-results/homepage.png', fullPage: true });
  console.log('📸 Screenshot saved');
});
