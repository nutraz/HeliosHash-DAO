import { expect, test } from '@playwright/test';
import TestHelper from './utils/test-helper';

test.describe('Dashboard Page', () => {
  let helper: TestHelper;

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page);
    await helper.setupSecurityTest();
    await helper.loginWithHttpOnlyCookie();
  });

  test('should display dashboard with all main sections', async ({ page }) => {
    await page.goto('/dashboard');

    // Check main heading
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('text=Welcome to your HeliosHash DAO dashboard')).toBeVisible();

    // Check search input
    const searchInput = page.locator('[data-testid="search-input"]');
    await expect(searchInput).toBeVisible();

    // Check tabs
    const tabs = ['overview', 'projects', 'governance', 'energy'];
    for (const tab of tabs) {
      await expect(page.locator(`[data-testid="${tab}-tab"]`)).toBeVisible();
    }

    // Check overview tab content (default)
    await expect(page.locator('[data-testid="energy-stats"]')).toBeVisible();
    await expect(page.locator('[data-testid="token-balance"]')).toBeVisible();
    await expect(page.locator('[data-testid="governance-section"]')).toBeVisible();
  });

  test('should switch between tabs correctly', async ({ page }) => {
    await page.goto('/dashboard');

    // Check projects tab
    await page.locator('[data-testid="projects-tab"]').click();
    await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();
    await expect(page.locator('text=Projects content here')).toBeVisible();

    // Check governance tab
    await page.locator('[data-testid="governance-tab"]').click();
    await expect(page.locator('[data-testid="governance-proposals"]')).toBeVisible();
    await expect(page.locator('text=Governance proposals here')).toBeVisible();

    // Check energy tab
    await page.locator('[data-testid="energy-tab"]').click();
    await expect(page.locator('[data-testid="energy-dashboard"]')).toBeVisible();
    await expect(page.locator('text=Energy monitoring here')).toBeVisible();
  });

  test('should display women bonus badge when user is woman', async ({ page }) => {
    // Use login helper with a woman user
    await helper.setupSecurityTest();
    await helper.loginWithHttpOnlyCookie('community1', 'http://localhost:3000');
    await page.addInitScript(() => {
  document.cookie = `user=${encodeURIComponent(JSON.stringify({ isWoman: true, name: 'Test User' }))}; path=/`;
    });
    await page.goto('/dashboard');
    const badge = page.locator('[data-testid="women-bonus-badge"]');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('20% Bonus');
  });

  test('should display correct token balance with women bonus', async ({ page }) => {
    await helper.setupSecurityTest();
    await helper.loginWithHttpOnlyCookie('community1', 'http://localhost:3000');
    await page.addInitScript(() => {
      sessionStorage.setItem('user', JSON.stringify({ isWoman: true, name: 'Test User' }));
    });
    await page.goto('/dashboard');
    const tokenBalance = page.locator('[data-testid="token-balance"]');
    await expect(tokenBalance).toContainText('2,930'); // 2450 * 1.2 = 2930
  });
});
