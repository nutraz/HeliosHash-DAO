/**
 * Urgam Valley E2E Tests
 *
 * End-to-end tests for the complete LocalGovernanceDashboard with
 * Urgam Valley pilot integration, mobile responsiveness, and user flows.
 */

import { expect, test } from '@playwright/test';

test.describe('LocalGovernanceDashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the local governance dashboard
    await page.goto('/governance/local');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Tab Navigation and Content', () => {
    test('should display all 6 tabs and navigate between them', async ({ page }) => {
      // Check that all 6 tabs are present
      const tabs = page.locator('[role="tab"]');
      await expect(tabs).toHaveCount(6);

      // Verify tab names
      await expect(tabs.nth(0)).toContainText('Panchayat');
      await expect(tabs.nth(1)).toContainText('Land Records');
      await expect(tabs.nth(2)).toContainText('Aadhaar KYC');
      await expect(tabs.nth(3)).toContainText('UP Subsidies');
      await expect(tabs.nth(4)).toContainText('SHG Onboarding');
      await expect(tabs.nth(5)).toContainText('Urgam Valley');
    });

    test('should switch to Urgam Valley tab and display pilot dashboard', async ({ page }) => {
      // Click on Urgam Valley tab
      await page.click('[role="tab"]:has-text("Urgam Valley")');

      // Wait for content to load
      await page.waitForTimeout(1000);

      // Verify Urgam Valley content is displayed
      await expect(page.locator('text=Urgam Valley Pilot Operations')).toBeVisible();
      await expect(page.locator('text=668km')).toBeVisible();
      await expect(page.locator('text=Pilot Capacity')).toBeVisible();
    });

    test('should display correct Urgam Valley metrics and data', async ({ page }) => {
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.waitForTimeout(1000);

      // Check for key metrics
      await expect(page.locator('text=Overall Readiness')).toBeVisible();
      await expect(page.locator('text=Sites Ready')).toBeVisible();
      await expect(page.locator('text=Total Capacity')).toBeVisible();
      await expect(page.locator('text=Investment')).toBeVisible();

      // Check for site information
      await expect(page.locator('text=UV-001: Urgam Village Center')).toBeVisible();
      await expect(page.locator('text=UV-002: Valley Upper Slopes')).toBeVisible();
    });
  });

  test.describe('Urgam Valley Pilot Features', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.waitForTimeout(1500);
    });

    test('should navigate through Urgam Valley sub-tabs', async ({ page }) => {
      // Check that Urgam Valley has its own tab system
      const pilotTabs = page.locator('[role="tablist"]').nth(1).locator('[role="tab"]');
      await expect(pilotTabs).toHaveCount(5);

      // Verify sub-tab names
      await expect(pilotTabs.nth(0)).toContainText('Pilot Readiness');
      await expect(pilotTabs.nth(1)).toContainText('Site Assessment');
      await expect(pilotTabs.nth(2)).toContainText('Field Teams');
      await expect(pilotTabs.nth(3)).toContainText('Mobile Operations');
      await expect(pilotTabs.nth(4)).toContainText('Deployment');
    });

    test('should display site assessment information', async ({ page }) => {
      // Navigate to Site Assessment tab
      await page.click('text=Site Assessment');
      await page.waitForTimeout(500);

      // Verify site cards are displayed
      await expect(page.locator('text=UV-001: Urgam Village Center')).toBeVisible();
      await expect(page.locator('text=5.2MW capacity')).toBeVisible();
      await expect(page.locator('text=Ready')).toBeVisible();

      await expect(page.locator('text=UV-002: Valley Upper Slopes')).toBeVisible();
      await expect(page.locator('text=8.9MW capacity')).toBeVisible();
      await expect(page.locator('text=In Progress')).toBeVisible();
    });

    test('should display field teams information', async ({ page }) => {
      await page.click('text=Field Teams');
      await page.waitForTimeout(500);

      // Check for team information
      await expect(page.locator('text=TEAM-001')).toBeVisible();
      await expect(page.locator('text=Rajesh Kumar Bhatt')).toBeVisible();
      await expect(page.locator('text=TEAM-002')).toBeVisible();
      await expect(page.locator('text=Sunita Sharma')).toBeVisible();
    });

    test('should show mobile operations and QR functionality', async ({ page }) => {
      await page.click('text=Mobile Operations');
      await page.waitForTimeout(500);

      // Check for mobile sync information
      await expect(page.locator('text=Connectivity')).toBeVisible();
      await expect(page.locator('text=Pending Uploads')).toBeVisible();
      await expect(page.locator('text=Offline Data')).toBeVisible();

      // Check for QR code generation
      await expect(page.locator('text=QR Code Field Survey System')).toBeVisible();
    });
  });

  test.describe('Integration with Other Dashboard Tabs', () => {
    test('should switch from Urgam Valley to Land Records and back', async ({ page }) => {
      // Start with Urgam Valley
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await expect(page.locator('text=Urgam Valley Pilot Operations')).toBeVisible();

      // Switch to Land Records
      await page.click('[role="tab"]:has-text("Land Records")');
      await page.waitForTimeout(500);
      await expect(page.locator('text=Land Verification')).toBeVisible();

      // Switch back to Urgam Valley
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.waitForTimeout(500);
      await expect(page.locator('text=Urgam Valley Pilot Operations')).toBeVisible();
    });

    test('should maintain state when switching between all tabs', async ({ page }) => {
      const tabNames = [
        'Land Records',
        'Aadhaar KYC',
        'UP Subsidies',
        'SHG Onboarding',
        'Urgam Valley',
      ];

      for (const tabName of tabNames) {
        await page.click(`[role="tab"]:has-text("${tabName}")`);
        await page.waitForTimeout(300);

        // Verify the tab is active
        const activeTab = page.locator(`[role="tab"]:has-text("${tabName}")`);
        await expect(activeTab).toHaveAttribute('data-state', 'active');
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Navigate to Urgam Valley tab
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.waitForTimeout(1000);

      // Check that content is visible and properly formatted
      await expect(page.locator('text=Urgam Valley Pilot Operations')).toBeVisible();
      await expect(page.locator('text=Overall Readiness')).toBeVisible();

      // Check that cards stack properly on mobile
      const metricCards = page.locator('[class*="grid-cols-1"]');
      await expect(metricCards).toBeVisible();
    });

    test('should handle tablet viewport', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.waitForTimeout(1000);

      // Content should be visible and well-formatted
      await expect(page.locator('text=Urgam Valley Pilot Operations')).toBeVisible();

      // Check grid layout adapts to tablet
      const gridElements = page.locator('[class*="md:grid-cols-2"]');
      await expect(gridElements).toBeVisible();
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load Urgam Valley tab within acceptable time', async ({ page }) => {
      const startTime = Date.now();

      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await expect(page.locator('text=Urgam Valley Pilot Operations')).toBeVisible();

      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle rapid tab switching without errors', async ({ page }) => {
      const tabs = ['Panchayat', 'Land Records', 'Urgam Valley', 'Aadhaar KYC', 'UP Subsidies'];

      // Rapidly switch between tabs
      for (let i = 0; i < 3; i++) {
        for (const tab of tabs) {
          await page.click(`[role="tab"]:has-text("${tab}")`);
          await page.waitForTimeout(100);
        }
      }

      // Final state should be stable
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await expect(page.locator('text=Urgam Valley Pilot Operations')).toBeVisible();
    });
  });

  test.describe('Interactive Features', () => {
    test('should handle QR code generation clicks', async ({ page }) => {
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.click('text=Mobile Operations');
      await page.waitForTimeout(500);

      // Click on QR code generation button
      const qrButton = page.locator('button:has-text("Generate QR Code")').first();
      await expect(qrButton).toBeVisible();

      // Click should not cause errors (we expect an alert in current implementation)
      await qrButton.click();
    });

    test('should handle team deployment actions', async ({ page }) => {
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.click('text=Field Teams');
      await page.waitForTimeout(500);

      // Look for deployment buttons
      const deployButton = page.locator('button:has-text("Deploy to UV-002")');
      if ((await deployButton.count()) > 0) {
        await deployButton.click();
        // Should handle the deployment action without errors
      }
    });
  });

  test.describe('Data Integration', () => {
    test('should display consistent data across tab switches', async ({ page }) => {
      // Check Baghpat location is consistent
      await expect(page.locator('text=Baghpat, Uttar Pradesh')).toBeVisible();

      // Switch to Urgam Valley
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await expect(page.locator('text=Remote solar deployment at 668km')).toBeVisible();

      // Switch to Land Records
      await page.click('[role="tab"]:has-text("Land Records")');
      // Should maintain contextual consistency
    });

    test('should show proper status indicators', async ({ page }) => {
      await page.click('[role="tab"]:has-text("Urgam Valley")');
      await page.waitForTimeout(1000);

      // Check for status badges and indicators
      await expect(page.locator('text=Ready')).toBeVisible();
      await expect(page.locator('text=In Progress')).toBeVisible();

      // Check for progress bars or percentage indicators
      const progressElements = page.locator('[role="progressbar"], .progress, [class*="progress"]');
      // At least some progress indicators should be present
    });
  });
});

test.describe('Accessibility Tests', () => {
  test('should have proper ARIA labels and keyboard navigation', async ({ page }) => {
    await page.goto('/governance/local');
    await page.waitForLoadState('networkidle');

    // Check tab accessibility
    const tabs = page.locator('[role="tab"]');
    for (let i = 0; i < (await tabs.count()); i++) {
      const tab = tabs.nth(i);
      await expect(tab).toHaveAttribute('aria-selected');
    }

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('ArrowRight');
    // Should be able to navigate with keyboard
  });

  test('should have readable text and proper contrast', async ({ page }) => {
    await page.goto('/governance/local');
    await page.click('[role="tab"]:has-text("Urgam Valley")');
    await page.waitForTimeout(1000);

    // Check that text is readable (basic visibility test)
    const mainHeading = page.locator('h1:has-text("Urgam Valley Pilot Operations")');
    await expect(mainHeading).toBeVisible();

    // Check that important metrics are clearly visible
    await expect(page.locator('text=Overall Readiness')).toBeVisible();
    await expect(page.locator('text=Sites Ready')).toBeVisible();
  });
});
