// Minimal smoke-test runner to verify file is clean and runnable
console.log('simple-runner smoke test');
process.exit(0);
// Clean CommonJS Node runner for Motoko wasm tests
// Overwrites previous messy fragments — single atomic file.
const fs = require('fs');
const path = require('path');

function toNumber(n) { return typeof n === 'bigint' ? Number(n) : n; }

function readString(mem, ptr, len) {
  try { return new TextDecoder().decode(new Uint8Array(mem.buffer, toNumber(ptr), toNumber(len))); }
  catch (e) { return ''; }
}

function writeBytes(mem, ptr, bytes) {
  try { new Uint8Array(mem.buffer, toNumber(ptr), bytes.length).set(bytes); }
  catch (e) {}
}

// Global runtime state used by ic0 host shims
let wasmMemory = null;
let replyData = [];
const callLog = [];
function logIc(name, args = []) { callLog.push({ name, args }); }
function resetReply() { replyData = []; }

function makeIC0(memory) {
  return {
    // lifecycle / message helpers
    msg_arg_data_size: () => (logIc('msg_arg_data_size'), 0n),
    msg_arg_data_copy: (dst, off, sz) => (logIc('msg_arg_data_copy', [dst, off, sz]), 0n),

    msg_reply_data_append: (ptr, len) => {
      logIc('msg_reply_data_append', [ptr, len]);
      try { const b = new Uint8Array(memory.buffer, toNumber(ptr), toNumber(len)); replyData.push(Buffer.from(b)); } catch (e) {}
      return 0n;
    },
    msg_reply_data_size: () => (logIc('msg_reply_data_size'), BigInt(replyData.reduce((s,b) => s + b.length, 0))),
    msg_reply_data_copy: (dst, off, size) => {
      logIc('msg_reply_data_copy', [dst, off, size]);
      const flat = Buffer.concat(replyData);
      const o = toNumber(off), s = toNumber(size);
      const slice = flat.slice(o, o + s);
      try { new Uint8Array(memory.buffer, toNumber(dst), slice.length).set(slice); } catch(e) {}
      return 0n;
    },
    msg_reply: () => (logIc('msg_reply'), 0n),

    msg_caller_size: () => (logIc('msg_caller_size'), 0n),
    msg_caller_copy: () => (logIc('msg_caller_copy', Array.from(arguments)), 0n),
    msg_method_name_size: () => (logIc('msg_method_name_size'), 0n),
    msg_method_name_copy: () => (logIc('msg_method_name_copy', Array.from(arguments)), 0n),
    accept_message: () => (logIc('accept_message'), 1n),

    debug_print: (ptr, len) => { logIc('debug_print', [ptr, len]); try { console.log('[wasm debug] ' + readString(memory, ptr, len)); } catch(e) {} return 0n; },

    // timing / cycles
    ic0_time: () => (logIc('ic0_time'), 0n),
    ic0_msg_cycles_available: () => (logIc('ic0_msg_cycles_available'), 0n),

    // stable memory stubs
    stable64_grow: () => (logIc('stable64_grow'), 0n),
    stable64_size: () => (logIc('stable64_size'), 0n),
    stable64_write: () => (logIc('stable64_write'), 0n),
    stable64_read: () => (logIc('stable64_read'), 0n),

    // call helpers (no-op)
    call_new: () => (logIc('call_new'), 0n),
    call_data_append: () => (logIc('call_data_append'), 0n),
    call_perform: () => (logIc('call_perform'), 0n),

    // fallback / placeholder
    data_certificate_copy: () => (logIc('data_certificate_copy'), 0n),
  };
}

async function run(wasmPath) {
  const abs = path.resolve(wasmPath);
  if (!fs.existsSync(abs)) throw new Error('wasm not found: ' + abs);
  const buf = fs.readFileSync(abs);
  const module = await WebAssembly.compile(buf);

  // initial memory; if module exports memory we'll switch to it.
  const mem = new WebAssembly.Memory({ initial: 100 });
  wasmMemory = mem;
  const ic0 = makeIC0(mem);

  const imports = { ic0, env: { memory: mem } };
  const { instance } = await WebAssembly.instantiate(module, imports);

  // prefer exported memory
  if (instance.exports.memory) {
    wasmMemory = instance.exports.memory;
    // rebuild ic0 with the real memory so subsequent host calls read/write correctly
    Object.assign(ic0, makeIC0(wasmMemory));
  }

  console.log('Exports:', Object.keys(instance.exports).sort().join(', '));

  function tryCall(name, args = []) {
    if (!instance.exports[name]) return;
    try {
      resetReply(); callLog.length = 0;
      console.log('\nCalling', name);
      const r = instance.exports[name](...args);
      console.log('Returned:', r);
      const total = replyData.reduce((s,b) => s + b.length, 0);
      if (total > 0) {
        const flat = Buffer.concat(replyData);
        console.log('Reply hex:', flat.toString('hex'));
        try { console.log('Reply text:', flat.toString('utf8')); } catch(e) {}
      }
      if (callLog.length) console.log('IC0 log:', JSON.stringify(callLog, null, 2));
    } catch (e) {
      console.error('Call threw:', e && e.message ? e.message : e);
      if (callLog.length) console.error('IC0 log at trap:', JSON.stringify(callLog, null, 2));
    }
  }

  // try runtime info
  if (instance.exports['canister_query __motoko_runtime_information']) {
    tryCall('canister_query __motoko_runtime_information');
  } else if (instance.exports.__motoko_runtime_information) {
    tryCall('__motoko_runtime_information');
  }

  if (instance.exports.canister_init) tryCall('canister_init');

  // call any canister_query <name> exports
  for (const k of Object.keys(instance.exports)) {
    if (k.startsWith('canister_query ')) tryCall(k);
  }

}

