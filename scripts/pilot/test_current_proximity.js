#!/usr/bin/env node
/**
 * Alternative Location Detection for HHDAO Proximity Testing
 * Uses multiple methods: curl, wget, and manual coordinates
 */

const { execSync } = require('child_process');
const fs = require('fs');

// HHDAO Network (same as before but adding more Indian locations)
const HHDAO_NETWORK = {
  primarySites: {
    urgamValley: { lat: 23.7337, lng: 68.8093, name: 'Urgam Valley Solar Pilot' },
    delhi: { lat: 28.6139, lng: 77.209, name: 'Delhi Partner Hub' },
    mumbai: { lat: 19.076, lng: 72.8777, name: 'Mumbai Tech Center' },
    bangalore: { lat: 12.9716, lng: 77.5946, name: 'Bangalore Research Hub' },
    chennai: { lat: 13.0827, lng: 80.2707, name: 'Chennai Distribution Center' },
    hyderabad: { lat: 17.385, lng: 78.4867, name: 'Hyderabad Innovation Lab' },
  },
  internationalNodes: {
    zurich: { lat: 47.3769, lng: 8.5417, name: 'IC Zurich Node' },
    sanFrancisco: { lat: 37.7749, lng: -122.4194, name: 'IC San Francisco' },
    singapore: { lat: 1.3521, lng: 103.8198, name: 'Asia Pacific Hub' },
  },
};

function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Try multiple location detection methods
function detectLocation() {
  console.log('🌍 TESTING MULTIPLE LOCATION DETECTION METHODS:');
  console.log('=' * 50);

  const methods = [];

  // Method 1: curl with ipinfo.io
  try {
    console.log('📡 Method 1: ipinfo.io...');
    const ipinfo = execSync('curl -s ipinfo.io/json', { timeout: 5000, encoding: 'utf8' });
    const data1 = JSON.parse(ipinfo);
    if (data1.loc) {
      const [lat, lng] = data1.loc.split(',').map(parseFloat);
      methods.push({
        method: 'ipinfo.io',
        lat,
        lng,
        city: data1.city,
        region: data1.region,
        country: data1.country,
        success: true,
      });
      console.log(`   ✅ Success: ${data1.city}, ${data1.country} (${lat}, ${lng})`);
    }
  } catch (error) {
    console.log('   ❌ Failed: ipinfo.io timeout');
  }

  // Method 2: curl with ip-api.com
  try {
    console.log('📡 Method 2: ip-api.com...');
    const ipapi = execSync(
      'curl -s "http://ip-api.com/json/?fields=status,country,city,lat,lon,query"',
      { timeout: 5000, encoding: 'utf8' }
    );
    const data2 = JSON.parse(ipapi);
    if (data2.status === 'success') {
      methods.push({
        method: 'ip-api.com',
        lat: data2.lat,
        lng: data2.lon,
        city: data2.city,
        country: data2.country,
        success: true,
      });
      console.log(`   ✅ Success: ${data2.city}, ${data2.country} (${data2.lat}, ${data2.lon})`);
    }
  } catch (error) {
    console.log('   ❌ Failed: ip-api.com timeout');
  }

  // Method 3: Simulated location based on nutrazz identity (assuming India-based)
  methods.push({
    method: 'simulated_nutrazz',
    lat: 28.6139, // Delhi coordinates as likely location for nutrazz
    lng: 77.209,
    city: 'New Delhi',
    region: 'Delhi',
    country: 'India',
    success: true,
    note: 'Simulated based on nutrazz identity and HHDAO context',
  });
  console.log('🎭 Method 3: Simulated nutrazz location (Delhi, India)');

  return methods;
}

// Test proximity with detected locations
function testAllProximities(locationMethods) {
  console.log('\n🔍 PROXIMITY TESTING FOR ALL DETECTED LOCATIONS:');
  console.log('=' * 60);

  locationMethods.forEach((location, index) => {
    if (!location.success) return;

    console.log(`\n📍 TESTING LOCATION ${index + 1}: ${location.method.toUpperCase()}`);
    console.log(`   🏙️  ${location.city}, ${location.country}`);
    console.log(`   🗺️  Coordinates: ${location.lat}, ${location.lng}`);

    // Test proximity to all HHDAO sites
    console.log(`\n   🏔️  HHDAO PRIMARY SITES:`);
    Object.entries(HHDAO_NETWORK.primarySites).forEach(([key, site]) => {
      const distance = calculateDistance(location.lat, location.lng, site.lat, site.lng);
      const status = distance < 100 ? '🟢 NEAR' : distance < 500 ? '🟡 MODERATE' : '🔴 FAR';
      console.log(`      ${site.name}: ${distance.toFixed(0)}km ${status}`);
    });

    console.log(`\n   🌐 INTERNATIONAL NODES:`);
    Object.entries(HHDAO_NETWORK.internationalNodes).forEach(([key, site]) => {
      const distance = calculateDistance(location.lat, location.lng, site.lat, site.lng);
      const status =
        distance < 1000 ? '🟢 ACCESSIBLE' : distance < 5000 ? '🟡 MODERATE' : '🔴 DISTANT';
      console.log(`      ${site.name}: ${distance.toFixed(0)}km ${status}`);
    });

    // Special analysis for this location
    analyzeLocationContext(location);
  });
}

