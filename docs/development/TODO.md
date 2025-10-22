# HeliosHash DAO Repository Fixes - TODO List

## Phase 1: Replace Deprecated Hash.hash Usage

- [ ] canisters/micro_grants/src/enhanced_main.mo - Replace Hash.hash with custom natHash
- [ ] canisters/micro_grants/src/main.mo - Replace Hash.hash with custom natHash
- [ ] canisters/compute/main.mo - Replace Hash.hash with custom natHash
- [ ] canisters/telemetry/main.mo - Replace Hash.hash with custom natHash

## Phase 2: Fix Type Inconsistencies

- [ ] canisters/micro_grants/src/main.mo - Standardize on GrantApplicationV2 type
- [ ] canisters/micro_grants/src/enhanced_main.mo - Ensure consistent type usage

## Phase 3: Remove Deprecated Imports

- [ ] Remove unused Hash imports from canisters that no longer need them
- [ ] Update import statements across affected files

## Phase 4: Add Custom Hash Functions

- [ ] Add natHash function to canisters missing it (compute, telemetry)
- [ ] Ensure all canisters follow hhdao/src/lib.mo pattern

## Phase 5: Verification & Testing

- [ ] Verify all canisters compile successfully
- [ ] Check Web3 compliance and ICP best practices
- [ ] Run integration tests
- [ ] Update documentation if needed

## Progress Tracking

- Started: $(date)
- Last Updated: $(date)
- Completed: 0/15 tasks
