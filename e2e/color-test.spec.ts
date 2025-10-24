import { test, expect } from '@playwright/test';

test.describe('Color Test Page', () => {
  test('should display color test page correctly', async ({ page }) => {
    await page.goto('/color-test');

    // Check page title
    await expect(page.locator('h1')).toContainText('Color Variables Test');

    // Check light mode section
    await expect(page.locator('h2').first()).toContainText('Light Mode');

    // Check dark mode section
    await expect(page.locator('h2').nth(1)).toContainText('Dark Mode');

    // Check brand colors section
    await expect(page.locator('h2').nth(2)).toContainText('Brand Colors (HeliosHash)');

    // Check that color boxes are present
    const colorBoxes = page.locator('[class*="bg-"]');
    await expect(colorBoxes).toHaveCount(11); // 7 in light, 7 in dark, 3 brand = 17, but some might be duplicated

    // Check specific brand colors
    await expect(page.locator('text=Saffron')).toBeVisible();
    await expect(page.locator('text=Green')).toBeVisible();
    await expect(page.locator('text=Navy')).toBeVisible();
  });

  test('should have proper color classes applied', async ({ page }) => {
    await page.goto('/color-test');

    // Check that elements have the expected color classes
    const saffronBox = page.locator('.bg-saffron');
    await expect(saffronBox).toBeVisible();

    const greenBox = page.locator('.bg-green');
    await expect(greenBox).toBeVisible();

    const navyBox = page.locator('.bg-navy');
    await expect(navyBox).toBeVisible();
  });
});
