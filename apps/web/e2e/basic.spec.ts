import { test, expect } from '@playwright/test';

test('basic navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/HeliosHash/);
});
