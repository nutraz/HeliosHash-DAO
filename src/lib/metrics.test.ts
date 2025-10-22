import { beforeEach, describe, expect, it } from 'vitest';
import { metrics } from './metrics';

// We rely on the test-only helper resetForTest we added.
declare module './metrics' {
  interface MetricsTracker {
    resetForTest(): void;
  }
}

describe('metrics', () => {
  beforeEach(() => {
    // @ts-ignore - test-only method
    metrics.resetForTest();
  });

  it('tracks user activity uniquely', () => {
    metrics.trackUserActivity('u1');
    metrics.trackUserActivity('u2');
    metrics.trackUserActivity('u1'); // duplicate shouldn't inflate
    const snap = metrics.getMetrics();
    expect(snap.activeUsers24h).toBe(2);
  });

  it('tracks request and error counts with percent', () => {
    metrics.trackRequest();
    metrics.trackRequest();
    metrics.trackError();
    const snap = metrics.getMetrics();
    expect(snap.requestCount).toBe(2);
    expect(snap.errorCount).toBe(1);
    expect(snap.errorRate).toBe(0.5);
    expect(snap.errorRatePercent).toBe(50);
  });

  it('tracks canister call timestamp', () => {
    expect(metrics.getMetrics().lastCanisterCall).toBeNull();
    metrics.trackCanisterCall();
    const after = metrics.getMetrics();
    expect(after.lastCanisterCall).not.toBeNull();
  });

  it('provides monotonic uptime', async () => {
    const first = metrics.getMetrics().uptimeMs;
    await new Promise((r) => setTimeout(r, 10));
    const second = metrics.getMetrics().uptimeMs;
    expect(second).toBeGreaterThanOrEqual(first);
  });
});
