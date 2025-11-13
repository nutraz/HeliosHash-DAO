# Deployment Guide

## Backend (ICP)
```bash
NEXT_PUBLIC_DISABLE_STATIC_EXPORT=true dfx deploy hhdao project_hub internet_identity
```

## Frontend (Dynamic)
```bash
cd apps/web
rm -rf .next
NEXT_PUBLIC_DISABLE_STATIC_EXPORT=true npm run build
```
→ Deploy `.next/standalone` to Vercel/Netlify

## Environment
- `NEXT_PUBLIC_DISABLE_STATIC_EXPORT=true` → disables `next export`
- `NEXT_PUBLIC_IC_HOST=http://localhost:4943` (local)

## Current Canister IDs (Local)
- hhdao: uqqxf-5h777-77774-qaaaa-cai
- project_hub: umunu-kh777-77774-qaaca-cai
- internet_identity: rdmx6-jaaaa-aaaaa-aaadq-cai

## URLs
- hhdao: http://127.0.0.1:4943/?canisterId=ulvla-h7777-77774-qaacq-cai&id=uqqxf-5h777-77774-qaaaa-cai
- project_hub: http://127.0.0.1:4943/?canisterId=ulvla-h7777-77774-qaacq-cai&id=umunu-kh777-77774-qaaca-cai
- internet_identity: http://127.0.0.1:4943/?canisterId=ulvla-h7777-77774-qaacq-cai&id=rdmx6-jaaaa-aaaaa-aaadq-cai