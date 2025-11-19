import { readFileSync } from 'fs';

const wasmPath = process.argv[2];
if (!wasmPath) {
  console.error('Usage: node inspect-exports.js <wasm-file>');
  process.exit(2);
}

const wasmBuffer = readFileSync(wasmPath);

const ic0 = new Proxy({}, { get: () => { return (..._args) => 0n; } });

(async () => {
  try {
    const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0 });
    const exports = instance.exports;
    console.log('All exports:');
    Object.keys(exports).forEach(key => console.log('  ', key, typeof exports[key]));

    const testExports = Object.keys(exports).filter(k => k.toLowerCase().includes('test') || k.toLowerCase().includes('run') || k.toLowerCase().includes('main'));
    console.log('\nTest-related exports:');
    testExports.forEach(k => console.log('  ', k));
  } catch (e) {
    console.error('Failed to instantiate WASM for inspection:', e);
    process.exit(1);
  }
})();
