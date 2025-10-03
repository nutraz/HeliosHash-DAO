import { test, expect } from '@playwright/test';

test('should create new solar project', async ({ page }) => {
  await page.goto('/community');

  // Switch to the 'Projects' tab
  await page.click('role=tab[name="Projects"]');

  // Click the button to open the 'Create Project' dialog
  await page.getByRole('button', { name: 'Create Project' }).click();

  // Wait for the dialog to appear
  const dialog = page.locator('[role="dialog"]');
  await expect(dialog).toBeVisible();

  // Fill out the form
  await dialog.locator('input#title').fill('Test Solar Farm');
  await dialog.locator('input#landOwner').fill('Community Land');
  await dialog.locator('input#location').fill('Testville, India');
  await dialog.locator('input#budget').fill('₹10 Crore');
  await dialog.locator('textarea#description').fill('A test solar project for the community.');

  // Select a project type
  await dialog.locator('button[role="combobox"]').first().click(); // Open the select dropdown
  await page.locator('div[role="option"]:has-text("Solar Energy")').click();

  // Submit the form
  await dialog.locator('button:has-text("Create Project")').click();

  // Assert that the new project appears in the list
  await expect(page.locator('h3:has-text("Test Solar Farm")')).toBeVisible();
});
