const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Mobile connection test server running!\n');
});

const port = 3001;
const host = '0.0.0.0';

server.listen(port, host, () => {
  console.log(`Test server running on http://${host}:${port}`);
  console.log(`Mobile access: http://192.168.29.210:${port}`);
});

// Keep the server running
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close();
});
