import { expect, test, devices } from '@playwright/test';

// This test needs a clean, unauthenticated slate, so we run it in a separate context from the global auth state.
test.use({
  ...devices['Desktop Chrome'],
  storageState: { cookies: [], origins: [] }, // Use a clean storage state
});

test('should display login redirect (placeholder wallet flow)', async ({ page }) => {
  // The home page immediately redirects to /auth/login when unauthenticated.
  // Instead of a wallet connect button on /, validate the redirect and presence of auth screen.
  await page.goto('/', { waitUntil: 'load' });
  // Wait for navigation to login route.
  await page.waitForURL(/\/auth\/login/, { timeout: 15000 });
  // Assert some stable elements on login page (add data-testid if needed later)
  await expect(page.locator('h1:has-text("Welcome Back")')).toBeVisible({ timeout: 10000 });
});
