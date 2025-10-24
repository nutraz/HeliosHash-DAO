import '@testing-library/jest-dom';
import { vi } from 'vitest';

/**
 * Enhanced Test Setup for Compliance Testing
 *
 * Configures comprehensive mocking environment for testing:
 * - Web3 providers and wallet connections
 * - Bitcoin integration services
 * - Internet Computer (IC) agent and canisters
 * - Constitutional governance mechanisms
 */

// Mock Next.js router
vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Internet Computer Agent for canister testing
vi.mock('@dfinity/agent', () => ({
  HttpAgent: vi.fn().mockImplementation(() => ({
    fetchRootKey: vi.fn().mockResolvedValue(undefined),
    call: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    readState: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
    status: vi.fn().mockResolvedValue({ replica_health_status: 'healthy' }),
  })),
  Actor: {
    createActor: vi.fn().mockImplementation(() => ({
      createProject: vi.fn().mockResolvedValue({ projectId: 'test-project-1' }),
      getProjects: vi.fn().mockResolvedValue([]),
      createProposal: vi.fn().mockResolvedValue({ proposalId: 'test-proposal-1' }),
      vote: vi.fn().mockResolvedValue({ success: true }),
      enforceWomensQuota: vi.fn().mockResolvedValue({ compliant: true }),
      validateVotingThreshold: vi.fn().mockResolvedValue({ passed: true }),
    })),
  },
  Principal: {
    fromText: vi.fn().mockImplementation((text: string) => ({ toText: () => text })),
    anonymous: () => ({ toText: () => '2vxsx-fae' }),
  },
}));

// Mock Web3 providers for wallet integration testing
const mockWeb3Provider = {
  request: vi.fn(),
  on: vi.fn(),
  removeListener: vi.fn(),
  isMetaMask: true,
  isConnected: () => true,
};

Object.defineProperty(window, 'ethereum', {
  writable: true,
  value: mockWeb3Provider,
});

// Mock Bitcoin integration services
const mockBitcoinService = {
  validateAddress: vi.fn().mockImplementation((address: string) => {
    const patterns = [/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, /^(bc1|tb1)[a-zA-HJ-NP-Z0-9]{25,87}$/];
    return patterns.some((pattern) => pattern.test(address));
  }),
  createTransaction: vi.fn().mockResolvedValue({
    txid: 'mock-txid-123',
    hex: '01000000...',
    size: 225,
  }),
  getLightningInvoice: vi.fn().mockResolvedValue({
    paymentRequest: 'lnbc1500n1...',
    amount: 1500,
    description: 'Mock Lightning payment',
  }),
};

vi.mock('../services/bitcoinService', () => ({
  default: mockBitcoinService,
  BitcoinService: mockBitcoinService,
}));

// Mock governance canister for constitutional testing
const mockGovernanceCanister = {
  // Constitutional constants matching main.mo
  WOMENS_QUOTA_MINIMUM: 33,
  MAJOR_DECISION_THRESHOLD: 66,
  QUORUM_PERCENTAGE: 51,
  VOTING_PERIOD_DAYS: 7,

  enforceWomensQuota: vi.fn().mockImplementation((members: any[]) => {
    const womenCount = members.filter((m) => m.gender === 'female').length;
    const percentage = members.length > 0 ? (womenCount / members.length) * 100 : 0;
    return {
      isCompliant: percentage >= 33,
      currentPercentage: percentage,
      womenCount,
      totalCount: members.length,
    };
  }),

  validateVotingThreshold: vi
    .fn()
    .mockImplementation((yesVotes: number, totalVotes: number, type: string) => {
      if (totalVotes === 0) return { passed: false, percentage: 0 };
      const percentage = (yesVotes / totalVotes) * 100;
      const threshold = type === 'major' ? 66 : 51;
      return {
        passed: percentage >= threshold,
        percentage,
        threshold,
        yesVotes,
        totalVotes,
      };
    }),
};

vi.mock('../declarations/hhdao_governance', () => ({
  createActor: () => mockGovernanceCanister,
  canisterId: 'rdmx6-jaaaa-aaaah-qcaiq-cai',
}));

// Mock solar project data for 1WP alignment testing
const mockSolarProjects = [
  {
    id: 'SOLAR-001',
    name: 'Rajasthan Desert Solar Farm',
    capacity: '50MW',
    location: 'Jaisalmer, Rajasthan, India',
    technology: 'Photovoltaic',
    status: 'operational',
  },
  {
    id: 'SOLAR-002',
    name: 'Rural Microgrid Project',
    capacity: '5MW',
    location: 'Maharashtra, India',
    technology: 'Solar + Battery Storage',
    status: 'under-construction',
  },
];

vi.mock('../services/solarProjectService', () => ({
  getSolarProjects: vi.fn().mockResolvedValue(mockSolarProjects),
  createSolarProject: vi.fn().mockResolvedValue(mockSolarProjects[0]),
}));

// matchMedia mock for responsive components
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock localStorage for auth testing
const localStorageMock = {
  getItem: vi.fn().mockImplementation((key: string) => {
    if (key === 'hhdao-auth') {
      return JSON.stringify({
        isAuthenticated: true,
        user: { id: 'test-user-1', name: 'Test User' },
      });
    }
    return null;
  }),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock crypto functions for wallet signing
Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: vi.fn().mockImplementation((arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }),
    subtle: {
      sign: vi.fn().mockResolvedValue(new ArrayBuffer(64)),
      verify: vi.fn().mockResolvedValue(true),
    },
  },
});

// Global test utilities
global.testUtils = {
  mockGovernanceCanister,
  mockBitcoinService,
  mockWeb3Provider,
  mockSolarProjects,

  // Helper to create test users with governance roles
  createTestUser: (overrides = {}) => ({
    id: 'test-user-1',
    name: 'Test User',
    role: 'dao-member',
    gender: 'female',
    votingPower: 100,
    ...overrides,
  }),

  // Helper to create test proposals
  createTestProposal: (overrides = {}) => ({
    id: 'test-proposal-1',
    title: 'Test Proposal',
    description: 'Test proposal description',
    type: 'regular',
    status: 'active',
    yesVotes: 0,
    noVotes: 0,
    ...overrides,
  }),

  // Helper to simulate Bitcoin transactions
  createMockBitcoinTx: (overrides = {}) => ({
    txid: 'mock-bitcoin-tx-' + Math.random().toString(36).substr(2, 9),
    inputs: [],
    outputs: [],
    fee: 10000,
    ...overrides,
  }),
};
