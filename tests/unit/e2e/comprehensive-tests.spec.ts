import { expect, test } from '@playwright/test';
import { AuthPage } from './pages/auth-page';
import { DashboardPage } from './pages/dashboard-page';
import { UPIPaymentPage } from './pages/upi-payment-page';

// Test data
const testUser = {
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+919876543210',
  aadhaar: '123456789012',
  pan: 'ABCDE1234F',
};

test.describe('HeliosHash DAO - Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    });
  });

  test.describe('Authentication Flow', () => {
    test('should login with wallet connection', async ({ page }) => {
      const authPage = new AuthPage(page);

      await authPage.goto();
      await authPage.connectWallet();

      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('[data-testid="user-profile"]')).toBeVisible();
    });

    test('should handle wallet connection failure', async ({ page }) => {
      await page.addInitScript(() => {
        (window as any).ic = {
          plug: {
            isConnected: () => Promise.resolve(false),
            requestConnect: () => Promise.reject(new Error('User rejected')),
          },
        };
      });

      const authPage = new AuthPage(page);
      await authPage.goto();
      await authPage.connectWallet();

      await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="error-message"]')).toContainText(
        'connection failed'
      );
    });
  });

  test.describe('Dashboard Functionality', () => {
    test('should display user dashboard with all components', async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      // Check main dashboard elements
      await expect(page.locator('[data-testid="dashboard-header"]')).toBeVisible();
      await expect(page.locator('[data-testid="energy-stats"]')).toBeVisible();
      await expect(page.locator('[data-testid="token-balance"]')).toBeVisible();
      await expect(page.locator('[data-testid="governance-section"]')).toBeVisible();
    });

    test('should navigate between different sections', async ({ page }) => {
      const dashboardPage = new DashboardPage(page);

      await dashboardPage.goto();

      // Test navigation
      await dashboardPage.navigateToProjects();
      await expect(page.locator('[data-testid="projects-section"]')).toBeVisible();

      await dashboardPage.navigateToGovernance();
      await expect(page.locator('[data-testid="governance-proposals"]')).toBeVisible();

      await dashboardPage.navigateToEnergy();
      await expect(page.locator('[data-testid="energy-dashboard"]')).toBeVisible();
    });

    test("should show women's bonus features for female users", async ({ page }) => {
      // Set user as woman
      await page.addInitScript(() => {
        document.cookie = `user=${encodeURIComponent(JSON.stringify({
          principal: '2vxsx-fae',
          name: 'Priya Sharma',
          isWoman: true,
        }))}; path=/`;
      });

      const dashboardPage = new DashboardPage(page);
      await dashboardPage.goto();

      // Check for women's bonus indicators
      await expect(page.locator('[data-testid="women-bonus-badge"]')).toBeVisible();
      await expect(page.locator('[data-testid="women-bonus-badge"]')).toContainText('20% Bonus');
    });
  });

  test.describe('UPI Payment Gateway', () => {
    test('should complete full UPI payment flow', async ({ page }) => {
      const upiPage = new UPIPaymentPage(page);

      await upiPage.goto();

      // Step 1: Amount input
      await upiPage.enterAmount('1000');
      await expect(page.locator('[data-testid="owp-tokens"]')).toContainText('2000.00 OWP');
      await upiPage.continueToKYC();

      // Step 2: KYC information
      await upiPage.fillKYCDetails(testUser);
      await upiPage.proceedToPayment();

      // Step 3: Payment confirmation
      await expect(page.locator('[data-testid="payment-summary"]')).toBeVisible();
      await expect(page.locator('[data-testid="total-amount"]')).toContainText('₹1,000');
      await upiPage.payWithUPI();

      // Step 4: Processing (simulated)
      await expect(page.locator('[data-testid="processing-indicator"]')).toBeVisible();

      // Step 5: Success
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible({ timeout: 15000 });
      await expect(page.locator('[data-testid="tokens-received"]')).toContainText('2000.00 OWP');
    });

    test('should enforce KYC limits for large amounts', async ({ page }) => {
      const upiPage = new UPIPaymentPage(page);

      await upiPage.goto();

      // Try amount exceeding basic KYC limit
      await upiPage.enterAmount('3000');
      await upiPage.continueToKYC();

      // Fill only basic KYC (no Aadhaar/PAN)
      await upiPage.fillKYCDetails({
        name: testUser.name,
        email: testUser.email,
        phone: testUser.phone,
        aadhaar: '',
        pan: '',
      });

      // Should show error for amount exceeding limits
      const proceedButton = page.locator('[data-testid="proceed-to-payment"]');
      await expect(proceedButton).toBeDisabled();
      await expect(page.locator('[data-testid="kyc-limit-error"]')).toBeVisible();
    });

    test('should handle payment failure gracefully', async ({ page }) => {
      // Mock payment failure
      await page.addInitScript(() => {
        (window as any).mockPaymentFailure = true;
      });

      const upiPage = new UPIPaymentPage(page);

      await upiPage.goto();
      await upiPage.enterAmount('500');
      await upiPage.continueToKYC();
      await upiPage.fillKYCDetails(testUser);
      await upiPage.proceedToPayment();
      await upiPage.payWithUPI();

      // Should show error state
      await expect(page.locator('[data-testid="payment-error"]')).toBeVisible({ timeout: 10000 });
      await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    });
  });

  test.describe('Multilingual Support', () => {
    test('should switch language to Hindi', async ({ page }) => {
      await page.goto('/');

      // Switch to Hindi
      await page.click('[data-testid="language-selector"]');
      await page.click('[data-testid="language-hindi"]');

      // Check for Hindi text
      await expect(page.locator('[data-testid="main-heading"]')).toContainText('हेलिओसहैश');
    });

    test('should persist language selection across navigation', async ({ page }) => {
      await page.goto('/');

      // Switch to Hindi
      await page.click('[data-testid="language-selector"]');
      await page.click('[data-testid="language-hindi"]');

      // Navigate to another page
      await page.click('[data-testid="dashboard-link"]');

      // Should still show Hindi text
      await expect(page.locator('[data-testid="dashboard-title"]')).toContainText('डैशबोर्ड');
    });
  });

  test.describe('Voice Interface', () => {
    test('should activate voice interface and respond to commands', async ({ page }) => {
      // Mock speech recognition
      await page.addInitScript(() => {
        (window as any).SpeechRecognition = class {
          start() {
            this.onresult?.({ results: [[{ transcript: 'show dashboard' }]] });
          }
          stop() {}
          onresult: any = null;
          onerror: any = null;
        };
        (window as any).webkitSpeechRecognition = (window as any).SpeechRecognition;
      });

      await page.goto('/dashboard');

      // Activate voice interface
      await page.click('[data-testid="voice-activation"]');
      await expect(page.locator('[data-testid="voice-indicator"]')).toBeVisible();

      // Should navigate based on voice command
      await expect(page.locator('[data-testid="dashboard-section"]')).toBeVisible();
    });
  });

  test.describe('Cross-Chain Integration', () => {
    test('should display multi-chain wallet options', async ({ page }) => {
      await page.goto('/wallet');

      // Check for different blockchain options
      await expect(page.locator('[data-testid="ethereum-option"]')).toBeVisible();
      await expect(page.locator('[data-testid="polygon-option"]')).toBeVisible();
      await expect(page.locator('[data-testid="bsc-option"]')).toBeVisible();
      await expect(page.locator('[data-testid="ic-option"]')).toBeVisible();
    });

    test('should handle cross-chain bridge transfers', async ({ page }) => {
      await page.goto('/bridge');

      // Select source and target chains
      await page.selectOption('[data-testid="source-chain"]', 'ethereum');
      await page.selectOption('[data-testid="target-chain"]', 'ic');

      // Enter transfer amount
      await page.fill('[data-testid="transfer-amount"]', '100');

      // Should show conversion rates and fees
      await expect(page.locator('[data-testid="conversion-rate"]')).toBeVisible();
      await expect(page.locator('[data-testid="bridge-fees"]')).toBeVisible();
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should meet performance benchmarks', async ({ page }) => {
      await page.goto('/');

      // Measure page load time
      const startTime = Date.now();
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;

      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should meet accessibility standards', async ({ page }) => {
      await page.goto('/');

      // Check for proper ARIA labels
      await expect(page.locator('[role="main"]')).toBeVisible();
      await expect(page.locator('[aria-label="Navigation menu"]')).toBeVisible();

      // Check for alt text on images
      const images = await page.locator('img').all();
      for (const img of images) {
        const alt = await img.getAttribute('alt');
        expect(alt).not.toBeNull();
        expect(alt).not.toBe('');
      }
    });
  });

  test.describe('Mobile Responsiveness', () => {
    test('should work on mobile viewport', async ({ page, browser }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');

      // Check mobile navigation
      await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible();

      // Test mobile navigation
      await page.click('[data-testid="mobile-menu-button"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    });

    test('should handle touch gestures', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/dashboard');

      // Test swipe gestures on carousel/slider if present
      const slider = page.locator('[data-testid="project-slider"]');
      if (await slider.isVisible()) {
        await slider.hover();
        await page.mouse.down();
        await page.mouse.move(100, 0);
        await page.mouse.up();

        // Should have moved to next slide
        await expect(page.locator('[data-testid="slide-2"]')).toBeVisible();
      }
    });
  });

  test.describe('Community Page', () => {
    test('should display community page with tabs', async ({ page }) => {
      await page.goto('/community');

      // Check for tabs
      await expect(page.locator('[data-testid="animal-care-tab"]')).toBeVisible();
      await expect(page.locator('[data-testid="opportunities-tab"]')).toBeVisible();
    });

    test('should display animal care tab by default', async ({ page }) => {
      await page.goto('/community');

      // Animal care tab should be active by default
      await expect(page.locator('[data-testid="animal-care-content"]')).toBeVisible();
    });

    test('should switch to opportunities tab', async ({ page }) => {
      await page.goto('/community');

      // Click opportunities tab
      await page.click('[data-testid="opportunities-tab"]');

      // Should show opportunities content
      await expect(page.locator('[data-testid="opportunities-content"]')).toBeVisible();
    });

    test('should have proper tab styling', async ({ page }) => {
      await page.goto('/community');

      // Check tab styling
      await expect(page.locator('[data-testid="animal-care-tab"]')).toHaveClass(/active/);
      await expect(page.locator('[data-testid="opportunities-tab"]')).not.toHaveClass(/active/);
    });
  });

  test.describe('Color Test Page', () => {
    test('should display color test page correctly', async ({ page }) => {
      await page.goto('/color-test');

      // Check for color elements
      await expect(page.locator('[data-testid="color-palette"]')).toBeVisible();
      await expect(page.locator('[data-testid="color-picker"]')).toBeVisible();
    });

    test('should have proper color classes applied', async ({ page }) => {
      await page.goto('/color-test');

      // Check for specific color classes
      await expect(page.locator('.bg-blue-500')).toBeVisible();
      await expect(page.locator('.text-green-600')).toBeVisible();
    });
  });
