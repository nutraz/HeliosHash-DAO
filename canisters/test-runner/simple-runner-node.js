const fs = require('fs');

// Minimal CommonJS Motoko WASM runner with ic0 stubs.
const wasmPath = process.argv[2] || 'wasm/quick-test-actor.wasm';
const wasmBuffer = fs.readFileSync(wasmPath);

const memory = new WebAssembly.Memory({ initial: 100 });
let replyBuf = Buffer.alloc(0);

function readString(ptr, len) { try { return new TextDecoder().decode(new Uint8Array(memory.buffer, Number(ptr), Number(len))); } catch (e) { return ''; } }

const ic0 = {
  trap: (ptr, len) => { const m = readString(ptr, len); console.error('IC trap:', m); throw new Error(m); },
  time: () => BigInt(Date.now()) * 1000000n,

  // message args
  msg_arg_data_size: () => 0n,
  msg_arg_data_copy: (dst, off, size) => 0n,

  // caller/method
  msg_caller_size: () => 0n,
  msg_caller_copy: (dst, off, size) => 0n,
  msg_method_name_size: () => 0n,
  msg_method_name_copy: (dst, off, size) => 0n,
  accept_message: () => 1n,

  // reply
  msg_reply_data_append: (src, size) => { try { const bytes = new Uint8Array(memory.buffer, Number(src), Number(size)); replyBuf = Buffer.concat([replyBuf, Buffer.from(bytes)]); } catch (e) {} },
  msg_reply: () => {},
  msg_reply_data_size: () => BigInt(replyBuf.length),
  msg_reply_data_copy: (dst, off, size) => { try { const n = Math.min(Number(size), replyBuf.length - Number(off)); if (n > 0) new Uint8Array(memory.buffer, Number(dst), n).set(replyBuf.slice(Number(off), Number(off) + n)); return 0n; } catch (e) { return 0n; } },

  // cycles / balance
  msg_cycles_available: () => 0n,
  msg_cycles_accept: () => 0n,
  canister_cycle_balance: () => 0n,
  canister_cycle_balance128: () => 0n,
  msg_cycles_refunded128: () => 0n,

  // canister self
  canister_self_size: () => 0n,
  canister_self_copy: (dst, off, size) => 0n,

  // stable memory
  stable_size: () => 0n,
  stable_grow: () => 0n,
  stable_read: () => 0n,
  stable_write: () => 0n,
  stable64_size: () => 0n,
  stable64_grow: () => 0n,
  stable64_read: () => 0n,
  stable64_write: () => 0n,

  // calls
  call_new: () => 0n,
  call_data_append: () => {},
  call_perform: () => 0n,
  call_with_best_effort_response: () => 0n,
  call_on_cleanup: () => {},
  call_cycles_add: () => {},
  call_cycles_add128: () => {},

  // misc
  data_certificate_present: () => 0n,
  data_certificate_size: () => 0n,
  data_certificate_copy: () => 0n,
  mint_cycles: () => 0n,
  canister_status: () => 0n,
  is_controller: () => 0n,
  global_timer_set: () => 0n,
  msg_reject: () => {},
  msg_reject_code: () => 0n,
  msg_reject_msg_size: () => 0n,
  msg_reject_msg_copy: () => 0n,
  debug_print: (ptr, len) => { try { console.log('debug_print:', readString(ptr, len)); } catch (e) {} }
};

(async () => {
  try {
    const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory } });
    const exports = instance.exports;
    console.log('Available exports:', Object.keys(exports).sort());

    // runtime info
    const r = 'canister_query __motoko_runtime_information';
    if (exports[r]) {
      console.log('\nCalling', r);
      replyBuf = Buffer.alloc(0);
      try {
        exports[r]();
        console.log('Runtime reply length:', replyBuf.length);
        if (replyBuf.length) console.log('Hex:', Array.from(replyBuf).map(b => b.toString(16).padStart(2,'0')).join(' '));
        try { console.log('Text:', new TextDecoder().decode(replyBuf)); } catch (e) {}
      } catch (e) {
        console.error('Runtime query failed:', e.message);
      }
    } else {
      console.log('\nNo runtime info export');
    }

    // call all canister_query exports
    const exportedQueries = Object.keys(exports).filter(k => k.startsWith('canister_query '));
    for (const q of exportedQueries.sort()) {
      console.log('\nCalling', q);
      replyBuf = Buffer.alloc(0);
      try { exports[q](); console.log(q, 'ok — reply len', replyBuf.length); if (replyBuf.length) console.log('Hex:', Array.from(replyBuf).map(b => b.toString(16).padStart(2,'0')).join(' ')); } catch (e) { console.error(q, 'failed:', e.message); }
    }

    process.exit(0);
  } catch (err) {
    console.error('Instantiate failed:', err);
    process.exit(1);
  }
})();
const fs = require('fs');

// Clean CommonJS runner (new file) — avoids previous file corruption.
const wasmPath = process.argv[2] || 'wasm/quick-test-actor.wasm';
const wasmBuffer = fs.readFileSync(wasmPath);

const memory = new WebAssembly.Memory({ initial: 100 });
let reply = Buffer.alloc(0);

function readString(ptr, len) {
  try { return new TextDecoder().decode(new Uint8Array(memory.buffer, Number(ptr), Number(len))); } catch (e) { return ''; }
}

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
      try {
        exports[r]();
        console.log('Reply length:', reply.length);
        if (reply.length) console.log('Hex:', Array.from(reply).map(b => b.toString(16).padStart(2,'0')).join(' '));
        try { console.log('Text:', new TextDecoder().decode(reply)); } catch (e) {}
      } catch (e) {
        console.error('Query failed:', e.message);
      }
    } else {
      console.log('\nNo __motoko_runtime_information export found');
    }

    // Discover and call all canister_query <name> exports (no args)
    const exportedQueries = Object.keys(exports).filter(k => k.startsWith('canister_query '));
    for (const q of exportedQueries.sort()) {
      console.log('\nCalling', q);
      reply = Buffer.alloc(0);
      try {
        exports[q]();
        console.log(q, 'ok — reply len', reply.length);
        if (reply.length) console.log('Hex:', Array.from(reply).map(b => b.toString(16).padStart(2,'0')).join(' '));
      } catch (e) {
        console.error(q, 'failed:', e.message);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error('Instantiate failed:', err);
    process.exit(1);
  }
})();
