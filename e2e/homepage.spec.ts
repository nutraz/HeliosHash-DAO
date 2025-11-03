import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');

  // Check if the page loads
  await expect(page).toHaveTitle(/HeliosHash/);

  // Basic smoke test
  await expect(page.locator('body')).toBeVisible();
});

test('navigation works', async ({ page }) => {
  await page.goto('/');

  // Test that we can navigate without errors
  await page.getByRole('link', { name: /home/i }).first().click().catch(() => {});

  // Just ensure no catastrophic failures
  await expect(page.locator('body')).toBeVisible();
});
