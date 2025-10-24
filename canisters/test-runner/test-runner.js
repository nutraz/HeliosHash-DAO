<<<<<<< HEAD
const fs = require('fs');
const { TextDecoder } = require('util');

// Load the WASM file
const wasmBuffer = fs.readFileSync(process.argv[2]);

// Mock IC system state
const icState = {
  stableMemory: new ArrayBuffer(0),
  callStack: [],
  nextCallId: 0,
  performanceCounters: {
    instruction: 0n,
    system: 0n,
    heap: 0n,
  },
  time: Date.now() * 1000000n, // Current time in nanoseconds
  randSeed: 42, // Fixed seed for deterministic tests
  canisterId: 'aaaaa-aa', // Mock canister ID
  caller: 'rrkah-fqaaa-aaaaa-aaaaq-cai', // Mock caller principal
  msgData: new Uint8Array(0),
  rejectCode: 0,
  rejectMsg: '',
};

// Create a comprehensive IC0 import object
const importObject = {
  ic0: {
    // Message functions
    msg_arg_data_size: () => icState.msgData.length,
    msg_arg_data_copy: (dst, offset, size) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      for (let i = 0; i < size; i++) {
        if (offset + i < icState.msgData.length) {
          memory[dst + i] = icState.msgData[offset + i];
        } else {
          memory[dst + i] = 0;
        }
      }
    },
    msg_caller_size: () => icState.caller.length,
    msg_caller_copy: (dst, offset, size) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const callerBytes = new TextEncoder().encode(icState.caller);
      for (let i = 0; i < size; i++) {
        if (offset + i < callerBytes.length) {
          memory[dst + i] = callerBytes[offset + i];
        } else {
          memory[dst + i] = 0;
        }
      }
    },
    msg_reject_code: () => icState.rejectCode,
    msg_reject_msg_size: () => icState.rejectMsg.length,
    msg_reject_msg_copy: (dst, offset, size) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const msgBytes = new TextEncoder().encode(icState.rejectMsg);
      for (let i = 0; i < size; i++) {
        if (offset + i < msgBytes.length) {
          memory[dst + i] = msgBytes[offset + i];
        } else {
          memory[dst + i] = 0;
        }
      }
    },

    // Canister functions
    canister_self_size: () => icState.canisterId.length,
    canister_self_copy: (dst, offset, size) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const idBytes = new TextEncoder().encode(icState.canisterId);
      for (let i = 0; i < size; i++) {
        if (offset + i < idBytes.length) {
          memory[dst + i] = idBytes[offset + i];
        } else {
          memory[dst + i] = 0;
        }
      }
    },

    // Debug and error functions
    debug_print: (str, len) => {
      const memory = new Uint8Array(instance.exports.memory.buffer, str, len);
      console.log(new TextDecoder().decode(memory));
    },
    trap: (str, len) => {
      const memory = new Uint8Array(instance.exports.memory.buffer, str, len);
      throw new Error(new TextDecoder().decode(memory));
    },

    // Call functions (for inter-canister calls)
    call_new: (
      callee_src,
      callee_len,
      name_src,
      name_len,
      reply_fun,
      reply_env,
      reject_fun,
      reject_env
    ) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const calleeBytes = new Uint8Array(memory.buffer, callee_src, callee_len);
      const nameBytes = new Uint8Array(memory.buffer, name_src, name_len);

      const callee = new TextDecoder().decode(calleeBytes);
      const name = new TextDecoder().decode(nameBytes);

      const callId = icState.nextCallId++;
      icState.callStack.push({
        id: callId,
        callee,
        name,
        replyFun,
        replyEnv,
        rejectFun,
        rejectEnv,
        args: new Uint8Array(0),
      });

      return callId;
    },
    call_data_append: (callId, src, len) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const data = new Uint8Array(memory.buffer, src, len);

      const call = icState.callStack.find((c) => c.id === callId);
      if (call) {
        const newArgs = new Uint8Array(call.args.length + len);
        newArgs.set(call.args);
        newArgs.set(data, call.args.length);
        call.args = newArgs;
      }
    },
    call_perform: (callId) => {
      const call = icState.callStack.find((c) => c.id === callId);
      if (call) {
        // For testing, we'll immediately "reply" with a success response
        // In a real test runner, you might want to customize this behavior
        const replyData = new TextEncoder().encode(JSON.stringify({ success: true }));

        // Simulate the reply callback
        const memory = new Uint8Array(instance.exports.memory.buffer);
        const replyBuffer = new Uint8Array(memory.buffer, call.replyEnv, replyData.length);
        replyBuffer.set(replyData);

        // Call the reply function
        instance.exports[call.replyFun](call.replyEnv, replyData.length);

        // Remove the call from the stack
        icState.callStack = icState.callStack.filter((c) => c.id !== callId);

        return 0; // Success
      }
      return 1; // Call not found
    },

    // Stable memory functions
    stable_size: () => icState.stableMemory.byteLength / 65536, // Return size in 64KB pages
    stable_grow: (newPages) => {
      const oldSize = icState.stableMemory.byteLength;
      const newSize = oldSize + newPages * 65536;
      const newBuffer = new ArrayBuffer(newSize);
      new Uint8Array(newBuffer).set(new Uint8Array(icState.stableMemory));
      icState.stableMemory = newBuffer;
      return oldSize / 65536; // Return old size in pages
    },
    stable_write: (offset, src, len) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const data = new Uint8Array(memory.buffer, src, len);
      const stableMemory = new Uint8Array(icState.stableMemory);

      // Ensure stable memory is large enough
      if (offset + len > stableMemory.length) {
        const newSize = offset + len;
        const newBuffer = new ArrayBuffer(newSize);
        new Uint8Array(newBuffer).set(stableMemory);
        icState.stableMemory = newBuffer;
      }

      // Write the data
      const updatedStableMemory = new Uint8Array(icState.stableMemory);
      updatedStableMemory.set(data, offset);
    },
    stable_read: (dst, offset, len) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const stableMemory = new Uint8Array(icState.stableMemory);

      for (let i = 0; i < len; i++) {
        if (offset + i < stableMemory.length) {
          memory[dst + i] = stableMemory[offset + i];
        } else {
          memory[dst + i] = 0;
        }
      }
    },

    // System functions
    time: () => {
      // Return current time in nanoseconds since Unix epoch
      return icState.time;
    },
    performance_counter: (counter_type) => {
      // Return different counters based on type
      switch (counter_type) {
        case 0: // instruction counter
          return icState.performanceCounters.instruction++;
        case 1: // system counter
          return icState.performanceCounters.system++;
        case 2: // heap counter
          return icState.performanceCounters.heap++;
        default:
          return 0n;
      }
    },
    raw_rand: (dst, len) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);

      // Simple deterministic pseudo-random number generator for testing
      for (let i = 0; i < len; i++) {
        icState.randSeed = (icState.randSeed * 1103515245 + 12345) & 0x7fffffff;
        memory[dst + i] = (icState.randSeed >> i % 8) & 0xff;
      }
    },

    // Additional IC0 functions that might be needed
    msg_reject: (src, len) => {
      const memory = new Uint8Array(instance.exports.memory.buffer);
      const msgBytes = new Uint8Array(memory.buffer, src, len);
      icState.rejectMsg = new TextDecoder().decode(msgBytes);
      icState.rejectCode = 1; // Generic error code
    },
    accept_message: () => {
      // For testing, always accept messages
      return 0; // Success
    },
  },
};

