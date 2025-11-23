Verifier Service Canister

Purpose:
- Anchor issuance events for VCs on-chain (lightweight)
- Optional linkage to project and verification level

Example:
  dfx canister call verifier_service recordIssuance '("sha256:abcd","did:web:verifier.example.org","did:ic:principal1", 1711334400)'
  dfx canister call verifier_service getIssuance '("sha256:abcd")'
Verifier Service Canister (skeleton)

Purpose:
- Anchor issuance events for VCs on-chain (lightweight)
- Optional linkage to project and verification level

Example:
  dfx canister call verifier_service recordIssuance '("sha256:abcd","did:web:verifier.example.org","did:ic:principal1", 1711334400)'
  dfx canister call verifier_service getIssuance '("sha256:abcd")'

Notes:
- Keep heavy verification (Onfido, human queue) off-chain; call this canister to anchor issuance.
