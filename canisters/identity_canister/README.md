Identity Canister (skeleton)

Purpose:
- Store VC hashes for principals/subjects
- Provide revocation check

Example usage (dfx):
  dfx canister call identity_canister addVC '("did:ic:principal1","sha256:abcd...")'
  dfx canister call identity_canister getVCs '("did:ic:principal1")'
  dfx canister call identity_canister isRevoked '("sha256:abcd...")'
Identity Canister (skeleton)

Purpose:
- Store VC hashes for principals/subjects
- Provide revocation check

Example usage (dfx):
  dfx canister call identity_canister addVC '("did:ic:principal1","sha256:abcd...")'
  dfx canister call identity_canister getVCs '("did:ic:principal1")'
  dfx canister call identity_canister isRevoked '("sha256:abcd...")'

Notes:
- This is a minimal development scaffold. For production, implement stable structures and signature verification.
# Identity Canister (skeleton)

This canister stores minimal references (VC hashes) anchored for subjects.

Local test commands (example):

1. Start the replica
```
dfx start --background
```

2. Deploy (from repo root)
```
dfx deploy --no-wallet --argument='()'
```

3. Example calls (using dfx canister call):
```
dfx canister call identity_canister "anchorVC '(\"did:ic:abc\", \"sha256:...\", \"did:web:verifier\", 1699990000, null )'"
dfx canister call identity_canister "getVCs '(\"did:ic:abc\")'"
```

Note: This is a lightweight scaffold. Add authentication, storage indexing, and persistent audit anchoring before production use.
