import { test, expect } from '@playwright/test';

test('debug page loading', async ({ page }) => {
  console.log('Starting debug test...');
  
  // Listen for console messages
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  // Go to the page
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  
  // Wait a bit for React to load
  await page.waitForTimeout(5000);
  
  // Take a screenshot
  await page.screenshot({ path: 'debug-page.png' });
  
  // Check the page title
  console.log('Page title:', await page.title());
  
  // Check page content
  const content = await page.content();
  console.log('Page contains Connect Wallet button:', content.includes('Connect Wallet'));
  console.log('Page contains data-testid:', content.includes('data-testid'));
  console.log('Page contains React root:', content.includes('id="root"'));
  
  // Check for script tags
  const scripts = await page.$$eval('script', scripts => scripts.map(s => s.src));
  console.log('Script tags:', scripts);
  
  // Check if React has mounted by looking for any React components
  const hasReactContent = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root && root.children.length > 0 && !root.innerHTML.includes('Fallback:');
  });
  console.log('React has mounted:', hasReactContent);
  
  // Check for any JavaScript errors in the page
  const jsErrors = await page.evaluate(() => {
    return (window as any).jsErrors || [];
  });
  console.log('JS Errors:', jsErrors);
});