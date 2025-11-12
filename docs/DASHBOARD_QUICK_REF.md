# Dashboard Quick Reference Card

## 🎯 Quick Start

```bash
# Explore dashboards interactively
./scripts/explore-dashboards.sh

# Or launch directly:
cd urgamu-project-dashboard && pnpm dev       # Financial dashboard
cd helios#baghpat-dao-village-dashboard && pnpm dev  # IoT dashboard
```

## 📊 Dashboard Overview

### Urgamu Project Dashboard
- **Focus:** Financial & Governance
- **Components:** 5 reusable UI primitives
- **Data:** $22.89M project financials
- **Integration:** Extract patterns to main app

### Helios#Baghpat Village Dashboard
- **Focus:** Live IoT & Community
- **Components:** 7 specialized components
- **Status:** ✅ Partially integrated
- **Location:** `apps/web/src/app/projects/helios-baghpat/`

## 🔧 Key Components to Reuse

| Component | Source | Priority | Purpose |
|-----------|--------|----------|---------|
| `DataTable` | Urgamu | ⭐⭐⭐ | Reusable data grids |
| `LiveDataView` | Baghpat | ⭐⭐⭐ | Real-time metrics |
| `ProjectNode` | Baghpat | ⭐⭐ | Project status cards |
| `Card/Section` | Urgamu | ⭐⭐ | Layout primitives |
| `CommunityHub` | Baghpat | ⭐⭐ | Community interfaces |

## 📝 Migration Pattern

```tsx
// 1. Copy component
cp dashboard/components/DataTable.tsx apps/web/src/components/ui/

// 2. Add Next.js directive (if interactive)
'use client'

// 3. Update imports
import { Component } from '@/components/ui/Component'

// 4. Replace mock data with canister calls
const actor = Actor.createActor(idlFactory, { agent, canisterId })
const data = await actor.get_data()
```

## ⚠️ Compatibility Notes

- **Dashboards:** React 19.2.0 + Vite
- **Main App:** React 18.3.1 + Next.js 14
- **Strategy:** Extract patterns, not entire files
- **Icons:** Use Lucide-react in main app

## 📚 Documentation

- **Overview:** `.github/copilot-instructions.md`
- **Deep Dive:** `docs/DASHBOARD_INTEGRATION.md`
- **Summary:** `docs/DASHBOARD_INTEGRATION_SUMMARY.md`

## 🚀 Common Tasks

### Browse Components
```bash
./scripts/explore-dashboards.sh  # Choose option 3 or 4
```

### Compare Dependencies
```bash
./scripts/explore-dashboards.sh  # Choose option 5
```

### View Integration Guide
```bash
less docs/DASHBOARD_INTEGRATION.md
```

### Test Original Dashboard
```bash
cd urgamu-project-dashboard
pnpm install && pnpm dev
```

## 💡 Best Practices

✅ **DO:**
- Extract patterns, not entire codebases
- Update imports to use `@/` aliases
- Replace mocks with canister calls
- Add `'use client'` for interactive components
- Test in isolation before integrating

❌ **DON'T:**
- Copy entire dashboard apps
- Mix React 19 and React 18.3.1
- Ignore Next.js App Router requirements
- Create duplicate components
- Skip TypeScript type definitions

## 🎨 Styling

Both dashboards use TailwindCSS v3+ with custom themes:
- **Urgamu:** Navy/Gold/Cyan palette
- **Baghpat:** Slate/Cyan/Amber palette
- **Main App:** Compatible with both

## 🔗 Quick Links

- Urgamu Components: `/urgamu-project-dashboard/components/`
- Baghpat Components: `/helios#baghpat-dao-village-dashboard/components/`
- Main App Components: `/apps/web/src/components/`
- Integration Examples: `docs/DASHBOARD_INTEGRATION.md#migration-examples`

---

**Last Updated:** November 12, 2025  
**Status:** ✅ Production Ready
