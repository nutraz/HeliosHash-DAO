# Currency Formatting Refactor Progress

This document tracks the progress of standardizing currency formatting throughout the HeliosHash DAO application.

## Goal

Replace all ad-hoc currency formatting with the centralized formatting utilities:

- `formatOWP()` for OWP token amounts
- `formatINR()` for Indian Rupee amounts
- `formatCurrency()` when the currency type is dynamic

## Priority Classification

### High Priority (User-Facing Components)

- [x] `src/components/wallet/WalletBalance.tsx`
- [x] `src/components/dashboard/RewardsSummary.tsx`
- [x] `src/components/mining/MiningOperations.tsx`
- [x] `src/components/projects/ProjectCard.tsx`
- [x] `src/components/community/opportunities/JobCard.tsx`

### Medium Priority (Administrative Components)

- [ ] `src/app/dashboard/page.tsx` - Dashboard metrics
- [ ] `src/components/dashboard/ProjectMap.tsx` - Project value overlays

### Low Priority (Internal/Developer-Facing)

- [ ] Test files with hardcoded currency values
- [ ] Documentation examples
- [ ] Mock data files

## Implementation Status

### Completed

- [x] Created `format.ts` with formatting utilities
- [x] Added unit tests for formatting functions
- [x] Updated `WalletBalance` component
- [x] Updated `RewardsSummary` component
- [x] Created currency scan script
- [x] Implemented `MiningOperations` with standardized formatting
- [x] Refactored `ProjectCard` with `formatCurrency` support
- [x] Refactored `JobCard` removing manual compensation strings
- [x] Introduced ESLint rule `no-raw-currency` and escalated to error
- [x] Added Husky pre-commit hook enforcing lint + tests + scan
- [x] Established service layer (wallet & rewards) enabling future backend integration without formatting regressions
- [x] Added `ServiceFactory` enabling dependency injection & environment-based service swapping

### In Progress

- [ ] Medium-priority component refactors (`dashboard/page.tsx`, `ProjectMap.tsx`)

### Planned

- [ ] Apply formatting to medium-priority components
- [ ] Update main README with formatting & service layer guidelines reference
- [ ] Add CI job to run currency scan separately from pre-commit hook

## Scan Results (Snapshot)

Run `pnpm scan:currency` for the latest findings. High-impact pages include mining, projects, community/job listings.

## Next Steps

1. Complete medium-priority component updates (dashboard metrics & project map overlays).
2. Add README section referencing currency policy and service abstraction.
3. Consider react-query integration for caching while preserving formatting responsibility in one layer.
4. Add CI enforcement for currency scan alongside ESLint to catch missed literals outside commit path (e.g., during merges).
5. Expand formatting tests to include parsing edge cases and round-trip validation.
