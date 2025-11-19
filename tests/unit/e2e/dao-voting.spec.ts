import { expect, Page, test } from '@playwright/test';

// Skeleton spec for future DAO governance E2E coverage.
// These tests are skipped until proposal creation & voting flows have stable APIs + selectors.
// Outline provides a roadmap so we can incrementally un-skip as backend/front-end functionality ships.

const COMMUNITY_URL = '/community';

async function openGovernanceTab(page: Page) {
  await page.goto(COMMUNITY_URL);
  // Tab trigger likely labelled "Governance" or similar; adjust if actual label differs
  const govTab = page.getByRole('tab', { name: /governance|dao|proposals/i });
  if (await govTab.isVisible()) {
    await govTab.click();
  }
}

test.describe('DAO Governance (Proposals) - Skeleton', () => {
  test('lists existing proposals with status + vote counts', async ({ page }: { page: Page }) => {
    await openGovernanceTab(page);
    // Expect proposals list container
    const list = page.getByTestId('dao-proposals-list');
    await expect(list).toBeVisible();
    // At least one proposal card
    await expect(list.locator('[data-testid^="proposal-card-"]').first()).toBeVisible();
  });

  test('opens create proposal dialog and validates form fields', async ({
    page,
  }: {
    page: Page;
  }) => {
    await openGovernanceTab(page);
    await page.getByTestId('create-proposal-button').click();
    await expect(page.getByTestId('create-proposal-dialog')).toBeVisible();
    await expect(page.getByTestId('proposal-title-input')).toBeVisible();
    await expect(page.getByTestId('proposal-description-input')).toBeVisible();
    await expect(page.getByTestId('proposal-deadline-input')).toBeVisible();
  });

  test.skip('submits a new proposal (mocked) and appears in list', async ({
    page,
  }: {
    page: Page;
  }) => {
    await openGovernanceTab(page);
    await page.getByTestId('create-proposal-button').click();
    await page.getByTestId('proposal-title-input').fill('Test Proposal E2E');
    await page
      .getByTestId('proposal-description-input')
      .fill('Automated test proposal description');
    await page.getByTestId('proposal-submit-button').click();
    await expect(page.getByTestId('toast-success')).toContainText(/proposal created/i);
    await expect(
      page.getByTestId('dao-proposals-list').getByText('Test Proposal E2E')
    ).toBeVisible();
  });

  test.skip('casts vote FOR and updates counts', async ({ page }: { page: Page }) => {
    await openGovernanceTab(page);
    // Select first proposal for voting
    const firstProposal = page.locator('[data-testid^="proposal-card-"]').first();
    await expect(firstProposal).toBeVisible();
    const voteForButton = firstProposal.getByTestId('vote-for-button');
    await voteForButton.click();
    await expect(firstProposal.getByTestId('votes-for-count')).toHaveText(/\d+/);
  });

  test.skip('casts vote AGAINST and updates counts', async ({ page }: { page: Page }) => {
    await openGovernanceTab(page);
    const firstProposal = page.locator('[data-testid^="proposal-card-"]').first();
    const voteAgainstButton = firstProposal.getByTestId('vote-against-button');
    await voteAgainstButton.click();
    await expect(firstProposal.getByTestId('votes-against-count')).toHaveText(/\d+/);
  });

  test.skip('proposal reaches quorum and status updates to Passed/Rejected', async ({
    page,
  }: {
    page: Page;
  }) => {
    await openGovernanceTab(page);
    // After multiple votes simulated (future implementation), status badge changes
    const targetProposal = page.locator('[data-testid^="proposal-card-"]').first();
    await expect(targetProposal.getByTestId('proposal-status-badge')).toHaveText(
      /passed|rejected|active/i
    );
  });
});
