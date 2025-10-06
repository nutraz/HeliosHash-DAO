import { Page } from '@playwright/test';

export class AuthPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/auth/login');
  }

  async connectWallet() {
    await this.page.click('[data-testid="connect-wallet-button"]');
  }

  async loginWithCredentials(email: string, password: string) {
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="login-button"]');
  }

  async signup(name: string, email: string, password: string) {
    await this.page.fill('[data-testid="name-input"]', name);
    await this.page.fill('[data-testid="email-input"]', email);
    await this.page.fill('[data-testid="password-input"]', password);
    await this.page.click('[data-testid="signup-button"]');
  }
}
