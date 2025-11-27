// Mock OWP Token Service for MVP (canister not deployed)
import { Principal } from '@dfinity/principal';

// Mock actor for MVP
const getActor = () => ({
  mint: async (_to: Principal, _amount: bigint) => ({ Ok: 'Mock mint' }),
  transfer: async (_to: Principal, _amount: bigint) => ({ Ok: 'Mock transfer' }),
  getBalanceOf: async (_principal: Principal) => BigInt(1000000),
  getTotalSupply: async () => BigInt(10000000),
});

export const owpTokenService = {
  getBalance: async (principal: Principal): Promise<bigint> => {
    const actor = getActor();
    return actor.getBalanceOf(principal);
  },

  getTotalSupply: async (): Promise<bigint> => {
    const actor = getActor();
    return actor.getTotalSupply();
  },

  transfer: async (to: Principal, amount: bigint) => {
    const actor = getActor();
    return actor.transfer(to, amount);
  },

  mint: async (to: Principal, amount: bigint) => {
    const actor = getActor();
    // This assumes the agent has an identity that is the owner of the token canister
    return actor.mint(to, amount);
  },
};
