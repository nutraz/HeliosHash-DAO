import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './hhdao_treasury.did.js';

export const createTreasuryActor = (canisterId, options = {}) => {
  const agent = options.agent || new HttpAgent({ host: options.host });
  if (options?.identity) agent.replaceIdentity(options.identity);
  return Actor.createActor(idlFactory, { agent, canisterId });
};
