import { test, expect } from '@playwright/test';

test('sign in redirects to dashboard', async ({ page }) => {
  // Try the direct signin route first
  await page.goto('/auth/signin');

  // If the signin page didn't render, fallback to /auth
  if ((await page.locator('text=Sign in to your account').count()) === 0) {
    await page.goto('/auth');
    await expect(page.locator('text=Sign in to your account')).toBeVisible();
  }

  // Fill the form and submit
  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');

  // Wait for navigation to dashboard
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await expect(page).toHaveURL(/.*\/dashboard/);

  // Confirm localStorage user was set by the mock auth
  const user = await page.evaluate(() => localStorage.getItem('user'));
  expect(user).not.toBeNull();
});
