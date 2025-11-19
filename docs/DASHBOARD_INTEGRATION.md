# Dashboard Integration Guide

**Last Updated:** November 12, 2025

## Overview

HeliosHash DAO includes two standalone Vite dashboard applications that demonstrate production-ready UI patterns and components. This guide helps developers understand and integrate these components into the main web application.

## Dashboard Projects

### 1. Urgamu Project Dashboard

**Location:** `/urgamu-project-dashboard/`  
**Purpose:** Complete financial overview and DAO governance visualization for the UrgamU Valley smart city project  
**Status:** ✅ Production-ready standalone app

#### Tech Stack
- **Framework:** Vite + React 19
- **Language:** TypeScript
- **Styling:** TailwindCSS with custom gold/cyan theme
- **Components:** 5 reusable UI primitives

#### Key Components

| Component | Purpose | Migration Priority |
|-----------|---------|-------------------|
| `DataTable.tsx` | Reusable data grid with custom row renderers | ⭐⭐⭐ High |
| `Card.tsx` | Layout primitive for content sections | ⭐⭐ Medium |
| `Section.tsx` | Titled section wrapper with icons | ⭐⭐ Medium |
| `Header.tsx` | Branded header with chakra symbol | ⭐ Low |
| `CodeBlock.tsx` | Syntax-highlighted code display | ⭐ Low |

#### Data Constants (`constants.tsx` - 135 lines)

Contains comprehensive project data:
- **Financial:** Exchange rates, phase costs ($22.89M total project)
- **Governance:** DAO tier structure (Elder/Steward/Citizen)
- **Tokenomics:** UrgamOne token distribution, Energy token mechanics
- **Team:** 95-person team structure with salary bands
- **Milestones:** 36-month project timeline
- **Legal:** IFSCA, SEBI, RBI compliance roadmap

**Migration Note:** Extract financial/governance data structures as TypeScript interfaces for main app.

#### Component Patterns

**DataTable with Custom Renderer:**
```tsx
<DataTable
  headers={['Phase', 'USD', 'INR', 'MATIC', 'ETH', 'BTC']}
  data={totalProjectCost}
  renderRow={(item) => (
    <tr className="border-b border-slate-700 hover:bg-slate-800/50">
      <td className="p-3 font-bold text-slate-200">{item.phase}</td>
      <td className="p-3 text-cyan">{item.usd}</td>
      <td className="p-3 text-slate-300">{item.inr}</td>
    </tr>
  )}
/>
```

**Section Component:**
```tsx
<Section title="DAO Governance" icon="🗳️">
  <DataTable ... />
</Section>
```

#### Running Urgamu Dashboard

```bash
cd urgamu-project-dashboard
pnpm install
pnpm dev  # Runs on Vite default port (5173)
```

### 2. Helios#Baghpat Village Dashboard

**Location:** `/helios#baghpat-dao-village-dashboard/`  
**Purpose:** Live IoT data visualization and community management for Baghpat solar project  
**Status:** ✅ Production-ready, **already integrated** in main web app

#### Tech Stack
- **Framework:** Vite + React 19
- **Language:** TypeScript
- **Styling:** TailwindCSS with slate/cyan/amber theme
- **Custom Fonts:** Orbitron (sci-fi aesthetic)

#### Key Components

| Component | Purpose | Integration Status |
|-----------|---------|-------------------|
| `Dashboard.tsx` | Tab navigation container | ✅ Pattern used in main app |
| `LiveDataView.tsx` | Real-time IoT metrics with auto-refresh | ⚠️ Partially integrated |
| `ProjectNode.tsx` | Project status card with metrics | ⭐⭐⭐ High priority |
| `CommunityHub.tsx` | Community engagement interface | ⭐⭐ Medium |
| `OpportunitiesBoard.tsx` | Task/bounty board | ⭐⭐ Medium |
| `LoginScreen.tsx` | Wallet connection flow | ✅ Integrated (AuthContext) |
| `IconComponents.tsx` | Custom icon library (Sun, Zap, etc.) | ⚠️ Use Lucide-react instead |

#### Integration Status

**Already Integrated in Main App:**
- Route: `apps/web/src/app/projects/helios-baghpat/`
- Live data hook: `apps/web/src/lib/api/heliosBaghpat.ts`
- Components: `apps/web/src/components/project/HeliosBaghpatOverview.tsx`

