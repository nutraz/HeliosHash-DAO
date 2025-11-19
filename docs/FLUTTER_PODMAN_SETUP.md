# Flutter & Podman Development Setup

This guide covers the Flutter and Podman setup for HeliosHash DAO development on Fedora.

## ✅ Flutter Setup (Completed)

### Installation Status
- **Flutter SDK**: ✅ Installed (v3.35.6)
- **Web Support**: ✅ Configured
- **Chrome Browser**: ✅ Installed
- **VS Code Integration**: ✅ Available

### Flutter Commands
```bash
# Run Flutter web app
flutter run -d chrome

# Build for web
flutter build web

# Run in development mode
flutter run -d web-server --web-port 8080

# Hot reload (in development)
# Press 'r' to hot reload, 'R' to hot restart
```

### Flutter Project Structure
```
lib/
├── main.dart           # Main Flutter app entry point
└── screens/           # Screen widgets
web/                   # Web-specific files
├── index.html
├── manifest.json
└── icons/            # Web app icons
```

## ✅ Podman Setup (Completed)

### Installation Status
- **Podman**: ✅ Installed (v5.6.2)
- **Podman Compose**: ✅ Installed (v1.5.0)
- **Container Image**: ✅ Built (hhdao-dev)

### Podman Commands
```bash
# Build development container
podman build -t hhdao-dev -f Dockerfile .

# Run with podman-compose
podman-compose up hhdao-dev

# Run production container
podman-compose up hhdao-prod

# Interactive shell in container
podman run -it --rm hhdao-dev sh

# List running containers
podman ps

# View logs
podman logs hhdao-dev
```

## 🔄 Integration Workflow

### 1. Flutter Development
```bash
# Start Flutter web development
cd /home/nutarzz/HeliosHash-DAO
flutter run -d chrome --web-port 8080
```

### 2. Next.js Development (Current)
```bash
# Development server (running on port 3002)
pnpm dev

# Mobile server (port 3003)
NODE_ENV=development PORT=3003 HOSTNAME=0.0.0.0 npx tsx server.ts
```

### 3. Containerized Development
```bash
# Run Next.js in container
podman-compose up hhdao-dev

# Access at http://localhost:3000
```

## 🌐 Multi-Platform Development

### Current Platform Support
- **Web**: ✅ Next.js (primary) + Flutter (secondary)
- **Mobile**: ✅ Responsive Next.js + QR access
- **Desktop**: ✅ Next.js browser + Flutter desktop (potential)
- **Container**: ✅ Podman/Docker ready

### Port Allocation
- **3001**: Next.js production (Podman)
- **3002**: Next.js development (current)
- **3003**: Mobile server
- **8080**: Flutter web development

## 🚀 Quick Start Commands

### Flutter Web App
```bash
cd /home/nutarzz/HeliosHash-DAO
flutter run -d chrome --web-port 8080
```

### Podman Container
```bash
cd /home/nutarzz/HeliosHash-DAO
podman-compose up -d hhdao-dev
# Access at http://localhost:3000
```

### Current Mobile Setup
```bash
# Already running on port 3003
# Access via QR code or http://192.168.29.210:3003
```

## 🔧 Development Tools Integration

### VS Code Extensions (Recommended)
- **Flutter**: Flutter SDK integration
- **Dart**: Dart language support
- **Podman**: Container management
- **Docker**: Container file syntax

### Flutter Doctor Status
```bash
flutter doctor
# ✅ Flutter, Chrome, Linux toolchain, VS Code
# ❌ Android (optional for web development)
```

## 📱 Mobile Development Options

### Option 1: Flutter Mobile (Native)
- Configure Android/iOS development
- Build native mobile apps
- Full device API access

### Option 2: Current Responsive Web (Active)
- QR code access via mobile browser
- Responsive Next.js design
- Network accessible server

## 🐳 Container Development Workflow

### Development Container
```bash
# Start development environment
podman-compose up hhdao-dev

# Make changes to code (auto-reload enabled)
# Test at http://localhost:3000
```

### Production Testing
```bash
# Build and test production image
podman-compose up hhdao-prod

# Test production build locally
```

---

## 🎯 Next Steps

1. **Choose Primary Mobile Strategy**: Flutter native vs. responsive web
2. **Android Development**: Install Android Studio for mobile builds
3. **Container CI/CD**: Set up automated container builds
4. **Flutter-Next.js Integration**: Decide on API integration approach

---

Your development environment is now ready for:
- ✅ Flutter web development
- ✅ Podman containerization  
- ✅ Multi-platform deployment
- ✅ Mobile responsive design