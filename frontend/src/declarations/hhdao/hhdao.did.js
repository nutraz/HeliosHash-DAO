// Minimal placeholder Candid IDL for `hhdao` canister used during builds.
// This file is a lightweight stub so the web build can import the IDL
// while real declarations are produced by `dfx` during local builds.

export const idlFactory = ({ IDL }) =>
  IDL.Service({
    // add known methods as no-op placeholders if needed by the UI
    // e.g., `getSummary: IDL.Func([], [IDL.Text], ['query'])`
  });

export const init = [];

// canonical export used in generated code
export default { idlFactory, init };
