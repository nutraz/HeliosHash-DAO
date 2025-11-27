# HeliosHash DAO — Web

![HeliosHash Logo](/assets/icons/helioshash.svg)

This directory contains the HeliosHash DAO web app. The canonical logo used
across the site and favicons is `public/assets/icons/helioshash.svg`.

If you need to update the logo used in the site, replace `helioshash.svg` and
`hhdaologo.svg` in `public/assets/icons/` and commit the changes. The app
references `/assets/icons/helioshash.svg` as its favicon and brand asset.

Deployment notes:

```chatagent
<p align="center">
	<img src="https://raw.githubusercontent.com/nutraz/HeliosHash-DAO/refs/heads/main/assets/icons/hhdao%20logo.avif" alt="HeliosHash DAO Logo" width="220" />
</p>

<h1 align="center">HeliosHash DAO (HHDAO)</h1>

**HeliosHash DAO Logo — A OneWorldProject Initiative (India)**

- Project page: https://dapp.oneworldproject.io/daodetail/UrgamUSmartCity
- Short description: Fintech RWA Monitoring & Management Platform for Solar, Compute & Mining Infrastructure

CI Status | License

🌍 HeliosHash DAO (HHDAO) is a fintech RWA (Real-World Asset) initiative focused on monitoring, financing, and managing solar, compute, and mining infrastructure. This repository holds the web frontend for the HHDAO demo and governance dashboard.

If the logo does not render, ensure the file exists at `public/assets/icons/helioshash.svg` and is committed to the repo.

Deployment notes:
- Build: `pnpm build`
- Deploy: `npx vercel --prod --yes`

``` 
