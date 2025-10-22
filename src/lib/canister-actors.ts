// IC Actor Factory - Creates typed canister actors from generated declarations
import { Identity } from '@dfinity/agent';
import { createAgent } from './ic-agent';

// Import generated actor creators and IDL factories
import { createActor as createHHDAOActorGenerated } from '@/declarations/hhdao';
import { createActor as createDAOActorGenerated } from '@/declarations/hhdao_dao';
import { createActor as createDisputeActorGenerated } from '@/declarations/hhdao_dispute_resolution';
import { createActor as createDocumentsActorGenerated } from '@/declarations/hhdao_documents';
import { createActor as createIdentityActorGenerated } from '@/declarations/hhdao_identity';
import { createActor as createMeetingActorGenerated } from '@/declarations/hhdao_meeting_management';
import { createActor as createTelemetryActorGenerated } from '@/declarations/hhdao_telemetry';

// Import generated types
import type { _SERVICE as HHDAOService } from '@/declarations/hhdao/service.did.d';
import type { _SERVICE as DAOService } from '@/declarations/hhdao_dao/service.did.d';
import type { _SERVICE as DisputeService } from '@/declarations/hhdao_dispute_resolution/service.did.d';
import type { _SERVICE as DocumentsService } from '@/declarations/hhdao_documents/service.did.d';
import type { _SERVICE as IdentityService } from '@/declarations/hhdao_identity/service.did.d';
import type { _SERVICE as MeetingService } from '@/declarations/hhdao_meeting_management/service.did.d';
import type { _SERVICE as TelemetryService } from '@/declarations/hhdao_telemetry/service.did.d';

// Environment-based canister IDs
const getCanisterId = (canisterName: string): string => {
  const network = process.env.NEXT_PUBLIC_IC_NETWORK || 'local';

  const canisterIds = {
    local: {
      hhdao: 'be2us-64aaa-aaaaa-qaabq-cai',
      dao: 'rdmx6-jaaaa-aaaah-qdrpq-cai',
      identity: 'rrkah-fqaaa-aaaah-qdrpq-cai',
      telemetry: 'ryjl3-tyaaa-aaaah-qdrpq-cai',
      documents: 'rno2w-sqaaa-aaaah-qdrpq-cai',
      dispute_resolution: 'renrk-eyaaa-aaaah-qdrpq-cai',
      meeting_management: 'rdrdx-ciaaa-aaaah-qdrpq-cai',
    },
    ic: {
      hhdao: process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID_IC || 'be2us-64aaa-aaaaa-qaabq-cai',
      dao: process.env.NEXT_PUBLIC_DAO_CANISTER_ID_IC || 'rdmx6-jaaaa-aaaah-qdrpq-cai',
      identity: process.env.NEXT_PUBLIC_IDENTITY_CANISTER_ID_IC || 'rrkah-fqaaa-aaaah-qdrpq-cai',
      telemetry: process.env.NEXT_PUBLIC_TELEMETRY_CANISTER_ID_IC || 'ryjl3-tyaaa-aaaah-qdrpq-cai',
      documents: process.env.NEXT_PUBLIC_DOCUMENTS_CANISTER_ID_IC || 'rno2w-sqaaa-aaaah-qdrpq-cai',
      dispute_resolution:
        process.env.NEXT_PUBLIC_DISPUTE_CANISTER_ID_IC || 'renrk-eyaaa-aaaah-qdrpq-cai',
      meeting_management:
        process.env.NEXT_PUBLIC_MEETING_CANISTER_ID_IC || 'rdrdx-ciaaa-aaaah-qdrpq-cai',
    },
  };

  return (
    canisterIds[network as keyof typeof canisterIds]?.[
      canisterName as keyof typeof canisterIds.local
    ] || ''
  );
};

// Typed canister actors interface
export interface CanisterActors {
  hhdao: HHDAOService;
  dao: DAOService;
  identity: IdentityService;
  telemetry: TelemetryService;
  documents: DocumentsService;
  dispute: DisputeService;
  meeting: MeetingService;
}

// Create all canister actors with proper typing
export const getCanisterActors = async (identity?: Identity): Promise<CanisterActors> => {
  const agent = createAgent(identity);

  // Fetch root key for local development
  if (process.env.NEXT_PUBLIC_IC_NETWORK !== 'ic') {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      console.warn('Failed to fetch root key:', error);
    }
  }

  const actorOptions = { agent };

  return {
    hhdao: createHHDAOActorGenerated(getCanisterId('hhdao'), actorOptions),
    dao: createDAOActorGenerated(getCanisterId('dao'), actorOptions),
    identity: createIdentityActorGenerated(getCanisterId('identity'), actorOptions),
    telemetry: createTelemetryActorGenerated(getCanisterId('telemetry'), actorOptions),
    documents: createDocumentsActorGenerated(getCanisterId('documents'), actorOptions),
    dispute: createDisputeActorGenerated(getCanisterId('dispute_resolution'), actorOptions),
    meeting: createMeetingActorGenerated(getCanisterId('meeting_management'), actorOptions),
  };
};

// Individual actor creators for specific use cases
export const createHHDAOActor = async (identity?: Identity): Promise<HHDAOService> => {
  const agent = createAgent(identity);

  if (process.env.NEXT_PUBLIC_IC_NETWORK !== 'ic') {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      console.warn('Failed to fetch root key:', error);
    }
  }

  return createHHDAOActorGenerated(getCanisterId('hhdao'), { agent });
};

export const createDAOActor = async (identity?: Identity): Promise<DAOService> => {
  const agent = createAgent(identity);

  if (process.env.NEXT_PUBLIC_IC_NETWORK !== 'ic') {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      console.warn('Failed to fetch root key:', error);
    }
  }

  return createDAOActorGenerated(getCanisterId('dao'), { agent });
};

// Export types for use in components
export type {
  DAOService,
  DisputeService,
  DocumentsService,
  HHDAOService,
  IdentityService,
  MeetingService,
  TelemetryService,
};
