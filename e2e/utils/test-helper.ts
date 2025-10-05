/**
 * Shared Test Utilities for HeliosHash DAO
 * Common operations for authentication, navigation, data setup, and assertions
 */

import { Locator, Page, expect } from '@playwright/test';
import { TestApplication, TestDataFactory, TestUser } from '../factories/test-data-factory';
import { MockManager } from '../mocks/api-mocker';

/**
 * Authentication Utilities
 */
export class AuthUtils {
  constructor(private page: Page) {}

  /**
   * Connect wallet with mock authentication
   */
  async connectWallet(user?: TestUser): Promise<void> {
    const testUser = user || TestDataFactory.User.createWomenEntrepreneur();

    // Setup wallet mock
    await this.page.addInitScript((mockUser) => {
      (window as any).ic = {
        plug: {
          requestConnect: async () => true,
          createAgent: async () => ({
            getPrincipal: () => mockUser.principal,
            call: async () => ({ success: true }),
          }),
          isConnected: () => true,
          accountId: mockUser.id,
          balance: 1000000,
        },
      };
    }, testUser);

    // Navigate to home and connect
    await this.page.goto('/');

    // Wait for and click connect button
    const connectButton = this.page
      .locator(
        '[data-testid="connect-wallet"], [data-testid="wallet-connect"], button:has-text("Connect")'
      )
      .first();
    await connectButton.waitFor({ state: 'visible', timeout: 10000 });
    await connectButton.click();

    // Wait for connection confirmation
    await this.page.waitForSelector(
      '[data-testid="wallet-connected"], .wallet-connected, [data-testid="user-profile"]',
      { timeout: 15000 }
    );
  }

  /**
   * Disconnect wallet
   */
  async disconnectWallet(): Promise<void> {
    const disconnectButton = this.page
      .locator('[data-testid="disconnect-wallet"], button:has-text("Disconnect")')
      .first();

    if (await disconnectButton.isVisible()) {
      await disconnectButton.click();
      await this.page.waitForSelector(
        '[data-testid="connect-wallet"], button:has-text("Connect")',
        { timeout: 10000 }
      );
    }
  }

  /**
   * Verify authentication state
   */
  async verifyAuthenticated(): Promise<void> {
    await expect(
      this.page.locator('[data-testid="wallet-connected"], [data-testid="user-profile"]')
    ).toBeVisible({ timeout: 10000 });
  }

  /**
   * Verify unauthenticated state
   */
  async verifyUnauthenticated(): Promise<void> {
    await expect(
      this.page.locator('[data-testid="connect-wallet"], button:has-text("Connect")')
    ).toBeVisible({ timeout: 10000 });
  }
}

/**
 * Navigation Utilities
 */
export class NavigationUtils {
  constructor(private page: Page) {}

  /**
   * Navigate to dashboard
   */
  async gotoDashboard(): Promise<void> {
    await this.page.goto('/dashboard');
    await this.page.waitForLoadState('networkidle');
    await expect(this.page).toHaveTitle(/Dashboard|HeliosHash/);
  }

