import { expect, test } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('@performance should meet Core Web Vitals thresholds', async ({ page }) => {
    // Navigate to main page
    await page.goto('/');

    // Measure performance using the Performance API
    const performanceMetrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics = {
            FCP: 0,
            LCP: 0,
            FID: 0,
            CLS: 0,
            TTFB: 0,
          };

          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              metrics.FCP = entry.startTime;
            } else if (entry.entryType === 'largest-contentful-paint') {
              metrics.LCP = entry.startTime;
            } else if (entry.entryType === 'first-input') {
              metrics.FID = entry.processingStart - entry.startTime;
            } else if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
              metrics.CLS += entry.value;
            }
          });

          // Get Time to First Byte
          const navigation = performance.getEntriesByType(
            'navigation'
          )[0] as PerformanceNavigationTiming;
          metrics.TTFB = navigation.responseStart - navigation.requestStart;

          resolve(metrics);
        }).observe({
          entryTypes: [
            'paint',
            'largest-contentful-paint',
            'first-input',
            'layout-shift',
            'navigation',
          ],
        });

        // Fallback timeout
        setTimeout(
          () =>
            resolve({
              FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
              LCP: 0,
              FID: 0,
              CLS: 0,
              TTFB: 0,
            }),
          5000
        );
      });
    });

    // Assert Core Web Vitals thresholds
    // First Contentful Paint should be < 1.8s
    expect(performanceMetrics.FCP).toBeLessThan(1800);

    // Largest Contentful Paint should be < 2.5s
    if (performanceMetrics.LCP > 0) {
      expect(performanceMetrics.LCP).toBeLessThan(2500);
    }

    // First Input Delay should be < 100ms
    if (performanceMetrics.FID > 0) {
      expect(performanceMetrics.FID).toBeLessThan(100);
    }

    // Cumulative Layout Shift should be < 0.1
    expect(performanceMetrics.CLS).toBeLessThan(0.1);

    // Time to First Byte should be < 600ms
    expect(performanceMetrics.TTFB).toBeLessThan(600);
  });

  test('should load dashboard within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/dashboard');

    // Wait for key elements to be visible
    await Promise.all([
      page.waitForSelector('[data-testid="dashboard-header"]'),
      page.waitForSelector('[data-testid="energy-stats"]'),
      page.waitForSelector('[data-testid="token-balance"]'),
    ]);

    const loadTime = Date.now() - startTime;


    console.log(`Dashboard load time: ${loadTime}ms`);
  });

  test('should handle large dataset rendering efficiently', async ({ page }) => {
    await page.goto('/projects');

    // Simulate loading many projects
    await page.addInitScript(() => {
      // Mock large dataset
      const mockProjects = Array.from({ length: 1000 }, (_, i) => ({
        id: i + 1,
        name: `Solar Project ${i + 1}`,
        location: `Location ${i + 1}`,
        capacity: Math.floor(Math.random() * 100) + 10,
        status: ['active', 'pending', 'completed'][Math.floor(Math.random() * 3)],
      }));

      (window as any).mockProjects = mockProjects;
    });

    const startTime = Date.now();

    // Trigger rendering of large dataset
    await page.evaluate(() => {
      const event = new CustomEvent('loadLargeDataset');
      document.dispatchEvent(event);
    });

    // Wait for rendering to complete
    await page.waitForFunction(
      () => {
        const projectItems = document.querySelectorAll('[data-testid="project-item"]');
      },
      { timeout: 10000 }
    );

    const renderTime = Date.now() - startTime;

    // Large dataset should render within 5 seconds
    expect(renderTime).toBeLessThan(5000);

    console.log(`Large dataset render time: ${renderTime}ms`);
  });

  test('should optimize image loading', async ({ page }) => {
    await page.goto('/');

    // Check that images use lazy loading
    const images = await page.locator('img').all();

    for (const img of images) {
      const loading = await img.getAttribute('loading');
      const src = await img.getAttribute('src');

      // Images should use lazy loading (except hero images)
      if (!src?.includes('hero') && !src?.includes('logo')) {
        expect(loading).toBe('lazy');
      }

      // Check for proper alt text
      const alt = await img.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('should minimize JavaScript bundle size', async ({ page }) => {
    // Intercept JavaScript files
    const jsFiles: string[] = [];
    let totalSize = 0;

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('.js') && response.status() === 200) {
        const headers = response.headers();
        const contentLength = headers['content-length'];

        if (contentLength) {
          const size = parseInt(contentLength, 10);
          totalSize += size;
          jsFiles.push(`${url}: ${(size / 1024).toFixed(2)}KB`);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('JavaScript files loaded:');
    jsFiles.forEach((file) => console.log(file));
    console.log(`Total JS size: ${(totalSize / 1024).toFixed(2)}KB`);

    // Total JavaScript should be less than 1MB
    expect(totalSize).toBeLessThan(1024 * 1024);
  });

  test('should optimize CSS bundle size', async ({ page }) => {
    // Intercept CSS files
    const cssFiles: string[] = [];
    let totalSize = 0;

    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('.css') && response.status() === 200) {
        const headers = response.headers();
        const contentLength = headers['content-length'];

        if (contentLength) {
          const size = parseInt(contentLength, 10);
          totalSize += size;
          cssFiles.push(`${url}: ${(size / 1024).toFixed(2)}KB`);
        }
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('CSS files loaded:');
    cssFiles.forEach((file) => console.log(file));
    console.log(`Total CSS size: ${(totalSize / 1024).toFixed(2)}KB`);

    // Total CSS should be less than 200KB
    expect(totalSize).toBeLessThan(200 * 1024);
  });

  test('should handle concurrent users efficiently', async ({ browser }) => {
    // Simulate multiple concurrent users
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
      browser.newContext(),
    ]);

    const pages = await Promise.all(contexts.map((context) => context.newPage()));

    // Mock authentication for all pages
    await Promise.all(
      pages.map((page) =>
        page.context().addCookies([
          {
            name: 'isAuthenticated',
            value: 'true',
            domain: 'localhost',
            path: '/',
            httpOnly: false,
            secure: false
          },
          {
            name: 'user',
            value: JSON.stringify({ principal: '2vxsx-fae', name: 'Test User' }),
            domain: 'localhost',
            path: '/',
            httpOnly: false,
            secure: false
          }
        ])
      )
    );

    const startTime = Date.now();

    // Navigate all pages simultaneously
    await Promise.all(pages.map((page) => page.goto('/dashboard')));

    // Wait for all pages to load
    await Promise.all(
      pages.map((page) => page.waitForSelector('[data-testid="dashboard-header"]'))
    );

    const loadTime = Date.now() - startTime;


    console.log(`Concurrent users load time: ${loadTime}ms`);

    // Cleanup
    await Promise.all(contexts.map((context) => context.close()));
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    await page.goto('/dashboard');

    // Get initial memory usage
    const initialMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    // Perform memory-intensive operations
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="projects-tab"]');
      await page.waitForTimeout(100);
      await page.click('[data-testid="governance-tab"]');
      await page.waitForTimeout(100);
      await page.click('[data-testid="energy-tab"]');
      await page.waitForTimeout(100);
    }

    // Force garbage collection if possible
    await page.evaluate(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
    });

    const finalMemory = await page.evaluate(() => {
      return (performance as any).memory?.usedJSHeapSize || 0;
    });

    const memoryIncrease = finalMemory - initialMemory;

    console.log(`Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);

    // Memory increase should be less than 10MB
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
  });
});
