// Temporarily comment out missing import and use any types
// import { Proposal, ProposalCreateRequest } from '../apps/web/src/types/governance';

// In-memory mock store (module-level singleton pattern)
const mockProposals: any[] = [
  {
    id: '1',
    title: 'Expand Solar Farm Capacity',
    description: 'Increase solar farm capacity from 50kW to 100kW to meet rising community demand.',
    proposer: 'alice',
    status: 'active',
    votesFor: 15,
    votesAgainst: 3,
    createdAt: new Date('2025-09-15T10:00:00Z'),
    votingDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    type: 'project',
  },
  {
    id: '2',
    title: 'Community Education Program',
    description: 'Fund local solar technician training program for rural youth.',
    proposer: 'bob',
    status: 'pending',
    votesFor: 8,
    votesAgainst: 1,
    createdAt: new Date('2025-09-10T10:00:00Z'),
    votingDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    type: 'community',
  },
];

export class GovernanceService {
  static async getProposals(projectId?: string): Promise<any[]> {
    // Placeholder: filter by projectId if we later embed project IDs in proposal structure
    await delay(50);
    return projectId
      ? mockProposals.filter((p) => p.title.toLowerCase().includes(projectId.toLowerCase()))
      : [...mockProposals];
  }

  static async createProposal(
    req: any,
    currentUser: string = 'current-user'
  ): Promise<any> {
    await delay(50);
    const proposal: any = {
      id: Math.random().toString(36).slice(2, 11),
      title: req.title,
      description: req.description,
      proposer: currentUser,
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      createdAt: new Date(),
      votingDeadline: new Date(Date.now() + req.votingPeriodDays * 24 * 60 * 60 * 1000),
      type: req.type,
    };
    mockProposals.push(proposal);
    return proposal;
  }

  static async vote(proposalId: string, support: boolean): Promise<void> {
    await delay(30);
    const p = mockProposals.find((mp) => mp.id === proposalId);
    if (p) {
      if (support) {
        p.votesFor++;
      } else {
        p.votesAgainst++;
      }
      // Simplified auto-status progression
      if (p.votesFor >= 20) {
        p.status = 'passed';
      }
      if (p.votesAgainst >= 10) {
        p.status = 'rejected';
      }
    }
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
