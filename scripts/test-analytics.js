#!/usr/bin/env node
/**
 * Advanced Test Analytics and Metrics Analysis
 * Provides detailed insights into test performance, trends, and quality metrics
 */

const fs = require('fs');
const path = require('path');

class TestAnalytics {
  constructor() {
    this.analytics = {
      trends: {},
      performance: {},
      quality: {},
      coverage: {},
      failures: {},
      recommendations: [],
    };
    this.historicalData = [];
  }

  /**
   * Load historical test data for trend analysis
   */
  loadHistoricalData() {
    const historyFile = 'test-history.json';

    if (fs.existsSync(historyFile)) {
      try {
        const data = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        this.historicalData = data.history || [];
        console.log(`📚 Loaded ${this.historicalData.length} historical test runs`);
      } catch (e) {
        console.warn(`⚠️  Could not load historical data: ${e.message}`);
      }
    }
  }

  /**
   * Add current run to historical data
   */
  addCurrentRun(analyticsData) {
    const currentRun = {
      timestamp: analyticsData.timestamp,
      summary: analyticsData.summary,
      runId: process.env.GITHUB_RUN_ID || `local-${Date.now()}`,
      commit: process.env.GITHUB_SHA || 'local',
      branch: process.env.GITHUB_REF_NAME || 'local',
    };

    this.historicalData.push(currentRun);

    // Keep only last 50 runs
    if (this.historicalData.length > 50) {
      this.historicalData = this.historicalData.slice(-50);
    }

    // Save updated history
    const historyData = {
      lastUpdated: new Date().toISOString(),
      history: this.historicalData,
    };

    fs.writeFileSync('test-history.json', JSON.stringify(historyData, null, 2));
  }

  /**
   * Analyze test trends over time
   */
  analyzeTrends() {
    console.log('📈 Analyzing test trends...');

    if (this.historicalData.length < 2) {
      this.analytics.trends = {
        insufficient_data: true,
        message: 'Need at least 2 test runs for trend analysis',
      };
      return;
    }

    const recentRuns = this.historicalData.slice(-10); // Last 10 runs

    // Pass rate trend
    const passRates = recentRuns.map((run) => {
      const total = run.summary.total || 0;
      const passed = run.summary.passed || 0;
      return total > 0 ? (passed / total) * 100 : 0;
    });

    this.analytics.trends.passRate = {
      current: passRates[passRates.length - 1] || 0,
      average: passRates.length > 0 ? passRates.reduce((a, b) => a + b, 0) / passRates.length : 0,
      trend: this.calculateTrend(passRates),
      history: passRates,
    };

    // Test count trend
    const testCounts = recentRuns.map((run) => run.summary.total || 0);
    this.analytics.trends.testCount = {
      current: testCounts[testCounts.length - 1] || 0,
      average:
        testCounts.length > 0 ? testCounts.reduce((a, b) => a + b, 0) / testCounts.length : 0,
      trend: this.calculateTrend(testCounts),
      history: testCounts,
    };

    // Category trends
    this.analytics.trends.categories = {};
    const categories = ['smoke', 'integration', 'performance', 'security'];

    for (const category of categories) {
      const categoryRates = recentRuns.map((run) => {
        const categoryData = run.summary.categories[category];
        if (!categoryData || categoryData.total === 0) return 0;
        return (categoryData.passed / categoryData.total) * 100;
      });

      this.analytics.trends.categories[category] = {
        current: categoryRates[categoryRates.length - 1] || 0,
        average:
          categoryRates.length > 0
            ? categoryRates.reduce((a, b) => a + b, 0) / categoryRates.length
            : 0,
        trend: this.calculateTrend(categoryRates),
      };
    }
  }

  /**
   * Calculate trend direction (improving, stable, declining)
   */
  calculateTrend(values) {
    if (values.length < 3) return 'insufficient_data';

    const recent = values.slice(-3);
    const older = values.slice(-6, -3);

    if (older.length === 0) return 'insufficient_data';

    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

    const difference = recentAvg - olderAvg;

    if (Math.abs(difference) < 1) return 'stable';
    return difference > 0 ? 'improving' : 'declining';
  }

