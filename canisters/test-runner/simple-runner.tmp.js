// Minimal CommonJS Node runner for Motoko-generated WASM
// Usage: node simple-runner.js <wasm-file>
const fs = require('fs');

if (process.argv.length < 3) {
  console.error('Usage: node simple-runner.js <wasm>');
  process.exit(2);
}

const wasmPath = process.argv[2];
const wasmBuffer = fs.readFileSync(wasmPath);

const callLog = [];
function logIcCall(name, args) {
  callLog.push({ name, args: args.map(a => (typeof a === 'bigint' ? `${a}n` : String(a))) });
  if (callLog.length > 200) callLog.shift();
}

function printCallLog() {
  console.log('\n=== IC0 Calls ===');
  callLog.forEach((c, i) => console.log(i + 1, c.name, c.args));
  console.log('==============\n');
}

function needsBigIntReturn(name) {
  return /64|time|counter|cycles|stable|now|performance/i.test(name);
}

function makeIc0Stub(name) {
  return (...args) => {
    logIcCall(name, args);
    if (needsBigIntReturn(name)) return 0n;
    return 0;
  };
}

(async function main() {
  try {
    const module = new WebAssembly.Module(wasmBuffer);
    const imports = WebAssembly.Module.imports(module);
    const importsObj = {};

    for (const imp of imports) {
      importsObj[imp.module] = importsObj[imp.module] || {};
      importsObj[imp.module][imp.name] = makeIc0Stub(imp.name);
    }

    importsObj.env = importsObj.env || {};
    importsObj.env.memory = importsObj.env.memory || new WebAssembly.Memory({ initial: 256 });

    console.log('WASM imports:');
    for (const imp of imports) {
      console.log(` - ${imp.module}.${imp.name} -> returnsBigInt=${needsBigIntReturn(imp.name)}`);
    }

    // When passing a compiled Module, WebAssembly.instantiate returns the Instance directly.
    // Assign appropriately to support both buffer and Module forms.
    const maybe = await WebAssembly.instantiate(module, importsObj);
    const instance = maybe.instance ? maybe.instance : maybe;

    console.log('Exports:', Object.keys(instance.exports || {}));

    if (typeof instance.exports.canister_init === 'function') {
      try {
        console.log('Calling canister_init');
        instance.exports.canister_init();
        console.log('canister_init ok');
      } catch (e) {
        console.error('canister_init trapped', e);
        printCallLog();
      }
    }

    for (const name of Object.keys(instance.exports || {})) {
      if (name.startsWith('canister_query')) {
        try {
          console.log('Calling', name);
          const r = instance.exports[name]();
          console.log(name, '->', r);
        } catch (e) {
          console.error(name, 'trapped', e);
          printCallLog();
        }
      }
    }
  } catch (e) {
    console.error('Runner error', e);
    printCallLog();
    process.exit(1);
  }
})();
