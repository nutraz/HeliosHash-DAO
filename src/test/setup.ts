
import '@testing-library/jest-dom';
import { vi } from 'vitest';

declare global {
  interface Window {
    ic?: any;
  }
}

global.window.ic = {
  plug: {
    requestConnect: vi.fn(),
    createAgent: vi.fn(),
  },
  window: {
    identity: {
      getPrincipal: vi.fn(() => 'mock-principal'),
    },
  },
};

vi.mock('@web3modal/react', () => ({
  useWeb3Modal: () => ({
    open: vi.fn(),
    close: vi.fn(),
  }),
}));
