import { createActor } from '@/lib/actorFactory';
import { canisterId as revocationCanisterId } from '../../../../../src/declarations/revocation_canister';

const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943';

export function getRevocationActor() {
  try {
    return createActor(revocationCanisterId, require('../../../../../src/declarations/revocation_canister').idlFactory);
  } catch (e) {
    const stub = {
      someMethod: async () => null,
    } as any;
    return stub;
  }
}
