import { test, expect } from '@playwright/test';

test('should connect wallet successfully', async ({ page }) => {
  console.log('Adding wallet mock...');
  await page.addInitScript(() => {
    (window as any).ic = {
      plug: {
        requestConnect: async () => true,
        createAgent: async () => ({ getPrincipal: () => 'test-principal' }),
      },
    };
  });

  console.log('Navigating to / ...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  console.log('Waiting for connect-wallet button...');
  await page.waitForSelector('[data-testid="connect-wallet"]', { timeout: 60000 });
  console.log('Clicking connect-wallet button...');
  await page.click('[data-testid="connect-wallet"]');

  console.log('Checking wallet address...');
  await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();
  await expect(page.locator('[data-testid="disconnect-button"]')).toBeVisible();
});
