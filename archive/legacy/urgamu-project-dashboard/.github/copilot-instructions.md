## Repo orientation — UrgamU Project Dashboard

This file gives concise, actionable instructions for AI coding agents (and engineers) to be productive in this codebase.

Summary
- Tech: React (v19) + TypeScript + Vite. Single-page dashboard built from small presentational components in `components/` and a central `constants.tsx` that drives most content.
- Entry points: `index.tsx` mounts `App.tsx`. `App.tsx` composes `Section`, `Card`, `DataTable`, and `Header` components.

Quick commands
- Install: `npm install` (project uses npm scripts in `package.json`).
- Dev server: `npm run dev` (Vite, listens on port 3000, host 0.0.0.0 by default per `vite.config.ts`).
- Build: `npm run build` (Vite build). Preview: `npm run preview`.

Key files to read first
- `App.tsx` — top-level layout and how sections are composed.
- `constants.tsx` — canonical source of data arrays, tokenomics, icons (JSX), and sample Motoko code. Changing this file will change most UI content.
- `components/DataTable.tsx` — a generic, typed table component used pervasively; examples of renderRow usage appear in `App.tsx`.
- `components/Header.tsx`, `components/Section.tsx`, `components/Card.tsx` — small presentational pieces; follow their patterns when adding new UI elements.
- `vite.config.ts` — environment wiring: loads `GEMINI_API_KEY` from `.env.*` and also sets `process.env.GEMINI_API_KEY` via `define` (so references to `process.env.GEMINI_API_KEY` are replaced at build time).

Project-specific conventions & patterns
- Data-first UI: Most content is driven by plain JS/TS arrays and objects in `constants.tsx`. Add new rows/content there and render via `DataTable` or `map()` in `App.tsx`.
- Icons-as-JSX: `icons` are defined in `constants.tsx` as inline SVG React nodes and passed to `Section` components. Prefer reusing these rather than adding new inline SVGs in multiple places.
- Generic typed components: `DataTable` is declared as a generic component (`DataTable<T>`). When adding tables, prefer providing a `renderRow` callback to keep table logic simple.
- Root alias: `@/*` maps to project root (see `tsconfig.json` and `vite.config.ts`). Use `@/path` for imports if desired.

Env & secrets
- The app expects `GEMINI_API_KEY` to be present in local env (the README mentions `.env.local`). `vite.config.ts` reads this via `loadEnv` and defines it into the build. For local dev, create `.env.local` with:

  GEMINI_API_KEY=your_key_here

Notes about changes and caution
- `constants.tsx` contains both content and UI bits (icons). Large refactors here affect many pages — update carefully and run the dev server to confirm.
- Styling uses Tailwind-like utility classes throughout (Tailwind config is outside this file set). Keep class names consistent.
- TypeScript is configured with `isolatedModules` and `noEmit`. Avoid transforms that require type-checked emit steps.

Examples (copyable)
- To add a new finance row shown in the dashboard, add an object to `exchangeRates` in `constants.tsx` and restart dev server to see changes.
- To reference the GEMINI API key in code (client replacement is performed at build): use `process.env.GEMINI_API_KEY` (note: value is inlined by Vite during build).

Common tasks for contributors
- Small content change: update `constants.tsx` → verify in dev (`npm run dev`).
- Add a small presentational component: create file in `components/`, export default, import from `App.tsx` and use props-only patterns.
- Add a table: use `DataTable` with typed `renderRow` for consistency.

Troubleshooting
- If the dev server cannot find the mounting element (id "root"), check `index.html` and `index.tsx` — the app will throw when the element is missing.
- If env values seem missing in runtime, ensure `.env.local` is present and restart Vite — Vite reads env on startup.

What not to change without asking
- `constants.tsx` structure (renaming keys or changing shapes) — many UI renderers expect specific keys (e.g., `phase`, `usd`, `inr`).
- `vite.config.ts` define mapping for `GEMINI_API_KEY` — if changed, build-time env replacement may break.

If you (the AI agent) make edits
- Provide a one-line summary in the PR describing the exact files changed and the reason.
- For UI changes, include a screenshot or a description of the visible change.

ACK: Read README.md and `package.json` scripts before running commands.

If anything above is unclear or you want me to expand examples (small code snippets, tests, or a PR template), tell me which part to expand.
