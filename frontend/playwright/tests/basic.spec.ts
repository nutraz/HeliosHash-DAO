import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title).toContain('HHDAO');
});

test('auth pages exist', async ({ page }) => {
  await page.goto('/auth/signin');
  const url = page.url();
  expect(url).toContain('/auth/signin');
});
