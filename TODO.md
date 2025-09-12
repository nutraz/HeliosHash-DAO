# TODO: Fix Motoko Hash.hash Warning and Frontend Security Policy

## Tasks
- [x] Add custom natHash function to canisters/hhdao/src/lib.mo
- [x] Update HashMap initializations in canisters/hhdao/src/lib.mo to use natHash instead of Hash.hash
- [x] Create src/hhdao_frontend/.ic-assets.json5 with standard security policy
- [x] Run dfx build hhdao to verify Motoko warning is resolved
- [ ] Run dfx deploy hhdao_frontend to verify security policy warning is resolved
