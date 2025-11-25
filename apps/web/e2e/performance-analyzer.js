const testResults = {
  'social-hub.spec.ts': {
    'should display social navigation elements': 19300,
    'should check for user profile elements': 1900,
    'should test social content creation': 1600
  },
  'user-journeys.spec.ts': {
    'complete user onboarding journey': 22300,
    'DAO member contribution journey': 'unknown' // This test didn't run
  }
};

console.log('🔍 E2E TEST PERFORMANCE ANALYSIS');
console.log('================================\n');

// Identify slow tests
const slowTests = [];
Object.entries(testResults).forEach(([file, tests]) => {
  Object.entries(tests).forEach(([testName, duration]) => {
    if (duration > 5000) { // Tests over 5 seconds are slow
      slowTests.push({ file, testName, duration: `${duration / 1000}s` });
    }
  });
});

console.log('🐌 SLOW TESTS (needs optimization):');
slowTests.forEach(test => {
  console.log(`  ❌ ${test.file}: ${test.testName} - ${test.duration}`);
});

console.log('\n🚀 FAST TESTS (well optimized):');
Object.entries(testResults).forEach(([file, tests]) => {
  Object.entries(tests).forEach(([testName, duration]) => {
    if (duration <= 5000) {
      console.log(`  ✅ ${testName} - ${duration / 1000}s`);
    }
  });
});

console.log('\n💡 PERFORMANCE RECOMMENDATIONS:');
console.log('  1. Add longer timeouts for navigation tests');
console.log('  2. Use waitForSelector instead of generic waits');
console.log('  3. Optimize page navigation patterns');
console.log('  4. Check for infinite loops or heavy operations');
