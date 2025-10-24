import { expect, test } from '@playwright/test';

// Basic rewards flow coverage: load page, stats visible, available + claimed + achievements tabs
// Future enhancements: mock claim action API, simulate state changes

test.describe('Rewards Page', () => {
  test.beforeEach(async ({ page }) => {
<<<<<<< HEAD
=======
    // Mock authentication cookie
    await page.context().addCookies([{
      name: 'auth_token',
      value: 'valid_token',
      domain: 'localhost',
      path: '/',
    }]);

>>>>>>> audit-clean
    // Wallet mock (consistent with existing tests)
    await page.addInitScript(() => {
      (window as any).ic = {
        plug: {
          requestConnect: async () => true,
          createAgent: async () => ({ getPrincipal: () => 'test-principal' }),
        },
      };
    });
  });

  test('should display rewards stats and available rewards', async ({ page }) => {
<<<<<<< HEAD
    await page.goto('http://localhost:3000/rewards', { waitUntil: 'networkidle' });
=======
    await page.goto('/rewards', { waitUntil: 'networkidle' });
>>>>>>> audit-clean

    // Header present
    await expect(page.locator('[data-testid="rewards-header"]')).toBeVisible();

    // Stats cards load
    await expect(page.locator('[data-testid="stat-total-rewards"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-nft-collected"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-tokens-earned"]')).toBeVisible();
    await expect(page.locator('[data-testid="stat-level"]')).toBeVisible();

    // Tabs present
    await expect(page.locator('[data-testid="rewards-tabs"]')).toBeVisible();

    // Wait for mock data load (setTimeout 1000ms in component)
    await page.waitForTimeout(1500);

    // Available rewards present
    const available = page.locator(
      '[data-testid="available-rewards"] [data-testid^="reward-available-"]'
    );
    await expect(available.first()).toBeVisible();
<<<<<<< HEAD
=======
    await page.waitForTimeout(1000);  // Render
    expect(await available.count()).toBeGreaterThan(0);
>>>>>>> audit-clean

    // Switch to claimed tab
    await page.click('role=tab[name="My Collection"]');
    const claimed = page.locator(
      '[data-testid="claimed-rewards"] [data-testid^="reward-claimed-"]'
    );
    await expect(claimed.first()).toBeVisible();

    // Switch to achievements tab
    await page.click('role=tab[name="Achievements"]');
    const achievements = page.locator(
      '[data-testid="achievements-list"] [data-testid^="achievement-"]'
    );
    await expect(achievements.first()).toBeVisible();
  });

  test('should allow claim button interaction (UI only)', async ({ page }) => {
    await page.goto('http://localhost:3000/rewards', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1500);

    // Find first claim button
    const firstClaim = page.locator('[data-testid^="claim-reward-"]').first();
    await expect(firstClaim).toBeVisible();

    // Click it (no state change yet — future API mock)
    await firstClaim.click();
    // Placeholder assertion (improve once API implemented)
    expect(true).toBeTruthy();
  });

  test('should display achievements', async ({ page }) => {
    await page.goto('/rewards');

    await page.click('[data-testid="rewards-tabs"] >> text=Achievements');
    const achievements = page.locator(
      '[data-testid="tab-achievements"] [data-testid^="achievement-"]'
    );
    await expect(achievements.first()).toBeVisible();
    expect(await achievements.count()).toBeGreaterThan(0);
  });
});
