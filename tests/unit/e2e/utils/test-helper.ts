/**
 * Test Helper for HeliosHash DAO E2E Tests
 * Provides common test utilities and setup methods
 */

import { Page, expect } from '@playwright/test';

export class TestHelper {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation utilities
  nav = {
    gotoWithRetry: async (url: string, retries: number = 3): Promise<void> => {
      for (let i = 0; i < retries; i++) {
        try {
          await this.page.goto(url, { waitUntil: 'networkidle' });
          return;
        } catch (error) {
          if (i === retries - 1) throw error;
          await this.page.waitForTimeout(1000);
        }
      }
    }
  };

  // Authentication utilities
  auth = {
    verifyAuthenticated: async (): Promise<void> => {
      // Check for authenticated state - look for dashboard elements or user info
      await expect(this.page.locator('body')).toContainText('Dashboard');
    }
  };

  // Assertion utilities
  assert = {
    assertNoXSSContent: async (): Promise<void> => {
      // Check that page doesn't contain unescaped script tags or dangerous content
      const bodyText = await this.page.locator('body').textContent();
      expect(bodyText).not.toContain('<script>');
      expect(bodyText).not.toContain('javascript:');
      expect(bodyText).not.toContain('onload=');
      expect(bodyText).not.toContain('onerror=');
    }
  };

  // Cleanup utilities
  async cleanup(): Promise<void> {
    // Clean up test data and state (no-op, sessionStorage not used)
    // All state is now managed via cookies/context.
  }

  // Test setup methods
  async setupSecurityTest(): Promise<void> {
    // Setup for security tests - ensure clean state, no authentication
    await this.page.context().clearCookies();
    // No sessionStorage usage; all state is managed via cookies/context.
  }

  /**
   * Authenticates the test browser context using the real /api/login route and HttpOnly cookies.
   * @param userId - The userId to log in as (default: 'community1')
   * @param apiBaseUrl - The base URL for API requests (default: 'http://localhost:3000')
   */
  async loginWithHttpOnlyCookie(userId: string = 'community1', apiBaseUrl: string = 'http://localhost:3000') {
    // Use static import to avoid ES module error
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { loginAndSaveSession } = require('./auth');
    // Get CSRF token from API
    const csrfRes = await this.page.request.get(`${apiBaseUrl}/api/csrf`);
    const csrfCookie = csrfRes.headers()['set-cookie']?.split(';')[0].split('=')[1];
    await loginAndSaveSession(apiBaseUrl, userId, csrfCookie, this.page.context());
  }

  async setupSmokeTest(): Promise<void> {
    // Setup for smoke tests - basic authenticated state using secure cookie
    await this.setupSecurityTest();
    await this.loginWithHttpOnlyCookie();
  }

  async setupIntegrationTest(): Promise<void> {
    // Setup for integration tests - full authenticated state with session persistence using secure cookie
    await this.setupSecurityTest();
    await this.loginWithHttpOnlyCookie();
  }
}

export default TestHelper;