**Integration Example:**
```tsx
// Main app uses this pattern from Baghpat dashboard
import { fetchLiveStats } from '@/lib/api/heliosBaghpat'

function useHeliosLiveStats(projectId: string, refreshInterval: number) {
  const [data, setData] = useState<LiveStats | null>(null)
  
  useEffect(() => {
    const interval = setInterval(async () => {
      const stats = await fetchLiveStats(projectId)
      setData(stats)
    }, refreshInterval)
    return () => clearInterval(interval)
  }, [projectId, refreshInterval])
  
  return { data, loading: !data }
}
```

#### Component Patterns

**Real-Time Data Updates:**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    setLiveData(prevData => ({
      ...prevData,
      current_kW: parseFloat((prevData.current_kW + (Math.random() - 0.5) * 2).toFixed(2)),
      today_kWh: Math.round(prevData.today_kWh + Math.random() * 2),
      temp: `${(42 + (Math.random() - 0.5) * 2).toFixed(1)}°C`
    }));
    setLastUpdated(new Date());
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

**Tab Navigation:**
```tsx
const [activeTab, setActiveTab] = useState<Tab>(Tab.Overview)

const tabs = [Tab.Overview, Tab.LiveData, Tab.Community, Tab.Opportunities]

tabs.map((tab) => (
  <button
    onClick={() => setActiveTab(tab)}
    className={activeTab === tab ? 'border-b-2 border-cyan-400' : ''}
  >
    {tab}
  </button>
))
```

#### Running Baghpat Dashboard

```bash
cd helios#baghpat-dao-village-dashboard  # Note: # in directory name
pnpm install
pnpm dev  # Runs on Vite default port (5173)
```

## Integration Strategy

### Approach 1: Component Migration (Recommended)

**For individual components that fit specific needs:**

```bash
# Example: Migrating DataTable from Urgamu
cp urgamu-project-dashboard/components/DataTable.tsx \
   apps/web/src/components/ui/DataTable.tsx

# Update imports in the new file
# Change: import React from 'react'
# To:     'use client' (if needed for Next.js App Router)
```

**Migration Checklist:**
- [ ] Add `'use client'` directive if component uses hooks/state
- [ ] Update import paths to use `@/` aliases
- [ ] Replace custom icons with Lucide-react equivalents
- [ ] Ensure TailwindCSS classes are compatible (both use v3+)
- [ ] Replace mock data with canister actor calls
- [ ] Add proper TypeScript interfaces

### Approach 2: Shared Package (Future)

**For systematic reuse across projects:**

```bash
# Create shared UI package
mkdir -p packages/ui-components/src
cp urgamu-project-dashboard/components/* packages/ui-components/src/
cp helios#baghpat-dao-village-dashboard/components/* packages/ui-components/src/

# Add to pnpm-workspace.yaml
# packages:
#   - 'packages/ui-components'
```

**Not recommended yet** - Wait until patterns stabilize.

### Approach 3: Reference Implementation (Current)

**Keep dashboards as standalone reference apps:**

- ✅ Demonstrates production UI patterns
- ✅ Independent versioning (React 19 vs main app React 18.3.1)
- ✅ Can run/test in isolation
- ✅ No complex dependency management
- ⚠️ Requires manual pattern extraction

## Key Differences: Dashboards vs Main App

| Aspect | Dashboard Projects | Main Web App |
|--------|-------------------|--------------|
| **React Version** | 19.2.0 | 18.3.1 |
| **Build Tool** | Vite | Next.js 14 |
| **Routing** | None (SPA) | App Router |
| **Auth** | Mock wallet simulation | localStorage + AuthContext |
| **Data Source** | Mock/hardcoded | ICP canisters |
| **Icons** | Custom + inline SVG | Lucide-react |
| **State** | useState only | useState + Context |

## Migration Examples

### Example 1: Migrating Urgamu's DataTable

**Original (Vite + React 19):**
```tsx
// urgamu-project-dashboard/components/DataTable.tsx
import React from 'react';

interface DataTableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T) => React.ReactNode;
}

function DataTable<T>({ headers, data, renderRow }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-900 border-b-2 border-cyan">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="p-3 text-left">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{data.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

export default DataTable;
```

**Migrated (Next.js 14 + App Router):**
```tsx
// apps/web/src/components/ui/DataTable.tsx
'use client'

import React from 'react'

interface DataTableProps<T> {
  headers: string[]
  data: T[]
  renderRow: (item: T, index: number) => React.ReactNode
}

export function DataTable<T>({ headers, data, renderRow }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-700">
      <table className="w-full">
        <thead className="bg-slate-900 border-b-2 border-cyan-500">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="p-3 text-left text-slate-300 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <React.Fragment key={idx}>
              {renderRow(item, idx)}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

**Usage in Main App:**
```tsx
// apps/web/src/app/treasury/page.tsx
import { DataTable } from '@/components/ui/DataTable'

