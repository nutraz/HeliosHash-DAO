# HeliosHash-DAO Canister IDs

This file lists all production and test canister IDs for transparency and on-chain verification.

| Canister Name         | Production Canister ID         | Description                       |
|----------------------|-------------------------------|-----------------------------------|
| Treasury             | rrkah-fqaaa-aaaaa-aaaaq-cai    | Main treasury canister            |
| Governance           | ryjl3-tyaaa-aaaaa-aaaba-cai    | DAO governance canister           |
| Identity             | rdmx6-jaaaa-aaaaa-aaadq-cai    | User identity/KYC canister        |
| Telemetry            | rdmx6-jaaaa-aaaaa-aaadq-cai    | Solar telemetry canister          |
| Documents            | <add-here>                     | Document workflow canister        |
| Compute              | <add-here>                     | Mining compute stats canister     |
| Gender Incentives    | <add-here>                     | Gender incentives canister        |
| OWP Token            | <add-here>                     | OWP token canister                |
| Community Badges     | <add-here>                     | NFT/community badge canister      |
| Dispute Resolution   | <add-here>                     | Dispute resolution canister       |
| Meeting Management   | <add-here>                     | Meeting management canister       |

> **Note:** Replace `<add-here>` with actual canister IDs after deployment. Update this file after every deployment to mainnet or testnet.

## How to verify
- Use `dfx canister id <canister_name>` to get the deployed ID.
- Check `dfx.json` for canister configuration.
- For frontend, see `.env.local` or `complete_build.js` for injected IDs.

---
For questions or updates, contact the HeliosHash-DAO team.
