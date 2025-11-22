# Verifier Service Canister (skeleton)

This canister provides a minimal interface for issuing VC anchors and receiving attestation notifications.

Notes:
- In production the heavy lifting (document uploads, photo checks, Onfido, KYC workflows) is performed off-chain. This canister can act as a lightweight anchor or as a bridge for proofs.

Example dfx calls:

```
dfx canister call verifier_service "issueVC '(\"did:ic:abc\", \"{...vc payload...}\")'"
```
