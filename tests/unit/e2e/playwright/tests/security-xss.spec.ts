import { test, expect } from '@playwright/test';

// Tag with @security for focused runs
// Run with: pnpm test:security (if configured) or: npx playwright test --grep "@security"

test.describe('XSS defenses @security', () => {
  test('search inputs do not execute scripts', async ({ page, baseURL }) => {
    const url = baseURL || process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001';
    await page.goto(`${url}/community`);

    const payload = "<img src=x onerror=alert('xss')>";

    // Try common search box selectors; ignore if not found
    const search = page.locator('input[placeholder*="Search" i], input[name*="search" i]');
    const hasSearch = await search.first().isVisible().catch(() => false);

    if (!hasSearch) {
      test.info().annotations.push({ type: 'skip', description: 'No search box found' });
      test.skip();
    }

    const first = search.first();
    await first.click();
    await first.fill(payload);

    // Monitor dialogs (alerts) as a sign of XSS execution
    let dialogTriggered = false;
    page.on('dialog', async (dialog) => {
      dialogTriggered = true;
      await dialog.dismiss();
    });

    // Trigger any search logic by pressing Enter
    await first.press('Enter');
    await page.waitForTimeout(500);

    expect(dialogTriggered).toBeFalsy();
  });
});
