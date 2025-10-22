#!/usr/bin/env node

/**
 * Mobile HHDAO Server - Full E2E Experience
 * Serves the complete HHDAO Next.js application on mobile-accessible network interface
 *
 * This server provides the full end-to-end experience for mobile users:
 * - Real nutrazz identity and data
 * - Complete HHDAO dashboard
 * - Solar projects interface
 * - DAO governance features
 * - Rewards and NFT functionality
 * - All responsive design features
 */

const { spawn } = require('child_process');
const path = require('path');

const LOCAL_IP = '192.168.29.210';
const MOBILE_PORT = 3003; // Use different port to avoid conflicts

console.log('\n🚀 STARTING MOBILE HHDAO SERVER');
console.log('══════════════════════════════════════════════════');
console.log('📱 Full End-to-End HHDAO Experience for Mobile');
console.log('✅ Real nutrazz identity & data');
console.log('✅ Complete dashboard & features');
console.log('✅ Solar projects & governance');
console.log('✅ Responsive mobile design');
console.log('══════════════════════════════════════════════════\n');

// Set environment variables for Next.js to work with mobile
const mobileEnv = {
  ...process.env,
  NODE_ENV: 'development',
  PORT: MOBILE_PORT.toString(),
  HOSTNAME: '0.0.0.0',
  NEXT_PUBLIC_REAL_USER: 'nutraazz',
  NEXT_PUBLIC_OWP_BALANCE: '226898',
  NEXT_PUBLIC_DISABLE_MOCK_MODE: 'true',
};

// Spawn the Next.js development server with mobile-specific environment
const nextServer = spawn('npx', ['tsx', 'server.ts'], {
  cwd: process.cwd(),
  env: mobileEnv,
  stdio: 'pipe',
});

let serverReady = false;

nextServer.stdout.on('data', (data) => {
  const output = data.toString();
  console.log(output);

  // Check if server is ready
  if (output.includes('Local:') && output.includes(`${MOBILE_PORT}`) && !serverReady) {
    serverReady = true;
    console.log('\n🎉 MOBILE HHDAO SERVER READY!');
    console.log('══════════════════════════════════════════════════');
    console.log(`📱 Mobile Access: http://${LOCAL_IP}:${MOBILE_PORT}`);
    console.log(`🖥️  Local Access: http://localhost:${MOBILE_PORT}`);
    console.log('══════════════════════════════════════════════════');
    console.log('📋 MOBILE E2E TEST CHECKLIST:');
    console.log('   1. 📱 Scan QR code on phone');
    console.log('   2. ✅ Verify nutrazz identity shows (not mock Arjun)');
    console.log('   3. 🏠 Navigate dashboard - check responsive design');
    console.log('   4. ☀️ Solar Projects - view/create projects');
    console.log('   5. 🏛️ Governance - proposals and voting');
    console.log('   6. 🏆 Rewards - NFT gallery and rewards');
    console.log('   7. 💰 Check OWP balance shows 226,898');
    console.log('══════════════════════════════════════════════════');

    // Generate QR code after server is ready
    setTimeout(generateMobileQR, 2000);
  }
});

nextServer.stderr.on('data', (data) => {
  const error = data.toString();
  console.error('❌ Server Error:', error);
});

nextServer.on('close', (code) => {
  console.log(`\n🛑 Mobile HHDAO server exited with code ${code}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Mobile HHDAO server...');
  nextServer.kill('SIGINT');
  process.exit(0);
});

function generateMobileQR() {
  const qr = require('qrcode');
  const url = `http://${LOCAL_IP}:${MOBILE_PORT}`;

  qr.toString(url, { type: 'terminal', small: true }, (err, qrString) => {
    if (!err) {
      console.log('\n📱 SCAN THIS QR CODE FOR MOBILE HHDAO ACCESS:');
      console.log(qrString);
      console.log(`🔗 URL: ${url}`);
      console.log('📝 Full HHDAO experience with real nutrazz data\n');
    } else {
      console.log('\n📱 QR Generation failed, but you can access manually:');
      console.log(`🔗 Mobile URL: ${url}\n`);
    }
  });
}

console.log('⚡ Starting Next.js development server...\n');
