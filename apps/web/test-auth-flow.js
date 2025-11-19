const http = require('http');

function testAuthFlow() {
  console.log('Testing auth endpoints...');
  const endpoints = [
    'http://localhost:3001/',
    'http://localhost:3001/auth/signin',
    'http://localhost:3001/auth/signup'
  ];

  endpoints.forEach(url => {
    http.get(url, (res) => {
      console.log(`${url}: ${res.statusCode}`);
    }).on('error', (err) => {
      console.log(`${url}: ERROR - ${err.message}`);
    });
  });
}

// Wait a bit for server to be ready, then test
setTimeout(testAuthFlow, 2000);
