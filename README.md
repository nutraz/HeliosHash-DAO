# HeliosHash DAO
  <img src="apps/web/public/hhdaologo.svg" alt="HeliosHash DAO Logo" width="400" style="animation: pulse 2s infinite;" />
  
  # HeliosHash DAO
  **A OneWorldProject Initiative India** 
  **https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity**
  **Decentralized Renewable Energy Platform on Internet Computer**


  
  [![CI Status](https://github.com/nutraz/HeliosHash-DAO/actions/workflows/ci.yml/badge.svg)](https://github.com/nutraz/HeliosHash-DAO/actions)
  [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
  
</div>

---

A decentralized autonomous organization built on the Internet Computer Protocol (ICP) with a modern Next.js frontend and Flutter mobile app. HeliosHash DAO enables community-driven renewable energy projects with transparent governance and tokenized participation.
  
  ** Refer to **
https://claude.ai/public/artifacts/d610b349-a837-47d7-a9f1-82b913b9d88e  Claude (AI Security Auditor) Date: November 19, 2025
https://claude.ai/public/artifacts/bf7b4445-dac1-4e25-b87d-6fb0fbfb17e1  UI look Feel
https://claude.ai/public/artifacts/b60c6997-4a0b-4730-a792-742859d59e55 Project creation flow 
https://claude.ai/public/artifacts/75542e5a-9fa9-42b8-b636-55080e9b4dba Dashboard

## 🏗️ Architecture

### Backend: Internet Computer
- **Language**: Motoko
- **Canisters**: Modular smart contracts for DAO functionality
- **Location**: `/canisters/` directory

### Frontend: Next.js Web Application  
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Location**: `/apps/web/` directory

### Mobile: Flutter Application
- **Framework**: Flutter 3.35.7
- **Language**: Dart
- **Platforms**: Android, iOS, Linux desktop
- **Location**: `/apps/mobile/` directory

### Smart Contracts
- **Solidity**: Bridge and integration contracts
- **Location**: `/contracts/` directory

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
dfx start --background
dfx deploy
dfx generate  # Regenerate TypeScript bindings
```

## 🚀 Vercel Deployment

### Quick Deploy
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub → Select `HeliosHash-DAO`
3. Configure project:
  - **Framework**: Next.js
  - **Root Directory**: `apps/web`
  - **Build Command**: `cd apps/web && pnpm build`
  - **Output Directory**: `.next`
4. Add environment variables from `.env.vercel.example`

### Environment Variables
Copy all variables from `.env.vercel.example` to your Vercel project settings.

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from web directory
cd apps/web && vercel --prod
```

## 🔧 Key Features

- **DAO Governance**: Proposal creation, voting, execution
- **Token Management**: HHU token distribution and rewards  
- **Project Hub**: Renewable energy project coordination
- **Identity System**: Multi-modal authentication and KYC
- **Mobile Access**: Full-featured Flutter mobile app
- **Social Integration**: Community engagement framework

**Project Phases**:
- **Phase 1**: Baghpat pilot implementation
- **Phase 2**: Urgam Valley SEZ national rollout

## 📱 Platforms

- **Web**: Desktop and mobile browsers
- **Android**: Native mobile app
- **iOS**: Native mobile app (requires macOS for build)
- **Linux**: Desktop application

## 🔧 CI/CD

GitHub Actions workflows automatically build and test on every push:
- **Flutter CI**: Builds Android APK, runs analysis
- **Web CI**: Builds Next.js production bundle
- **Backend CI**: Deploys IC canisters

View workflow status: [GitHub Actions](https://github.com/nutraz/HeliosHash-DAO/actions)

## 🗂️ Module Architecture

| Feature           | Path                                  | Status      |
|-------------------|---------------------------------------|-------------|
| NFT System        | `apps/web/src/components/nft/*`       | Canonical   |
| Village Dashboard | `apps/web/src/app/urgamu-delhi/*`     | Active      |
| Legacy Villages   | `apps/web/src/app/villages/`          | Deprecated  |
| UrgamU Module     | `src/modules/UrgamUDelhi/*`           | Reusable UI |
| Shared Components | `src/`                                | Core UI     |

## 🛠️ Troubleshooting

- Ensure DFX is running for canister operations
- Regenerate TypeScript bindings after canister changes (`dfx generate`)
- See [docs/CRITICAL_FIXES_TODO.md](docs/CRITICAL_FIXES_TODO.md) for urgent issues
- Check mock auth implementation for development
- Verify canister IDs in frontend configuration

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📄 License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## 📚 Documentation

- **Full Documentation**: [docs/](docs/)
- **Project Vision**: [docs/COPILOT_CONTEXT.md](docs/COPILOT_CONTEXT.md)
- **API Design**: [API_DESIGN.md](API_DESIGN.md)
- **Development Status**: [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md)
- **Security Checklist**: [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md)
- **Critical Fixes**: [docs/CRITICAL_FIXES_TODO.md](docs/CRITICAL_FIXES_TODO.md)
- **Repo Cleanup**: [docs/REPO_CLEANUP_SUMMARY.md](docs/REPO_CLEANUP_SUMMARY.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

<div align="center">
  Made with ❤️ by the OneWorldProject Community
</div>



<div align="center">
  <img src="apps/web/public/hhdaologo.svg" alt="HeliosHash DAO Logo" width="400" style="animation: pulse 2s infinite;" />
  
  # HeliosHash DAO
  **A OneWorldProject Initiative India** 
  **https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity**
  **Decentralized Renewable Energy Platform on Internet Computer**
  
  [![CI Status](https://github.com/nutraz/HeliosHash-DAO/actions/workflows/ci.yml/badge.svg)](https://github.com/nutraz/HeliosHash-DAO/actions)
  [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
  
</div>

<style>
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}
</style>

---

A decentralized autonomous organization built on the Internet Computer Protocol (ICP) with a modern Next.js frontend and Flutter mobile app. HeliosHash DAO enables community-driven renewable energy projects with transparent governance and tokenized participation.

## 🏗️ Architecture

### Backend: Internet Computer
- **Language**: Motoko
- **Canisters**: Modular smart contracts for DAO functionality
- **Location**: `/canisters/` directory

### Frontend: Next.js Web Application  
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **Location**: `/apps/web/` directory

### Mobile: Flutter Application
- **Framework**: Flutter 3.35.7
- **Language**: Dart
- **Platforms**: Android, iOS, Linux desktop
- **Location**: `/apps/mobile/` directory

### Smart Contracts
- **Solidity**: Bridge and integration contracts
- **Location**: `/contracts/` directory

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
dfx start --background
dfx deploy
dfx generate  # Regenerate TypeScript bindings
```

## 🚀 Vercel Deployment

### Quick Deploy
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub → Select `HeliosHash-DAO`
3. Configure project:
  - **Framework**: Next.js
  - **Root Directory**: `apps/web`
  - **Build Command**: `cd apps/web && pnpm build`
  - **Output Directory**: `.next`
4. Add environment variables from `.env.vercel.example`

### Environment Variables
Copy all variables from `.env.vercel.example` to your Vercel project settings.

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from web directory
cd apps/web && vercel --prod
```

## 🔧 Key Features

- **DAO Governance**: Proposal creation, voting, execution
- **Token Management**: HHU token distribution and rewards  
- **Project Hub**: Renewable energy project coordination
- **Identity System**: Multi-modal authentication and KYC
- **Mobile Access**: Full-featured Flutter mobile app
- **Social Integration**: Community engagement framework

**Project Phases**:
- **Phase 1**: Baghpat pilot implementation
- **Phase 2**: Urgam Valley SEZ national rollout

## 📱 Platforms

- **Web**: Desktop and mobile browsers
- **Android**: Native mobile app
- **iOS**: Native mobile app (requires macOS for build)
- **Linux**: Desktop application

## 🔧 CI/CD

GitHub Actions workflows automatically build and test on every push:
- **Flutter CI**: Builds Android APK, runs analysis
- **Web CI**: Builds Next.js production bundle
- **Backend CI**: Deploys IC canisters

View workflow status: [GitHub Actions](https://github.com/nutraz/HeliosHash-DAO/actions)

## 🗂️ Module Architecture

| Feature           | Path                                  | Status      |
|-------------------|---------------------------------------|-------------|
| NFT System        | `apps/web/src/components/nft/*`       | Canonical   |
| Village Dashboard | `apps/web/src/app/urgamu-delhi/*`     | Active      |
| Legacy Villages   | `apps/web/src/app/villages/`          | Deprecated  |
| UrgamU Module     | `src/modules/UrgamUDelhi/*`           | Reusable UI |
| Shared Components | `src/`                                | Core UI     |

## 🛠️ Troubleshooting

- Ensure DFX is running for canister operations
- Regenerate TypeScript bindings after canister changes (`dfx generate`)
- See [docs/CRITICAL_FIXES_TODO.md](docs/CRITICAL_FIXES_TODO.md) for urgent issues
- Check mock auth implementation for development
- Verify canister IDs in frontend configuration

## 🤝 Contributing

Contributions are welcome! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

## 📄 License

Apache 2.0 - See [LICENSE](LICENSE) for details.

## 📚 Documentation

- **Full Documentation**: [docs/](docs/)
- **Project Vision**: [docs/COPILOT_CONTEXT.md](docs/COPILOT_CONTEXT.md)
- **API Design**: [API_DESIGN.md](API_DESIGN.md)
- **Development Status**: [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md)
- **Security Checklist**: [docs/SECURITY_CHECKLIST.md](docs/SECURITY_CHECKLIST.md)
- **Critical Fixes**: [docs/CRITICAL_FIXES_TODO.md](docs/CRITICAL_FIXES_TODO.md)
- **Repo Cleanup**: [docs/REPO_CLEANUP_SUMMARY.md](docs/REPO_CLEANUP_SUMMARY.md)
- **Changelog**: [CHANGELOG.md](CHANGELOG.md)

---

<div align="center">
  Made with ❤️ by the OneWorldProject Community
</div>


