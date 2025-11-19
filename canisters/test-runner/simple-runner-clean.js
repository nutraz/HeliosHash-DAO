// Clean CommonJS runner (new file) for Motoko wasm tests
const fs = require('fs');
const path = require('path');

function toNumber(n) { return typeof n === 'bigint' ? Number(n) : n; }

function readString(mem, ptr, len) {
  try { return new TextDecoder().decode(new Uint8Array(mem.buffer, toNumber(ptr), toNumber(len))); }
  catch (e) { return ''; }
}

let wasmMemory = null;
let replyParts = [];
const callLog = [];
function logIc(name, args = []) { callLog.push({ name, args }); }
// Minimal message lifecycle state used by msg_* host functions
const EMPTY_ARGS = Buffer.from([0x44, 0x49, 0x44, 0x4c, 0x00, 0x00, 0x00, 0x00]); // "DIDL" + 4-byte zero length for empty candid
let currentArgs = EMPTY_ARGS;
let currentMethod = Buffer.from('');
const MOCK_PRINCIPAL = Buffer.from(new Array(32).fill(0)); MOCK_PRINCIPAL[0] = 1; MOCK_PRINCIPAL[31] = 2;
const MOCK_CANISTER = Buffer.from(MOCK_PRINCIPAL);
// Simple stable memory emulation (bytes)
const STABLE_SIZE = 1024 * 1024; // 1MiB
const stableMemory = new Uint8Array(STABLE_SIZE);
let stableSizeBytes = 0;

function makeIC0(mem) {
  return {
    // low-level call/cycles functions
    call_cycles_add128: () => (logIc('call_cycles_add128'), 0n),
    call_with_best_effort_response: () => (logIc('call_with_best_effort_response'), 0n),
    call_on_cleanup: () => (logIc('call_on_cleanup'), 0n),

    // canister identity/status
    canister_self_copy: () => (logIc('canister_self_copy', Array.from(arguments)), 0n),
    canister_self_size: () => (logIc('canister_self_size'), 0n),
    canister_status: () => (logIc('canister_status'), 0n),
    is_controller: () => (logIc('is_controller'), 0n),

    // rejection helpers
    msg_reject_code: () => (logIc('msg_reject_code'), 0n),
    msg_reject_msg_size: () => (logIc('msg_reject_msg_size'), 0n),
    msg_reject_msg_copy: () => (logIc('msg_reject_msg_copy', Array.from(arguments)), 0n),
    msg_reject: () => (logIc('msg_reject', Array.from(arguments)), 0n),
    msg_cycles_refunded128: () => (logIc('msg_cycles_refunded128'), 0n),

    trap: (ptr, len) => {
      logIc('trap', [ptr, len]);
      const p = toNumber(ptr), l = toNumber(len);
      let msg = '';
      try {
        const bytes = new Uint8Array(mem.buffer, p, l);
        const hex = Array.from(bytes).map(b => b.toString(16).padStart(2,'0')).join(' ');
        msg = new TextDecoder().decode(bytes);
        console.error('WASM trap raw hex:', hex);
        console.error('WASM trap text:', msg);
      } catch (e) {
        console.error('WASM trap: failed to read memory at', p, l, e.message);
      }
      throw new Error(msg);
    },
    performance_counter: () => (logIc('performance_counter'), 0n),
    time: () => (logIc('time'), 0n),
    global_timer_set: () => (logIc('global_timer_set'), 0n),
    msg_arg_data_size: () => (logIc('msg_arg_data_size'), BigInt(currentArgs.length)),
    msg_arg_data_copy: (dst, off, sz) => {
      logIc('msg_arg_data_copy', [dst, off, sz]);
      const o = toNumber(off); const s = Math.min(toNumber(sz), currentArgs.length - o);
      if (s > 0) {
        try { const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem; new Uint8Array(targetMem.buffer, toNumber(dst), s).set(currentArgs.slice(o, o + s)); } catch(e) {}
      }
      return 0n;
    },

    msg_reply_data_append: (ptr, len) => {
      logIc('msg_reply_data_append', [ptr, len]);
      try { const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem; const b = new Uint8Array(targetMem.buffer, toNumber(ptr), toNumber(len)); replyParts.push(Buffer.from(b)); } catch (e) {}
      return 0n;
    },
    msg_reply_data_size: () => (logIc('msg_reply_data_size'), BigInt(replyParts.reduce((s,b) => s + b.length, 0))),
    msg_reply_data_copy: (dst, off, size) => {
      logIc('msg_reply_data_copy', [dst, off, size]);
      const flat = Buffer.concat(replyParts);
      const o = toNumber(off), s = toNumber(size);
      const slice = flat.slice(o, o + s);
      try { const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem; new Uint8Array(targetMem.buffer, toNumber(dst), slice.length).set(slice); } catch(e) {}
      return 0n;
    },

    msg_reply: () => (logIc('msg_reply'), 0n),
  msg_caller_size: () => (logIc('msg_caller_size'), BigInt(MOCK_PRINCIPAL.length)),
  msg_caller_copy: (dst, off, sz) => { logIc('msg_caller_copy', [dst, off, sz]); const o = toNumber(off); const s = Math.min(toNumber(sz), MOCK_PRINCIPAL.length - o); if (s>0) { try { const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem; new Uint8Array(targetMem.buffer, toNumber(dst), s).set(MOCK_PRINCIPAL.slice(o,o+s)); } catch(e){} } return 0n; },
  msg_method_name_size: () => (logIc('msg_method_name_size'), BigInt(currentMethod.length)),
  msg_method_name_copy: (dst, off, sz) => { logIc('msg_method_name_copy', [dst, off, sz]); const o = toNumber(off); const s = Math.min(toNumber(sz), currentMethod.length - o); if (s>0) { try { const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem; new Uint8Array(targetMem.buffer, toNumber(dst), s).set(currentMethod.slice(o,o+s)); } catch(e){} } return 0n; },
    accept_message: () => (logIc('accept_message'), 1n),

    debug_print: (ptr, len) => { logIc('debug_print', [ptr, len]); try { console.log('[wasm debug] ' + readString(mem, ptr, len)); } catch (e) {} return 0n; },

  // canister self helpers
  canister_self_size: () => (logIc('canister_self_size'), BigInt(MOCK_CANISTER.length)),
  canister_self_copy: (dst, off, sz) => { logIc('canister_self_copy', [dst, off, sz]); const o = toNumber(off); const s = Math.min(toNumber(sz), MOCK_CANISTER.length - o); if (s>0) { try { const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem; new Uint8Array(targetMem.buffer, toNumber(dst), s).set(MOCK_CANISTER.slice(o,o+s)); } catch(e){} } return 0n; },

  // stubs for stable and call APIs
    stable64_grow: (pages) => { logIc('stable64_grow', [pages]); const old = stableSizeBytes; stableSizeBytes = Math.min(STABLE_SIZE, stableSizeBytes + toNumber(pages) * 65536); return BigInt(old / 65536); },
    stable64_size: () => (logIc('stable64_size'), BigInt(Math.floor(stableSizeBytes / 65536))),
    stable64_write: (src_ptr, off, size) => {
      logIc('stable64_write', [src_ptr, off, size]);
      try {
        const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem;
        const s = toNumber(size), o = toNumber(off);
        const src = new Uint8Array(targetMem.buffer, toNumber(src_ptr), s);
        stableMemory.set(src, o);
        stableSizeBytes = Math.max(stableSizeBytes, o + s);
      } catch (e) {}
      return 0n;
    },
    stable64_read: (dst_ptr, off, size) => {
      logIc('stable64_read', [dst_ptr, off, size]);
      try {
        const targetMem = (typeof wasmMemory !== 'undefined' && wasmMemory) ? wasmMemory : mem;
        const s = toNumber(size), o = toNumber(off);
        const slice = stableMemory.subarray(o, o + s);
        new Uint8Array(targetMem.buffer, toNumber(dst_ptr), slice.length).set(slice);
      } catch (e) {}
      return 0n;
    },

    call_new: () => (logIc('call_new'), 0n),
    call_data_append: () => (logIc('call_data_append'), 0n),
    call_perform: () => (logIc('call_perform'), 0n),

    data_certificate_copy: () => (logIc('data_certificate_copy'), 0n),
  };
}

