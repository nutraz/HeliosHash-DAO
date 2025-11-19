#!/usr/bin/env node
/**
 * HHDAO Mobile Connectivity Diagnostics
 * Tests and troubleshoots mobile access issues
 */

const { execSync } = require('child_process');
const fs = require('fs');

function runMobileConnectivityDiagnostics() {
  console.log('📱 HHDAO MOBILE CONNECTIVITY DIAGNOSTICS');
  console.log('═'.repeat(50));

  const diagnostics = {
    timestamp: new Date().toISOString(),
    server_status: {},
    network_info: {},
    firewall_info: {},
    mobile_troubleshooting: {},
  };

  // 1. Check server status
  console.log('\n🖥️  SERVER STATUS CHECK:');
  try {
    const devServerCheck = execSync('ps aux | grep "tsx server.ts" | grep -v grep', {
      encoding: 'utf8',
    });
    const isRunning = devServerCheck.trim().length > 0;
    diagnostics.server_status.dev_server_running = isRunning;
    console.log(`   📡 Dev Server: ${isRunning ? '✅ RUNNING' : '❌ NOT RUNNING'}`);

    if (isRunning) {
      console.log(`   🔗 Server Process Found: ${devServerCheck.trim().split(/\s+/)[1]}`);
    }
  } catch (error) {
    diagnostics.server_status.dev_server_running = false;
    console.log('   📡 Dev Server: ❌ NOT RUNNING');
  }

  // 2. Check port status
  try {
    const portCheck = execSync(
      'ss -tlnp 2>/dev/null | grep :3001 || netstat -tlnp 2>/dev/null | grep :3001',
      { encoding: 'utf8' }
    );
    const portOpen = portCheck.trim().length > 0;
    diagnostics.server_status.port_3001_open = portOpen;
    console.log(`   🔌 Port 3001: ${portOpen ? '✅ OPEN' : '❌ CLOSED'}`);

    if (portOpen) {
      console.log(`   📋 Port Details: ${portCheck.trim()}`);
    }
  } catch (error) {
    diagnostics.server_status.port_3001_open = false;
    console.log('   🔌 Port 3001: ❌ CLOSED');
  }

  // 3. Network interface check
  console.log('\n🌐 NETWORK INTERFACE CHECK:');
  try {
    const ipInfo = execSync('ip addr show | grep "inet " | grep -v "127.0.0.1"', {
      encoding: 'utf8',
    });
    const lines = ipInfo.trim().split('\n');
    diagnostics.network_info.interfaces = [];

    lines.forEach((line) => {
      const match = line.match(/inet (\d+\.\d+\.\d+\.\d+)\/\d+.*?(\w+)$/);
      if (match) {
        const [, ip, interface_name] = match;
        diagnostics.network_info.interfaces.push({ ip, interface: interface_name });
        console.log(`   🔗 ${interface_name}: ${ip}`);
      }
    });

    // Find the WiFi interface
    const wifiInterface = diagnostics.network_info.interfaces.find(
      (iface) => iface.interface.includes('wl') || iface.interface.includes('wifi')
    );

    if (wifiInterface) {
      diagnostics.network_info.wifi_ip = wifiInterface.ip;
      console.log(`   📶 WiFi IP: ${wifiInterface.ip} ← USE THIS FOR MOBILE`);
    }
  } catch (error) {
    console.log('   ❌ Could not determine network interfaces');
  }

  // 4. Firewall check
  console.log('\n🔥 FIREWALL CHECK:');
  try {
    const firewallStatus = execSync(
      'sudo firewall-cmd --state 2>/dev/null || echo "firewall-cmd not available"',
      { encoding: 'utf8' }
    );
    diagnostics.firewall_info.firewall_active = firewallStatus.includes('running');
    console.log(`   🔒 Firewall: ${firewallStatus.trim()}`);

    if (firewallStatus.includes('running')) {
      try {
        const port3001Status = execSync(
          'sudo firewall-cmd --query-port=3001/tcp 2>/dev/null || echo "no"',
          { encoding: 'utf8' }
        );
        const port3001Open = port3001Status.includes('yes');
        diagnostics.firewall_info.port_3001_allowed = port3001Open;
        console.log(
          `   🔌 Port 3001 Allowed: ${port3001Open ? '✅ YES' : '❌ NO - FIREWALL BLOCKING'}`
        );

        if (!port3001Open) {
          console.log(
            '   💡 To fix: sudo firewall-cmd --add-port=3001/tcp --permanent && sudo firewall-cmd --reload'
          );
        }
      } catch (error) {
        console.log('   ⚠️  Could not check port 3001 firewall status');
      }
    }
  } catch (error) {
    console.log('   ⚠️  Could not check firewall status (may not be installed)');
  }

  // 5. Generate mobile troubleshooting
  console.log('\n📱 MOBILE ACCESS TROUBLESHOOTING:');

  const wifiIP = diagnostics.network_info.wifi_ip || '192.168.29.210';
  const mobileURL = `http://${wifiIP}:3001`;

  console.log(`\n🎯 CORRECT MOBILE URL: ${mobileURL}`);
  console.log('\n📋 TROUBLESHOOTING STEPS:');

  const troubleSteps = [
    {
      step: 1,
      title: 'Check Same WiFi Network',
      description: 'Ensure phone and computer are on same WiFi network',
      test: `Phone should be on same network as computer (${wifiIP
        .split('.')
        .slice(0, 3)
        .join('.')}.xxx)`,
    },
    {
      step: 2,
      title: 'Test Direct URL',
      description: 'Open mobile browser and type URL manually',
      test: `Type: ${mobileURL}`,
    },
    {
      step: 3,
      title: 'Check Firewall',
      description: 'Ensure firewall allows port 3001',
      test: diagnostics.firewall_info.port_3001_allowed
        ? '✅ Firewall OK'
        : '❌ May need: sudo firewall-cmd --add-port=3001/tcp',
    },
    {
      step: 4,
      title: 'Test from Computer',
      description: 'Verify server works from same machine',
      test: `curl ${mobileURL} (should return HTML)`,
    },
  ];

  troubleSteps.forEach((step) => {
    console.log(`\n   ${step.step}. ${step.title}`);
    console.log(`      ${step.description}`);
    console.log(`      Test: ${step.test}`);
  });

  diagnostics.mobile_troubleshooting = {
    correct_url: mobileURL,
    troubleshooting_steps: troubleSteps,
  };

  // 6. Generate new QR code with correct IP
  console.log('\n🔄 GENERATING UPDATED QR CODE:');

  try {
    const qrcode = require('qrcode');

    const terminalQR = qrcode.toString(mobileURL, {
      type: 'terminal',
      small: false,
    });

    terminalQR
      .then((qr) => {
        console.log('\n📱 UPDATED MOBILE QR CODE - SCAN THIS:');
        console.log(qr);

        // Save updated QR as file
        return qrcode.toFile('hhdao_mobile_fixed.png', mobileURL, {
          width: 300,
          margin: 2,
        });
      })
      .then(() => {
        console.log('\n💾 Updated QR saved as: hhdao_mobile_fixed.png');
      })
      .catch((error) => {
        console.log('⚠️  QR generation failed:', error.message);
      });
  } catch (error) {
    console.log('⚠️  QR library not available, install with: pnpm add qrcode');
  }

  // 7. Test server connectivity
  console.log('\n🧪 CONNECTIVITY TEST:');
  try {
    const curlTest = execSync(`curl -s --connect-timeout 5 ${mobileURL} | head -1`, {
      encoding: 'utf8',
    });
    const serverResponding = curlTest.includes('<!DOCTYPE') || curlTest.includes('<html');
    diagnostics.server_status.responding_to_requests = serverResponding;
    console.log(
      `   📡 Server Response: ${serverResponding ? '✅ RESPONDING' : '❌ NOT RESPONDING'}`
    );

    if (serverResponding) {
      console.log('   🎉 Server is accessible - mobile should work!');
    } else {
      console.log('   ⚠️  Server not responding - check if dev server is running');
    }
  } catch (error) {
    console.log('   ❌ Could not test server connectivity');
  }

  // Save diagnostics
  fs.writeFileSync('mobile_diagnostics.json', JSON.stringify(diagnostics, null, 2));

  console.log('\n🎯 SUMMARY:');
  console.log(`📱 Mobile URL: ${mobileURL}`);
  console.log(`🖥️  Server Running: ${diagnostics.server_status.dev_server_running ? '✅' : '❌'}`);
  console.log(`🔌 Port Open: ${diagnostics.server_status.port_3001_open ? '✅' : '❌'}`);
  console.log(
    `🔒 Firewall: ${diagnostics.firewall_info.port_3001_allowed !== false ? '✅' : '❌'}`
  );
  console.log(`📡 Responding: ${diagnostics.server_status.responding_to_requests ? '✅' : '❌'}`);

  console.log('\n💾 Full diagnostics saved to: mobile_diagnostics.json');

  return diagnostics;
}

// Run diagnostics
if (require.main === module) {
  runMobileConnectivityDiagnostics().then
    ? runMobileConnectivityDiagnostics()
        .then(() => {
          console.log('\n✅ Mobile diagnostics complete!');
          process.exit(0);
        })
        .catch((error) => {
          console.error('💥 Diagnostics failed:', error);
          process.exit(1);
        })
    : (() => {
        runMobileConnectivityDiagnostics();
        console.log('\n✅ Mobile diagnostics complete!');
      })();
}

module.exports = { runMobileConnectivityDiagnostics };
