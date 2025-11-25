# HeliosHash DAO — Web

![HeliosHash Logo](/assets/icons/helioshash.svg)

This directory contains the HeliosHash DAO web app. The canonical logo used
across the site and favicons is `public/assets/icons/helioshash.svg`.

If you need to update the logo used in the site, replace `helioshash.svg` and
`hhdaologo.svg` in `public/assets/icons/` and commit the changes. The app
references `/assets/icons/helioshash.svg` as its favicon and brand asset.

Deployment notes:
- Build: `pnpm build`
- Deploy: `npx vercel --prod --yes`
