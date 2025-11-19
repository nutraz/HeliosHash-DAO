# Mobile Connection Guide

## Current Status

✅ Firewall ports opened: 3001/tcp, 8000/tcp  
✅ Server configured to bind to 0.0.0.0  
✅ CORS configured for mobile access  
✅ Local IP identified: 192.168.29.210

## Mobile Access URLs

- **Main App**: http://192.168.29.210:3001
- **Login Page**: http://192.168.29.210:3001/auth/login
- **Dashboard**: http://192.168.29.210:3001/dashboard

## Steps to Connect Mobile Device

### 1. Start Development Server

```bash
cd /home/nutarzz/HeliosHash-DAO
pnpm dev
```

Wait for: `Ready on http://0.0.0.0:3001`

### 2. Verify Connection (from computer)

```bash
curl -I http://192.168.29.210:3001
```

Should return HTTP 200 response.

### 3. Connect from Mobile

- Ensure mobile device is on same WiFi network
- Open browser on mobile device
- Navigate to: `http://192.168.29.210:3001/auth/login`

## Authentication Options Available

1. **Social Login** (Recommended for mobile)
   - Google OAuth
   - GitHub OAuth
   - Discord OAuth
   - Twitter OAuth

2. **Email/OTP** (Mobile-friendly)
   - Enter email address
   - Receive OTP code
   - Quick login process

3. **Internet Identity** (Limited on mobile)
4. **Crypto Wallet** (Requires wallet app)

## Troubleshooting

### If mobile can't connect:

1. Check both devices are on same WiFi
2. Verify firewall status: `sudo firewall-cmd --list-ports`
3. Confirm server is running: `lsof -i:3001`
4. Test from computer first: `curl http://192.168.29.210:3001`

### If authentication fails:

- Use Social Login options (Google/GitHub)
- These work without IC backend integration
- Email/OTP also works independently

### Network Issues:

- IP might change if router restarts
- Check current IP: `ip route get 8.8.8.8 | grep -oP 'src \K[0-9.]+' | head -1`
- Update mobile bookmark if IP changed

## Next Steps

1. Start the dev server consistently
2. Test connection from mobile browser
3. Use social authentication for easiest mobile experience
4. Test duo validation system across devices
