#!/usr/bin/env node
"use strict"
const fs = require('fs')
const path = require('path')

// Simple renderer that reads a members fixture and emits OpenSea-compatible JSON files
const fixturesPath = process.argv[2] || 'scripts/demo/members.json'
const outDir = process.argv[3] || 'build/opensea'

if (!fs.existsSync(fixturesPath)) {
  console.error('fixtures not found:', fixturesPath)
  process.exit(1)
}

const members = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'))
fs.mkdirSync(outDir, { recursive: true })

members.forEach((m) => {
  const tokenId = m.tokenId || m.id || Math.floor(Math.random() * 1e6)
  const tier = m.tier || 1
  const name = `1WP Membership #${tokenId}`
  const metadata = {
    name,
    description: `One World Project — Membership (tier ${tier}).`,
    image: `ipfs://<CID_PLACEHOLDER>/membership-${tokenId}.png`,
    external_url: `https://app.helioshash.org/members/${tokenId}`,
    attributes: [
      { trait_type: 'Type', value: 'DAO Membership' },
      { trait_type: 'Tier', value: tier },
      { trait_type: 'TokenID', value: tokenId }
    ]
  }
  const outFile = path.join(outDir, `${tokenId}.json`)
  fs.writeFileSync(outFile, JSON.stringify(metadata, null, 2))
  console.log('Wrote', outFile)
})

console.log('Rendered metadata for', members.length, 'members to', outDir)