if (require.main === module) {
  const wasmPath = process.argv[2] || path.join(__dirname, '..', '..', 'wasm', 'quick-test-actor.wasm');
  run(wasmPath).catch(err => { console.error('Runner error:', err); process.exit(1); });
}

module.exports = { run };
const fs = require('fs');

// Minimal CommonJS runner: instantiate Motoko wasm and call runtime info query.
const wasmPath = process.argv[2];
if (!wasmPath) { console.error('Usage: node simple-runner.js <wasm>'); process.exit(2); }
const wasmBuffer = fs.readFileSync(wasmPath);

const memory = new WebAssembly.Memory({ initial: 100 });
let reply = Buffer.alloc(0);

function readString(ptr, len) { try { return new TextDecoder().decode(new Uint8Array(memory.buffer, Number(ptr), Number(len))); } catch (e) { return ''; } }

const ic0 = {
  trap: (ptr, len) => { const m = readString(ptr, len); console.error('IC trap:', m); throw new Error(m); },
  msg_reply_data_append: (src, size) => { try { const bytes = new Uint8Array(memory.buffer, Number(src), Number(size)); reply = Buffer.concat([reply, Buffer.from(bytes)]); } catch (e) {} },
  msg_reply_data_size: () => BigInt(reply.length),
  msg_reply_data_copy: (dst, off, size) => { try { const n = Math.min(Number(size), reply.length - Number(off)); if (n > 0) new Uint8Array(memory.buffer, Number(dst), n).set(reply.slice(Number(off), Number(off) + n)); return 0n; } catch (e) { return 0n; } },
  msg_arg_data_size: () => 0n,
  msg_arg_data_copy: () => 0n,
  time: () => BigInt(Date.now()) * 1000000n
};

(async () => {
  try {
    const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory } });
    const exports = instance.exports;
    console.log('Available exports:', Object.keys(exports).sort());

    const r = 'canister_query __motoko_runtime_information';
    if (exports[r]) {
      console.log('\nCalling', r);
      reply = Buffer.alloc(0);
      try { exports[r](); console.log('Reply length:', reply.length); if (reply.length) console.log('Hex:', Array.from(reply).map(b => b.toString(16).padStart(2,'0')).join(' ')); } catch (e) { console.error('Query failed:', e.message); }
    } else {
      console.log('\nNo __motoko_runtime_information export found');
    }

    process.exit(0);
  } catch (err) { console.error('Instantiate failed:', err); process.exit(1); }
})();
const fs = require('fs');

// Minimal, clean CommonJS runner that lists exports and calls
// `canister_query __motoko_runtime_information` if present.

const path = process.argv[2];
if (!path) { console.error('Usage: node simple-runner.js <wasm>'); process.exit(2); }
const wasmBuffer = fs.readFileSync(path);

let memory = new WebAssembly.Memory({ initial: 100 });
let replyData = Buffer.alloc(0);

function readString(ptr, len) { try { return new TextDecoder().decode(new Uint8Array(memory.buffer, Number(ptr), Number(len))); } catch (e) { return ''; } }

const ic0 = {
  trap: (ptr, len) => { const m = readString(ptr, len); console.error('IC Trap:', m); throw new Error(m); },
  msg_reply_data_append: (src, size) => { try { const bytes = new Uint8Array(memory.buffer, Number(src), Number(size)); replyData = Buffer.concat([replyData, Buffer.from(bytes)]); } catch (e) {} },
  msg_reply_data_size: () => BigInt(replyData.length),
  msg_reply_data_copy: (dst, off, size) => { try { const n = Math.min(Number(size), replyData.length - Number(off)); if (n > 0) new Uint8Array(memory.buffer, Number(dst), n).set(replyData.slice(Number(off), Number(off) + n)); return 0n; } catch (e) { return 0n; } },
  msg_arg_data_size: () => 0n,
  msg_arg_data_copy: () => 0n,
  time: () => BigInt(Date.now()) * 1000000n
};