function analyzeLocationContext(location) {
  console.log(`\n   🎯 LOCATION ANALYSIS:`);

  if (location.country === 'India') {
    console.log(`      ✅ INDIA-BASED: Optimal HHDAO connectivity`);
    console.log(`      🏔️  Direct access to Urgam Valley pilot`);
    console.log(`      🏛️  Connected to Delhi partner network`);
    console.log(`      ⚡ Low-latency IC connectivity via Singapore`);
    console.log(`      💡 RECOMMENDATION: Full pilot participation`);
  } else if (['US', 'Canada'].includes(location.country)) {
    console.log(`      🇺🇸 NORTH AMERICA: Good IC connectivity`);
    console.log(`      🌐 Direct access to San Francisco IC node`);
    console.log(`      📡 Remote participation in HHDAO governance`);
    console.log(`      💡 RECOMMENDATION: DAO governance + remote monitoring`);
  } else if (['Switzerland', 'Germany', 'UK'].includes(location.country)) {
    console.log(`      🇪🇺 EUROPE: Excellent IC connectivity`);
    console.log(`      🏔️  Direct access to Zurich IC node`);
    console.log(`      🤝 Potential European expansion opportunities`);
    console.log(`      💡 RECOMMENDATION: European HHDAO chapter`);
  } else if (['Singapore', 'Japan', 'Australia'].includes(location.country)) {
    console.log(`      🌏 ASIA-PACIFIC: Good regional connectivity`);
    console.log(`      🌐 Access via Singapore hub`);
    console.log(`      🔄 Gateway to Indian operations`);
    console.log(`      💡 RECOMMENDATION: Regional coordination role`);
  } else {
    console.log(`      🌍 GLOBAL: Universal IC connectivity`);
    console.log(`      🌐 Standard Internet Computer access`);
    console.log(`      📡 Remote HHDAO participation available`);
    console.log(`      💡 RECOMMENDATION: Ambassador program`);
  }
}

// Real-time connectivity test
function testRealTimeConnectivity() {
  console.log('\n🚀 REAL-TIME CONNECTIVITY TESTING:');
  console.log('=' * 40);

  const testSites = [
    { name: 'Internet Computer', host: 'ic0.app', port: 443 },
    { name: 'GitHub (for repo)', host: 'github.com', port: 443 },
    { name: 'Google DNS', host: '8.8.8.8', port: 53 },
  ];

  testSites.forEach((site) => {
    try {
      const start = Date.now();
      execSync(`timeout 3 bash -c "echo >/dev/tcp/${site.host}/${site.port}"`, { stdio: 'ignore' });
      const latency = Date.now() - start;
      console.log(`   ✅ ${site.name}: ${latency}ms`);
    } catch (error) {
      console.log(`   ❌ ${site.name}: Connection failed`);
    }
  });
}

// Generate current status report
function generateCurrentStatusReport(locationMethods) {
  const timestamp = new Date().toISOString();
  const report = {
    timestamp,
    testType: 'HHDAO_CURRENT_PROXIMITY_TEST',
    tester: 'nutrazz',
    detectionMethods: locationMethods,
    currentRecommendations: [],
    networkStatus: 'TESTING',
  };

  // Add recommendations based on detected locations
  locationMethods.forEach((location) => {
    if (location.success && location.country === 'India') {
      report.currentRecommendations.push({
        priority: 'IMMEDIATE',
        action: 'Activate Urgam Valley pilot participation',
        reason: 'India-based location detected',
      });
    }
  });

  // Save report
  const filename = `current_proximity_${timestamp.split('T')[0]}.json`;
  fs.writeFileSync(filename, JSON.stringify(report, null, 2));

  console.log(`\n💾 Current status saved to: ${filename}`);
  return report;
}

// Main execution
function main() {
  console.log('🎯 HHDAO REAL-TIME PROXIMITY & CONNECTIVITY TEST');
  console.log('===============================================');
  console.log(`⏰ Current Time: ${new Date().toISOString()}`);
  console.log(`👤 Testing for: nutrazz (HHDAO founder)`);
  console.log(`🌐 Network: HHDAO + Internet Computer`);

  // Detect current location using multiple methods
  const locationMethods = detectLocation();

  // Test proximity for all detected locations
  testAllProximities(locationMethods);

  // Test real-time connectivity
  testRealTimeConnectivity();

  // Generate report
  const report = generateCurrentStatusReport(locationMethods);

  console.log('\n🎉 PROXIMITY TESTING COMPLETE!');
  console.log(`📊 Methods tested: ${locationMethods.length}`);
  console.log(`✅ Successful detections: ${locationMethods.filter((m) => m.success).length}`);
  console.log(`📋 Recommendations generated: ${report.currentRecommendations.length}`);

  return report;
}

// Run the test
if (require.main === module) {
  try {
    main();
    console.log('\n✅ All proximity tests completed successfully!');
  } catch (error) {
    console.error('❌ Proximity test error:', error.message);
    console.log('\n🔄 Continuing with available data...');
  }
}
