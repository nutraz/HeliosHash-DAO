#!/usr/bin/env node

/**
 * Generate QR Code for Mobile Development Access
 * Run: node scripts/show-mobile-qr.js [port] [ip]
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const qrcode = require('qrcode');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { exec } = require('child_process');

// Get command line arguments or use defaults
const PORT = process.argv[2] || process.env.PORT || '3001';
const customIP = process.argv[3];

function getLocalIP(callback) {
  if (customIP) {
    callback(null, customIP);
    return;
  }

  exec("ip route get 8.8.8.8 | grep -oP 'src \\K[0-9.]+'", (error, stdout, stderr) => {
    if (error) {
      // eslint-disable-next-line helioshash-rules/no-raw-currency
      exec("hostname -I | awk '{print $1}'", (err, out) => {
        callback(err, out.trim());
      });
    } else {
      callback(null, stdout.trim());
    }
  });
}

function generateQR(ip) {
  const url = `http://${ip}:${PORT}`;

  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║  HeliosHash DAO - Mobile Development Server              ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  qrcode.toString(url, { type: 'terminal', small: true }, (err, qrString) => {
    if (!err) {
      console.log('📱 SCAN THIS QR CODE ON YOUR MOBILE DEVICE:\n');
      console.log(qrString);

      console.log(`\n🔗 URL: ${url}`);
    } else {
      console.log(`\n🔗 Mobile URL: ${url}`);
      console.log('   (QR generation failed, but you can type the URL manually)');
    }

    console.log('\n📋 Available Routes:');
    console.log(`   • Homepage:   ${url}/`);
    console.log(`   • Login:      ${url}/auth/login`);
    console.log(`   • Dashboard:  ${url}/dashboard`);
    console.log(`   • Community:  ${url}/community`);
    console.log(`   • Mining:     ${url}/mining`);
    console.log(`   • Rewards:    ${url}/rewards`);
    console.log(`   • Wallet:     ${url}/wallet`);

    console.log('\n✅ Instructions:');
    console.log('   1. Ensure your mobile device is on the same WiFi network');
    console.log('   2. Scan the QR code or manually enter the URL');
    console.log('   3. Start testing the mobile experience!');

    console.log('\n💡 Tip: For better mobile testing, use the dedicated mobile server:');
    console.log('   pnpm mobile\n');
  });
}

getLocalIP((err, ip) => {
  if (err || !ip) {
    console.error('❌ Could not detect IP address. Please provide it manually:');
    console.error('   node scripts/show-mobile-qr.js [port] [ip]');
    console.error('\nExample:');
    console.error('   node scripts/show-mobile-qr.js 3001 192.168.1.100\n');
    process.exit(1);
  }

  generateQR(ip.trim());
});
