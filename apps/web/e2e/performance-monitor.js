const fs = require('fs');

class PerformanceMonitor {
  constructor() {
    this.baseline = {
      'social-hub.spec.ts': 19300,
      'user-journeys.spec.ts': 22300
    };
  }

  analyzeCurrentRun(results) {
    console.log('📈 PERFORMANCE MONITORING REPORT');
    console.log('================================\n');

    const issues = [];

    Object.entries(results).forEach(([testFile, duration]) => {
      const baseline = this.baseline[testFile];
      
      if (baseline) {
        const percentChange = ((duration - baseline) / baseline) * 100;
        
        if (percentChange > 50) {
          issues.push({
            test: testFile,
            baseline: `${(baseline / 1000).toFixed(1)}s`,
            current: `${(duration / 1000).toFixed(1)}s`,
            change: `+${percentChange.toFixed(1)}%`,
            severity: 'HIGH'
          });
        } else if (percentChange > 20) {
          issues.push({
            test: testFile,
            baseline: `${(baseline / 1000).toFixed(1)}s`,
            current: `${(duration / 1000).toFixed(1)}s`,
            change: `+${percentChange.toFixed(1)}%`,
            severity: 'MEDIUM'
          });
        }
      }
    });

    if (issues.length > 0) {
      console.log('🚨 PERFORMANCE REGRESSIONS DETECTED:');
      issues.forEach(issue => {
        console.log(`  ${issue.severity === 'HIGH' ? '🔴' : '🟡'} ${issue.test}`);
        console.log(`     Baseline: ${issue.baseline}, Current: ${issue.current} (${issue.change})`);
      });
    } else {
      console.log('✅ All tests within performance thresholds');
    }

    return issues;
  }
}

// Example usage
const monitor = new PerformanceMonitor();
const currentResults = {
  'social-hub.spec.ts': 19300,
  'user-journeys.spec.ts': 22300
};

monitor.analyzeCurrentRun(currentResults);
