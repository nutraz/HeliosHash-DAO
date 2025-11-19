import { Actor, HttpAgent, Identity, ActorSubclass } from "@dfinity/agent";
import { IDL } from "@dfinity/candid";

export async function createActor<T>(
  canisterId: string,
  idlFactory: IDL.InterfaceFactory,
  identity?: Identity
): Promise<ActorSubclass<T>> {
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

  return Actor.createActor<T>(idlFactory, { agent, canisterId });
}