  /**
   * Navigate to projects page
   */
  async gotoProjects(): Promise<void> {
    await this.page.goto('/projects');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to governance page
   */
  async gotoGovernance(): Promise<void> {
    await this.page.goto('/governance');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate to application form
   */
  async gotoApplicationForm(): Promise<void> {
    await this.page.goto('/projects/apply');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Navigate using main navigation menu
   */
  async navigateViaMenu(
    menuItem: 'Dashboard' | 'Projects' | 'Governance' | 'Community'
  ): Promise<void> {
    const menuSelector = `nav a:has-text("${menuItem}"), [data-testid="nav-${menuItem.toLowerCase()}"]`;
    await this.page.click(menuSelector);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('main, [data-testid="page-content"]', { timeout: 10000 });
  }

  /**
   * Navigate back
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
    await this.waitForPageLoad();
  }
}

/**
 * Form Utilities
 */
export class FormUtils {
  constructor(private page: Page) {}

  /**
   * Fill application form with test data
   */
  async fillApplicationForm(application: TestApplication): Promise<void> {
    // Title
    await this.page.fill(
      '[data-testid="application-title"], input[name="title"]',
      application.title
    );

    // Description
    await this.page.fill(
      '[data-testid="application-description"], textarea[name="description"]',
      application.description
    );

    // Category selection
    const categorySelector = '[data-testid="application-category"], select[name="category"]';
    if (await this.page.locator(categorySelector).isVisible()) {
      await this.page.selectOption(categorySelector, application.category);
    }

    // Tier selection
    const tierSelector = '[data-testid="application-tier"], select[name="tier"]';
    if (await this.page.locator(tierSelector).isVisible()) {
      await this.page.selectOption(tierSelector, application.tier);
    }

    // Amount
    await this.page.fill(
      '[data-testid="requested-amount"], input[name="requestedAmount"]',
      application.requestedAmount.toString()
    );

    // Expected Impact
    await this.page.fill(
      '[data-testid="expected-impact"], textarea[name="expectedImpact"]',
      application.expectedImpact
    );

    // Timeline
    await this.page.fill(
      '[data-testid="timeline"], input[name="timeline"], textarea[name="timeline"]',
      application.timeline
    );

    // Women-led checkbox
    if (application.isWomenLed) {
      const womenLedCheckbox = this.page.locator(
        '[data-testid="women-led"], input[name="isWomenLed"]'
      );
      if ((await womenLedCheckbox.isVisible()) && !(await womenLedCheckbox.isChecked())) {
        await womenLedCheckbox.check();
      }
    }
  }

  /**
   * Submit form and handle response
   */
  async submitForm(expectSuccess: boolean = true): Promise<void> {
    const submitButton = this.page
      .locator(
        '[data-testid="submit-application"], button[type="submit"], button:has-text("Submit")'
      )
      .first();
    await submitButton.click();

    if (expectSuccess) {
      // Wait for success message or redirect
      await this.page.waitForSelector('[data-testid="success-message"], .success, .alert-success', {
        timeout: 15000,
      });
    }
  }

  /**
   * Clear form fields
   */
  async clearForm(): Promise<void> {
    const formInputs = await this.page.locator('input, textarea, select').all();
    for (const input of formInputs) {
      const tagName = await input.evaluate((el) => el.tagName.toLowerCase());
      if (tagName === 'input' || tagName === 'textarea') {
        await input.fill('');
      } else if (tagName === 'select') {
        await input.selectOption('');
      }
    }
  }

  /**
   * Verify form validation errors
   */
  async verifyValidationError(field: string, expectedMessage?: string): Promise<void> {
    const errorSelector = `[data-testid="${field}-error"], .error-${field}, .field-error`;
    const errorElement = this.page.locator(errorSelector).first();

    await expect(errorElement).toBeVisible();

    if (expectedMessage) {
      await expect(errorElement).toContainText(expectedMessage);
    }
  }
}

/**
 * Data Setup Utilities
 */
export class DataUtils {
  constructor(private page: Page) {}

  /**
   * Create test application via UI
   */
  async createTestApplication(application?: TestApplication): Promise<string> {
    const testApp = application || TestDataFactory.Application.createWomensEmpowermentApp();

    const nav = new NavigationUtils(this.page);
    const form = new FormUtils(this.page);

    await nav.gotoApplicationForm();
    await form.fillApplicationForm(testApp);
    await form.submitForm();

    // Extract application ID from success message or URL
    const successMessage = await this.page
      .locator('[data-testid="success-message"], .success')
      .textContent();
    const idMatch = successMessage?.match(/ID[:\s]*(\d+)/i) || successMessage?.match(/(\d+)/);
    return idMatch?.[1] || 'unknown';
  }

  /**
   * Create multiple test applications
   */
  async createBatchApplications(
    count: number,
    type: 'women' | 'technical' | 'community' = 'women'
  ): Promise<string[]> {
    const applications = TestDataFactory.Application.createBatch(count, type);
    const ids: string[] = [];

    for (const app of applications) {
      const id = await this.createTestApplication(app);
      ids.push(id);
    }

    return ids;
  }

  /**
   * Setup test environment with mock data
   */
  async setupTestEnvironment(
    options: {
      applications?: number;
      authenticateUser?: boolean;
      mockType?: 'smoke' | 'integration' | 'performance' | 'security';
    } = {}
  ): Promise<void> {
    const { applications = 0, authenticateUser = true, mockType = 'smoke' } = options;

    // Setup mocks
    const mockManager = new MockManager();
    switch (mockType) {
      case 'smoke':
        await mockManager.setupSmokeTestMocks(this.page);
        break;
      case 'integration':
        await mockManager.setupIntegrationTestMocks(this.page);
        break;
      case 'performance':
        await mockManager.setupPerformanceTestMocks(this.page);
        break;
      case 'security':
        await mockManager.setupSecurityTestMocks(this.page);
        break;
    }

    // Authenticate user if needed
    if (authenticateUser) {
      const auth = new AuthUtils(this.page);
      await auth.connectWallet();
    }

    // Create test applications if needed
    if (applications > 0 && authenticateUser) {
      await this.createBatchApplications(applications);
    }
  }

  /**
   * Clean up test data
   */
  async cleanup(): Promise<void> {
    // In a real app, this would clean up test data
    // For now, we'll just clear browser state
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }
}

/**
 * Assertion Utilities
 */
export class AssertUtils {
  constructor(private page: Page) {}

  /**
   * Assert page title contains expected text
   */
  async assertPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(expectedTitle, 'i'));
  }

  /**
   * Assert element is visible with text
   */
  async assertElementVisible(selector: string, expectedText?: string): Promise<void> {
    const element = this.page.locator(selector);
    await expect(element).toBeVisible();

    if (expectedText) {
      await expect(element).toContainText(expectedText);
    }
  }

  /**
   * Assert success message appears
   */
  async assertSuccessMessage(expectedMessage?: string): Promise<void> {
    const successSelector = '[data-testid="success-message"], .success, .alert-success';
    await expect(this.page.locator(successSelector)).toBeVisible();

    if (expectedMessage) {
      await expect(this.page.locator(successSelector)).toContainText(expectedMessage);
    }
  }

  /**
   * Assert error message appears
   */
  async assertErrorMessage(expectedMessage?: string): Promise<void> {
    const errorSelector = '[data-testid="error-message"], .error, .alert-error';
    await expect(this.page.locator(errorSelector)).toBeVisible();

    if (expectedMessage) {
      await expect(this.page.locator(errorSelector)).toContainText(expectedMessage);
    }
  }

  /**
   * Assert application appears in list
   */
  async assertApplicationInList(applicationTitle: string): Promise<void> {
    const applicationList = this.page.locator(
      '[data-testid="applications-list"], .applications-grid'
    );
    await expect(applicationList.locator(`text=${applicationTitle}`)).toBeVisible();
  }

  /**
   * Assert performance metrics meet thresholds
   */
  async assertPerformanceThresholds(): Promise<void> {
    const performanceMetrics = await this.page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {
            FCP: 0,
            LCP: 0,
            FID: 0,
            CLS: 0,
          };

          entries.forEach((entry: any) => {
            if (entry.name === 'first-contentful-paint') {
              metrics.FCP = entry.startTime;
            } else if (entry.entryType === 'largest-contentful-paint') {
              metrics.LCP = entry.startTime;
            } else if (entry.entryType === 'first-input') {
              metrics.FID = entry.processingStart - entry.startTime;
            } else if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.CLS += (entry as any).value;
            }
          });

          resolve(metrics);
        }).observe({
          entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'],
        });

