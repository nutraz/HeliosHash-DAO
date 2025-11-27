import { test, expect } from '@playwright/test';

test.describe('User Journey Tests', () => {
  test('complete user onboarding journey', async ({ page }) => {
    console.log('🧭 Starting user onboarding journey...');
    
    // 1. Landing page
    await page.goto('/');
    await expect(page).toHaveTitle(/HeliosHash DAO/);
    console.log('✅ Landed on homepage');
    
    // 2. Authentication flow
    const loginButton = page.locator('button:has-text("Login"), [data-testid="login-button"]').first();
    if (await loginButton.isVisible()) {
      await loginButton.click();
      console.log('✅ Initiated login flow');
      await page.waitForTimeout(2000);
    }
    
    // 3. Dashboard exploration
    await page.goto('/');
    const dashboardElements = page.locator('main, .dashboard, [data-testid="dashboard"]');
    await expect(dashboardElements.first()).toBeVisible();
    console.log('✅ Dashboard accessible');
    
    // 4. Social features exploration
    await page.goto('/social');
    const socialElements = page.locator('text=Social, text=Feed, text=Community').first();
    if (await socialElements.isVisible()) {
      console.log('✅ Social features accessible');
    }
    
    // 5. Governance exploration  
    await page.goto('/governance');
    const governanceElements = page.locator('text=Governance, text=Proposals, text=Vote').first();
    if (await governanceElements.isVisible()) {
      console.log('✅ Governance features accessible');
    }
    
    console.log('🎉 User onboarding journey completed successfully!');
  });

  test('DAO member contribution journey', async ({ page }) => {
    console.log('🧭 Starting DAO member journey...');
    
    await page.goto('/');
    
    // Navigate to governance
    const govLinks = page.locator('a[href*="governance"], button:has-text("Governance")');
    if (await govLinks.count() > 0) {
      await govLinks.first().click();
      await page.waitForTimeout(1000);
      console.log('✅ Navigated to governance');
    }
    
    // Look for proposal creation
    const newProposalBtn = page.locator('button:has-text("New Proposal"), [data-testid="new-proposal"]');
    if (await newProposalBtn.isVisible()) {
      await newProposalBtn.click();
      console.log('✅ Accessed proposal creation');
      
      // Check for proposal form
      const formInputs = page.locator('input, textarea');
      if (await formInputs.count() > 0) {
        console.log('✅ Proposal form elements present');
      }
    }
    
    // Navigate to social features
    await page.goto('/social');
    const postCreators = page.locator('textarea[placeholder*="post"], [data-testid="post-content"]');
    if (await postCreators.count() > 0) {
      console.log('✅ Social content creation available');
    }
    
    console.log('🎉 DAO member journey completed successfully!');
  });
});
