# HeliosHash DAO

Decentralized autonomous organization on Internet Computer.

## Quick Start
```bash
pnpm install
pnpm dev
```

## Project Status (November 2025)

### Recent Improvements
- ✅ **Type Safety Enhanced**: All components now use proper TypeScript interfaces
- ✅ **Performance Optimized**: Event handlers use `useCallback` for optimal re-rendering
- ✅ **Code Quality**: Main page component refactored with improved organization
- ✅ **Build Status**: Clean production builds with zero errors

### Current Features
- 🔐 Multi-auth onboarding (Phone/Email/Wallet)
- 🎭 Role-based access (Investor/Contributor/Landowner/Community)
- 📊 DAO Dashboard with live metrics
- 🗺️ Project visualization map
- 🎁 Rewards and opportunities hub
- 💱 Token exchange interface
- 📝 Project creation and management

### Web Application Architecture

**Tech Stack**: Next.js 14.2.33, React 18, TypeScript, TailwindCSS

**Key Components**:
- Entry system with Ashok Chakra animation
- Authentication flow with validation
- Role selection with KYC requirements
- Main dashboard with navigation
- Project management interface

## Development

### Build & Test
```bash
# Install dependencies
pnpm install

# Development mode
pnpm dev

# Production build
pnpm build

# Type checking
pnpm type-check
```

### Project Structure
```
apps/
  web/                    # Next.js web application
    src/
      app/               # App router pages
        page.tsx         # Main entry page (recently refactored)
        projects/        # Project management
        login/           # Authentication
      components/        # Reusable components
        auth/           # Authentication components
        dashboard/      # Dashboard widgets
        entry/          # Entry animations
        exchange/       # Token exchange
        onboarding/     # User onboarding
        projects/       # Project components
        rewards/        # Rewards system
docs/                    # Comprehensive documentation
```

## Documentation

See [docs/](docs/) for detailed documentation including:
- Architecture overview
- API design specifications
- Smart contract architecture
- Security policies
- Development priorities
- Production readiness assessment

## Contributing

1. Follow TypeScript best practices
2. Use proper type definitions (no `any` types)
3. Implement error handling and validation
4. Write clean, maintainable code
5. Test thoroughly before submitting PRs

## License

MIT License - See LICENSE file for details
