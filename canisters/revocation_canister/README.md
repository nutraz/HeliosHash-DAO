Revocation Canister

Purpose:
- Store revocation entries and provide lookup for VC revocation info

Example:
  dfx canister call revocation_canister revoke '("sha256:vc1234","did:web:verifier.example.org",1711334600,"fraud suspected")'
  dfx canister call revocation_canister isRevoked '("sha256:vc1234")'
Revocation Canister (skeleton)

Purpose:
- Store revocation entries for VC hashes and provide revocation queries.

Example:
  dfx canister call revocation_canister revoke '("sha256:vc123","did:web:verifier.example.org",1711334600,"fraud suspected")'
  dfx canister call revocation_canister isRevoked '("sha256:vc123")'

Notes:
- Minimal dev scaffold; ensure only authorized issuers can mark revocations in production.
# Revocation Canister (skeleton)

Manages a simple revocation list for VC hashes. This is a starting point: for production, use Merkle roots or IPFS CRLs and anchor roots on-chain.

Example:

```
dfx canister call revocation_canister "addRevocation '(\"sha256:...\")'"
dfx canister call revocation_canister "isRevoked '(\"sha256:...\")'"
```
