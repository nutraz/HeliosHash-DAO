# HeliosHash DAO — Architecture Overview

```mermaid
graph TD
    A[Next.js App (Dynamic)] -->|II Auth| B(internet_identity)
    A -->|Calls| C(hhdao)
    A -->|Calls| D(project_hub)
    subgraph ICP
        B & C & D
    end
```

- **Frontend**: Next.js 14 (App Router) — **cannot be static**
- **Auth**: Internet Identity → requires client-side JS + dynamic rendering
- **Backend**: Motoko canisters (`hhdao`, `project_hub`, `internet_identity`)
- **Frontend Hosting**: **Vercel / Netlify / Node server** — **not ICP assets**

## Current Status (November 2025)
- ✅ Backend canisters deployed locally
- ✅ Frontend builds in dynamic mode
- ✅ Internet Identity integration complete
- ✅ Authentication context implemented
- ❌ Static export incompatible with auth flow