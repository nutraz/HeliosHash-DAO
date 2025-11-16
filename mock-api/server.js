#!/usr/bin/env node
const http = require('http')
const PORT = process.env.PORT || 4000

const server = http.createServer((req, res) => {
  const { url, method } = req
  if (method === 'GET' && url === '/_health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok' }))
    return
  }

  if (method === 'GET' && (url === '/favicon.ico' || url === '/favicon.png')) {
    // small transparent 1x1 GIF base64
    const img = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
      'base64'
    )
    res.writeHead(200, { 'Content-Type': 'image/gif', 'Content-Length': img.length })
    res.end(img)
    return
  }

  // DevTools probe route (noise), respond 204
  if (method === 'GET' && url === '/__react_devtools_backend_ping__') {
    res.writeHead(204)
    res.end()
    return
  }

  // Default: simple index
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('HeliosHash mock API')
})

// Start listening
server.listen(PORT, '127.0.0.1', () => {
  // eslint-disable-next-line no-console
  console.log(`Mock API listening on http://127.0.0.1:${PORT}`)
})
