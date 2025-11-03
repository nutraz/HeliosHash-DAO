import { test, expect } from '@playwright/test';


test('complete CRUD flow', async ({ page }) => {
  // Navigate to app
  await page.goto('http://localhost:3000');


// Test wallet connection
  await page.click('button:has-text("Connect Wallet")');
  // Add wallet connection assertions


// Test CRUD operations
  // Create
  await page.fill('input[placeholder="Name"]', 'Test Item');
  await page.fill('input[placeholder="Description"]', 'Test Description');
  await page.click('button:has-text("Create Item")');


// Verify creation
  await expect(page.locator('text=Test Item')).toBeVisible();


// Update
  await page.click('button:has-text("Edit")');
  await page.fill('input[placeholder="Name"]', 'Updated Item');
  await page.click('button:has-text("Update Item")');


// Verify update
  await expect(page.locator('text=Updated Item')).toBeVisible();


// Delete
  await page.click('button:has-text("Delete")');


// Verify deletion
  await expect(page.locator('text=Updated Item')).not.toBeVisible();
});
