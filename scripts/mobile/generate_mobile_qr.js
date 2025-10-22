#!/usr/bin/env node
/**
 * HHDAO Mobile QR Code Generator
 * Generates QR codes for mobile access to real HHDAO dashboard
 */

const qrcode = require('qrcode');
const fs = require('fs');

// HHDAO Access URLs
const HHDAO_URLS = {
  local: 'http://localhost:3001',
  network: 'http://192.168.29.210:3001', // From server output
  mobile_optimized: 'http://192.168.29.210:3001?mobile=true',
  dashboard: 'http://192.168.29.210:3001/dashboard',
  governance: 'http://192.168.29.210:3001/governance',
  projects: 'http://192.168.29.210:3001/projects',
};

// QR Code generation function
async function generateQRCode(url, filename, description) {
  try {
    // Generate QR code as PNG
    await qrcode.toFile(`${filename}.png`, url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a1a', // Dark foreground
        light: '#ffffff', // Light background
      },
    });

    // Generate QR code as SVG
    const svg = await qrcode.toString(url, {
      type: 'svg',
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff',
      },
    });

    fs.writeFileSync(`${filename}.svg`, svg);

    // Generate terminal QR for immediate display
    const terminal = await qrcode.toString(url, { type: 'terminal', small: true });

    console.log(`\n📱 ${description.toUpperCase()}`);
    console.log(`🔗 URL: ${url}`);
    console.log(`💾 Files: ${filename}.png, ${filename}.svg`);
    console.log(terminal);
    console.log('─'.repeat(50));

    return { png: `${filename}.png`, svg: `${filename}.svg`, url };
  } catch (error) {
    console.error(`❌ Failed to generate QR for ${description}:`, error.message);
    return null;
  }
}

// Main QR generation
async function generateHHDAOQRCodes() {
  console.log('📱 HHDAO MOBILE QR CODE GENERATOR');
  console.log('═'.repeat(50));
  console.log('🎯 Real HHDAO Dashboard Access');
  console.log('👤 User: TEST_USER');
  console.log('💰 Balance: OWP_BALANCE_PLACEHOLDER OWP');
  console.log('📍 Location: Mumbai → Urgam Valley');
  console.log('═'.repeat(50));

  const results = [];

  // Generate QR codes for different access points
  const qrConfigs = [
    {
      url: HHDAO_URLS.network,
      filename: 'hhdao_main_dashboard',
      description: 'Main HHDAO Dashboard',
    },
    {
      url: HHDAO_URLS.mobile_optimized,
      filename: 'hhdao_mobile_optimized',
      description: 'Mobile-Optimized Dashboard',
    },
    {
      url: HHDAO_URLS.governance,
      filename: 'hhdao_governance',
      description: 'HHDAO Governance & Voting',
    },
    {
      url: HHDAO_URLS.projects,
      filename: 'hhdao_urgam_projects',
      description: 'Urgam Valley Solar Projects',
    },
  ];

  // Generate all QR codes
  for (const config of qrConfigs) {
    const result = await generateQRCode(config.url, config.filename, config.description);
    if (result) results.push(result);
  }

  // Generate comprehensive mobile access info
  const mobileInfo = {
    timestamp: new Date().toISOString(),
  user: 'TEST_USER',
    access_points: results,
    device_instructions: {
      android: 'Open Camera app → Point at QR code → Tap notification',
      ios: 'Open Camera app → Point at QR code → Tap banner',
      manual: `Type in browser: ${HHDAO_URLS.network}`,
    },
    features_available: [
  'Real TEST_USER identity (not Arjun Patel)',
  'OWP_BALANCE_PLACEHOLDER OWP balance display',
      'Urgam Valley solar proposals',
      'Mumbai location (668km to Urgam)',
      'Delhi partner network access',
      'Voice interface development status',
      'Real-time governance participation',
    ],
    network_info: {
      local_ip: '192.168.29.210',
      port: 3001,
      protocol: 'http',
      connectivity: 'Same WiFi network required',
    },
  };

  // Save mobile info
  fs.writeFileSync('hhdao_mobile_access.json', JSON.stringify(mobileInfo, null, 2));

  console.log('\n🎉 QR CODE GENERATION COMPLETE!');
  console.log(`📁 Generated ${results.length} QR codes`);
  console.log('💾 Mobile access info saved to: hhdao_mobile_access.json');

  // Show main QR prominently
  console.log('\n🏆 MAIN DASHBOARD QR - SCAN WITH MOBILE:');
  const mainTerminalQR = await qrcode.toString(HHDAO_URLS.network, {
    type: 'terminal',
    small: false,
  });
  console.log(mainTerminalQR);

  console.log('\n📱 MOBILE ACCESS INSTRUCTIONS:');
  console.log('1. Connect mobile to same WiFi network');
  console.log('2. Open Camera app on phone');
  console.log('3. Point camera at QR code above');
  console.log('4. Tap the notification/banner that appears');
  console.log('5. View your real HHDAO dashboard with TEST_USER identity!');

  console.log("\n🎯 WHAT YOU'LL SEE ON MOBILE:");
  console.log('✅ Your real identity: TEST_USER (not Arjun Patel)');
  console.log('✅ Your OWP balance: OWP_BALANCE_PLACEHOLDER');
  console.log('✅ Mumbai location with proximity to Urgam Valley');
  console.log('✅ Real proposals with Delhi partners');
  console.log('✅ Authentic HHDAO governance system');

  return results;
}

// Run the generator
if (require.main === module) {
  generateHHDAOQRCodes()
    .then((results) => {
      console.log(`\n✅ Successfully generated ${results.length} QR codes for mobile access!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 QR generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateHHDAOQRCodes, HHDAO_URLS };