(async () => {
  try {
    const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory } });
    const exports = instance.exports;
    console.log('Available exports:', Object.keys(exports).sort());

    const r = 'canister_query __motoko_runtime_information';
    if (exports[r]) {
      console.log('\nCalling', r);
      replyData = Buffer.alloc(0);
      try { exports[r](); console.log('Runtime reply length:', replyData.length); if (replyData.length) console.log('Hex dump:', Array.from(replyData).map(b => b.toString(16).padStart(2,'0')).join(' ')); } catch (e) { console.error('Runtime query failed:', e.message); }
    }

    process.exit(0);
  } catch (err) { console.error('Instantiate failed:', err); process.exit(1); }
})();
// Clean single-file runner (atomic)
import { readFileSync } from 'fs';

const wasmPath = process.argv[2];
if (!wasmPath) { console.error('Usage: node simple-runner.js <wasm-file>'); process.exit(2); }
const wasmBuffer = readFileSync(wasmPath);

let wasmMemory = null;
const EMPTY_ARGS = new Uint8Array([0x44,0x49,0x44,0x4c,0x00,0x00]);
const MOCK_PRINCIPAL = new Uint8Array(new Array(32).fill(0)); MOCK_PRINCIPAL[0]=1; MOCK_PRINCIPAL[31]=2;

let currentMessage = { args: EMPTY_ARGS, caller: MOCK_PRINCIPAL, canisterId: MOCK_PRINCIPAL, methodName: new Uint8Array(0) };

const callLog = [];
const MAX_CALL_LOG = 50;
function logIcCall(name, args = []) { callLog.push({ name, args: args.map(a => typeof a === 'bigint' ? `${a}n` : a) }); if (callLog.length > MAX_CALL_LOG) callLog.shift(); }
function printCallLog() { console.log('IC0 call log:'); callLog.forEach((c,i)=>console.log(`  ${i+1}. ${c.name}(${c.args.join(', ')})`)); }
function resetMessageState(m='') { currentMessage.methodName = new TextEncoder().encode(m); }
function toNumber(v) { return typeof v === 'bigint' ? Number(v) : v; }
function readStringFromMemory(ptr,len){ try { return new TextDecoder().decode(new Uint8Array(wasmMemory.buffer, toNumber(ptr), toNumber(len))); } catch(e){ return ''; } }
function writeBytesToMemory(bytes, dst){ try { new Uint8Array(wasmMemory.buffer, toNumber(dst), bytes.length).set(bytes); } catch(e){} }

let replyData = new Uint8Array(0);