        // Fallback if no entries
        setTimeout(() => resolve({ FCP: 0, LCP: 0, FID: 0, CLS: 0 }), 5000);
      });
    });

    const metrics = performanceMetrics as any;

    // Core Web Vitals thresholds
    if (metrics.FCP > 0) expect(metrics.FCP).toBeLessThan(1800); // < 1.8s
    if (metrics.LCP > 0) expect(metrics.LCP).toBeLessThan(2500); // < 2.5s
    if (metrics.FID > 0) expect(metrics.FID).toBeLessThan(100); // < 100ms
    if (metrics.CLS > 0) expect(metrics.CLS).toBeLessThan(0.1); // < 0.1
  }

  /**
   * Assert security - no XSS content in page
   */
  async assertNoXSSContent(): Promise<void> {
    const pageContent = await this.page.content();

    // Check for common XSS patterns
    expect(pageContent).not.toContain('<script>alert');
    expect(pageContent).not.toContain('javascript:alert');
    expect(pageContent).not.toContain('onerror=alert');
    expect(pageContent).not.toContain('onload=alert');
  }
}

/**
 * Wait Utilities
 */
export class WaitUtils {
  constructor(private page: Page) {}

  /**
   * Wait for canister response
   */
  async waitForCanisterResponse(timeout: number = 10000): Promise<void> {
    await this.page.waitForFunction(
      () => !(window as any).ic?.loading && !(window as any).dfinity?.loading,
      { timeout }
    );
  }

