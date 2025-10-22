


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

describe('StakingPanel', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders staking panel', async () => {
    ServiceFactory.initialize(new MockWalletService({ stakedAmount: 100, pendingRewards: 10 }));
    const { StakingPanel } = await import('../StakingPanel');
    renderWithQueryClient(<StakingPanel />);
    expect(await screen.findByText(/Stake OWP/i)).toBeInTheDocument();
    expect(screen.getByText(/Unstake OWP/i)).toBeInTheDocument();
    expect(screen.getByText(/Claim Rewards/i)).toBeInTheDocument();
  });
});
