// Minimal test-time stub for canister declaration `treasury`.
// Export `treasury` so modules importing it at runtime won't fail. Tests may mock.

export const canisterId = 'dev-treasury';

// Provide a createActor factory so runtime code/tests can call/mock it.
export function createActor(_canisterId?: string, _options?: any) {
	// Provide a minimal actor implementation that reads optional overrides
	// from `globalThis.__treasuryMockOverrides` so tests can selectively
	// override behaviors without needing to mock the module system.
	const overrides: Record<string, any> = (globalThis as any).__treasuryMockOverrides || {};

	const actor = {
		balanceOf: async (principal: any) => {
			if (typeof overrides.balanceOf === 'function') return await overrides.balanceOf(principal);
			return BigInt(300);
		},
		getTransactions: async (principal: any, _limit: bigint, offset: bigint) => {
			if (typeof overrides.getTransactions === 'function') return await overrides.getTransactions(principal, _limit, offset);
			const off = Number(offset || 0);
			const limitN = Number(_limit || 5n);
			const page = Array.from({ length: Math.min(limitN, 5) }, (_, i) => ({ id: off + i + 1, amount: BigInt(i + 1) }));
			return page;
		},
		getPendingRewards: async (principal: any) => {
			if (typeof overrides.getPendingRewards === 'function') return await overrides.getPendingRewards(principal);
			return BigInt(10);
		},
		getStakedAmount: async (principal: any) => {
			if (typeof overrides.getStakedAmount === 'function') return await overrides.getStakedAmount(principal);
			return BigInt(5);
		},
	} as any;

	return actor as any;
}

export const treasury = {
	createActor,
} as unknown as Record<string, any>;

export type _SERVICE = Record<string, any>;
