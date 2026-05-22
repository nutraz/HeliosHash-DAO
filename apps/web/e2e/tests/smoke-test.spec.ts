import { test, expect } from '@playwright/test';

test('basic page load', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  console.log('Page title:', title);
  expect(title).toContain('HeliosHash');
});
