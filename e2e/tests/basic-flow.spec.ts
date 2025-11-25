import { test, expect } from '@playwright/test';

test('frontend is running', async ({ page }) => {
  await page.goto('http://localhost:3002');
  await expect(page).toHaveTitle(/HeliosHash DAO/);
  await page.screenshot({ path: 'test-results/homepage.png' });
});

test('backend health', async ({ request }) => {
  const response = await request.get('http://localhost:4943/_/raw/health');
  expect(response.status()).toBe(200);
});
