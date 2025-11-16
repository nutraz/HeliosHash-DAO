# HeliosHash DAO Repository Architecture (Official)

This repository follows the unified architecture for:
- HeliosHash DAO
- UrgamU Smart City Layer
- OneWorld Global Governance DAO

Core layout (recommended):

/
├── apps/
│   ├── web/                 # Next.js 15 Dashboard (HHDAO + UrgamU + ProjectHub)
│   ├── admin/               # Optional governance / multisig ops panel
│   └── mobile/              # Placeholder if mobile app is added later
│
├── services/
│   ├── api/                 # Node API: KYC, user auth, sessions, privacy service
│   ├── kyc/                 # Aadhaar, PAN, Onfido adapters, mobile seeding
│   └── billing/             # INR-to-crypto bridge, NFT minting via OpenSea
│
├── canisters/
│   ├── governance/          # DAO voting, proposals, delegation
│   ├── projectHub/          # All HHDAO microgrid data
│   ├── identity/            # HHIdentity: PII encrypted, 2-confidant recovery
│   └── energy/              # Real-time metrics, mining, smart city integration
│
├── contracts/               # Solidity bridges, NFT schema, RWA connectors
│
├── prisma/                  # schema.prisma + migrations only
│
├── packages/
│   ├── ui/                  # shadcn + DAO components shared
│   ├── utils/               # shared helpers (ic-agent, wallet, crypto utils)
│   └── sdk/                 # JS SDK for 3rd party devs
│
├── scripts/
│   ├── setup/               # installation, env generation
│   ├── deploy/              # dfx + docker + CD scripts
│   ├── cleanup/             # automated cleanup
│   └── audits/              # security tools
│
├── infra/
│   ├── docker/
│   ├── ci/
│   ├── k8s/
│   └── terraform/
│
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── governance/
│   └── rwa/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .gitignore
├── pnpm-workspace.yaml
├── turbo.json
└── README.md

This is the canonical layout for integrating HeliosHash with UrgamU & OneWorld.
