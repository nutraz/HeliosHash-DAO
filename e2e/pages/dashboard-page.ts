import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }

  async navigateToProjects() {
    await this.page.click('[data-testid="projects-nav"]');
  }

  async navigateToGovernance() {
    await this.page.click('[data-testid="governance-nav"]');
  }

  async navigateToEnergy() {
    await this.page.click('[data-testid="energy-nav"]');
  }

  async navigateToWallet() {
    await this.page.click('[data-testid="wallet-nav"]');
  }

  async navigateToCommunity() {
    await this.page.click('[data-testid="community-nav"]');
  }

  async getEnergyStats() {
    return await this.page.locator('[data-testid="energy-stats"]').textContent();
  }

  async getTokenBalance() {
    return await this.page.locator('[data-testid="token-balance"]').textContent();
  }

  async getUserProfile() {
    return await this.page.locator('[data-testid="user-profile"]').textContent();
  }

  async logout() {
    await this.page.click('[data-testid="logout-button"]');
  }
}
