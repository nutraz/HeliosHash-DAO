# TODO: Fix Failing Tests in HeliosHash DAO Web App

## Overview
There are 22 failing tests across 4 test files. This document outlines the steps to fix them systematically.

## Issues Identified

### 1. LocalGovernanceDashboard Integration Test (1 failure)
- **Test**: `should maintain responsive grid layout`
- **Issue**: Test expects element to have class "max-w-7xl mx-auto" but it's not found
- **Root Cause**: Test selector is targeting wrong element

### 2. India Compliance Test (1 failure)
- **Test**: `should generate accurate monthly compliance summary for Baghpat operations`
- **Issue**: GST alert format mismatch - expects "GST registration may be required (annual turnover projection: ₹60,00,000.00)" but gets different amount
- **Root Cause**: Annual turnover calculation bug in IndiaComplianceService

### 3. Canister Integration Tests (13 failures)
- **Tests**: All tests in `canister-integration.test.ts`
- **Issue**: `daoActor` and `disputeActor` are undefined
- **Root Cause**: `getCanisterActors()` returns empty object

### 4. Treasury Integration Tests (7 failures)
- **Tests**: All tests in `treasuryIntegration.test.ts`
- **Issue**: Cannot find module '@/declarations/treasury'
- **Root Cause**: Treasury declarations mock is incomplete

## Fix Plan

### Step 1: Fix LocalGovernanceDashboard Test
- [ ] Update test selector to target correct container element
- [ ] Verify component has correct classes

### Step 2: Fix India Compliance Service
- [ ] Correct annual turnover calculation in `generateComplianceSummary`
- [ ] Ensure GST alert uses projected annual turnover (monthly * 12)

### Step 3: Implement Canister Actor Mocks
- [ ] Update `getCanisterActors` to return proper mock actors
- [ ] Add mock implementations for required methods (join, getDisputeStats, etc.)

### Step 4: Fix Treasury Declarations Mock
- [ ] Update treasury.ts mock to include createActor function
- [ ] Ensure mock matches test expectations

### Step 5: Run Tests and Verify
- [ ] Run full test suite after each fix
- [ ] Ensure no regressions introduced

## Dependencies
- Files to modify:
  - `src/test/LocalGovernanceDashboard.integration.test.tsx`
  - `src/services/IndiaComplianceService.ts`
  - `src/lib/canister-actors.ts`
  - `src/declarations/treasury.ts`
  - `src/services/wallets/__tests__/treasuryIntegration.test.ts`

## Expected Outcome
- All 22 failing tests pass
- No new test failures introduced
- App functionality remains intact
