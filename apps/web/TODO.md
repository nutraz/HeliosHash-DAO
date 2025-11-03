# ESLint Error Fixes for E2E Tests

## Critical Files (Fix First)
- [ ] src/app/layout.tsx - Fixed pathname null issue
- [ ] src/components/KycVerification.tsx - Fix any types and unused vars
- [ ] src/components/PrivacyDashboard.tsx - Fix any types and unused vars
- [ ] src/app/api/items/route.ts - Fix any types and unused vars
- [ ] src/app/api/items/[id]/route.ts - Fix any types and unused vars
- [ ] src/services/api.projects.spec.ts - Fix any types

## High Priority Files
- [ ] src/components/HHDAODashboard.tsx - Remove unused imports (many)
- [ ] src/components/HHDAOProjectCreation.tsx - Fix unused imports and entities
- [ ] src/services/treasuryService.ts - Fix any types
- [ ] src/services/wallets/treasuryIntegration.ts - Fix any types
- [ ] src/services/privacyComplianceService.ts - Fix any types

## Medium Priority Files
- [ ] src/contexts/DAOContext.tsx - Fix unused vars
- [ ] src/contexts/ProjectsContext.tsx - Fix any types
- [ ] src/hooks/useWallet.ts - Fix any types
- [ ] src/lib/canisterIds.ts - Fix any types and ts-ignore
- [ ] src/services/authService.ts - Fix any types and unused vars

## Low Priority Files (Declarations/Tests)
- [ ] Declaration files (*.did.js) - Fix unused IDL vars
- [ ] Test files - Fix any types and unused vars
- [ ] Global types - Fix any types

## After Fixes
- [ ] Run lint again to verify all errors fixed
- [ ] Run e2e tests
