// Minimal treasury client used by the web UI. Tries to use generated canister
// declarations if available, otherwise falls back to mock data.

export async function listMultisigProposals(): Promise<any[]> {
  try {
    // Try to import generated declarations
     
    const decl = require('../../src/declarations/multisig');
    if (decl && decl.createActor) {
      const actor = decl.createActor(decl.canisterId);
      return await actor.listProposals(0, 20);
    }
  } catch (e) {
    // ignore - fall back to mock
  }

  // Mock proposals for UI
  return [
    { id: 1, proposer: 'aaaaa-aa', to: 'bbbb-bb', amount: 1000, createdAt: Date.now(), approvals: [], executed: false, note: 'Initial funding' },
  ];
}
