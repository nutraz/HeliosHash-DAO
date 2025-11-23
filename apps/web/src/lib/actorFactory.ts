import { Actor, HttpAgent } from "@dfinity/agent";

export async function createActor<T>(
  canisterId: string,
  idlFactory: any,
  identity?: any
): Promise<any> {
  if (!canisterId) {
    throw new Error(`Canister ID not defined for actor creation`);
  }

  const agent = new HttpAgent({
    identity,
    host: process.env.NEXT_PUBLIC_IC_HOST || 'https://ic0.app'
  });

  if (process.env.NEXT_PUBLIC_DFX_NETWORK !== "ic") {
    await agent.fetchRootKey();
  }

  // Verify canister ID format
  if (!/^[a-z0-9\-]+$/.test(canisterId)) {
    throw new Error(`Invalid canister ID: ${canisterId}`);
  }

  // Actor.createActor may not accept TS generics depending on @dfinity/agent
  // typings present; call without type arguments and cast to `any` to avoid
  // compilation errors in mixed-typing environments.
  return Actor.createActor(idlFactory, { agent, canisterId }) as any;
}