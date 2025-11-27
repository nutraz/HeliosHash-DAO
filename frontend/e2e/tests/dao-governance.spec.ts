import { test, expect } from '@playwright/test';

test.describe('DAO Governance Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should check for governance navigation', async ({ page }) => {
    const governanceSelectors = [
      '[data-testid="governance"]',
      '[data-testid="proposals"]',
      '[data-testid="voting"]',
      'a[href*="governance"]',
      'a[href*="proposals"]',
      'a[href*="vote"]',
      'button:has-text("Governance")',
      'button:has-text("Proposals")'
    ];

    for (const selector of governanceSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found governance element: ${selector}`);
        await elements.first().click();
        await page.waitForTimeout(1000);
        break;
      }
    }
  });

  test('should test proposal creation flow', async ({ page }) => {
    // Navigate to governance if possible
    await page.goto('/governance');
    
    // Look for new proposal button
    const newProposalSelectors = [
      '[data-testid="new-proposal"]',
      'button:has-text("New Proposal")',
      'button:has-text("Create Proposal")',
      'a[href*="proposals/new"]'
    ];

    for (const selector of newProposalSelectors) {
      const elements = page.locator(selector);
      if (await elements.count() > 0) {
        console.log(`✅ Found proposal creation: ${selector}`);
        await elements.first().click();
        await page.waitForTimeout(1000);
        
        // Check for proposal form elements
        const formElements = [
          'input[placeholder*="title"]',
          'textarea[placeholder*="description"]',
          'input[type="text"]',
          'textarea'
        ];
        
        for (const formSelector of formElements) {
          const formEls = page.locator(formSelector);
          if (await formEls.count() > 0) {
            console.log(`✅ Found form element: ${formSelector}`);
          }
        }
        break;
      }
    }
  });
});
