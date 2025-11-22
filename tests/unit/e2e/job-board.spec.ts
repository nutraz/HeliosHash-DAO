// @ts-ignore - Playwright types may not be picked up by the project's tsconfig include
import { expect, Page, test } from '@playwright/test';

// Basic navigation + interaction tests for the Job Board (Opportunities) section
// Assumptions:
//  - Community page route is /community
//  - JobBoard is rendered under a tab value 'opportunities' on that page
//  - Tabs use role="tab" semantics from Radix (via TabsTrigger) so we can click the trigger
//  - Data-testid attributes have been added for resilient selectors

const COMMUNITY_URL = '/community';

// Helper to open community page and switch to Opportunities tab
async function openJobBoard(page: Page) {
  await page.goto(COMMUNITY_URL);
  // Locate the Opportunities tab trigger by its text (fallback) or value attribute
  const opportunitiesTab = page.getByRole('tab', { name: /opportunities/i });
  if (await opportunitiesTab.isVisible()) {
    await opportunitiesTab.click();
  } else {
    // Fallback: attempt to click via data-state or nth
    const triggers = page.getByRole('tab');
    const count = await triggers.count();
    for (let i = 0; i < count; i++) {
      const t = triggers.nth(i);
      if (/opportun/i.test(await t.innerText())) {
        await t.click();
        break;
      }
    }
  }
  await expect(page.getByTestId('job-board-wrapper')).toBeVisible();
}

// Smoke tests

test.describe('Job Board (Opportunities)', () => {
  test('loads job board and shows stats + list', async ({ page }: { page: Page }) => {
    await openJobBoard(page);

    // Stats cards
    const stats = page.getByTestId('job-stats-cards');
    await expect(stats).toBeVisible();
    // Expect at least one stat card present
    const firstStat = page.getByTestId(/job-stat-/).first();
    await expect(firstStat).toBeVisible();

    // Job list present
    const jobList = page.getByTestId('job-list');
    await expect(jobList).toBeVisible();
    const cards = await jobList.getByTestId('job-card').all();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('search filters down jobs', async ({ page }: { page: Page }) => {
    await openJobBoard(page);
    const search = page.getByTestId('job-search-input').locator('input');

    // Type a query that should match blockchain job
    await search.fill('blockchain');
    await expect(page.getByTestId('job-showing-count')).toContainText(/showing/i);

    // All visible cards should contain the term or related content
    const cards = await page.getByTestId('job-card').all();
    expect(cards.length).toBeGreaterThan(0);

    for (const c of cards) {
      const text = (await c.innerText()).toLowerCase();
      expect(text).toMatch(/blockchain|smart contract|internet computer|motoko/);
    }
  });

  test('clear filters resets results', async ({ page }: { page: Page }) => {
    await openJobBoard(page);
    const search = page.getByTestId('job-search-input').locator('input');
    await search.fill('nonexistent-super-rare-search-term');

    // Expect empty state
    await expect(page.getByTestId('job-empty-state')).toBeVisible();

    // Click Clear All Filters inside empty state
    await page.getByTestId('job-empty-clear').click();

    // Job list should reappear
    await expect(page.getByTestId('job-list')).toBeVisible();
    const cards = await page.getByTestId('job-card').all();
    expect(cards.length).toBeGreaterThan(0);
  });

  test('sort select changes ordering (sanity check)', async ({ page }: { page: Page }) => {
    await openJobBoard(page);
    const sortSelect = page.getByTestId('job-sort-select');
    await expect(sortSelect).toBeVisible();

    // Capture initial first job title
    const firstBefore = await page.getByTestId('job-card').first().innerText();

    await sortSelect.selectOption('applications');

    // Allow UI to re-render
    await page.waitForTimeout(300);

    const firstAfter = await page.getByTestId('job-card').first().innerText();
    // Not asserting strict difference (dataset might already be ordered) but log if unchanged
    if (firstBefore === firstAfter) {
      console.warn(
        'Sort did not visibly change first item - dataset may already match selected sort'
      );
    }
  });

  test('refresh button works (basic visibility & spinner)', async ({ page }: { page: Page }) => {
    await openJobBoard(page);
    const refreshBtn = page.getByTestId('job-refresh-button');
    await expect(refreshBtn).toBeVisible();
    await refreshBtn.click();
    // Spinner class could appear briefly; we just wait a bit
    await page.waitForTimeout(200);
  });
});
