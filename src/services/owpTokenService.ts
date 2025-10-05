import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory as owpTokenIdlFactory } from "../../../.dfx/local/canisters/owp_token/service.did";
import { _SERVICE as OWPTokenService } from "../../../.dfx/local/canisters/owp_token/service.did.d";

const canisterId = process.env.NEXT_PUBLIC_OWP_TOKEN_CANISTER_ID;

const getAgent = () => {
  const agent = new HttpAgent({ host: process.env.NEXT_PUBLIC_IC_HOST });
  // Fetch root key for local development
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch(err => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }
  return agent;
};

const getActor = () => {
  const agent = getAgent();
  return Actor.createActor<OWPTokenService>(owpTokenIdlFactory, {
    agent,
    canisterId,
  });
};

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