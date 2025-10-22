import * as service from '@/services/governanceService';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GovernancePanel } from './GovernancePanel';

// Mock toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: () => {} }),
}));

const mockProposals = [
  {
    id: '1',
    title: 'Expand Solar Farm Capacity',
    description: 'Increase solar farm capacity from 50kW to 100kW',
    proposer: 'alice',
    status: 'active' as const,
    votesFor: 15,
    votesAgainst: 3,
    createdAt: new Date('2025-01-15T10:00:00Z'),
    votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    type: 'project' as const,
  },
  {
    id: '2',
    title: 'Community Education Program',
    description: 'Fund local solar technician training program',
    proposer: 'bob',
    status: 'pending' as const,
    votesFor: 8,
    votesAgainst: 1,
    createdAt: new Date('2025-01-10T10:00:00Z'),
    votingDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    type: 'community' as const,
  },
  {
    id: '3',
    title: 'Treasury Allocation Update',
    description: 'Adjust treasury allocation for Q2 initiatives',
    proposer: 'charlie',
    status: 'passed' as const,
    votesFor: 25,
    votesAgainst: 5,
    createdAt: new Date('2025-01-05T10:00:00Z'),
    votingDeadline: new Date('2025-01-20T10:00:00Z'),
    type: 'treasury' as const,
  },
];

describe('GovernancePanel', () => {
  beforeEach(() => {
    vi.spyOn(service.GovernanceService, 'getProposals').mockResolvedValue(mockProposals);
    vi.spyOn(service.GovernanceService, 'createProposal').mockImplementation(async (req) => ({
      id: 'new',
      title: req.title,
      description: req.description,
      proposer: 'current-user',
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      createdAt: new Date(),
      votingDeadline: new Date(Date.now() + req.votingPeriodDays * 24 * 60 * 60 * 1000),
      type: req.type,
    }));
    vi.spyOn(service.GovernanceService, 'vote').mockResolvedValue();
  });

  it('renders tabs and overview metrics', async () => {
    render(<GovernancePanel projectId='proj-1' />);
    expect(screen.getByText('Project Governance')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Total Proposals')).toBeInTheDocument();
    });
  });

  it('lists proposals when starting on proposals tab', async () => {
    render(<GovernancePanel projectId='proj-1' initialTab='proposals' />);
    await waitFor(() => {
      expect(screen.getByText('Expand Solar Farm Capacity')).toBeInTheDocument();
      expect(screen.getByText('Community Education Program')).toBeInTheDocument();
    });
  });

  it('filters by status via quick pill', async () => {
    render(<GovernancePanel projectId='proj-1' initialTab='proposals' />);
    await waitFor(() => screen.getByText('Expand Solar Farm Capacity'));
    fireEvent.click(screen.getByText('Active'));
    await waitFor(() => {
      expect(screen.getByText('Expand Solar Farm Capacity')).toBeInTheDocument();
      expect(screen.queryByText('Community Education Program')).not.toBeInTheDocument();
    });
  });

  it('sorts by most votes', async () => {
    render(<GovernancePanel projectId='proj-1' initialTab='proposals' />);
    await waitFor(() => screen.getByText('Expand Solar Farm Capacity'));
    // Use quick pill button (has role button) - pick the pill distinct from select option
    const mostVotesButton = screen
      .getAllByRole('button')
      .find((b) => b.textContent === 'Most Votes')!;
    fireEvent.click(mostVotesButton);
    await waitFor(() => {
      const cards = screen.getAllByTestId('proposal-card');
      expect(cards[0]).toHaveTextContent('Treasury Allocation Update'); // 30 total votes highest
    });
  });

  it('casts a vote (optimistic UI)', async () => {
    render(<GovernancePanel projectId='proj-1' initialTab='proposals' />);
    await waitFor(() => screen.getByText('Expand Solar Farm Capacity'));
    const approve = screen.getAllByText('Approve')[0];
    fireEvent.click(approve);
    // optimistic increment
    await waitFor(() => {
      expect(screen.getByText(/16 For/)).toBeInTheDocument();
    });
  });
});
