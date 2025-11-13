# Known Issues & Resolutions

| Issue | Cause | Fix | Status |
|------|------|-----|--------|
| `useContext` in prerender | Static export + React Context | `NEXT_PUBLIC_DISABLE_STATIC_EXPORT=true` | ✅ Resolved |
| `baghpat_backend` not found | `main.mo` missing | Remove from `dfx.json` | ✅ Resolved |
| ICP assets + auth | Assets are static | Host frontend externally | 📝 Documented |
| Motoko warnings | Unused identifiers | Clean up code (non-blocking) | 🔄 Future |

## Architecture Constraints

### Why Next.js Cannot Be Static
- Internet Identity requires client-side JavaScript
- Authentication state needs dynamic rendering
- `usePathname`, `useContext` hooks incompatible with static generation

### Why Not ICP Assets Canister
- ICP assets canisters serve static files only
- No server-side rendering or dynamic routing
- Authentication flows require Node.js runtime

## Workarounds Implemented
- Client-side only auth provider (`ClientAuthProvider.tsx`)
- Dynamic rendering for all auth-dependent pages
- Environment variable to disable static export
- External hosting for frontend (Vercel/Netlify recommended)

## Future Options
1. **Vercel Deployment**: Deploy Next.js app to Vercel with ICP canister endpoints
2. **Standalone Server**: Use `next start` with custom server
3. **Hybrid Architecture**: Static marketing pages + dynamic auth pages
4. **Boundary Nodes**: ICP boundary nodes for dynamic hosting (future)