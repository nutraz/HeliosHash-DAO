#!/usr/bin/env node
/**
 * Simple HHDAO Mobile Test Server
 * Basic HTTP server to test mobile connectivity
 */

const http = require('http');
const fs = require('fs');

// Create simple HTML page with HHDAO data
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HHDAO Mobile Test - nutrazz</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; 
            padding: 20px; 
            margin: 0;
        }
        .container { 
            max-width: 400px; 
            margin: 0 auto; 
            text-align: center;
        }
        .logo { 
            font-size: 2em; 
            font-weight: bold; 
            margin-bottom: 20px;
        }
        .user-info { 
            background: rgba(255,255,255,0.1); 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0;
        }
        .balance { 
            font-size: 1.5em; 
            color: #ffeb3b; 
            margin: 10px 0;
        }
        .location { 
            color: #4caf50; 
            margin: 10px 0;
        }
        .proposal { 
            background: rgba(255,255,255,0.05); 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 8px; 
            text-align: left;
        }
        .status { 
            color: #00bcd4; 
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">🏔️ HHDAO Mobile</div>
        
        <div class="user-info">
            <h2>👤 nutrazz</h2>
            <div class="balance">💰 226,898 OWP</div>
            <div class="location">📍 Mumbai, India</div>
            <div>🎯 Rank #1 HHDAO Founder</div>
        </div>
        
        <div class="proposal">
            <h3>🏔️ Urgam Valley Solar Pilot</h3>
            <div class="status">✅ ACTIVE</div>
            <div>💰 ₹18.75L / ₹25L raised</div>
            <div>📍 668km from your location</div>
        </div>
        
        <div class="proposal">
            <h3>🏛️ Delhi Partner Network</h3>
            <div class="status">🗳️ VOTING</div>
            <div>💰 ₹3.5L / ₹5L raised</div>
            <div>📍 1,148km from Mumbai</div>
        </div>
        
        <div class="user-info">
            <div>🌐 Network: 847 members</div>
            <div>💡 Total Raised: ₹45 lakh</div>
            <div>⚡ IC Latency: 98ms</div>
        </div>
        
        <div style="margin-top: 30px; font-size: 0.9em; opacity: 0.8;">
            ✅ Mobile connectivity test successful!<br>
            Real HHDAO data loading on mobile device.<br>
            Server: ${require('os').hostname()}
        </div>
    </div>
</body>
</html>`;

const server = http.createServer((req, res) => {
  console.log(`📱 Mobile request: ${req.method} ${req.url} from ${req.socket.remoteAddress}`);

  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });

  res.end(htmlContent);
});

const PORT = 3002; // Use different port to avoid conflicts
const HOST = '0.0.0.0';

server.listen(PORT, HOST, () => {
  const os = require('os');
  const interfaces = os.networkInterfaces();
  let wifiIP = '';

  // Find WiFi IP
  Object.keys(interfaces).forEach((name) => {
    interfaces[name].forEach((iface) => {
      if (iface.family === 'IPv4' && !iface.internal && name.includes('wl')) {
        wifiIP = iface.address;
      }
    });
  });

  console.log('📱 HHDAO MOBILE TEST SERVER RUNNING');
  console.log('═'.repeat(50));
  console.log(`🖥️  Local:   http://localhost:${PORT}`);
  console.log(`📱 Mobile:  http://${wifiIP}:${PORT}`);
  console.log(`🌐 Network: http://${HOST}:${PORT}`);
  console.log('═'.repeat(50));
  console.log('\n📱 MOBILE INSTRUCTIONS:');
  console.log('1. Connect phone to same WiFi network');
  console.log(`2. Open browser and go to: http://${wifiIP}:${PORT}`);
  console.log('3. You should see HHDAO mobile interface with nutrazz data');
  console.log('\n💡 If this works, the issue is with the main dev server.');
  console.log("💡 If this fails, there's a network/firewall issue.");

  // Generate QR code for this test server
  try {
    const qrcode = require('qrcode');
    const testURL = `http://${wifiIP}:${PORT}`;

    qrcode
      .toString(testURL, { type: 'terminal', small: true })
      .then((qr) => {
        console.log('\n📱 SCAN THIS QR FOR MOBILE TEST:');
        console.log(qr);
      })
      .catch(() => {
        console.log(`\n📱 Manual URL for mobile: ${testURL}`);
      });
  } catch (error) {
    console.log(`\n📱 Manual URL for mobile: http://${wifiIP}:${PORT}`);
  }
});

server.on('error', (err) => {
  console.error('❌ Server error:', err);
  if (err.code === 'EADDRINUSE') {
    console.log(`💡 Port ${PORT} in use. Try: sudo lsof -i :${PORT}`);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down mobile test server...');
  server.close(() => {
    console.log('✅ Server stopped');
    process.exit(0);
  });
});

module.exports = { server };
