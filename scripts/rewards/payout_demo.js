#!/usr/bin/env node
// Simple demo: distribute a reward pool among membership mock users equally.
const fs = require('fs');
const path = require('path');

const membersPath = path.resolve(__dirname, '..', 'demo', 'members.json');
if (!fs.existsSync(membersPath)) {
  console.error('members.json not found at', membersPath);
  process.exit(1);
}

const members = JSON.parse(fs.readFileSync(membersPath, 'utf8'));
const pool = 1000.0; // demo reward pool
const perMember = pool / Math.max(1, members.length);

console.log('Distributing pool:', pool);
console.log('Members:', members.length);
members.forEach((m, i) => {
  console.log(`${i + 1}. ${m.name} (${m.principal || 'unknown'}) -> ${perMember.toFixed(2)}`);
});
