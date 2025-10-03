// server.ts - Next.js Standalone + Socket.IO
import { formatDuration, getLocalIPv4, getUptimeMs } from '@/lib/runtime-info';
import { setupSocket } from '@/lib/socket';
import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
let currentPort = process.env.PORT ? parseInt(process.env.PORT) : 3001;
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' },
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    setupSocket(io);

    function attemptListen(port: number, attempt = 0) {
      server.once('error', (err: any) => {
        if (err.code === 'EADDRINUSE' && attempt < 9) {
          const nextPort = port + 1;
          console.warn(`Port ${port} in use, trying ${nextPort}...`);
          attemptListen(nextPort, attempt + 1);
        } else {
          console.error('Failed to bind server:', err);
          process.exit(1);
        }
      });
      server.listen(port, hostname, () => {
        currentPort = port;
        const ip = getLocalIPv4();
        console.log('──────────────────────────────────────────────');
        console.log(`> HeliosHash Dev Server Ready`);
        console.log(`> Local:      http://localhost:${currentPort}`);
        console.log(`> Network:    ${ip ? `http://${ip}:${currentPort}` : 'IP not detected'}`);
        console.log(`> Socket.IO:  ws://${hostname}:${currentPort}/api/socketio`);
        if (port !== (process.env.PORT ? parseInt(process.env.PORT) : 3001)) {
          console.log(`> Note: Fallback port selected (original busy).`);
        }
        if (!ip) {
          console.log('⚠ Could not detect LAN IP automatically (may be a VPN / container).');
        }
        console.log('──────────────────────────────────────────────');
      });
    }

    attemptListen(currentPort);

    // Prevent server from crashing on unhandled promises
    process.on('unhandledRejection', (reason, promise) => {
      console.log('[unhandledRejection]', reason);
    });

    process.on('uncaughtException', (error) => {
      console.log('[uncaughtException]', error);
    });

    setInterval(() => {
      // lightweight heartbeat
      process.stdout.write(`heartbeat uptime=${formatDuration(getUptimeMs())}    \r`);
    }, 15000).unref();
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
