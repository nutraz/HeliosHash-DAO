import { createActor, canisterId as revocationCanisterId } from '../../../../../src/declarations/revocation_canister';

const host = process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:4943';

export function getRevocationActor() {
  return createActor(revocationCanisterId, {
    agentOptions: { host },
  });
}
