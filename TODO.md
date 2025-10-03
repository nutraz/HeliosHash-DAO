# HeliosHash DAO Fix Plan

## Step 1: Fix import statements
- [ ] Fix `import Map "mo:base/HashMap";` to `import HashMap "mo:base/HashMap";` in canisters/documents/main.mo
- [ ] Fix `import Map "mo:base/HashMap";` to `import HashMap "mo:base/HashMap";` in canisters/identity/main.mo
- [ ] Add `import HashMap "mo:base/HashMap";` and change Map.HashMap to HashMap.HashMap in canisters/dispute-resolution/main.mo

## Step 2: Remove 'stable' keyword from var declarations
- [ ] Remove 'stable' from all var declarations in canisters/dao/main.mo
- [ ] Remove 'stable' from all var declarations in canisters/telemetry/main.mo
- [ ] Remove 'stable' from all var declarations in canisters/identity/main.mo
- [ ] Remove 'stable' from all var declarations in canisters/documents/main.mo

## Step 3: Fix hash function return types
- [ ] Fix votes HashMap hash func to return Nat32 in canisters/dao/main.mo
- [ ] Fix disputes and arbitrators HashMap hash funcs to return Nat32 in canisters/dispute-resolution/main.mo

## Step 4: Remove unused imports
- [ ] Remove unused Blob import in canisters/documents/main.mo

## Step 5: Build and verify
- [ ] Run `dfx build` to compile canisters and generate .did files
- [ ] Verify no compilation errors remain
