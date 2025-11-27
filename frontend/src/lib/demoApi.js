// Demo API helper: chooses MSW/mock API or real backend depending on APP_MODE
const API_BASE = process.env.NEXT_PUBLIC_MOCK_API || 'http://localhost:4000'

async function call(path, opts = {}) {
  const url = path.startsWith('http') ? path : API_BASE + path
  const res = await fetch(url, Object.assign({ headers: { 'content-type': 'application/json' } }, opts))
  return res.json()
}

module.exports = { call }
