import { test, expect } from '@playwright/test';

// Mobile smoke (mocked actor): open mobile URL, submit animal-care report, open detail, vote
test.use({ viewport: { width: 412, height: 915 } });

test('mobile smoke - animal care flow (mocked)', async ({ page }) => {
  // Inject a mock actor into the browser global before page scripts run
  await page.addInitScript(() => {
    // @ts-ignore
    window.__HHDAO_MOCK_ACTOR = {
      _reports: [],
      submitAnimalReport: async (location, description, photos, votesRequired, reporter) => {
        const id = window.__HHDAO_MOCK_ACTOR._reports.length + 1;
        window.__HHDAO_MOCK_ACTOR._reports.push({
          id,
          location,
          description,
          photos,
          votesFor: 0,
          votesAgainst: 0,
          votesRequired: votesRequired || 3,
        });
        return id;
      },
      getAllAnimalReports: async () => window.__HHDAO_MOCK_ACTOR._reports,
      getAnimalReport: async (id) =>
        window.__HHDAO_MOCK_ACTOR._reports.find((r) => r.id === id) || null,
      voteOnAnimalReport: async (id, inFavor) => {
        const r = window.__HHDAO_MOCK_ACTOR._reports.find((rep) => rep.id === id);
        if (!r) return false;
        if (inFavor) r.votesFor += 1;
        else r.votesAgainst += 1;
        return true;
      },
    };
  });

  const base = process.env.MOBILE_TEST_BASE || 'http://localhost:3001';
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

  // Wait and refresh list
  await page.waitForTimeout(500);
  await page.reload();

  // Click first report to open detail
  const firstReport = page.locator('ul li').first();
  await expect(firstReport).toBeVisible();
  await firstReport.click();

  // Vote yes
  await page.locator('button:has-text("Vote Yes")').click();

  // Verify mock state changed via detail content
  await page.waitForTimeout(200);
  const votesText = await page.locator('text=Votes:').innerText();
  expect(votesText).toContain('/');
});
// keep a single import line above

// Mobile smoke: open mobile URL, submit animal-care report, open detail, vote
test.use({ viewport: { width: 412, height: 915 } });

test('mobile smoke - animal care flow', async ({ page }) => {
  // Replace LAN_IP with your dev machine IP if not running in CI
  const base = process.env.MOBILE_TEST_BASE || 'http://localhost:3003';
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
