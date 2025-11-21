# Demo README & Notes

This file summarizes the demo configuration, tokenomics placeholders and next steps.

Key defaults

- Initial membership supply (example): 19,825 (not minted by the small demo)
- Tiers: Bronze(1), Silver(2), Gold(3), Platinum(4)
- Upgrade fees (example): Bronze→Silver = 100 HHU; Silver→Gold = 1,000 HHU; Gold→Platinum = 10,000 HHU
- Treasury cut (example): 20% of upgrade fees

Files added in demo mode

- `scripts/demo/seed.sh`: mints HHU to a principal and prepares a small `scripts/demo/members.json` fixture.
- `apps/web/.env.demo`: demo env toggles (set `NEXT_PUBLIC_USE_MOCKS` to `false` to use real canisters).
- `apps/web/src/mocks/*`: small JSON fixtures for users, projects and transactions.

Next steps

1. If you want to seed the full 19,825 membership NFTs as fixtures (not on-chain), ask and I will generate `members-big.json`. Note: that file will be large.
2. Implement `burnForUpgrade` logic in the NFT canister and wire telemetry emits. I can prepare a patch for `canisters/nft_membership` if you want.
3. Add governance proposal template to change fees/treasury percentages and update the docs accordingly.

Safety notes

- The seed script targets the local replica. Do not run it against mainnet unless intended.
- The demo uses small sample fixtures for quick iteration; replace them with real data by toggling the env flag and setting canister IDs.
