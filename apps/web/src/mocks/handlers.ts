const API = process.env.NEXT_PUBLIC_MOCK_API || 'http://localhost:4000'

// Export a factory that receives MSW's `rest` helper at runtime and returns
// the handlers array. This avoids importing `msw` at build-time (server SSR),
// preventing TypeScript/Next build errors when MSW types differ between envs.
export function createHandlers(rest: any) {
  return [
    rest.get(`${API}/_health`, (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ status: 'ok' }))
    }),

    rest.post(`${API}/auth/login`, (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ token: 'mock-token', user: { id: 'user_1', name: 'Demo User' } }))
    }),

    rest.get(`${API}/nft/mint`, (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ success: true, tokenId: Math.floor(Math.random() * 100000) }))
    }),

    rest.get(`${API}/dao/proposals`, (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ proposals: [ { id: 1, title: 'Demo Proposal', votes: 42 } ] }))
    }),

    rest.get(`${API}/projects`, (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ projects: [ { id: 'p1', name: 'Baghpat Solar' } ] }))
    }),

    // fallback for well-known DevTools probe
    rest.get(`${API}/.well-known/appspecific/com.chrome.devtools.json`, (req: any, res: any, ctx: any) => {
      return res(ctx.status(200), ctx.json({ name: 'helioshash-dev-probe', ok: true }))
    })
  ]
}
