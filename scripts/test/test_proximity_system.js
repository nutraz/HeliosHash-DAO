#!/usr/bin/env node
/**
 * HHDAO Proximity Testing System
 * Tests device-user-network location detection and proximity calculations
 * Real-time geographic positioning for Delhi partners and Urgam Valley
 */

const fs = require('fs');
const https = require('https');

// HHDAO Network Coordinates (Real locations)
const HHDAO_LOCATIONS = {
  urgamValley: {
    name: 'Urgam Valley Solar Pilot Site',
    lat: 23.7337, // Gujarat, India
    lng: 68.8093,
    type: 'primary_site',
    status: 'active',
    description: 'Main solar installation and community hub',
  },
  delhiPartners: [
    {
      name: 'Delhi Technology Hub',
      lat: 28.6139, // New Delhi
      lng: 77.209,
      type: 'partner_node',
      status: 'active',
      description: 'Primary partner coordination center',
    },
    {
      name: 'Delhi Solar Distribution Center',
      lat: 28.5355, // Gurgaon
      lng: 77.091,
      type: 'distribution',
      status: 'active',
      description: 'Equipment and logistics hub',
    },
    {
      name: 'Delhi Research Institute',
      lat: 28.6692, // North Delhi
      lng: 77.2315,
      type: 'research_node',
      status: 'active',
      description: 'Solar technology research and development',
    },
  ],
  icNodes: [
    {
      name: 'IC Zurich Node',
      lat: 47.3769,
      lng: 8.5417,
      type: 'blockchain_node',
      status: 'active',
      description: 'Primary Internet Computer infrastructure',
    },
    {
      name: 'IC San Francisco Node',
      lat: 37.7749,
      lng: -122.4194,
      type: 'blockchain_node',
      status: 'active',
      description: 'Secondary IC infrastructure',
    },
  ],
};

// Distance calculation using Haversine formula
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

// Get device location using IP geolocation
async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    console.log('🌍 Detecting current device location...');

    // Using ipapi.co for geolocation
    https
      .get('https://ipapi.co/json/', (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const location = JSON.parse(data);
            console.log(
              `📍 Current Location: ${location.city}, ${location.region}, ${location.country}`
            );
            console.log(`🗺️  Coordinates: ${location.latitude}, ${location.longitude}`);
            console.log(`🌐 IP Address: ${location.ip}`);
            console.log(`🏢 ISP: ${location.org}`);

            resolve({
              lat: parseFloat(location.latitude),
              lng: parseFloat(location.longitude),
              city: location.city,
              region: location.region,
              country: location.country,
              ip: location.ip,
              isp: location.org,
              timezone: location.timezone,
            });
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });
}

// Test proximity to all HHDAO network nodes
function testProximityToNetwork(currentLocation) {
  console.log('\n🔍 PROXIMITY ANALYSIS TO HHDAO NETWORK:');
  console.log('=' * 60);

  const proximityResults = [];

  // Test Urgam Valley
  const urgamDistance = calculateDistance(
    currentLocation.lat,
    currentLocation.lng,
    HHDAO_LOCATIONS.urgamValley.lat,
    HHDAO_LOCATIONS.urgamValley.lng
  );

  console.log(`\n🏔️  ${HHDAO_LOCATIONS.urgamValley.name}`);
  console.log(`   Distance: ${urgamDistance.toFixed(2)} km`);
  console.log(`   Status: ${HHDAO_LOCATIONS.urgamValley.status.toUpperCase()}`);
  console.log(`   Type: ${HHDAO_LOCATIONS.urgamValley.type}`);

  proximityResults.push({
    ...HHDAO_LOCATIONS.urgamValley,
    distance: urgamDistance,
    isNear: urgamDistance < 100, // Within 100km is "near"
  });

  // Test Delhi Partners
  console.log(`\n🏛️  DELHI PARTNER NETWORK:`);
  HHDAO_LOCATIONS.delhiPartners.forEach((partner) => {
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      partner.lat,
      partner.lng
    );

    console.log(`   📍 ${partner.name}: ${distance.toFixed(2)} km`);
    console.log(`      ${partner.description}`);

    proximityResults.push({
      ...partner,
      distance: distance,
      isNear: distance < 50, // Within 50km for partners
    });
  });

  // Test IC Nodes
  console.log(`\n🌐 INTERNET COMPUTER NODES:`);
  HHDAO_LOCATIONS.icNodes.forEach((node) => {
    const distance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      node.lat,
      node.lng
    );

    console.log(`   🖥️  ${node.name}: ${distance.toFixed(2)} km`);

    proximityResults.push({
      ...node,
      distance: distance,
      isNear: distance < 1000, // Within 1000km for IC nodes
    });
  });

  return proximityResults;
}

