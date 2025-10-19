const fs = require('fs');
const path = require('path');

const wasmPath = process.argv[2] || path.join(__dirname, '..', '..', 'wasm', 'quick-test-actor.wasm');
if (!fs.existsSync(wasmPath)) { console.error('wasm not found:', wasmPath); process.exit(2); }
const buf = fs.readFileSync(wasmPath);
const mod = new WebAssembly.Module(buf);
const imports = WebAssembly.Module.imports(mod);
console.log('WASM imports (module:name -> kind):');
for (const i of imports) console.log(`${i.module}:${i.name} -> ${i.kind}`);
