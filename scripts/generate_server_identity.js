#!/usr/bin/env node
/**
 * Generate a raw Ed25519 secret key (64 bytes) and print base64.
 * This uses `tweetnacl` to ensure the secret format matches the 64-byte
 * secretKey expected by `Ed25519KeyIdentity.fromSecretKey`.
 *
 * Usage:
 *   node scripts/generate_server_identity.js > server-key.b64
 */
const nacl = require('tweetnacl');

function main() {
  const seed = nacl.randomBytes(32);
  const kp = nacl.sign.keyPair.fromSeed(seed);
  const secretSeed = Buffer.from(seed);
  const b64 = secretSeed.toString('base64');
  console.log(b64);
}

if (require.main === module) main();