const ic0 = {
  trap: (ptr,len) => { logIcCall('trap',[ptr,len]); const msg = readStringFromMemory(ptr,len); console.error('\n=== IC TRAP ==='); console.error(msg); printCallLog(); throw new Error(`IC Trap: ${msg}`); },
  time: () => (logIcCall('time'), BigInt(Date.now()) * 1000000n),
  performance_counter: () => (logIcCall('performance_counter'), 0n),

  msg_arg_data_size: () => (logIcCall('msg_arg_data_size'), BigInt(currentMessage.args.length)),
  msg_arg_data_copy: (dst,offset,size) => { logIcCall('msg_arg_data_copy',[dst,offset,size]); const n = Math.min(toNumber(size), currentMessage.args.length - toNumber(offset)); if (n>0) writeBytesToMemory(currentMessage.args.subarray(toNumber(offset), toNumber(offset)+n), dst); return 0n; },

  msg_caller_size: () => (logIcCall('msg_caller_size'), BigInt(currentMessage.caller.length)),
  msg_caller_copy: (dst,offset,size) => { logIcCall('msg_caller_copy',[dst,offset,size]); const n = Math.min(toNumber(size), currentMessage.caller.length - toNumber(offset)); if (n>0) writeBytesToMemory(currentMessage.caller.subarray(toNumber(offset), toNumber(offset)+n), dst); return 0n; },

  msg_method_name_size: () => (logIcCall('msg_method_name_size'), BigInt(currentMessage.methodName.length)),
  msg_method_name_copy: (dst,offset,size) => { logIcCall('msg_method_name_copy',[dst,offset,size]); const n = Math.min(toNumber(size), currentMessage.methodName.length - toNumber(offset)); if (n>0) writeBytesToMemory(currentMessage.methodName.subarray(toNumber(offset), toNumber(offset)+n), dst); return 0n; },

  accept_message: () => (logIcCall('accept_message'), 1n),

  msg_reply_data_append: (src,size) => { logIcCall('msg_reply_data_append',[src,size]); try { const s = new Uint8Array(wasmMemory.buffer, toNumber(src), toNumber(size)); const combined = new Uint8Array(replyData.length + s.length); combined.set(replyData); combined.set(s, replyData.length); replyData = combined; } catch(e){} },
  msg_reply: () => (logIcCall('msg_reply'), undefined),
  msg_reply_data_size: () => (logIcCall('msg_reply_data_size'), BigInt(replyData.length)),
  msg_reply_data_copy: (dst,off,size) => { logIcCall('msg_reply_data_copy',[dst,off,size]); const n = Math.min(toNumber(size), replyData.length - toNumber(off)); if (n>0) writeBytesToMemory(replyData.subarray(toNumber(off), toNumber(off)+n), dst); return 0n; },

  msg_cycles_available: () => (logIcCall('msg_cycles_available'), 0n),
  msg_cycles_accept: () => (logIcCall('msg_cycles_accept'), 0n),
  canister_cycle_balance: () => (logIcCall('canister_cycle_balance'), 0n),

  canister_self_size: () => (logIcCall('canister_self_size'), BigInt(currentMessage.canisterId.length)),
  canister_self_copy: (dst,off,size) => { logIcCall('canister_self_copy',[dst,off,size]); const n = Math.min(toNumber(size), currentMessage.canisterId.length - toNumber(off)); if (n>0) writeBytesToMemory(currentMessage.canisterId.subarray(toNumber(off), toNumber(off)+n), dst); return 0n; },

  stable_size: () => (logIcCall('stable_size'), 0n),
  stable_grow: () => (logIcCall('stable_grow'), 0n),
  stable_read: () => (logIcCall('stable_read'), undefined),
  stable_write: () => (logIcCall('stable_write'), undefined),
  debug_print: (ptr,len) => { logIcCall('debug_print',[ptr,len]); console.log('debug_print:', readStringFromMemory(ptr,len)); },

  // Minimal, single-file CommonJS runner (clean)
  const fs = require('fs');

  const wasmPath = process.argv[2];
  if (!wasmPath) { console.error('Usage: node simple-runner.js <wasm>'); process.exit(2); }
  const wasmBuffer = fs.readFileSync(wasmPath);

  const memory = new WebAssembly.Memory({ initial: 100 });
  let reply = Buffer.alloc(0);

  function readString(ptr, len) { try { return new TextDecoder().decode(new Uint8Array(memory.buffer, Number(ptr), Number(len))); } catch (e) { return ''; } }

  const ic0 = {
    trap: (ptr, len) => { const m = readString(ptr, len); console.error('IC trap:', m); throw new Error(m); },
    msg_reply_data_append: (src, size) => { try { const bytes = new Uint8Array(memory.buffer, Number(src), Number(size)); reply = Buffer.concat([reply, Buffer.from(bytes)]); } catch (e) {} },
    msg_reply_data_size: () => BigInt(reply.length),
    msg_reply_data_copy: (dst, off, size) => { try { const n = Math.min(Number(size), reply.length - Number(off)); if (n > 0) new Uint8Array(memory.buffer, Number(dst), n).set(reply.slice(Number(off), Number(off) + n)); return 0n; } catch (e) { return 0n; } },
    msg_arg_data_size: () => 0n,
    msg_arg_data_copy: () => 0n,
    time: () => BigInt(Date.now()) * 1000000n
  };

  (async () => {
    try {
      const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory } });
      const exports = instance.exports;
      console.log('Exports:', Object.keys(exports).sort());

      const runQuery = 'canister_query __motoko_runtime_information';
      if (exports[runQuery]) {
        console.log('\nCalling', runQuery);
        reply = Buffer.alloc(0);
        try { exports[runQuery](); console.log('Reply length:', reply.length); if (reply.length) console.log('Hex:', Array.from(reply).map(b => b.toString(16).padStart(2,'0')).join(' ')); } catch (e) { console.error('Query failed:', e.message); }
      }

      process.exit(0);
    } catch (err) { console.error('Instantiate failed:', err); process.exit(1); }
  })();
            // Call canister_init if present
            if (exports.canister_init) {
              console.log('\nCalling canister_init...');
              resetMessageState(''); replyData = new Uint8Array(0); callLog.length = 0;
              try { exports.canister_init(); console.log('canister_init ok'); } catch (e) { console.error('canister_init failed', e.message); printCallLog(); }
            }

            // Discover and run available canister_query <name> exports
            const exportedQueries = Object.keys(exports).filter(k => k.startsWith('canister_query '));
            for (const q of exportedQueries.sort()) {
              console.log(`\nCalling ${q}...`);
              const name = q.slice('canister_query '.length);
              resetMessageState(name); replyData = new Uint8Array(0); callLog.length = 0;
              try {
                exports[q]();
                if (replyData.length) console.log('reply hex', Array.from(replyData).map(b => b.toString(16).padStart(2,'0')).join(' '));
                console.log(`${q} ok`);
              } catch (e) { console.error(`${q} failed`, e.message); printCallLog(); }
            }

            return true;
          } catch (err) { console.error('Runner error', err); return false; }
        }

        run().then(ok => { console.log(ok ? '\nDone' : '\nDone with errors'); process.exit(ok ? 0 : 1); });

        if (replyData.length) {
          console.log('runtime reply len', replyData.length);
          console.log('hex', Array.from(replyData).map(b => b.toString(16).padStart(2, '0')).join(' '));
          try { console.log('text:', new TextDecoder().decode(replyData)); } catch (e) {}
        } else {
          console.log('no reply data');
        }
        printCallLog();
      } catch (e) { console.error('runtime query failed', e.message); printCallLog(); }
    }

    // Call canister_init if present
    if (exports.canister_init) {
      console.log('\nCalling canister_init...');
      resetMessageState(''); replyData = new Uint8Array(0); callLog.length = 0;
      try { exports.canister_init(); console.log('canister_init ok'); } catch (e) { console.error('canister_init failed', e.message); printCallLog(); }
    }

    // Discover and run available canister_query <name> exports
    const exportedQueries = Object.keys(exports).filter(k => k.startsWith('canister_query '));
    for (const q of exportedQueries.sort()) {
      console.log(`\nCalling ${q}...`);
      const name = q.slice('canister_query '.length);
      resetMessageState(name); replyData = new Uint8Array(0); callLog.length = 0;
      try {
        exports[q]();
        if (replyData.length) console.log('reply hex', Array.from(replyData).map(b => b.toString(16).padStart(2,'0')).join(' '));
        console.log(`${q} ok`);
      } catch (e) { console.error(`${q} failed`, e.message); printCallLog(); }
    }

    return true;
  } catch (err) { console.error('Runner error', err); return false; }
}

