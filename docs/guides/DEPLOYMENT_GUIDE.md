# 🚀 HHDAO Deployment Guide - October 2025

## 📋 **Quick Deployment Overview**

**System Status**: 95% Production Ready | **Mobile E2E**: ✅ Operational | **Pilot**: ✅ Ready

---

## 🖥️ **Desktop Development Server**

### Standard Development

```bash
# Install dependencies (updated Oct 2025)
pnpm install

# Start desktop development server
pnpm dev
# Available at: http://localhost:3001
```

### Health Monitoring

```bash
# Check system health
pnpm health

# View real-time status
pnpm status

# Monitor with auto-restart
pnpm dev:health
```

---

## 📱 **Mobile E2E Deployment**

### Complete Mobile Server

```bash
# Start mobile-accessible HHDAO server
pnpm mobile
# OR
node mobile_hhdao_server.js

# Available at: http://192.168.29.210:3003
# Includes: Full HHDAO experience, real nutrazz data, QR access
```

### Mobile QR Generation

```bash
# Generate QR codes for mobile access
pnpm mobile:qr
# OR
node generate_mobile_qr.js

# Shows: Terminal QR codes + mobile URLs
```

### Mobile Diagnostics

```bash
# Simple mobile test server
pnpm mobile:test
# OR
node mobile_test_server.js

# Available at: http://192.168.29.210:3002
# Purpose: Basic connectivity testing
```

---

## 🏔️ **Urgam Valley Pilot Deployment**

### Pilot Status Check

```bash
# Check current proximity and readiness
pnpm pilot:status
# OR
node test_current_proximity.js

# Shows: Mumbai location (19.0728°N, 72.8826°E), 668km to Urgam Valley
```

### Launch Pilot System

```bash
# Execute complete pilot launch automation
pnpm pilot:launch
# OR
python3 launch_pilot.py

# Includes: Partner onboarding, infrastructure deployment, coordination
```

---

## 🧪 **Testing & Validation**

### Unit & Integration Tests

```bash
# Run all frontend unit tests (82 tests)
pnpm test:run

# Run with coverage
pnpm test:coverage

# Run E2E browser tests
pnpm test:e2e

# Test specific components
pnpm test:vitest:ui
```

### System Validation

```bash
# Test mobile accessibility
curl http://192.168.29.210:3003 | head -5

# Test desktop server
curl http://localhost:3001/api/status | jq .

# Test canister health
pnpm build:canisters
```

---

## 🌐 **Production Deployment**

### Environment Setup

```bash
# Copy environment template
cp .env.example .env.local

# Set production variables
NEXT_PUBLIC_REAL_USER=nutraazz
NEXT_PUBLIC_OWP_BALANCE=226898
NEXT_PUBLIC_DISABLE_MOCK_MODE=true
```

### Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start

# Available at: http://localhost:3001 (configured port)
```

### Docker Deployment

```bash
# Development environment
pnpm docker:dev

# Production environment
pnpm docker:prod

# With DFX network
pnpm docker:dfx

# Full stack deployment
pnpm docker:all
```

---

## 📊 **Monitoring & Health Checks**

### Real-time Monitoring

```bash
# System status endpoint
curl http://localhost:3001/api/status

# Mobile server status
curl http://192.168.29.210:3003/api/health

# Network connectivity test
ping 192.168.29.210
```

### Log Monitoring

```bash
# Development logs
tail -f dev.log

# Production logs
tail -f server.log

# Real-time health output
pnpm dev:health
```

---

## 🔧 **Troubleshooting**

### Common Issues

#### Mobile Server Not Accessible

```bash
# Check network interface binding
ss -tlnp | grep :3003

# Test local connectivity
curl http://localhost:3003

# Check firewall settings
sudo firewall-cmd --list-all
```

#### Desktop Server Port Conflicts

```bash
# Kill existing processes
pkill -f "tsx server.ts"
pkill -f "next dev"

# Check port usage
ss -tlnp | grep :3001

# Start with different port
PORT=3004 pnpm dev
```

#### Canister Deployment Issues

```bash
# Check DFX status
dfx ping local

# Restart local network
dfx stop && dfx start --clean

# Rebuild canisters
pnpm build:canisters
```

---

## 📱 **Mobile E2E Checklist**

### Complete Mobile Experience

1. **📱 Start Mobile Server**: `pnpm mobile`
2. **🔍 Generate QR Codes**: `pnmp mobile:qr`
3. **📋 Test User Journey**:
   - Scan QR code on phone
   - Verify nutrazz identity (226,898 OWP)
   - Navigate dashboard (responsive design)
   - View solar projects (mobile interface)
   - Access governance (touch-optimized)
   - Check rewards system (NFT gallery)

### Validation Commands

```bash
# Mobile server running
ps aux | grep mobile_hhdao_server

# Network accessibility
curl -I http://192.168.29.210:3003

# QR codes generated
ls -la *qr* *mobile*

# Real data active
curl http://192.168.29.210:3003 | grep -i nutrazz
```

---

## 🎯 **Deployment Scripts Summary**

```bash
# Essential Commands
pnpm dev          # Desktop development server
pnpm mobile       # Mobile E2E server
pnpm mobile:qr    # Generate mobile QR codes
pnpm pilot:launch # Launch Urgam Valley pilot
pnpm test:run     # Run all unit tests
pnpm health       # System health check
pnpm status       # Real-time status
```

---

**🏔️ Ready for Urgam Valley transformation! 🚀**

_Updated: October 4, 2025 | System Status: 95% Production Ready_
