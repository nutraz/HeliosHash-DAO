#!/usr/bin/env node

// Script to validate security headers
const https = require('https');
const { exec } = require('child_process');

const url = process.argv[2] || 'http://localhost:3002';

console.log(`🔍 Checking security headers for: ${url}`);

if (url.startsWith('https')) {
  https.get(url, (res) => {
    checkHeaders(res.headers);
  });
} else {
  // For HTTP, use curl or similar
  exec(`curl -I ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error checking headers:', error);
      return;
    }
    console.log(stdout);
  });
}

function checkHeaders(headers) {
  const requiredHeaders = {
    'content-security-policy': 'CSP',
    'x-content-type-options': 'X-Content-Type-Options',
    'x-frame-options': 'X-Frame-Options',
    'strict-transport-security': 'HSTS'
  };

  let score = 0;
  const total = Object.keys(requiredHeaders).length;

  Object.entries(requiredHeaders).forEach(([header, name]) => {
    if (headers[header]) {
      console.log(`✅ ${name}: ${headers[header]}`);
      score++;
    } else {
      console.log(`❌ ${name}: Missing`);
    }
  });

  console.log(`\n📊 Security Headers Score: ${score}/${total}`);
  
  if (score === total) {
    console.log('🎉 All security headers are properly configured!');
  } else {
    console.log('⚠️  Some security headers are missing. Review configuration.');
  }
}