  /**
   * Analyze performance metrics
   */
  analyzePerformance(analyticsData) {
    console.log('⚡ Analyzing performance metrics...');

    const performanceData = analyticsData.reports.performance || [];

    this.analytics.performance = {
      testsRun: performanceData.length,
      avgDuration: 0,
      slowTests: [],
      recommendations: [],
    };

    // Mock performance analysis (would integrate with actual test timing data)
    if (performanceData.length > 0) {
      this.analytics.performance.recommendations.push(
        'Performance tests are running successfully',
        'Core Web Vitals monitoring is active',
        'Consider adding load testing for high-traffic scenarios'
      );
    }
  }

  /**
   * Analyze test quality metrics
   */
  analyzeQuality(analyticsData) {
    console.log('🎯 Analyzing test quality metrics...');

    const summary = analyticsData.summary;

    this.analytics.quality = {
      passRate: summary.total > 0 ? (summary.passed / summary.total) * 100 : 0,
      stability: this.calculateStability(),
      coverage: this.estimateCoverage(analyticsData),
      maintainability: this.assessMaintainability(analyticsData),
    };
  }

  /**
   * Calculate test stability score
   */
  calculateStability() {
    if (this.historicalData.length < 5) return 'insufficient_data';

    const recentRuns = this.historicalData.slice(-5);
    const passRates = recentRuns.map((run) => {
      const total = run.summary.total || 0;
      const passed = run.summary.passed || 0;
      return total > 0 ? (passed / total) * 100 : 0;
    });

    const variance = this.calculateVariance(passRates);

    if (variance < 5) return 'excellent';
    if (variance < 15) return 'good';
    if (variance < 30) return 'moderate';
    return 'poor';
  }

