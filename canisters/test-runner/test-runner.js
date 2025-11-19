// Clean CommonJS Motoko WASM test-runner
const fs = require('fs');

// Minimal CommonJS Motoko WASM runner with ic0 stubs.
const wasmPath = process.argv[2] || 'wasm/hhdao-test.wasm';
const wasmBuffer = fs.readFileSync(wasmPath);

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

// Instantiate the WASM module and print available exports. Then attempt
// to call canister_query exports or the usual test entrypoints.
(async () => {
  try {
    const memory = new WebAssembly.Memory({ initial: 100 });
    let reply = Buffer.alloc(0);

    function readString(ptr, len) { try { return new TextDecoder().decode(new Uint8Array(memory.buffer, Number(ptr), Number(len))); } catch (e) { return ''; } }

    const ic0 = {
      trap: (ptr, len) => { const m = readString(ptr, len); console.error('IC trap:', m); throw new Error(m); },
      time: () => BigInt(Date.now()) * 1000000n,
      msg_arg_data_size: () => 0n,
      msg_arg_data_copy: () => 0n,
      msg_caller_size: () => 0n,
      msg_caller_copy: () => 0n,
      msg_method_name_size: () => 0n,
      msg_method_name_copy: () => 0n,
      accept_message: () => 1n,
      msg_reply_data_append: (src, size) => { try { const bytes = new Uint8Array(memory.buffer, Number(src), Number(size)); reply = Buffer.concat([reply, Buffer.from(bytes)]); } catch (e) {} },
      msg_reply: () => {},
      msg_reply_data_size: () => BigInt(reply.length),
      msg_reply_data_copy: (dst, off, size) => { try { const n = Math.min(Number(size), reply.length - Number(off)); if (n > 0) new Uint8Array(memory.buffer, Number(dst), n).set(reply.slice(Number(off), Number(off) + n)); return 0n; } catch (e) { return 0n; } },
      msg_cycles_available: () => 0n,
      msg_cycles_accept: () => 0n,
      canister_cycle_balance: () => 0n,
      canister_cycle_balance128: () => 0n,
      msg_cycles_refunded128: () => 0n,
      canister_self_size: () => 0n,
      canister_self_copy: () => 0n,
      stable_size: () => 0n,
      stable_grow: () => 0n,
      stable_read: () => 0n,
      stable_write: () => 0n,
      debug_print: (ptr, len) => { try { console.log('debug_print:', readString(ptr, len)); } catch (e) {} }
    };

    const { instance } = await WebAssembly.instantiate(wasmBuffer, { ic0, env: { memory } });
    const exports = instance.exports;
    console.log('Available exports:', Object.keys(exports).sort());

    // runtime info
    const r = 'canister_query __motoko_runtime_information';
    if (exports[r]) {
      console.log('\nCalling', r);
      reply = Buffer.alloc(0);
      try {
        exports[r]();
        console.log('Reply length:', reply.length);
        if (reply.length) console.log('Text:', new TextDecoder().decode(reply));
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
        if (reply.length) console.log('Text:', new TextDecoder().decode(reply));
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
// end of file