  /**
   * Wait for network idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element with retry
   */
  async waitForElementWithRetry(selector: string, maxRetries: number = 3): Promise<Locator> {
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const element = this.page.locator(selector);
        await element.waitFor({ state: 'visible', timeout: 5000 });
        return element;
      } catch (error) {
        lastError = error as Error;
        await this.page.waitForTimeout(1000); // Wait 1 second before retry
      }
    }

    throw new Error(
      `Element ${selector} not found after ${maxRetries} retries. Last error: ${lastError?.message}`
    );
  }

  /**
   * Wait for animation to complete
   */
  async waitForAnimation(): Promise<void> {
    await this.page.waitForTimeout(500); // Wait for CSS animations
  }
}

/**
 * All-in-one Test Helper Class
 */
export class TestHelper {
  public auth: AuthUtils;
  public nav: NavigationUtils;
  public form: FormUtils;
  public data: DataUtils;
  public assert: AssertUtils;
  public wait: WaitUtils;

  constructor(private page: Page) {
    this.auth = new AuthUtils(page);
    this.nav = new NavigationUtils(page);
    this.form = new FormUtils(page);
    this.data = new DataUtils(page);
    this.assert = new AssertUtils(page);
    this.wait = new WaitUtils(page);
  }

  /**
   * Quick setup for smoke tests
   */
  async setupSmokeTest(): Promise<void> {
    await this.data.setupTestEnvironment({
      authenticateUser: true,
      mockType: 'smoke',
    });
  }

  /**
   * Quick setup for integration tests
   */
  async setupIntegrationTest(applications: number = 2): Promise<void> {
    await this.data.setupTestEnvironment({
      authenticateUser: true,
      mockType: 'integration',
      applications,
    });
  }

  /**
   * Quick setup for performance tests
   */
  async setupPerformanceTest(): Promise<void> {
    await this.data.setupTestEnvironment({
      authenticateUser: true,
      mockType: 'performance',
    });
  }

  /**
   * Quick setup for security tests
   */
  async setupSecurityTest(): Promise<void> {
    await this.data.setupTestEnvironment({
      authenticateUser: false,
      mockType: 'security',
    });
  }

  /**
   * Complete test cleanup
   */
  async cleanup(): Promise<void> {
    await this.data.cleanup();
  }
}

export default TestHelper;
