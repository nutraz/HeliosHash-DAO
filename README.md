<div align="center">
  <img src="apps/web/public/hhdaologo.svg" alt="HeliosHash DAO Logo" width="400"/>
  
  # HeliosHash DAO
  **A OneWorldProject Initiative India**https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity**
  **Decentralized Renewable Energy Platform on Internet Computer**
  
  [![CI Status](https://github.com/nutraz/HeliosHash-DAO/actions/workflows/ci.yml/badge.svg)](https://github.com/nutraz/HeliosHash-DAO/actions)
  [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
  
</div>

---

A decentralized autonomous organization built on the Internet Computer Protocol (ICP) with a modern Next.js frontend and Flutter mobile app. HeliosHash DAO enables community-driven renewable energy projects with transparent governance and tokenized participation.

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/nutraz/HeliosHash-DAO.git
cd HeliosHash-DAO

# Automated setup (recommended)
./scripts/dev-setup.sh

# Or manual setup
pnpm install
dfx start --background --clean
dfx deploy
pnpm dev
```

Visit [http://localhost:3002](http://localhost:3002) to see your app.

## 🏗️ Architecture

### Backend: Internet Computer
- **Language**: Motoko
- **Canisters**: Modular smart contracts for DAO functionality
- **Location**: `/apps/backend/` directory

### Frontend: Next.js Web Application  
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Location**: `/apps/web/` directory

### Mobile: Flutter Application
- **Framework**: Flutter 3.35.7
- **Language**: Dart
- **Platforms**: Android, iOS, Linux desktop
- **Location**: `/apps/mobile/` directory

### Key Features
- **DAO Governance**: Proposal creation, voting, execution
- **Token Management**: HHU token distribution and rewards
- **Project Hub**: Renewable energy project coordination
- **Identity System**: Multi-modal authentication and KYC
- **Mobile Access**: Full-featured Flutter mobile app
- **Social Integration**: Community engagement framework

**Key Components**:
- Entry system with animated splash screen
- Authentication flow with validation
- Role selection with KYC requirements
- Main dashboard with navigation
- Project management interface
- Mobile-first responsive design

## 💻 Development

### Web Development
```bash
cd apps/web
pnpm install
pnpm dev  # Runs on port 3002
```

### Mobile Development
```bash
cd apps/mobile
flutter pub get
flutter run  # For Android/iOS
flutter run -d linux  # For Linux desktop
```

### Backend Development
```bash
cd apps/backend
dfx start --background
dfx deploy
```

## 🔧 CI/CD

GitHub Actions workflows automatically build and test on every push:
- **Flutter CI**: Builds Android APK, runs analysis
- **Web CI**: Builds Next.js production bundle
- **Backend CI**: Deploys IC canisters

View workflow status: [GitHub Actions](https://github.com/nutraz/HeliosHash-DAO/actions)

## 📱 Platforms

- **Web**: Desktop and mobile browsers
- **Android**: Native mobile app
- **iOS**: Native mobile app (requires macOS for build)
- **Linux**: Desktop application

## �� Contributing

Contributions are welcome! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## 🔗 Links

- **Documentation**: [Full Docs](docs/)
- **API Design**: [API_DESIGN.md](API_DESIGN.md)
- **Development Status**: [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

<div align="center">
  Made with ❤️ by the HeliosHash DAO community
</div>
