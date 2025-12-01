# **HeliosHash DAO**

<div align="center">
  <img src="https://raw.githubusercontent.com/nutraz/HeliosHash-DAO/main/assets/icons/hhdaologo.svg" alt="HeliosHash DAO Logo" width="120" style="margin-bottom: 20px;" />

**A OneWorldProject Initiative — India**  
**[https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity](https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity)**  
**Fintech RWA Monitoring & Management Platform for Solar, Compute & Mining Infrastructure**

[![CI Status](https://github.com/nutraz/HeliosHash-DAO/actions/workflows/ci.yml/badge.svg)](https://github.com/nutraz/HeliosHash-DAO/actions)
[![Security Audit](https://github.com/nutraz/HeliosHash-DAO/actions/workflows/security.yml/badge.svg)](https://github.com/nutraz/HeliosHash-DAO/actions/workflows/security.yml)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)

</div>

---

## 🌍 **HeliosHash DAO (HHDAO)** is a **fintech RWA (Real-World Asset) monitoring & management platform**, enabling community-driven investment, oversight, and governance of **solar microgrids, modular data centers, and Bitcoin mining infrastructure**.

Built on the **Internet Computer Protocol (ICP)** and deployed with **Next.js + Flutter**, HHDAO provides:

* **Real-time monitoring of physical infrastructure**
* **Tokenized participation in RWA-backed projects**
* **Transparent yield tracking & dashboards**
* **DAO-driven governance & treasury oversight**
* **Community-owned renewable energy impact**

HHDAO is a **real-world infrastructure engine**, not a theoretical DAO.

**Real assets → Real-time data → Real revenue → DAO governance.**

---

### **1️⃣ Fintech RWA Infrastructure Layer**

A fully integrated monitoring stack for:

* Solar energy generation
* Data center compute load
* ASIC/GPU mining performance
* Temperature, uptime, and operational metrics
* Yield + revenue per asset cluster

All exposed in **transparent, on-chain dashboards**.

### **2️⃣ Tokenized Participation**

Members participate in:

* DAO proposals
* Infrastructure-backed rewards
* On-chain verification of revenue
* Governance through NFT tiers
* Cross-chain compatibility via Solidity bridges

### **3️⃣ Real-World Impact (India-first Model)**

HHDAO powers:

* Villages
* Community buildings
* Schools
* Hospitals
* SEZ Smart Regions (Urgam Valley)

With **free energy** provided under the OneWorldProject charter.

### **4️⃣ Fully Open Source Infrastructure**

You can audit, fork, deploy, or extend the entire stack.

---

## 🏗️ **Architecture**

### **Backend — Internet Computer (ICP)**

* **Language:** Motoko
* **Canisters:** DAO logic, treasury, members, proposals
* **Directory:** `/canisters/`

### **Frontend — Next.js 14 Web App**

* **Framework:** Next.js App Router
* **Tech:** TypeScript, TailwindCSS, shadcn/ui
* **Directory:** `/apps/web/`

### **Mobile — Flutter Application**

* **Platforms:** Android, iOS, Linux
* **Directory:** `/apps/mobile/`

### **Smart Contracts — Solidity**

* **Components:** Bridge contracts, cross-chain verification
* **Directory:** `/contracts/`

---

## 🚀 **Quick Start**

```bash
# Clone and setup
git clone https://github.com/nutraz/HeliosHash-DAO.git
cd HeliosHash-DAO

# Automated developer environment
./scripts/dev-setup.sh

# Manual setup
pnpm install
dfx start --background --clean
dfx deploy
pnpm dev
```

Visit: **[http://localhost:3002](http://localhost:3002)**

---

## 💻 **Development Commands**

### **Web**

```bash
cd apps/web
pnpm install
pnpm dev
```

### **Mobile**

```bash
cd apps/mobile
flutter pub get
flutter run
```

### **Backend (ICP)**

```bash
dfx start --background
dfx deploy
dfx generate
```

---

## 🌐 **Deployment (Vercel)**

### **Vercel Setup**

* Framework: **Next.js**
* Root dir: `apps/web`
* Build: `cd apps/web && pnpm build`
* Output: `.next`

Copy env vars from: `.env.vercel.example`

### **Manual**

```bash
npm i -g vercel
cd apps/web
vercel --prod
```

---

## 🔧 **Key Features**

### **RWA Monitoring & Analytics**

* Solar generation
* Data center health
* Mining stats & rewards
* Yield dashboards
* Geographic analytics

### **DAO Governance**

* Proposal creation
* Voting & execution
* Weighted/flat governance via NFTs
* Treasury transparency

### **Identity & Security**

* Multi-modal login
* KYC options
* On-chain data integrity

### **Mobile + Web Access**

* Full RWA dashboards on mobile
* Real-time notifications
* Energy & compute alerts

---

## 🏢 **Project Phases**

### **Phase 1: Baghpat Pilot**

* Solar generation
* Mining cluster
* Operational telemetry

### **Phase 2: Urgam Valley Smart Region**

* SEZ micro data center
* Large-scale renewable deployment
* DAO-governed civic infrastructure

### **Phase 3: Mumbai HPC Hub**

* Tier 3 micro data center
* 500 kW solar park
* National scaling

---

## 🗂️ **Module Architecture**

| Feature            | Path                                 | Status     |
| ------------------ | ------------------------------------ | ---------- |
| NFT System         | `apps/web/src/components/nft/*`      | Stable     |
| Village Dashboard  | `apps/web/src/app/urgamu-delhi/*`    | Active     |
| Legacy Modules     | `apps/web/src/app/villages/`         | Deprecated |
| Urgam U Smart City | `apps/web/src/modules/UrgamUDelhi/*` | Core       |
| Shared Components  | `apps/web/src/*`                     | Core UI    |

---

## 🛠️ **Troubleshooting**

* Ensure **DFX** is running
* After editing IC canisters: `dfx generate`
* Check `docs/CRITICAL_FIXES_TODO.md`
* Verify canister IDs in frontend env config
* Mobile issues: run with `flutter clean`

---

## 🤝 **Contributing**

All contributions are welcome!
Please read the **Contributing Guide** in:

```
docs/CONTRIBUTING.md
```

---

## 📄 **License**

Open-source under **Apache 2.0**.
See: `LICENSE`

---

## 📚 **Documentation**

* Full Docs → `docs/`
* Vision → `docs/COPILOT_CONTEXT.md`
* API Design → `API_DESIGN.md`
* Dev Status → `DEVELOPMENT_STATUS.md`
* Security Checklist → `docs/SECURITY_CHECKLIST.md`
* Critical Fixes → `docs/CRITICAL_FIXES_TODO.md`
* Repo Cleanup → `docs/REPO_CLEANUP_SUMMARY.md`
* Changelog → `CHANGELOG.md`

---

<div align="center">
  Made with ❤️ by the OneWorldProject Community  
</div>
```
