# Mobile Development Server Guide

## Quick Start

The HeliosHash DAO development server is now running and accessible for mobile testing!

### Server Information

- **Local URL**: http://localhost:3001
- **Network URL**: http://10.1.0.126:3001
- **Status**: ✅ Running

### Mobile Access

#### Option 1: QR Code (Recommended)

Scan this QR code with your mobile device:

```
 ▄▄▄▄▄▄▄  ▄ ▄▄ ▄ ▄ ▄▄▄▄▄▄▄ 
 █ ▄▄▄ █ ▀▄█ ▄▀ ▀▄ █ ▄▄▄ █ 
 █ ███ █ ▄█ █▄█▄▄█ █ ███ █ 
 █▄▄▄▄▄█ ▄▀█ ▄ █▀▄ █▄▄▄▄▄█ 
 ▄ ▄ ▄ ▄  ▄ ▀▄  ▀█   ▄  ▄  
  █▀▀  ▄▀▄█  ▄▀▄█▄▀▀▀█ ▄▄█ 
 ▀█▀▄▀▄▄▀█  ▀▀▀█▄█▀▄▀▄▄ █▄ 
 ▄ ▀█▄▀▄▄ █ ▀ ▄▀▀█▀▀▀ ▀▄▄█ 
 ▄▀▀▄▄▀▄ █▄█▀▄  ▄█▄██▄▀ ▀  
 ▄▄▄▄▄▄▄ ▀▄ ██▀▄ █ ▄ █▀▄██ 
 █ ▄▄▄ █ ▄█ ▄▀▀█ █▄▄▄████▄ 
 █ ███ █ ▄ █▀ ▄▀▀▄▀█▄▀▄ ▀▄ 
 █▄▄▄▄▄█ ▄▀ ▀▄  ▀▀▀ ▄█ ▀█▄ 
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
```

**URL**: http://10.1.0.126:3001

#### Option 2: Manual Entry

1. Connect your mobile device to the same WiFi network as your development machine
2. Open your mobile browser
3. Navigate to: `http://10.1.0.126:3001`

### Available Routes

- **Homepage**: http://10.1.0.126:3001/
- **Auth/Login**: http://10.1.0.126:3001/auth/login
- **Dashboard**: http://10.1.0.126:3001/dashboard
- **Community**: http://10.1.0.126:3001/community
- **Mining**: http://10.1.0.126:3001/mining
- **Rewards**: http://10.1.0.126:3001/rewards
- **Wallet**: http://10.1.0.126:3001/wallet

## Running the Development Server

### Standard Development Mode

```bash
pnpm dev
```

This command starts the server on:
- Port: 3001
- Hostname: 0.0.0.0 (accessible from network)
- Environment: development

### Mobile-Specific Server

For a dedicated mobile testing experience with QR code generation:

```bash
pnpm mobile
```

This runs `mobile_hhdao_server.js` which:
- Runs on port 3003 by default
- Automatically generates QR codes
- Uses specific mobile environment variables
- Provides real user data for testing

### Alternative Mobile Dev Script

```bash
bash scripts/mobile-dev.sh
```

This script:
- Automatically picks an available port (3005, 3001, or 3100-3120)
- Configures firewall rules (Fedora)
- Generates QR code for easy mobile access
- Provides health check monitoring

## Troubleshooting

### Server Not Accessible from Mobile

1. **Check WiFi Connection**: Ensure both devices are on the same network
2. **Firewall**: If on Fedora/RHEL, ensure port is open:
   ```bash
   sudo firewall-cmd --add-port=3001/tcp --permanent
   sudo firewall-cmd --reload
   ```
3. **IP Address**: Verify your IP address:
   ```bash
   ip route get 8.8.8.8 | grep -oP 'src \K[0-9.]+'
   ```

### 404 Errors

The application requires authentication. Some routes may show 404 until you:
1. Navigate to `/auth/login`
2. Complete authentication flow
3. Access protected routes

This is expected behavior for authenticated routes.

### Port Already in Use

If port 3001 is busy, the server will automatically try ports 3002-3010. Check console output for the actual port being used.

## Development Environment

- **OS**: Linux (GitHub Actions Runner)
- **Node.js**: v20.x
- **Package Manager**: pnpm v10.18.2
- **Framework**: Next.js 15.5.4
- **Port**: 3001 (default)

## Network Information

- **Server IP**: 10.1.0.126
- **Hostname**: 0.0.0.0 (listens on all interfaces)
- **Protocol**: HTTP (development mode)

## Mobile Testing Checklist

- [ ] Server accessible on mobile via network IP
- [ ] QR code scannable and navigates correctly
- [ ] Responsive design works on various screen sizes
- [ ] Touch interactions function properly
- [ ] Network requests complete successfully
- [ ] Authentication flow works on mobile
- [ ] Mobile navigation menu functional

## Additional Resources

- **Main README**: See `/README.md` for project overview
- **Mobile Testing Plan**: See `/THOROUGH_MOBILE_TESTING_PLAN.md`
- **Manual Testing Guide**: See `/MANUAL_TESTING_GUIDE.md`
- **Mobile Connection Guide**: See `/MOBILE_CONNECTION_GUIDE.md`

## Notes

- The development server uses hot reload for faster iteration
- Changes to code will automatically refresh in the browser
- For production deployment, use `pnpm build` and `pnpm start`
- Mobile testing works best on the same local network
- For testing over internet, consider using ngrok or similar tunneling service
