import { Locator, Page } from '@playwright/test';

export class UPIPaymentPage {
  readonly page: Page;
  readonly amountInput: Locator;
  readonly continueButton: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly aadhaarInput: Locator;
  readonly panInput: Locator;
  readonly proceedButton: Locator;
  readonly payButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.amountInput = page.locator('[data-testid="amount-input"]');
    this.continueButton = page.locator('[data-testid="continue-to-kyc"]');
    this.nameInput = page.locator('[data-testid="name-input"]');
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.phoneInput = page.locator('[data-testid="phone-input"]');
    this.aadhaarInput = page.locator('[data-testid="aadhaar-input"]');
    this.panInput = page.locator('[data-testid="pan-input"]');
    this.proceedButton = page.locator('[data-testid="proceed-to-payment"]');
    this.payButton = page.locator('[data-testid="pay-with-upi"]');
  }

  async goto() {
    await this.page.goto('/payment/upi');
  }

  async enterAmount(amount: string) {
    await this.amountInput.fill(amount);
  }

  async continueToKYC() {
    await this.continueButton.click();
  }

  async fillKYCDetails(user: {
    name: string;
    email: string;
    phone: string;
    aadhaar?: string;
    pan?: string;
  }) {
    await this.nameInput.fill(user.name);
    await this.emailInput.fill(user.email);
    await this.phoneInput.fill(user.phone);

    if (user.aadhaar) {
      await this.aadhaarInput.fill(user.aadhaar);
    }

    if (user.pan) {
      await this.panInput.fill(user.pan);
    }
  }

  async proceedToPayment() {
    await this.proceedButton.click();
  }

  async payWithUPI() {
    await this.payButton.click();
  }
}

export class DashboardPage {
  readonly page: Page;
  readonly projectsTab: Locator;
  readonly governanceTab: Locator;
  readonly energyTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectsTab = page.locator('[data-testid="projects-tab"]');
    this.governanceTab = page.locator('[data-testid="governance-tab"]');
    this.energyTab = page.locator('[data-testid="energy-tab"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async navigateToProjects() {
    await this.projectsTab.click();
  }

  async navigateToGovernance() {
    await this.governanceTab.click();
  }

  async navigateToEnergy() {
    await this.energyTab.click();
  }
}

export class AuthPage {
  readonly page: Page;
  readonly connectWalletButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.connectWalletButton = page.locator('[data-testid="connect-wallet"]');
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async connectWallet() {
    await this.connectWalletButton.click();
  }
}
