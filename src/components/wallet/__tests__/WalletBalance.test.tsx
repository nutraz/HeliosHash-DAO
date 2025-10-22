


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ServiceFactory } from '../../../../services/factory';
import type { WalletData, WalletService } from '../../../../services/types';
// ...existing code...


function renderWithQueryClient(ui: React.ReactElement) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

class MockWalletService implements WalletService {
  private state: Partial<WalletData>;
  constructor(state: Partial<WalletData>) {
    this.state = state;
  }
  async getBalance(): Promise<WalletData> {
    return {
      balance: this.state.balance ?? 0,
      pendingRewards: this.state.pendingRewards ?? 0,
      stakedAmount: this.state.stakedAmount ?? 0,
      fiatValue: this.state.fiatValue ?? 0,
      transactions: this.state.transactions ?? 0,
    };
  }
  async getTransactions() {
    return [];
  }
}

describe('WalletBalance', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state', async () => {
    // No service injected, so hook will be loading
    const { WalletBalance } = await import('../WalletBalance');
    renderWithQueryClient(<WalletBalance />);
    expect(screen.getByText(/Loading wallet data/i)).toBeInTheDocument();
  });

  it('renders error state', async () => {
    class FailingWalletService implements WalletService {
      async getBalance(): Promise<WalletData> { throw new Error('fail'); }
      async getTransactions() { return []; }
    }
    ServiceFactory.initialize(new FailingWalletService());
    const { WalletBalance } = await import('../WalletBalance');
    renderWithQueryClient(<WalletBalance />);
    // Wait for error to propagate
    expect(await screen.findByText(/Error loading wallet/i)).toBeInTheDocument();
  });

  it('renders wallet data', async () => {
    ServiceFactory.initialize(new MockWalletService({ balance: 100, pendingRewards: 10, stakedAmount: 50, fiatValue: 1000, transactions: 2 }));
    const { WalletBalance } = await import('../WalletBalance');
    renderWithQueryClient(<WalletBalance />);
    expect(await screen.findByText(/Wallet Balance/i)).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
  });
});
