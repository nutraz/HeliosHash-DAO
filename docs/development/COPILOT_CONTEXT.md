# HeliosHash DAO Development Guide

## Quick Reference for GitHub Copilot Optimization

### Project Overview

# HeliosHash DAO Development Guide

## Quick Reference for GitHub Copilot Optimization

### Project Overview

**HeliosHash DAO (HHDAO)** is the **India node of the One World Project (1WP)** - a revolutionary solar energy infrastructure DAO built on Internet Computer Protocol. It serves as a living pilot project in Urgam Valley, Gujarat, demonstrating how renewable energy, community governance, and decentralized job opportunities can transform rural communities.

**🌍 Global Context**: Part of the One World Project (https://www.oneworldproject.io/) - a network of interconnected sustainable infrastructure nodes worldwide, focusing on solar energy, community empowerment, and decentralized governance.

**🎯 India Mission**: Transform rural energy independence through solar-powered microgrids, community job board, DAO governance, and thermal waste heat recovery from Bitcoin mining.

### Key Technologies & Architecture

- **Blockchain**: Internet Computer Protocol (ICP) with Motoko canisters
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI/UX**: Shadcn/UI components, Tailwind CSS, mobile-first design
- **Testing**: Playwright (E2E), Vitest (unit), custom Motoko test framework
- **Development**: DFX (Internet Computer SDK), pnpm, VS Code
- **Integration**: One World Project payment rails, 1WP DAO platform
- **Infrastructure**: Solar microgrids, Bitcoin mining, IoT sensors, edge computing

### Core Features & Contexts

- **Community Job Board** (`/community`) - Solar installation, renewable energy jobs
- **DAO Governance** - Transparent community decision-making for energy projects
- **Mining Operations** - Bitcoin mining with thermal waste heat recovery
- **1WP Integration** - Cross-border remittances, multi-currency (INR/ICP/BTC/USD)
- **Rural Focus** - Urgam Valley pilot, replicable across India villages

---

## Motoko Quick Reference

### Essential Motoko Patterns

#### Actor Definition

```motoko
actor HeliosHashDAO {
    private stable var memberCount : Nat = 0;

    public shared ({ caller }) func joinDAO() : async Result.Result<MemberInfo, Text> {
        // Implementation
    };

    public query func getMemberCount() : async Nat {
        memberCount
    };
}
```

#### Common Imports

```motoko
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Debug "mo:base/Debug";
```

#### Error Handling

```motoko
public func createProject(name : Text) : async Result.Result<Project, Text> {
    if (Text.size(name) == 0) {
        return #err("Project name cannot be empty");
    };

    let project : Project = {
        id = nextProjectId;
        name = name;
        creator = caller;
        status = #Planning;
    };

    #ok(project)
};
```

### Common Data Types

```motoko
type ProjectStatus = {
    #Planning;
    #Active;
    #Completed;
    #Cancelled;
};

type Project = {
    id: Nat;
    name: Text;
    location: Text;
    capacity: Nat;
    creator: Principal;
    status: ProjectStatus;
    createdAt: Int;
};
```

---

## React/TypeScript Patterns

### HeliosHash Component Structure

```typescript
// Component with Canister Integration
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { hhdao } from '@/declarations/hhdao';
import { JobPosting } from '@/types/jobs';

interface ProjectDashboardProps {
  // Props interface
}

export default function ProjectDashboard({}: ProjectDashboardProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  // Canister interaction
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const result = await hhdao.getProjects();
      setProjects(result);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solar Projects</CardTitle>
      </CardHeader>
      <CardContent>{/* Component content */}</CardContent>
    </Card>
  );
}
```

### Custom Hooks for Canisters

```typescript
import { useState, useEffect } from 'react';
import { hhdao_dao } from '@/declarations/hhdao_dao';

export function useDAOProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  const createProposal = async (title: string, description: string) => {
    try {
      setLoading(true);
      const result = await hhdao_dao.createProposal(title, description, { #Project }, 7, null);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { proposals, createProposal, loading };
}
```

---

## Development Commands

### DFX Commands

```bash
# Start local replica
dfx start --clean --background

# Deploy all canisters
dfx deploy

# Deploy specific canister
dfx deploy hhdao

# Generate TypeScript declarations
dfx generate

# Check canister status
dfx canister status --all
```

### Project Commands

```bash
# Development server
pnpm dev

# Run tests
pnpm test:all
pnpm test:canister

# Build project
pnpm build
```

---

## File Structure Context

### Key Directories

```
canisters/
├── hhdao/          # Main business logic canister
│   ├── src/main.mo # Actor entrypoint
│   ├── src/lib.mo  # Core types and logic
│   └── test/       # Motoko tests
├── dao/            # DAO governance canister
├── identity/       # User identity management
├── telemetry/      # Solar data (stub)
└── documents/      # Document workflows (stub)

src/
├── components/     # React components
├── types/          # TypeScript interfaces
├── hooks/          # Custom React hooks
├── services/       # API services
└── declarations/   # Auto-generated canister bindings
```

### Important Files

- `dfx.json` - Canister configuration
- `package.json` - Dependencies and scripts
- `.vscode/settings.json` - VS Code configuration
- `tailwind.config.js` - UI styling configuration

---

## Copilot Context Tips

### When Working with Motoko:

- Always use `async` for public functions
- Handle Results with pattern matching: `switch (result) { case (#ok(val)) {}; case (#err(msg)) {} }`
- Use `shared ({ caller })` for functions needing identity
- Stable variables persist across upgrades: `private stable var`

### When Working with React:

- Use `"use client"` for interactive components
- Import UI components from `@/components/ui/`
- Type canister responses with generated interfaces
- Handle async canister calls with try/catch

### Common Patterns:

- Job Board: `/types/jobs.ts` for interfaces
- Solar Projects: Focus on sustainability and community impact
- DAO Governance: Proposals, voting, member management
- Authentication: Basic client-side auth (not production-ready)

---

## Testing Patterns

### Motoko Tests

```motoko
import { assert } from "test-utils";

public func testCreateProject() : async () {
    let result = await dao.createProject("Solar Farm Alpha", "Gujarat", 100);
    switch (result) {
        case (#ok(project)) {
            assert(project.name == "Solar Farm Alpha");
        };
        case (#err(msg)) {
            assert(false); // Test should pass
        };
    };
};
```

### React Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('create solar project', async ({ page }) => {
  await page.goto('/projects');
  await page.click('[data-testid="create-project-btn"]');
  await page.fill('[name="project-name"]', 'Test Solar Project');
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Test Solar Project')).toBeVisible();
});
```

This guide provides Copilot with comprehensive context about HeliosHash DAO's architecture, patterns, and development practices for optimal code suggestions.
