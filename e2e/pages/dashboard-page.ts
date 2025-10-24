import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/dashboard');
  }

  async navigateToProjects() {
<<<<<<< HEAD
    await this.page.click('[data-testid="projects-nav"]');
  }

  async navigateToGovernance() {
    await this.page.click('[data-testid="governance-nav"]');
  }

  async navigateToEnergy() {
    await this.page.click('[data-testid="energy-nav"]');
=======
    await this.page.click('[data-testid="projects-tab"]');
  }

  async navigateToGovernance() {
    await this.page.click('[data-testid="governance-tab"]');
  }

  async navigateToEnergy() {
    await this.page.click('[data-testid="energy-dashboard"]');
>>>>>>> audit-clean
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