const treasuryData = [
  { phase: 'Phase 1', usd: '$285k', status: 'Active' },
  { phase: 'Phase 2', usd: '$1.2M', status: 'Pending' }
]

<DataTable
  headers={['Phase', 'USD', 'Status']}
  data={treasuryData}
  renderRow={(item) => (
    <tr className="border-b border-slate-700 hover:bg-slate-800/50">
      <td className="p-3">{item.phase}</td>
      <td className="p-3 text-cyan-400">{item.usd}</td>
      <td className="p-3">{item.status}</td>
    </tr>
  )}
/>
```

### Example 2: Migrating LiveDataView Pattern

**From Baghpat Dashboard:**
```tsx
// helios#baghpat-dao-village-dashboard/components/LiveDataView.tsx
const [liveData, setLiveData] = useState<LiveData>({
  current_kW: 94.2,
  today_kWh: 847,
  temp: "42°C"
})

useEffect(() => {
  const interval = setInterval(() => {
    setLiveData(prevData => ({
      ...prevData,
      current_kW: parseFloat((prevData.current_kW + (Math.random() - 0.5) * 2).toFixed(2))
    }))
  }, 5000)
  return () => clearInterval(interval)
}, [])
```

**Adapted for Main App (with Canister Integration):**
```tsx
// apps/web/src/components/project/LiveEnergyMetrics.tsx
'use client'

import { useState, useEffect } from 'react'
import { Actor, HttpAgent } from '@dfinity/agent'

export function LiveEnergyMetrics({ projectId }: { projectId: string }) {
  const [metrics, setMetrics] = useState<EnergyMetrics | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      const agent = new HttpAgent({ host: process.env.NEXT_PUBLIC_IC_HOST })
      const canisterId = process.env.NEXT_PUBLIC_PROJECT_HUB_CANISTER_ID
      const actor = Actor.createActor(idlFactory, { agent, canisterId })
      
      const result = await actor.get_live_metrics(projectId)
      if ('ok' in result) {
        setMetrics(result.ok)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 10_000) // Real canister polling
    return () => clearInterval(interval)
  }, [projectId])

  if (!metrics) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      <MetricCard label="Current Output" value={`${metrics.current_kW} kW`} />
      <MetricCard label="Today's Energy" value={`${metrics.today_kWh} kWh`} />
      <MetricCard label="Panel Temp" value={metrics.temp} />
    </div>
  )
}
```

## Best Practices

### ✅ Do

- Extract **patterns** and **component structures**, not entire files
- Update imports to use `@/` path aliases
- Replace mock data with canister calls
- Add `'use client'` for interactive components in Next.js App Router
- Use existing UI libraries (Radix UI, Lucide-react) when available
- Keep dashboard projects as reference implementations
- Document which patterns you've migrated

### ❌ Don't

- Copy entire dashboard apps wholesale
- Mix React 19 and React 18.3.1 dependencies
- Ignore Next.js App Router requirements (`'use client'`, async Server Components)
- Use custom icon implementations when Lucide-react exists
- Create duplicate components - check `apps/web/src/components/` first
- Ignore TypeScript type safety

## Testing Migrated Components

```bash
# Test in main web app
cd apps/web
pnpm dev  # Visit http://localhost:3002

# Test original dashboard
cd urgamu-project-dashboard
pnpm dev  # Visit http://localhost:5173

# Run unit tests
cd apps/web
pnpm test:run  # Vitest
```

## Future Improvements

### Short Term (Q4 2025)
- [ ] Create `packages/ui-components` for shared primitives
- [ ] Standardize on single React version across monorepo
- [ ] Add Storybook for component documentation
- [ ] Migrate Urgamu financial components to main treasury section

### Long Term (2026)
- [ ] Consolidate dashboards into main app as dedicated routes
- [ ] Create design system package
- [ ] Add E2E tests for dashboard workflows
- [ ] Build component migration CLI tool

## Related Documentation

- [Main Copilot Instructions](../.github/copilot-instructions.md)
- [Architecture Overview](./architecture.md)
- [Web App README](../apps/web/README.md)
- [API Design](../API_DESIGN.md)

---

**Questions?** Check existing components in `apps/web/src/components/` before migrating. Many patterns may already exist!