// Compile and instantiate the WASM module
WebAssembly.compile(wasmBuffer)
  .then((module) => WebAssembly.instantiate(module, importObject))
  .then((instance) => {
    // Store instance for use in trap function
    global.instance = instance;

    // Run the tests
    console.log('=== Starting HHDAO Canister Tests ===');

    try {
      // Call the test function
      instance.exports.run();
      console.log('=== Tests Completed Successfully ===');
    } catch (error) {
      console.error('Test execution failed:', error);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('Error instantiating WASM module:', error);
    process.exit(1);
  });
=======
// Minimal test-runner: instantiate wasm and call a simple export
import { readFileSync } from 'fs';

const wasmPath = process.argv[2] || 'wasm/hhdao-test.wasm';
const wasmBuffer = readFileSync(wasmPath);

// Create a type-aware ic0 import object. Many ic0 functions return i32 (JS Number)
// while others return i64 (BigInt). Returning the wrong JS type causes traps.
function createIc0(memory) {
  function readString(ptr, len) {
    try {
      const p = Number(ptr);
      const l = Number(len);
      const mem = new Uint8Array(memory.buffer);
      if (p < 0 || l <= 0 || p >= mem.length) return '';
      const available = Math.min(l, mem.length - p);
      return new TextDecoder().decode(mem.subarray(p, p + available));
    } catch (e) { return ''; }
  }

  return new Proxy({}, {
    get: (_t, k) => {
      const name = String(k);
      // debug_print expects (ptr, len) -> void
      if (name === 'debug_print') return (ptr, len) => { console.log(readString(ptr, len)); };

      // Functions that should return BigInt (i64)
      if (name.match(/time|performance|cycles|balance|mint|refunded|_128|128|counter/)) {
        return (..._args) => 0n;
      }

      // Functions that should return Number (i32)
      if (name.match(/size|copy|len|_size|_copy|caller|self|stable|data_certificate/)) {
        return (..._args) => 0;
      }

      // Default: return 0 (i32)
      return (..._args) => 0;
    }
  });
}

async function run() {
  try {
    const memory = new WebAssembly.Memory({ initial: 20, maximum: 200 });

    // Inspect module imports to create type-correct ic0 stubs
    const module = new WebAssembly.Module(wasmBuffer);
    const imports = WebAssembly.Module.imports(module).filter(i => i.module === 'ic0');
    const ic0Obj = {};
    // Heuristic: which ic0 functions should return BigInt (i64)
  const bigintHint = /(time|performance|counter|cycles|balance|mint|refunded|_128|128|64|stable64|now|size)/i;
    for (const imp of imports) {
      const name = imp.name;
      if (name === 'debug_print') {
        ic0Obj[name] = (ptr, len) => {
          try {
            const p = Number(ptr);
            const l = Number(len);
            const mem = new Uint8Array(memory.buffer);
            const available = Math.min(l, Math.max(0, mem.length - p));
            const s = new TextDecoder().decode(mem.subarray(p, p + available));
            console.log('[wasm debug_print] ', s);
          } catch (e) {}
        };
        continue;
      }
      if (bigintHint.test(name)) {
        ic0Obj[name] = (..._a) => 0n;
      } else {
        ic0Obj[name] = (..._a) => 0;
      }
    }

    const ic0 = new Proxy(ic0Obj, { get: (t, k) => (k in t ? t[k] : (..._a) => 0) });
    const importObject = { ic0, env: { memory } };
  const instResult = await WebAssembly.instantiate(module, importObject);
  const instance = instResult.instance ? instResult.instance : instResult;
  const exports = instance.exports || {};

    // First, attempt canister_init (some Motoko modules perform initialization here)
    if (typeof exports['canister_init'] === 'function') {
      console.log('Invoking canister_init...');
      try {
        exports['canister_init']();
        console.log('canister_init completed');
      } catch (e) {
        console.error('canister_init failed:', e);
      }
    }

    // First, try plain candidate names
    const candidates = ['run', 'runTests', 'runAllTests', 'runAll', 'main', 'test'];
    for (const c of candidates) {
      if (typeof exports[c] === 'function') {
        console.log('Invoking plain export:', c);
        try {
          const r = exports[c]();
          console.log('Result:', r);
          return process.exit(0);
        } catch (e) {
          console.error('Invocation failed for', c, e);
        }
      }
    }

    // Next, Motoko often emits update/query entrypoints as 'canister_update <name>'
    // or 'canister_query <name>'. Try those variants by scanning available exports.
    const allKeys = Object.keys(exports);
    const candidatesFound = allKeys.filter(k => {
      const lower = k.toLowerCase();
      return (lower.startsWith('canister_update ') || lower.startsWith('canister_query ')) && (lower.includes('run') || lower.includes('test') || lower.includes('all'));
    });
    for (const key of candidatesFound) {
      if (typeof exports[key] === 'function') {
        console.log('Invoking Motoko-style export:', key);
        try {
          const r = exports[key]();
          console.log('Result:', r);
          return process.exit(0);
        } catch (e) {
          console.error('Invocation failed for', key, e);
        }
      }
    }

    console.log('No callable test entry found. Exports:', allKeys);
    return process.exit(1);
  } catch (e) {
    console.error('Runner error:', e);
    return process.exit(1);
  }
}

run();
>>>>>>> audit-clean
