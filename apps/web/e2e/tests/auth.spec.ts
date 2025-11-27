import { test, expect } from '@playwright/test';
import { seedMockAuth } from '../helpers/mockIdentity';

test.describe('Auth E2E', () => {
  test('seeded auth allows page access', async ({ page }) => {
    await seedMockAuth(page, 'plmu2-gt2p5-3b24o-nralm-x6x67', 'E2E User');
    const response = await page.goto('http://localhost:3002/helioshash-dao');
    // If the app is running, the page should respond OK
    expect(response && response.ok()).toBeTruthy();
    // Optionally assert some UI text exists — keep minimal to avoid flakiness
    await page.waitForLoadState('domcontentloaded');
  });
});
