import { expect, test } from '@playwright/test';

// Basic contract test for /api/status endpoint
// Ensures required structural fields remain stable.

test.describe('Status Endpoint', () => {
  test('returns expected structure', async ({ request }) => {
    const response = await request.get('/api/status');
    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    // Top-level required keys
    for (const key of ['status', 'timestamp', 'build', 'version', 'metrics']) {
      expect(data, `missing top-level key: ${key}`).toHaveProperty(key);
    }

    // Version structure
    expect(data.version).toHaveProperty('app');
    expect(data.version).toHaveProperty('canisters');

    // Build structure
    for (const key of ['commit', 'branch', 'timestamp']) {
      expect(data.build, `missing build key: ${key}`).toHaveProperty(key);
    }

    // Metrics structure (subset)
    for (const key of [
      'uptimeMs',
      'uptimeSeconds',
      'activeUsers24h',
      'requestCount',
      'errorRate',
    ]) {
      expect(data.metrics, `missing metrics key: ${key}`).toHaveProperty(key);
    }

    // Sanity checks on value types
    expect(typeof data.timestamp).toBe('number');
    expect(typeof data.metrics.uptimeMs).toBe('number');
    expect(typeof data.metrics.requestCount).toBe('number');
  });
});
