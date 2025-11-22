# Revocation Canister (skeleton)

Manages a simple revocation list for VC hashes. This is a starting point: for production, use Merkle roots or IPFS CRLs and anchor roots on-chain.

Example:

```
dfx canister call revocation_canister "addRevocation '(\"sha256:...\")'"
dfx canister call revocation_canister "isRevoked '(\"sha256:...\")'"
```
