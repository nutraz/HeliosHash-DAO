#!/usr/bin/env node
const nacl = require('tweetnacl');

function main() {
  // generate a 32-byte seed and print it base64 (Ed25519 raw secret expected by dfinity libs)
  const seed = nacl.randomBytes(32);
  // derive full keypair from seed to be sure it's valid
  const kp = nacl.sign.keyPair.fromSeed(seed);
  const secretSeed = Buffer.from(seed); // 32 bytes
  const b64 = secretSeed.toString('base64');
  console.log(b64);
}

if (require.main === module) main();
