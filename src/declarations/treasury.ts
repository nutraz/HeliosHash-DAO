// Mock treasury canister declaration for tests

// Allow tests to override behavior by setting globalThis.__treasuryMockOverrides
export const treasury = {
  createActor: () => {
    const overrides =
      (typeof globalThis !== 'undefined' && globalThis.__treasuryMockOverrides) || {};
    return {
      balanceOf: overrides.balanceOf || (async () => BigInt(1000)),
      transfer: overrides.transfer || (async () => true),
      getTransactions:
        overrides.getTransactions ||
        (async (_principal, limit, offset) => {
          // Simulate pagination: return different arrays for different offsets
          if (offset && offset > 0) {
            return [{ id: 'txn2', amount: 2 }];
          }
          return [{ id: 'txn1', amount: 1 }];
        }),
      getPendingRewards: overrides.getPendingRewards || (async () => BigInt(0)),
      getStakedAmount: overrides.getStakedAmount || (async () => BigInt(0)),
    };
  },
};
