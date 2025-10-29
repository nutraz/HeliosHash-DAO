// File: /home/nutarzz/HeliosHash-DAO/src/declarations/hhdao_treasury/index.d.ts

import { ActorSubclass } from "@dfinity/agent";
import type { _SERVICE as TreasuryService } from "./hhdao_treasury.did";

/**
 * Creates an actor for the treasury canister.
 */
export declare const createTreasuryActor: (
    canisterId: string,
    options?: { agentOptions?: import("@dfinity/agent").AgentConfig }
) => ActorSubclass<TreasuryService>;
