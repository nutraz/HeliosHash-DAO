# HeliosHash DAO

A decentralized autonomous organization built on the Internet Computer Protocol (ICP) with a modern Next.js frontend. HeliosHash DAO enables community-driven renewable energy projects with transparent governance and tokenized participation.

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

Visit [http://localhost:3001](http://localhost:3001) to see your app.

## 🏗️ Architecture

### Backend: Internet Computer
- **Language**: Motoko
- **Canisters**: Modular smart contracts for DAO functionality
- **Location**: `/canisters/` directory

### Frontend: Next.js Application
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Location**: `/app/`, `/src/` directories

### Key Components
- **DAO Governance**: Proposal creation, voting, execution
- **Token Management**: HHU token distribution and rewards
- **Project Hub**: Renewable energy project coordination
- **Identity System**: Multi-modal authentication and KYC

**Key Components**:
- Entry system with Ashok Chakra animation
- Authentication flow with validation
- Role selection with KYC requirements
- Main dashboard with navigation
- Project management interface

## 💻 Development

### Prerequisites

- **Node.js** 18+
- **DFX SDK** (Internet Computer)
- **pnpm** package manager

### Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server

# Testing
pnpm test:run         # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm test:canister    # Run Motoko tests

# Internet Computer
dfx start             # Start local IC replica
dfx deploy            # Deploy canisters
dfx generate          # Generate type declarations

# Utilities
pnpm setup            # Automated environment setup
pnpm clean            # Clean build artifacts
```

### Project Structure

```
canisters/              # Motoko backend canisters
├── hhdao/             # Main DAO logic
├── governance/        # Governance canister
├── treasury/          # Treasury management
└── test-runner/       # Test utilities

app/                   # Next.js frontend (App Router)
├── (dashboard)/       # Dashboard routes
├── auth/             # Authentication pages
├── projects/         # Project management
└── globals.css       # Global styles

src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── declarations/     # Generated canister bindings
└── lib/              # Utility functions

docs/                  # Documentation
scripts/               # Development scripts
```

## 🧪 Testing

- **Unit Tests**: Vitest with React Testing Library
- **E2E Tests**: Playwright for full application flows
- **Canister Tests**: Custom Motoko test runner
- **Type Checking**: TypeScript strict mode

## 📚 Documentation

Comprehensive documentation in [`docs/`](docs/):

- [`docs/architecture.md`](docs/architecture.md) - System architecture
- [`docs/development-setup.md`](docs/development-setup.md) - Development guide
- [`docs/API_DESIGN.md`](docs/API_DESIGN.md) - API specifications
- [`docs/SMART_CONTRACT_ARCHITECTURE.md`](docs/SMART_CONTRACT_ARCHITECTURE.md) - Canister design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Install dependencies: `pnpm install`
4. Start development: `pnpm dev`
5. Run tests: `pnpm test:run`
6. Commit changes: `git commit -m 'feat: add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Development Workflow

- Use [Conventional Commits](https://conventionalcommits.org/)
- Run tests before submitting PRs
- Update documentation for new features
- Follow TypeScript strict mode guidelines

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Internet Computer Documentation](https://internetcomputer.org/docs/current/developer-docs/quickstart/hello10mins)
- [Motoko Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Next.js Documentation](https://nextjs.org/docs)

1. Follow TypeScript best practices
2. Use proper type definitions (no `any` types)
3. Implement error handling and validation
4. Write clean, maintainable code
5. Test thoroughly before submitting PRs

## License

MIT License - See LICENSE file for details