run().then(ok => { console.log(ok ? '\nDone' : '\nDone with errors'); process.exit(ok ? 0 : 1); });
const fs = require('fs');

// Clean CommonJS runner that instantiates a Motoko wasm module and invokes
// any exported `canister_query <name>` functions. It captures reply bytes
// appended via `msg_reply_data_append` and logs IC0 calls/traps for debugging.

const wasmPath = process.argv[2];
if (!wasmPath) { console.error('Usage: node simple-runner.js <wasm-file>'); process.exit(2); }
const wasmBuffer = fs.readFileSync(wasmPath);

let wasmMemory = null;
const EMPTY_ARGS = new Uint8Array([0x44, 0x49, 0x44, 0x4c, 0x00, 0x00]);
const MOCK_PRINCIPAL = new Uint8Array(32).fill(0); MOCK_PRINCIPAL[0] = 1;

let currentMessage = { args: EMPTY_ARGS, caller: MOCK_PRINCIPAL, canisterId: MOCK_PRINCIPAL, methodName: new Uint8Array(0) };
const callLog = [];
function logIcCall(name, args = []) { callLog.push({ name, args: args.map(a => typeof a === 'bigint' ? `${a}n` : a) }); if (callLog.length > 300) callLog.shift(); }
function printCallLog() { console.log('IC0 call log:'); callLog.forEach((c, i) => console.log(`  ${i + 1}. ${c.name}(${c.args.join(', ')})`)); }
function resetMessageState(methodName = '') { currentMessage.methodName = new TextEncoder().encode(methodName); }
function toNumber(v) { return typeof v === 'bigint' ? Number(v) : v; }
function writeBytesToMemory(src, dst) { if (!wasmMemory?.buffer) return; try { new Uint8Array(wasmMemory.buffer, toNumber(dst), src.length).set(src); } catch (e) {} }
function readStringFromMemory(ptr, len) { if (!wasmMemory?.buffer) return ''; try { return new TextDecoder().decode(new Uint8Array(wasmMemory.buffer, toNumber(ptr), toNumber(len))); } catch (e) { return ''; } }

let replyData = new Uint8Array(0);

