import { expect, test } from '@playwright/test';

test('should display login redirect (placeholder wallet flow)', async ({ page }) => {
  // The home page immediately redirects to /auth/login when unauthenticated.
  // Instead of a wallet connect button on /, validate the redirect and presence of auth screen.
  await page.goto('http://localhost:3000/', { waitUntil: 'load' });
  // Wait for navigation to login route.
  await page.waitForURL(/\/auth\/login/, { timeout: 15000 });
  // Assert some stable elements on login page (add data-testid if needed later)
  await expect(page.locator('text=Sign In').first()).toBeVisible({ timeout: 10000 });
});
