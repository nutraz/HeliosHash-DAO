# Verifiable Credential (VC) Spec for HeliosHash DAO

This document specifies the VC format and issuance/verification flows used by the HeliosHash DAO project (privacy-first, ICP-first design). The spec covers JWT-style VCs for ease of implementation plus notes on Linked Data Proofs where applicable.

## Design principles
- Minimal claims: VCs should contain only necessary claims (no raw PII).
- Hash-only references: store only document hashes or CIDs on-chain (never raw Aadhaar/PAN or biometrics).
- Short lived attestations when needed: use `iat`/`exp` and versioning to allow rotation.
- Selective disclosure: prefer presenting hashes and zero-knowledge protocols for sensitive data (future work).

## Common fields (JWT-style)

- `iss` (issuer): DID or URL representing the verifier (e.g. `did:web:verifier.heliosexample.org`).
- `sub` (subject): subject DID (ICP principal DID or did:ic: scheme) or principal hex.
- `iat` / `exp`: issued-at and expiry timestamps.
- `vc`: object containing VC specific claims.
- `proof`: cryptographic proof (JWS / LD proof). For JWT-style VCs we store `proof.jws`.

## Example structure (compact JWT-like)

```
{
  "iss": "did:web:verifier.example.org",
  "sub": "did:ic:abcd1234",
  "iat": 1711334400,
  "exp": 1713926400,
  "vc": {
    "type": ["VerifiableCredential", "KYCClaim"],
    "credentialSubject": {
      "nameHash": "sha256:...",
      "documentType": "Aadhaar",
      "documentHash": "sha256:...",
      "verificationLevel": 3,
      "projectRelation": "Helios#Baghpat",
      "role": "land_owner",
      "attestor": "did:web:sarpanch.example.org"
    }
  },
  "proof": { "type": "Ed25519Signature2020", "jws": "..." }
}
```

Notes:
- `nameHash` and `documentHash` use a canonical hashing scheme (e.g. SHA-256) and include a prefix like `sha256:` to indicate algorithm.
- `verificationLevel` is an integer reflecting cumulative confidence (1..5). The verifier_service defines mapping rules for levels.

## VC issuance flow (high level)

1. User initiates onboarding via the frontend (Next.js or mobile). The app requests a QR or direct upload endpoint from `verifier_service`.
2. User uploads documents (photo ID, selfie) or is routed to in-person verification.
3. `verifier_service` runs checks (Onfido or a manual queue). Validators sign attestations where applicable.
4. When the required attestations are present, `verifier_service` issues a VC, signs it with its issuer key, and returns:
   - The VC JSON/JWT to the user (for their wallet)
   - The VC hash (e.g. `sha256:`) to send to `identity_canister`
5. `identity_canister` stores a minimal record: `{subjectPrincipal, vcHash, vcType, issuer, iat, exp}`.

## VC verification

- On-chain: store `vcHash` and optionally `issuerDid` on the `identity_canister`. Use the hash as the canonical reference.
- Off-chain: verifier service or other relying parties verify `proof.jws` and signature chain.
- Revocation: maintain a revocation list managed by `verifier_service`. For on-chain proofs, store revocation pointers (revocation-list CID + revocation ID) in `identity_canister` metadata.

## Revocation strategies

- Simple list: `verifier_service` publishes a revocation list (signed) and `identity_canister` stores the latest revocation-root hash.
- Short-lived VCs: set short `exp` values and require revalidation for sensitive actions.
- CRL on IPFS + canister anchor: store CRL CID in `identity_canister` so clients can fetch and verify revocations.

## Minimal JSON examples

- Example 1: Land-owner attestation (Sarpanch)

```
{
  "iss": "did:web:sarpanch.baghpat.example.org",
  "sub": "did:ic:abcd1234",
  "iat": 1711334400,
  "exp": 1742860400,
  "vc": {
    "type": ["VerifiableCredential", "LandOwnerAttestation"],
    "credentialSubject": {
      "nameHash": "sha256:7b1df3...",
      "documentType": "Aadhaar",
      "documentHash": "sha256:98badc...",
      "verificationLevel": 4,
      "projectRelation": "Helios#Baghpat",
      "role": "land_owner",
      "parcelId": "BAGHPAT-001",
      "attestor": "did:web:sarpanch.baghpat.example.org"
    }
  },
  "proof": { "type": "Ed25519Signature2020", "jws": "..." }
}
```

- Example 2: Validator badge (issued after repeated good inspections)

```
{
  "iss": "did:web:verifier.example.org",
  "sub": "did:ic:val1234",
  "iat": 1711334400,
  "vc": {
    "type": ["VerifiableCredential","ValidatorBadge"],
    "credentialSubject": { "badge": "validator_silver", "trustScore": 0.82 }
  },
  "proof": { "type": "Ed25519Signature2020", "jws": "..." }
}
```

## Notes about proof formats

- JWT-style VC uses JWS signatures and is straightforward to pass around in webhooks and APIs.
- Linked Data Proofs (LD-Proofs) are recommended if you need selective disclosure or JSON-LD compatibility; however JWT is easier to start with.

## Minimal API contract (verifier_service)

- `POST /qr/create` → returns `{qrToken, expiresAt, projectId}`
- `POST /verify/upload` → upload docs; returns verification task id
- `GET /verify/task/:id` → returns task status and any partial attestations
- `POST /vc/issue` (internal) → issues VC for subject; returns VC JWT and `vcHash`
- `POST /webhook/attestation` → called by mobile validators to submit attestations; triggers aggregation and possibly VC issuance

## Security recommendations

- Use Ed25519 keys for VC signing.
- Protect issuer private keys using HSM or a KMS.
- Audit logs: store signatures and issuance events in an off-chain audit DB and anchor index hashes on-chain (audit_log_canister) when required.

---
See next artifact for canister skeletons and Candid-like interfaces.
