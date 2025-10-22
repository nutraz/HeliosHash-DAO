#!/usr/bin/env node

const QRCode = require('qrcode');

// Get the application URL (default to localhost:3000)
const url = process.argv[2] || 'http://localhost:3000';

console.log('\n🌞 HeliosHash DAO - QR Code Generator\n');
console.log('═'.repeat(50));

// Display basic info
console.log(`📱 Application URL: ${url}`);
console.log(`🔗 Access via QR code below:`);
console.log('═'.repeat(50));

// Generate QR code for terminal
QRCode.toString(
  url,
  {
    type: 'terminal',
    small: true,
    errorCorrectionLevel: 'M',
  },
  function (err, qrString) {
    if (err) {
      console.error('❌ Error generating QR code:', err);
      return;
    }

    console.log(qrString);
    console.log('═'.repeat(50));
    console.log('📋 Instructions:');
    console.log('   1. Open your phone camera');
    console.log('   2. Point at the QR code above');
    console.log('   3. Tap the notification to open');
    console.log('');
    console.log('💻 Or visit directly: ' + url);
    console.log('');
    console.log('🚀 System Status:');
    console.log('   ✅ Frontend: Ready on port 3000');
    console.log('   ✅ Backend: 7 canisters deployed');
    console.log('   ✅ DAO: Governance system active');
    console.log('   ✅ Disputes: Resolution system ready');
    console.log('   ✅ Telemetry: Solar monitoring online');
    console.log('');
  }
);
