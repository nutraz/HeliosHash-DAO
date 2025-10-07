import { test, expect } from '@playwright/test';

// Mobile smoke: open mobile URL, submit animal-care report, open detail, vote
test.use({ viewport: { width: 412, height: 915 } });

test('mobile smoke - animal care flow', async ({ page }) => {
  // Replace LAN_IP with your dev machine IP if not running in CI
  const base = process.env.MOBILE_TEST_BASE || 'http://192.168.29.210:3003';
  await page.goto(base + '/community/animal-care');

  // Fill form
  await page.locator('input[aria-label="Location"]').fill('Community Park');
  await page
    .locator('textarea[aria-label="Description"]')
    .fill('Found a stray dog with minor wound');
  await page
    .locator('input[aria-label="Photos (comma-separated URLs)"]')
    .fill('https://example.com/photo1.jpg');
  await page.locator('button:has-text("Submit report")').click();

  // Wait for submission and list refresh
  await page.waitForTimeout(1000);

  // Click first report to open detail (assumes list is present)
  const firstReport = page.locator('ul li').first();
  await expect(firstReport).toBeVisible();
  await firstReport.click();

  // Vote yes
  await page.locator('button:has-text("Vote Yes")').click();

  // Validate vote count increment (best-effort: wait for change)
  await page.waitForTimeout(500);
  const votesText = await page.locator('text=Votes:').innerText();
  expect(votesText).toContain('/');
});
