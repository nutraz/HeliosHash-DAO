// Lightweight in-memory metrics tracker (non-production: resets on deploy)

class MetricsTracker {
  private startTime = Date.now();
  private activeUsers = new Set<string>();
  private lastCanisterCall: number | null = null;
  private requestCount = 0;
  private errorCount = 0;

  trackRequest() {
    this.requestCount++;
  }

  trackError() {
    this.errorCount++;
  }

  trackUserActivity(userId: string) {
    this.activeUsers.add(userId);
    if (this.activeUsers.size > 5000) {
      // Very naive cap to prevent unbounded growth in dev
      this.activeUsers.clear();
    }
  }

  trackCanisterCall() {
    this.lastCanisterCall = Date.now();
  }

  getMetrics() {
    const uptimeMs = Date.now() - this.startTime;
    return {
      uptimeMs,
      uptimeSeconds: Math.floor(uptimeMs / 1000),
      activeUsers24h: this.activeUsers.size,
      lastCanisterCall: this.lastCanisterCall,
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      errorRate: this.requestCount > 0 ? this.errorCount / this.requestCount : 0,
      errorRatePercent: this.requestCount > 0 ? (this.errorCount / this.requestCount) * 100 : 0,
    };
  }

  // TEST SUPPORT
  resetForTest() {
    this.startTime = Date.now();
    this.activeUsers.clear();
    this.lastCanisterCall = null;
    this.requestCount = 0;
    this.errorCount = 0;
  }
}

export const metrics = new MetricsTracker();

export type MetricsSnapshot = ReturnType<MetricsTracker['getMetrics']>;
