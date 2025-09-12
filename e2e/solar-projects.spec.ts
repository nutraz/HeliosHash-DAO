import { test, expect } from '@playwright/test';

test('should create new solar project', async ({ page }) => {
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
  console.log('Waiting for create-project button...');
  await page.waitForSelector('[data-testid="create-project"]', { timeout: 60000 });
  await page.click('[data-testid="create-project"]');

  console.log('Filling project name...');
  await page.fill('[data-testid="project-name"]', 'Test Solar Farm');
  console.log('Filling project location...');
  await page.fill('[data-testid="project-location"]', 'Rural Area');
  console.log('Submitting project...');
  await page.click('[data-testid="submit-project"]');

  console.log('Checking for success message...');
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
});