// Analyze optimal connectivity and recommendations
function analyzeConnectivity(currentLocation, proximityResults) {
  console.log('\n🎯 CONNECTIVITY ANALYSIS & RECOMMENDATIONS:');
  console.log('=' * 60);

  const nearNodes = proximityResults.filter((node) => node.isNear);
  const closestNode = proximityResults.reduce((closest, node) =>
    node.distance < closest.distance ? node : closest
  );

  console.log(`\n✅ Nodes within range: ${nearNodes.length}/${proximityResults.length}`);
  console.log(`🎯 Closest node: ${closestNode.name} (${closestNode.distance.toFixed(2)} km)`);

  // Specific recommendations based on location
  if (currentLocation.country === 'India') {
    console.log(`\n🇮🇳 INDIA-BASED USER DETECTED:`);
    console.log(`   ✅ Optimal connectivity to HHDAO network`);
    console.log(`   🏔️  Direct access to Urgam Valley pilot`);
    console.log(`   🏛️  Connected to Delhi partner ecosystem`);
    console.log(`   💡 Recommended: Full HHDAO participation`);
  } else {
    console.log(`\n🌍 INTERNATIONAL USER DETECTED (${currentLocation.country}):`);
    console.log(`   🌐 Remote participation via Internet Computer`);
    console.log(`   📡 Connectivity through IC global nodes`);
    console.log(`   💡 Recommended: DAO governance participation`);
  }

  // Network latency estimation
  const avgDistance =
    proximityResults.reduce((sum, node) => sum + node.distance, 0) / proximityResults.length;
  const estimatedLatency = Math.min(300, Math.max(50, avgDistance * 0.1)); // Rough estimation

  console.log(`\n📊 NETWORK PERFORMANCE ESTIMATE:`);
  console.log(`   📡 Average distance to network: ${avgDistance.toFixed(0)} km`);
  console.log(`   ⚡ Estimated latency: ${estimatedLatency.toFixed(0)}ms`);
  console.log(
    `   🔄 Connection quality: ${
      estimatedLatency < 100 ? 'EXCELLENT' : estimatedLatency < 200 ? 'GOOD' : 'ACCEPTABLE'
    }`
  );

  return {
    nearNodes: nearNodes.length,
    totalNodes: proximityResults.length,
    closestNode,
    averageDistance: avgDistance,
    estimatedLatency,
    isInIndia: currentLocation.country === 'India',
    recommendations: generateRecommendations(currentLocation, proximityResults),
  };
}

// Generate specific recommendations
function generateRecommendations(currentLocation, proximityResults) {
  const recommendations = [];

  const urgamNode = proximityResults.find((n) => n.name.includes('Urgam'));
  const delhiNodes = proximityResults.filter((n) => n.type === 'partner_node');

  if (urgamNode && urgamNode.distance < 200) {
    recommendations.push({
      type: 'LOCAL_PILOT',
      priority: 'HIGH',
      action: 'Join Urgam Valley solar pilot program',
      benefit: 'Direct participation in solar transformation',
    });
  }

  if (delhiNodes.some((n) => n.distance < 100)) {
    recommendations.push({
      type: 'PARTNER_NETWORK',
      priority: 'MEDIUM',
      action: 'Connect with Delhi partner ecosystem',
      benefit: 'Technology and business collaboration opportunities',
    });
  }

  if (currentLocation.country === 'India') {
    recommendations.push({
      type: 'NATIONAL_EXPANSION',
      priority: 'HIGH',
      action: 'Lead HHDAO expansion in your region',
      benefit: 'Become regional HHDAO coordinator',
    });
  }

  recommendations.push({
    type: 'DAO_PARTICIPATION',
    priority: 'MEDIUM',
    action: 'Participate in HHDAO governance and proposals',
    benefit: 'Shape the future of solar DAO development',
  });

  return recommendations;
}

// Save results to file
function saveResults(currentLocation, proximityResults, analysis) {
  const timestamp = new Date().toISOString();
  const results = {
    timestamp,
    testType: 'HHDAO_PROXIMITY_TEST',
    currentLocation,
    proximityResults,
    analysis,
    metadata: {
      version: '1.0.0',
      tester: 'nutraazz',
      network: 'HHDAO_IC_NETWORK',
    },
  };

  const filename = `proximity_test_${timestamp.split('T')[0]}.json`;
  fs.writeFileSync(filename, JSON.stringify(results, null, 2));

  console.log(`\n💾 Results saved to: ${filename}`);
  return filename;
}

// Main test execution
async function runProximityTest() {
  console.log('🚀 HHDAO PROXIMITY TESTING SYSTEM');
  console.log('==================================');
  console.log(`⏰ Test Time: ${new Date().toISOString()}`);
  console.log(`👤 Tester: nutraazz (HHDAO founder)`);
  console.log(`🌐 Network: Internet Computer + HHDAO nodes`);

  try {
    // Get current location
    const currentLocation = await getCurrentLocation();

    // Test proximity to network
    const proximityResults = testProximityToNetwork(currentLocation);

    // Analyze connectivity
    const analysis = analyzeConnectivity(currentLocation, proximityResults);

    // Display recommendations
    console.log(`\n🎯 PERSONALIZED RECOMMENDATIONS:`);
    analysis.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. [${rec.priority}] ${rec.action}`);
      console.log(`      → ${rec.benefit}`);
    });

    // Save results
    const resultsFile = saveResults(currentLocation, proximityResults, analysis);

    console.log(`\n🎉 PROXIMITY TEST COMPLETE!`);
    console.log(`📊 Summary: ${analysis.nearNodes}/${analysis.totalNodes} nodes accessible`);
    console.log(
      `🎯 Closest: ${analysis.closestNode.name} (${analysis.closestNode.distance.toFixed(0)}km)`
    );
    console.log(
      `⚡ Quality: ${
        analysis.estimatedLatency < 100
          ? '🟢 EXCELLENT'
          : analysis.estimatedLatency < 200
            ? '🟡 GOOD'
            : '🔴 ACCEPTABLE'
      }`
    );

    return { currentLocation, proximityResults, analysis, resultsFile };
  } catch (error) {
    console.error('❌ Proximity test failed:', error.message);

    // Fallback to manual testing
    console.log('\n🔄 Switching to manual location input...');
    console.log('Please provide your approximate coordinates for testing.');

    return null;
  }
}

// Export for use in other modules
module.exports = {
  runProximityTest,
  calculateDistance,
  HHDAO_LOCATIONS,
};

// Run if called directly
if (require.main === module) {
  runProximityTest()
    .then((result) => {
      if (result) {
        console.log('\n✅ Test completed successfully!');
        process.exit(0);
      } else {
        console.log('\n⚠️  Test completed with fallback mode');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('💥 Test system error:', error);
      process.exit(1);
    });
}
