import { test, expect } from '@playwright/test';

test.describe('Component-Specific Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should test HeliosHash specific components', async ({ page }) => {
    // Test for HeliosHash brand elements
    const brandSelectors = [
      'text=HeliosHash',
      'text=HHDAO',
      'text=DAO',
      '[alt*="helioshash"]',
      '[src*="helioshash"]',
      '.logo',
      '[data-testid*="logo"]'
    ];

    for (const selector of brandSelectors) {
      const elements = page.locator(selector);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found brand element: ${selector}`);
        await page.screenshot({ path: `test-results/brand-${selector.replace(/[^a-zA-Z0-9]/g, '-')}.png` });
      }
    }
  });

  test('should test main layout components', async ({ page }) => {
    // Check for common layout patterns
    const layoutComponents = [
      'header',
      'main',
      'footer',
      'nav',
      'aside',
      'section',
      'article'
    ];

    for (const component of layoutComponents) {
      const elements = page.locator(component);
      const count = await elements.count();
      if (count > 0) {
        console.log(`✅ Found ${component}: ${count} elements`);
        
        // Test visibility and basic properties
        const firstElement = elements.first();
        await expect(firstElement).toBeVisible();
        
        const boundingBox = await firstElement.boundingBox();
        if (boundingBox) {
          console.log(`  📐 ${component} size: ${boundingBox.width}x${boundingBox.height}`);
        }
      }
    }
  });

  test('should test interactive elements', async ({ page }) => {
    // Test all buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    console.log(`🔘 Found ${buttonCount} buttons on page`);
    
    for (let i = 0; i < Math.min(buttonCount, 10); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      const isEnabled = await button.isEnabled();
      
      console.log(`  Button ${i + 1}: "${text?.substring(0, 30)}" | Visible: ${isVisible} | Enabled: ${isEnabled}`);
      
      if (isVisible && isEnabled && text && !text.includes('⚠️')) {
        // Test click on safe buttons
        try {
          await button.click();
          await page.waitForTimeout(500);
          console.log(`  ✅ Clicked: "${text.substring(0, 20)}..."`);
          
          // Go back to homepage for next test
          await page.goto('/');
        } catch (error) {
          console.log(`  ⚠️ Could not click: "${text.substring(0, 20)}..."`);
        }
      }
    }
  });

  test('should test form inputs and controls', async ({ page }) => {
    const inputTypes = [
      'input',
      'textarea',
      'select',
      '[contenteditable="true"]',
      '[role="textbox"]'
    ];

    for (const inputType of inputTypes) {
      const elements = page.locator(inputType);
      const count = await elements.count();
      if (count > 0) {
        console.log(`📝 Found ${count} ${inputType} elements`);
        
        // Test first element of each type
        const firstElement = elements.first();
        if (await firstElement.isVisible() && await firstElement.isEnabled()) {
          const inputType = await firstElement.getAttribute('type');
          const placeholder = await firstElement.getAttribute('placeholder');
          
          console.log(`  First ${inputType}: placeholder="${placeholder}"`);
          
          // Try to fill text inputs
          if (inputType !== 'submit' && inputType !== 'button') {
            await firstElement.fill('Test input from E2E');
            await page.waitForTimeout(200);
            
            const value = await firstElement.inputValue();
            console.log(`  ✅ Can input text: "${value.substring(0, 20)}..."`);
          }
        }
      }
    }
  });
});
