import { test, expect } from '@playwright/test';

test.describe('Community Page', () => {
  test('should display community page with tabs', async ({ page }) => {
    await page.goto('/community');

    // Check main heading
    await expect(page.locator('h1')).toContainText('Community Initiatives');

    // Check tabs
    await expect(page.locator('text=Animal Care')).toBeVisible();
    await expect(page.locator('text=Opportunities')).toBeVisible();
  });

  test('should display animal care tab by default', async ({ page }) => {
    await page.goto('/community');

    // Check animal care content is visible
    await expect(page.locator('text=Animal Care Initiative')).toBeVisible();
    await expect(page.locator('text=Support local animal welfare through community-driven initiatives.')).toBeVisible();

    // Check animal care form is present
    await expect(page.locator('form')).toBeVisible();
  });

  test('should switch to opportunities tab', async ({ page }) => {
    await page.goto('/community');

    // Click opportunities tab
    await page.locator('text=Opportunities').click();

    // Check job board is displayed
    await expect(page.locator('text=Job Board')).toBeVisible();
  });

  test('should have proper tab styling', async ({ page }) => {
    await page.goto('/community');

    // Check default active tab styling
    const animalCareTab = page.locator('[value="animal-care"]');
    await expect(animalCareTab).toHaveClass(/data-\[state=active\]/);

    // Click opportunities tab and check styling
    await page.locator('text=Opportunities').click();
    const opportunitiesTab = page.locator('[value="opportunities"]');
    await expect(opportunitiesTab).toHaveClass(/data-\[state=active\]/);
  });
});
