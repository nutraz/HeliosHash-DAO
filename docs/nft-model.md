# NFT Model & OpenSea Sync

This document describes the three NFT types used by One World Project (1WP), their on-chain responsibilities, and the OpenSea metadata + IPFS pinning pipeline with a governance-controlled publish flow.

## NFT Types

1. **DAO Membership NFT** — represents membership in the DAO. Implements:
   - Ownership, transfer, burn
   - Tier (`tier` attribute) and `burnForUpgrade` atomic operation
   - Voting power derived from `tier`
   - Automatic reward distribution hooks

2. **Project NFT** — minted to represent support/engagement in a project.
   - Tracks contributions and may carry revenue-sharing rules.

3. **Identity NFT (optional, soulbound)** — KYC-verified identity token.
   - Non-transferable (soulbound) once minted.

## On-chain interfaces (recommended)

- `mint(owner, metadata) -> ApiResponse<Bool>`
- `burn(tokenId) -> ApiResponse<Bool>`
- `burnForUpgrade(tokenId, targetTier) -> ApiResponse<Bool>` (atomic burn + mint new tier)
- `totalSupply() -> Nat`
- `tierDistribution() -> [(Nat, Nat)]` — list of (tier, count)
- Event emits: `emitEvent(kind: Text, payload: Blob)` (to `telemetry` canister)

## OpenSea metadata

Metadata should follow the standard OpenSea/ERC-721 metadata JSON schema. Example fields:

```
{
  "name": "1WP Membership #1",
  "description": "One World Project — Bronze membership (tier 1).",
  "image": "ipfs://<CID>/membership-1.png",
  "external_url": "https://app.helioshash.org/members/1",
  "attributes": [ {"trait_type":"Tier","value":"Bronze"} ]
}
```

## Pinning & publish pipeline (overview)

1. Export metadata JSON files from on-chain or fixture data.
2. Pin assets and metadata to IPFS (web3.storage / nft.storage / pinata).
3. Record candidate CIDs in a manifest (staging area).
4. Submit a governance proposal referencing the candidate manifest (on-chain or off-chain + on-chain approval).
5. After the proposal passes, an executor (CI or operator) runs the publish step which updates the canonical metadata pointer in the NFT canister or registry.

## Safety and governance

- Never auto-publish to mainnet without governance approval.
- CI secrets (pinning keys) must live in protected environment variables.
- Keep a manifest audit log with author, timestamp, and signature.

## Local demo notes

See `scripts/opensea/*` for export/pin scripts and `docs/demo-script.md` for a short demo flow.
