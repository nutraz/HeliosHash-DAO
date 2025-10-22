export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  createdAt: Date;
  votingDeadline: Date;
  type: 'project' | 'governance' | 'treasury' | 'community';
  // Geolocation for project mapping
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface ProposalCreateRequest {
  title: string;
  description: string;
  type: Proposal['type'];
  votingPeriodDays: number;
}