async function run(wasmPath) {
  const abs = path.resolve(wasmPath);
  if (!fs.existsSync(abs)) throw new Error('wasm not found: ' + abs);
  const buf = fs.readFileSync(abs);
  const mod = await WebAssembly.compile(buf);

  const mem = new WebAssembly.Memory({ initial: 200 });
  wasmMemory = mem;
  const ic0 = makeIC0(mem);

  const imports = { ic0, env: { memory: mem } };
  const instOrObj = await WebAssembly.instantiate(mod, imports);
  const instance = instOrObj.instance ? instOrObj.instance : instOrObj;

  if (instance.exports.memory) {
    wasmMemory = instance.exports.memory;
    Object.assign(ic0, makeIC0(wasmMemory));
  }

  console.log('Exports:', Object.keys(instance.exports).sort().join(', '));

  function callExport(name) {
    if (!instance.exports[name]) return;
    try {
      // prepare message context
      replyParts = []; callLog.length = 0;
      // set method name and default args
      if (name.startsWith('canister_query ')) {
        currentMethod = Buffer.from(name.slice('canister_query '.length));
      } else {
        currentMethod = Buffer.from(name);
      }
      currentArgs = EMPTY_ARGS;
      console.log('\nCalling', name);
      const r = instance.exports[name]();
      console.log('Returned raw:', r);
      const total = replyParts.reduce((s,b) => s + b.length, 0);
      if (total) {
        const flat = Buffer.concat(replyParts);
        console.log('Reply hex:', flat.toString('hex'));
        try { console.log('Reply text:', flat.toString('utf8')); } catch(e) {}
      }
      if (callLog.length) console.log('IC0 log:', JSON.stringify(callLog, (k,v) => (typeof v === 'bigint' ? v.toString() + 'n' : v), 2));
    } catch (e) {
      console.error('Call threw:', e && e.message ? e.message : e);
      if (callLog.length) console.error('IC0 log at trap:', JSON.stringify(callLog, (k,v) => (typeof v === 'bigint' ? v.toString() + 'n' : v), 2));
    }
  }

  if (instance.exports['canister_query __motoko_runtime_information']) callExport('canister_query __motoko_runtime_information');
  else if (instance.exports.__motoko_runtime_information) callExport('__motoko_runtime_information');

  if (instance.exports.canister_init) callExport('canister_init');

  for (const k of Object.keys(instance.exports)) if (k.startsWith('canister_query ')) callExport(k);
}

if (require.main === module) {
  const wasmPath = process.argv[2] || path.join(__dirname, '..', '..', 'wasm', 'quick-test-actor.wasm');
  run(wasmPath).catch(e => { console.error('Runner failed:', e); process.exit(1); });
}

module.exports = { run };
