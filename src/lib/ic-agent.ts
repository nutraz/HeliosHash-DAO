import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

// Environment-based canister IDs
const getCanisterId = (canisterName: string): string => {
  const network = process.env.NEXT_PUBLIC_IC_NETWORK || 'local';

  const canisterIds = {
    local: {
      hhdao: process.env.CANISTER_ID_HHDAO || 'umunu-kh777-77774-qaaca-cai',
      dao: process.env.CANISTER_ID_HHDAO_DAO || 'ulvla-h7777-77774-qaacq-cai',
      identity: process.env.CANISTER_ID_HHDAO_IDENTITY || 'uxrrr-q7777-77774-qaaaq-cai',
      telemetry: process.env.CANISTER_ID_HHDAO_TELEMETRY || 'vpyes-67777-77774-qaaeq-cai',
      documents: process.env.CANISTER_ID_HHDAO_DOCUMENTS || 'uzt4z-lp777-77774-qaabq-cai',
    },
    ic: {
      hhdao: process.env.NEXT_PUBLIC_HHDAO_CANISTER_ID_IC || 'be2us-64aaa-aaaaa-qaabq-cai',
      dao: process.env.NEXT_PUBLIC_DAO_CANISTER_ID_IC || 'rdmx6-jaaaa-aaaah-qdrpq-cai',
      identity: process.env.NEXT_PUBLIC_IDENTITY_CANISTER_ID_IC || 'rrkah-fqaaa-aaaah-qdrpq-cai',
      telemetry: process.env.NEXT_PUBLIC_TELEMETRY_CANISTER_ID_IC || 'ryjl3-tyaaa-aaaah-qdrpq-cai',
      documents: process.env.NEXT_PUBLIC_DOCUMENTS_CANISTER_ID_IC || 'rno2w-sqaaa-aaaah-qdrpq-cai',
    },
  };

  return (
    canisterIds[network as keyof typeof canisterIds]?.[
      canisterName as keyof typeof canisterIds.local
    ] || ''
  );
};

// Create HTTP Agent
export const createAgent = (identity?: Identity): HttpAgent => {
  // Use different host based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  const host = isProduction
    ? 'https://ic0.app'
    : process.env.NEXT_PUBLIC_IC_HOST || 'http://127.0.0.1:8000';

  const agent = new HttpAgent({
    identity,
    host,
    // Disable fetchRootKey in production
    verifyQuerySignatures: isProduction,
  });

  // Fetch root key for local development
  if (!isProduction) {
    agent.fetchRootKey().catch((err) => {
      console.warn('Unable to fetch root key. Check IC replica is running:', err);
    });
  }

  return agent;
};

// Create actor with proper interface
export const createActor = async <T>(
  canisterId: string,
  idlFactory: any,
  identity?: Identity
): Promise<T> => {
  const agent = createAgent(identity);

  // Fetch root key for local development
  if (process.env.NODE_ENV !== 'production') {
    try {
      await agent.fetchRootKey();
    } catch (error) {
      console.warn('Failed to fetch root key:', error);
    }
  }

  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId: Principal.fromText(canisterId),
  });
};

// Utility to get canister actors
export const getCanisterActors = async (identity?: Identity) => {
  // Import canister interfaces (these would be generated from .did files)
  // For now, we'll use the interfaces from the main.mo file

  const hhdaoCanisterId = getCanisterId('hhdao');
  const daoCanisterId = getCanisterId('dao');
  const identityCanisterId = getCanisterId('identity');
  const telemetryCanisterId = getCanisterId('telemetry');
  const documentsCanisterId = getCanisterId('documents');

  // These interfaces would be generated from .did files
  // For now, we'll create them based on the main.mo interfaces

  return {
    hhdao: hhdaoCanisterId,
    dao: daoCanisterId,
    identity: identityCanisterId,
    telemetry: telemetryCanisterId,
    documents: documentsCanisterId,
  };
};

// Error handling for IC calls
export class ICAgentError extends Error {
  constructor(message: string, public readonly code?: string, public readonly details?: any) {
    super(message);
    this.name = 'ICAgentError';
  }
}

export const handleICError = (error: any): ICAgentError => {
  if (error instanceof ICAgentError) {
    return error;
  }

  // Handle common IC errors
  if (error.message?.includes('Call was rejected')) {
    return new ICAgentError('Canister call was rejected', 'REJECTED', error);
  }

  if (error.message?.includes('timeout')) {
    return new ICAgentError('Request timeout', 'TIMEOUT', error);
  }

  if (error.message?.includes('network')) {
    return new ICAgentError('Network error', 'NETWORK', error);
  }

  return new ICAgentError(error.message || 'Unknown Internet Computer error', 'UNKNOWN', error);
};
