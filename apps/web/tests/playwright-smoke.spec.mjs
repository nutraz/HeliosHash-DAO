import { test, expect } from '@playwright/test'

test.describe('HeliosHash smoke', () => {
  test.beforeEach(async ({ request }) => {
    // quick probe to ensure servers are up
    const res = await request.get('http://localhost:3000/')
    if (!res.ok()) throw new Error('Server not responding on http://localhost:3000')
  })

  test('root serves HTML and contains heading', async ({ page }) => {
    const r = await page.goto('http://localhost:3000/')
    expect(r.status()).toBe(200)
    const h = await page.locator('h1').first().textContent()
    expect(h).toContain('HeliosHash')
  })

  test('test-ui and test-simple pages respond', async ({ page }) => {
    const p1 = await page.goto('http://localhost:3000/test-ui/')
    expect([200, 304, 301, 302]).toContain(p1.status())
    const p2 = await page.goto('http://localhost:3000/test-simple/')
    expect([200, 304, 301, 302]).toContain(p2.status())
  })

  test('favicon and mock API health', async ({ request }) => {
    const f = await request.get('http://localhost:3000/favicon.ico')
    expect(f.status()).toBe(200)
    const api = await request.get('http://localhost:4000/_health')
    expect(api.status()).toBe(200)
    const body = await api.json()
    expect(body.status).toBe('ok')
  })
})
// Production-focused smoke tests
test.describe('HeliosHash smoke (prod)', () => {
  test.beforeEach(async ({ request }) => {
    const res = await request.get('http://localhost:3000/')
    if (!res.ok()) throw new Error('Production server not responding on http://localhost:3000')
  })

  test('root serves HTML and contains expected text', async ({ page }) => {
    const r = await page.goto('http://localhost:3000/')
    expect(r.status()).toBe(200)
    const body = await page.locator('body').textContent()
    expect(body).toContain('HeliosHash')
  })

  test('test-home and test-simple pages respond', async ({ page }) => {
    const p1 = await page.goto('http://localhost:3000/test-home/')
    expect([200, 304, 301, 302]).toContain(p1.status())
    const p2 = await page.goto('http://localhost:3000/test-simple/')
    expect([200, 304, 301, 302]).toContain(p2.status())
  })

  test('favicon and mock API health', async ({ request }) => {
    const f = await request.get('http://localhost:3000/favicon.ico')
    expect([200, 304]).toContain(f.status())
    const api = await request.get('http://localhost:4000/_health')
    expect(api.status()).toBe(200)
    const body = await api.json()
    expect(body.status).toBe('ok')
  })
})
