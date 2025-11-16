// MSW handlers for the HeliosHash demo app
const { rest } = require('msw')

const API_BASE = process.env.NEXT_PUBLIC_MOCK_API || ''

module.exports = [
  rest.post(API_BASE + '/auth/login', (req, res, ctx) => {
    const { username } = req.body || {}
    return res(ctx.json({ ok: true, token: 'mock-token-' + (username || 'guest'), user: { id: 'user_1', username: username || 'guest' } }))
  }),

  rest.post(API_BASE + '/nft/mint', (req, res, ctx) => {
    return res(ctx.json({ nftId: 'hhid_74339', openseaUrl: 'https://testnets.opensea.io/assets/hhid_74339', status: 'minted' }))
  }),

  rest.get(API_BASE + '/dao/proposals', (req, res, ctx) => {
    return res(ctx.json({ proposals: [ { id: 'p1', title: 'Increase microgrant', votes: { yes: 12, no: 3 } } ] }))
  }),

  rest.get(API_BASE + '/projects/:id/realtime', (req, res, ctx) => {
    return res(ctx.json({ id: req.params.id, current_kW: (Math.random()*10).toFixed(2), today_kWh: Math.round(Math.random()*100) }))
  }),

  rest.post(API_BASE + '/account/confidants/add', (req, res, ctx) => {
    return res(ctx.json({ ok: true, confidant: req.body.confidant }))
  }),
]
