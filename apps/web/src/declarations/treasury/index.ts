import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './treasury.did.js';

export const createActor = (canisterId: string, options?: { agentOptions?: Record<string, unknown> }) => {
  const agent = new HttpAgent({ ...options?.agentOptions });

  if (process.env.NODE_ENV !== 'production') {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
      console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

export const treasury = {
  createActor,
};