const ic0 = {
  trap: (ptr, len) => { logIcCall('trap', [ptr, len]); const m = readStringFromMemory(ptr, len); console.error('TRAP:', m); throw new Error(m); },
  time: () => (logIcCall('time'), BigInt(Date.now()) * 1000000n),
  performance_counter: () => (logIcCall('performance_counter'), 0n),

  msg_arg_data_size: () => (logIcCall('msg_arg_data_size'), BigInt(currentMessage.args.length)),
  msg_arg_data_copy: (dst, off, size) => { logIcCall('msg_arg_data_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.args.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.args.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

  msg_caller_size: () => (logIcCall('msg_caller_size'), BigInt(currentMessage.caller.length)),
  msg_caller_copy: (dst, off, size) => { logIcCall('msg_caller_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.caller.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.caller.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

  msg_method_name_size: () => (logIcCall('msg_method_name_size'), BigInt(currentMessage.methodName.length)),
  msg_method_name_copy: (dst, off, size) => { logIcCall('msg_method_name_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.methodName.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.methodName.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

  accept_message: () => (logIcCall('accept_message'), 1n),

  msg_reply_data_append: (src, size) => { logIcCall('msg_reply_data_append', [src, size]); try { const srcBytes = new Uint8Array(wasmMemory.buffer, toNumber(src), toNumber(size)); const combined = new Uint8Array(replyData.length + srcBytes.length); combined.set(replyData); combined.set(srcBytes, replyData.length); replyData = combined; } catch (e) {} },
  msg_reply: () => (logIcCall('msg_reply'), undefined),
  msg_reply_data_size: () => (logIcCall('msg_reply_data_size'), BigInt(replyData.length)),
  msg_reply_data_copy: (dst, off, size) => { logIcCall('msg_reply_data_copy', [dst, off, size]); const n = Math.min(toNumber(size), replyData.length - toNumber(off)); if (n > 0) writeBytesToMemory(replyData.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

  msg_cycles_available: () => (logIcCall('msg_cycles_available'), 0n),
  msg_cycles_accept: () => (logIcCall('msg_cycles_accept'), 0n),
  canister_cycle_balance: () => (logIcCall('canister_cycle_balance'), 0n),

  canister_self_size: () => (logIcCall('canister_self_size'), BigInt(currentMessage.canisterId.length)),
  canister_self_copy: (dst, off, size) => { logIcCall('canister_self_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.canisterId.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.canisterId.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

  stable_size: () => (logIcCall('stable_size'), 0n),
  stable_grow: () => (logIcCall('stable_grow'), 0n),
  stable_read: () => logIcCall('stable_read'),
  stable_write: () => logIcCall('stable_write'),
  debug_print: () => logIcCall('debug_print'),

  // Minimal no-ops
  call_new: () => (logIcCall('call_new'), 0n),
  call_data_append: () => logIcCall('call_data_append'),
  call_perform: () => (logIcCall('call_perform'), 0n),
  call_with_best_effort_response: () => (logIcCall('call_with_best_effort_response'), 0n),
  call_on_cleanup: () => logIcCall('call_on_cleanup'),
  call_cycles_add: () => logIcCall('call_cycles_add'),
  msg_reject: () => logIcCall('msg_reject')
};

async function run() {
  try {
    wasmMemory = new WebAssembly.Memory({ initial: 100, maximum: 1000 });
    console.log('Instantiating WASM...');
    const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory: wasmMemory } });
    const exports = instance.exports;
    console.log('Exports:', Object.keys(exports).sort());

    // Call runtime information query if present
    const rquery = 'canister_query __motoko_runtime_information';
    if (exports[rquery]) {
      console.log('\nCalling runtime info...');
      resetMessageState('__motoko_runtime_information'); replyData = new Uint8Array(0); callLog.length = 0;
      try {
        exports[rquery]();
        if (replyData.length) {
          console.log('runtime reply len', replyData.length);
          console.log('hex', Array.from(replyData).map(b => b.toString(16).padStart(2, '0')).join(' '));
          try { console.log('text:', new TextDecoder().decode(replyData)); } catch (e) {}
        } else {
          console.log('no reply data');
        }
        printCallLog();
      } catch (e) { console.error('runtime query failed', e.message); printCallLog(); }
    }

    // Call canister_init if present
    if (exports.canister_init) {
      console.log('\nCalling canister_init...');
      resetMessageState(''); replyData = new Uint8Array(0); callLog.length = 0;
      try { exports.canister_init(); console.log('canister_init ok'); } catch (e) { console.error('canister_init failed', e.message); printCallLog(); }
    }

    // Discover and run available canister_query <name> exports
    const exportedQueries = Object.keys(exports).filter(k => k.startsWith('canister_query '));
    for (const q of exportedQueries.sort()) {
      console.log(`\nCalling ${q}...`);
      const name = q.slice('canister_query '.length);
      resetMessageState(name); replyData = new Uint8Array(0); callLog.length = 0;
      try {
        exports[q]();
        if (replyData.length) console.log('reply hex', Array.from(replyData).map(b => b.toString(16).padStart(2,'0')).join(' '));
        console.log(`${q} ok`);
      } catch (e) { console.error(`${q} failed`, e.message); printCallLog(); }
    }

    return true;
  } catch (err) { console.error('Runner error', err); return false; }
}

run().then(ok => { console.log(ok ? '\nDone' : '\nDone with errors'); process.exit(ok ? 0 : 1); });

          stable_size: () => (logIcCall('stable_size'), 0n),
          stable_grow: () => (logIcCall('stable_grow'), 0n),
          stable_read: () => logIcCall('stable_read'),
          stable_write: () => logIcCall('stable_write'),
          debug_print: () => logIcCall('debug_print'),

          // Minimal no-ops
          call_new: () => (logIcCall('call_new'), 0n),
          call_data_append: () => logIcCall('call_data_append'),
          call_perform: () => (logIcCall('call_perform'), 0n),
          call_with_best_effort_response: () => (logIcCall('call_with_best_effort_response'), 0n),
          call_on_cleanup: () => logIcCall('call_on_cleanup'),
          call_cycles_add: () => logIcCall('call_cycles_add'),
          msg_reject: () => logIcCall('msg_reject')
        };

        async function run() {
          try {
            wasmMemory = new WebAssembly.Memory({ initial: 100, maximum: 1000 });
            console.log('Instantiating WASM...');
            const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory: wasmMemory } });
            const exports = instance.exports;
            console.log('Exports:', Object.keys(exports).sort());

            // Call runtime information query if present
            const rquery = 'canister_query __motoko_runtime_information';
            if (exports[rquery]) {
              console.log('\nCalling runtime info...');
              resetMessageState('__motoko_runtime_information'); replyData = new Uint8Array(0); callLog.length = 0;
              try {
                const fs = require('fs');

                // Simple CommonJS runner to instantiate a Motoko-compiled WASM and call query exports.
                // Usage: node simple-runner.js <wasm-file>

                const wasmPath = process.argv[2];
                if (!wasmPath) { console.error('Usage: node simple-runner.js <wasm-file>'); process.exit(2); }
                const wasmBuffer = fs.readFileSync(wasmPath);

                let wasmMemory = null;
                const EMPTY_ARGS = new Uint8Array([0x44, 0x49, 0x44, 0x4c, 0x00, 0x00]);
                const MOCK_PRINCIPAL = new Uint8Array(32).fill(0); MOCK_PRINCIPAL[0] = 1;

                let currentMessage = { args: EMPTY_ARGS, caller: MOCK_PRINCIPAL, canisterId: MOCK_PRINCIPAL, methodName: new Uint8Array(0) };
                const callLog = [];
                function logIcCall(name, args = []) { callLog.push({ name, args: args.map(a => typeof a === 'bigint' ? `${a}n` : a) }); if (callLog.length > 300) callLog.shift(); }
                function printCallLog() { console.log('IC0 call log:'); callLog.forEach((c, i) => console.log(`  ${i + 1}. ${c.name}(${c.args.join(', ')})`)); }
                function resetMessageState(methodName = '') { currentMessage.methodName = new TextEncoder().encode(methodName); }
                function toNumber(v) { return typeof v === 'bigint' ? Number(v) : v; }
                function writeBytesToMemory(src, dst) { if (!wasmMemory?.buffer) return; try { new Uint8Array(wasmMemory.buffer, toNumber(dst), src.length).set(src); } catch (e) {} }
                function readStringFromMemory(ptr, len) { if (!wasmMemory?.buffer) return ''; try { return new TextDecoder().decode(new Uint8Array(wasmMemory.buffer, toNumber(ptr), toNumber(len))); } catch (e) { return ''; } }

                let replyData = new Uint8Array(0);

                const ic0 = {
                  trap: (ptr, len) => { logIcCall('trap', [ptr, len]); const m = readStringFromMemory(ptr, len); console.error('TRAP:', m); throw new Error(m); },
                  time: () => (logIcCall('time'), BigInt(Date.now()) * 1000000n),
                  performance_counter: () => (logIcCall('performance_counter'), 0n),

                  msg_arg_data_size: () => (logIcCall('msg_arg_data_size'), BigInt(currentMessage.args.length)),
                  msg_arg_data_copy: (dst, off, size) => { logIcCall('msg_arg_data_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.args.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.args.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

                  msg_caller_size: () => (logIcCall('msg_caller_size'), BigInt(currentMessage.caller.length)),
                  msg_caller_copy: (dst, off, size) => { logIcCall('msg_caller_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.caller.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.caller.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

                  msg_method_name_size: () => (logIcCall('msg_method_name_size'), BigInt(currentMessage.methodName.length)),
                  msg_method_name_copy: (dst, off, size) => { logIcCall('msg_method_name_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.methodName.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.methodName.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

                  accept_message: () => (logIcCall('accept_message'), 1n),

                  msg_reply_data_append: (src, size) => { logIcCall('msg_reply_data_append', [src, size]); try { const srcBytes = new Uint8Array(wasmMemory.buffer, toNumber(src), toNumber(size)); const combined = new Uint8Array(replyData.length + srcBytes.length); combined.set(replyData); combined.set(srcBytes, replyData.length); replyData = combined; } catch (e) {} },
                  msg_reply: () => (logIcCall('msg_reply'), undefined),
                  msg_reply_data_size: () => (logIcCall('msg_reply_data_size'), BigInt(replyData.length)),
                  msg_reply_data_copy: (dst, off, size) => { logIcCall('msg_reply_data_copy', [dst, off, size]); const n = Math.min(toNumber(size), replyData.length - toNumber(off)); if (n > 0) writeBytesToMemory(replyData.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

                  msg_cycles_available: () => (logIcCall('msg_cycles_available'), 0n),
                  msg_cycles_accept: () => (logIcCall('msg_cycles_accept'), 0n),
                  canister_cycle_balance: () => (logIcCall('canister_cycle_balance'), 0n),

                  canister_self_size: () => (logIcCall('canister_self_size'), BigInt(currentMessage.canisterId.length)),
                  canister_self_copy: (dst, off, size) => { logIcCall('canister_self_copy', [dst, off, size]); const n = Math.min(toNumber(size), currentMessage.canisterId.length - toNumber(off)); if (n > 0) writeBytesToMemory(currentMessage.canisterId.subarray(toNumber(off), toNumber(off) + n), dst); return 0n; },

                  stable_size: () => (logIcCall('stable_size'), 0n),
                  stable_grow: () => (logIcCall('stable_grow'), 0n),
                  stable_read: () => logIcCall('stable_read'),
                  stable_write: () => logIcCall('stable_write'),
                  debug_print: () => logIcCall('debug_print'),

                  // Minimal no-ops
                  call_new: () => (logIcCall('call_new'), 0n),
                  call_data_append: () => logIcCall('call_data_append'),
                  call_perform: () => (logIcCall('call_perform'), 0n),
                  call_with_best_effort_response: () => (logIcCall('call_with_best_effort_response'), 0n),
                  call_on_cleanup: () => logIcCall('call_on_cleanup'),
                  call_cycles_add: () => logIcCall('call_cycles_add'),
                  msg_reject: () => logIcCall('msg_reject')
                };

                async function run() {
                  try {
                    wasmMemory = new WebAssembly.Memory({ initial: 100, maximum: 1000 });
                    console.log('Instantiating WASM...');
                    const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory: wasmMemory } });
                    const exports = instance.exports;
                    console.log('Exports:', Object.keys(exports).sort());

                    // Call runtime information query if present
                    const rquery = 'canister_query __motoko_runtime_information';
                    if (exports[rquery]) {
                      console.log('\nCalling runtime info...');
                      resetMessageState('__motoko_runtime_information'); replyData = new Uint8Array(0); callLog.length = 0;
                      try {
                        exports[rquery]();
                        if (replyData.length) {
                          console.log('runtime reply len', replyData.length);
                          console.log('hex', Array.from(replyData).map(b => b.toString(16).padStart(2, '0')).join(' '));
                          try { console.log('text:', new TextDecoder().decode(replyData)); } catch (e) {}
                        } else {
                          console.log('no reply data');
                        }
                        printCallLog();
                      } catch (e) { console.error('runtime query failed', e.message); printCallLog(); }
                    }

                    // Call canister_init if present
                    if (exports.canister_init) {
                      console.log('\nCalling canister_init...');
                      resetMessageState(''); replyData = new Uint8Array(0); callLog.length = 0;
                      try { exports.canister_init(); console.log('canister_init ok'); } catch (e) { console.error('canister_init failed', e.message); printCallLog(); }
                    }

                    // Discover and run available canister_query <name> exports
                    const exportedQueries = Object.keys(exports).filter(k => k.startsWith('canister_query '));
                    for (const q of exportedQueries.sort()) {
                      console.log(`\nCalling ${q}...`);
                      const name = q.slice('canister_query '.length);
                      resetMessageState(name); replyData = new Uint8Array(0); callLog.length = 0;
                      try {
                        exports[q]();
                        if (replyData.length) console.log('reply hex', Array.from(replyData).map(b => b.toString(16).padStart(2,'0')).join(' '));
                        console.log(`${q} ok`);
                      } catch (e) { console.error(`${q} failed`, e.message); printCallLog(); }
                    }

                    return true;
                  } catch (err) { console.error('Runner error', err); return false; }
                }

                run().then(ok => { console.log(ok ? '\nDone' : '\nDone with errors'); process.exit(ok ? 0 : 1); });
