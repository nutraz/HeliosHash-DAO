const fs = require('fs');
const path = require('path');

class TestMonitor {
  constructor() {
    this.historyFile = 'test-results/test-history.json';
    this.loadHistory();
  }

  loadHistory() {
    try {
      this.history = fs.existsSync(this.historyFile) 
        ? JSON.parse(fs.readFileSync(this.historyFile, 'utf8'))
        : { runs: [] };
    } catch (error) {
      this.history = { runs: [] };
    }
  }

  saveCurrentRun(results) {
    const run = {
      timestamp: new Date().toISOString(),
      totalTests: results.totalTests,
      duration: results.duration,
      successRate: results.successRate,
      performance: results.performance
    };

    this.history.runs.push(run);
    
    // Keep only last 100 runs
    if (this.history.runs.length > 100) {
      this.history.runs = this.history.runs.slice(-100);
    }

    fs.writeFileSync(this.historyFile, JSON.stringify(this.history, null, 2));
    return run;
  }

  generateTrends() {
    if (this.history.runs.length < 2) return null;

    const recent = this.history.runs.slice(-5);
    const older = this.history.runs.slice(-10, -5);

    const recentAvg = recent.reduce((sum, run) => sum + parseFloat(run.duration), 0) / recent.length;
    const olderAvg = older.reduce((sum, run) => sum + parseFloat(run.duration), 0) / older.length;

    return {
      durationTrend: recentAvg < olderAvg ? 'improving' : 'stable',
      stability: recent.every(run => run.successRate === '100%') ? 'excellent' : 'good'
    };
  }

  printDashboard() {
    console.log('📈 HELIOSHASH DAO TEST MONITORING DASHBOARD');
    console.log('===========================================\n');

    if (this.history.runs.length === 0) {
      console.log('No test history available. Run tests to see analytics.');
      return;
    }

    const latestRun = this.history.runs[this.history.runs.length - 1];
    const trends = this.generateTrends();

    console.log('📊 LATEST RUN');
    console.log('─────────────');
    console.log(`Date: ${new Date(latestRun.timestamp).toLocaleString()}`);
    console.log(`Tests: ${latestRun.totalTests}`);
    console.log(`Duration: ${latestRun.duration}`);
    console.log(`Success Rate: ${latestRun.successRate}`);

    if (trends) {
      console.log('\n📈 TRENDS');
      console.log('─────────');
      console.log(`Performance: ${trends.durationTrend}`);
      console.log(`Stability: ${trends.stability}`);
    }

    console.log('\n📅 RECENT HISTORY');
    console.log('────────────────');
    const recentRuns = this.history.runs.slice(-5).reverse();
    recentRuns.forEach((run, index) => {
      const date = new Date(run.timestamp).toLocaleDateString();
      console.log(`${index + 1}. ${date} - ${run.totalTests} tests - ${run.duration} - ${run.successRate}`);
    });

    console.log(`\nTotal runs recorded: ${this.history.runs.length}`);
  }
}

// Example usage
const monitor = new TestMonitor();

// Simulate current run results
const currentResults = {
  totalTests: 26,
  duration: '22.6s',
  successRate: '100%',
  performance: 'A+'
};

monitor.saveCurrentRun(currentResults);
monitor.printDashboard();
