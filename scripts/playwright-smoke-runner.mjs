#!/usr/bin/env node
import { chromium } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const MOCK = process.env.MOCK_URL || 'http://localhost:4000'

async function probeUrl(path) {
  const url = `${BASE}${path}`
  const res = await fetch(url, { cache: 'no-store' })
  return { url, status: res.status, text: await res.text() }
}

async function probeMock() {
  const url = `${MOCK}/_health`
  const res = await fetch(url)
  return { url, status: res.status, json: await res.json() }
}

;(async () => {
  try {
    console.log('Probing', BASE)
    const root = await probeUrl('/')
    console.log('ROOT', root.status)

    const testHome = await probeUrl('/test-home/')
    console.log('/test-home', testHome.status)

    const mock = await probeMock()
    console.log('mock', mock.status, mock.json)

    // Launch browser to check page contents
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    const r = await page.goto(BASE)
    console.log('browser goto status', r.status())
    const h = await page.locator('h1').first().textContent()
    console.log('first H1:', h)
    await browser.close()
    process.exit(0)
  } catch (err) {
    console.error('Smoke runner error:', err)
    process.exit(2)
  }
})()