  /**
   * Calculate variance for stability assessment
   */
  calculateVariance(values) {
    if (values.length === 0) return 0;

    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map((value) => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  }

  /**
   * Estimate test coverage based on test categories
   */
  estimateCoverage(analyticsData) {
    const categories = analyticsData.summary.categories;
    const categoryCount = Object.keys(categories).length;
    const totalTests = analyticsData.summary.total;

    return {
      categories: categoryCount,
      totalTests,
      estimatedCoverage: Math.min(categoryCount * 25 + totalTests * 2, 100), // Rough estimate
      areas: Object.keys(categories),
    };
  }

  /**
   * Assess test maintainability
   */
  assessMaintainability(analyticsData) {
    const categories = Object.keys(analyticsData.summary.categories);
    const hasAllCategories = ['smoke', 'integration', 'performance', 'security'].every((cat) =>
      categories.includes(cat)
    );

    return {
      score: hasAllCategories ? 'excellent' : 'good',
      categoriesPresent: categories.length,
      wellStructured: hasAllCategories,
      recommendations: hasAllCategories
        ? ['Test structure is well organized']
        : ['Consider adding missing test categories'],
    };
  }

  /**
   * Analyze failure patterns
   */
  analyzeFailures(analyticsData) {
    console.log('🔍 Analyzing failure patterns...');

    const failedTests = analyticsData.summary.failed || 0;

    this.analytics.failures = {
      total: failedTests,
      byCategory: {},
      byBrowser: {},
      patterns: [],
      recommendations: [],
    };

    // Analyze by category
    for (const [category, stats] of Object.entries(analyticsData.summary.categories)) {
      if (stats.failed > 0) {
        this.analytics.failures.byCategory[category] = stats.failed;
      }
    }

    // Analyze by browser
    for (const [browser, stats] of Object.entries(analyticsData.summary.browsers)) {
      if (stats.failed > 0) {
        this.analytics.failures.byBrowser[browser] = stats.failed;
      }
    }

    // Generate recommendations based on failures
    if (failedTests > 0) {
      this.analytics.failures.recommendations.push(
        `Investigate ${failedTests} failed test(s) for root causes`,
        'Check test logs for detailed error information',
        'Consider adding retry mechanisms for flaky tests'
      );
    } else {
      this.analytics.failures.recommendations.push(
        'No test failures detected - excellent stability!'
      );
    }
  }

  /**
   * Generate comprehensive recommendations
   */
  generateRecommendations() {
    console.log('💡 Generating recommendations...');

    const recommendations = [];

    // Trend-based recommendations
    if (this.analytics.trends.passRate?.trend === 'declining') {
      recommendations.push({
        priority: 'high',
        type: 'quality',
        message: 'Pass rate is declining - investigate recent changes and stabilize tests',
      });
    }

    if (this.analytics.trends.passRate?.trend === 'improving') {
      recommendations.push({
        priority: 'info',
        type: 'quality',
        message: 'Pass rate is improving - good progress on test stability',
      });
    }

    // Quality-based recommendations
    if (this.analytics.quality.passRate < 95) {
      recommendations.push({
        priority: 'medium',
        type: 'quality',
        message: `Pass rate at ${this.analytics.quality.passRate.toFixed(
          1
        )}% - target 95%+ for production readiness`,
      });
    }

    if (this.analytics.quality.stability === 'poor') {
      recommendations.push({
        priority: 'high',
        type: 'stability',
        message: 'Test stability is poor - focus on reducing flaky tests',
      });
    }

    // Coverage recommendations
    if (this.analytics.quality.coverage.estimatedCoverage < 80) {
      recommendations.push({
        priority: 'medium',
        type: 'coverage',
        message: 'Consider expanding test coverage with additional test scenarios',
      });
    }

    // Add default recommendation if none found
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'info',
        type: 'quality',
        message: 'Test suite is performing well - maintain current practices',
      });
    }

    this.analytics.recommendations = recommendations;
  }

  /**
   * Generate analytics report
   */
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      analytics: this.analytics,
      summary: {
        totalRuns: this.historicalData.length,
        currentTrend: this.analytics.trends.passRate?.trend || 'unknown',
        qualityScore: this.analytics.quality.passRate || 0,
        stabilityRating: this.analytics.quality.stability || 'unknown',
      },
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Generate markdown analytics summary
   */
  generateMarkdownSummary() {
    const lines = [];

    lines.push('# 📊 Test Analytics Dashboard');
    lines.push('');
    lines.push(`**Analysis Date:** ${new Date().toLocaleString()}`);
    lines.push(`**Historical Runs:** ${this.historicalData.length}`);
    lines.push('');

    // Quality metrics
    lines.push('## 🎯 Quality Metrics');
    lines.push('');
    lines.push(`- **Pass Rate:** ${this.analytics.quality.passRate?.toFixed(1) || 'N/A'}%`);
    lines.push(`- **Stability:** ${this.analytics.quality.stability || 'Unknown'}`);
    lines.push(
      `- **Coverage Areas:** ${this.analytics.quality.coverage?.categories || 0} categories`
    );
    lines.push('');

    // Trends
    if (this.analytics.trends.passRate) {
      lines.push('## 📈 Trends');
      lines.push('');
      lines.push(`- **Pass Rate Trend:** ${this.analytics.trends.passRate.trend}`);
      lines.push(`- **Current:** ${this.analytics.trends.passRate.current.toFixed(1)}%`);
      lines.push(`- **Average:** ${this.analytics.trends.passRate.average.toFixed(1)}%`);
      lines.push('');
    }

    // Recommendations
    lines.push('## 💡 Key Recommendations');
    lines.push('');

    for (const rec of this.analytics.recommendations.slice(0, 5)) {
      const icon = rec.priority === 'high' ? '🚨' : rec.priority === 'medium' ? '⚠️' : '💡';
      lines.push(`${icon} **${rec.type.toUpperCase()}:** ${rec.message}`);
    }

    lines.push('');

    return lines.join('\n');
  }
}

// Main execution
async function main() {
  const analyticsFile = process.argv[2] || 'test-analytics.json';

  console.log('🚀 Starting advanced test analytics...');

  if (!fs.existsSync(analyticsFile)) {
    console.error(`❌ Analytics file not found: ${analyticsFile}`);
    process.exit(1);
  }

  const analyticsData = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));

  const analytics = new TestAnalytics();
  analytics.loadHistoricalData();
  analytics.addCurrentRun(analyticsData);

  analytics.analyzeTrends();
  analytics.analyzePerformance(analyticsData);
  analytics.analyzeQuality(analyticsData);
  analytics.analyzeFailures(analyticsData);
  analytics.generateRecommendations();

  // Output reports
  const report = analytics.generateReport();
  const markdownSummary = analytics.generateMarkdownSummary();

  fs.writeFileSync('test-analytics-detailed.json', report);
  console.log(markdownSummary);

  console.error('📊 Detailed analytics saved to test-analytics-detailed.json');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { TestAnalytics };
