import { useState, useEffect } from 'react';

// Mock data for development - replace with actual blockchain calls
const mockMembershipData = {
  isMember: true,
  membershipLevel: 'Gold',
  votingPower: 150,
  stakedTokens: 1000,
  proposalsVoted: 12,
  memberSince: '2024-01-15',
  nftCount: 3,
  energyContributed: 2500, // kWh
  bitcoinEarned: 0.0045
};

const mockProposals = [
  {
    id: 1,
    title: 'Solar Farm Expansion in Maharashtra',
    description: 'Proposal to expand our solar infrastructure by 200kW in rural Maharashtra',
    status: 'active',
    votesFor: 245,
    votesAgainst: 23,
    totalVotes: 268,
    endDate: '2024-12-20',
    category: 'infrastructure'
  },
  {
    id: 2,
    title: 'Community Education Program',
    description: 'Fund educational programs about renewable energy in local schools',
    status: 'active',
    votesFor: 189,
    votesAgainst: 45,
    totalVotes: 234,
    endDate: '2024-12-25',
    category: 'education'
  },
  {
    id: 3,
    title: 'Bitcoin Mining Efficiency Upgrade',
    description: 'Upgrade mining equipment to increase efficiency by 15%',
    status: 'passed',
    votesFor: 312,
    votesAgainst: 67,
    totalVotes: 379,
    endDate: '2024-11-30',
    category: 'technology'
  }
];

export const useDaoMembership = () => {
  const [membershipData, setMembershipData] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    const fetchMembershipData = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setMembershipData(mockMembershipData);
        setProposals(mockProposals);
        setError(null);
      } catch (err) {
        setError('Failed to fetch membership data');
        console.error('Error fetching membership data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembershipData();
  }, []);

  const voteOnProposal = async (proposalId, vote) => {
    try {
      // Simulate voting
      setProposals(prev => prev.map(proposal => {
        if (proposal.id === proposalId) {
          const updatedProposal = { ...proposal };
          if (vote === 'for') {
            updatedProposal.votesFor += 1;
          } else {
            updatedProposal.votesAgainst += 1;
          }
          updatedProposal.totalVotes += 1;
          return updatedProposal;
        }
        return proposal;
      }));
      
      // Update user's voting count
      setMembershipData(prev => ({
        ...prev,
        proposalsVoted: prev.proposalsVoted + 1
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Error voting on proposal:', err);
      return { success: false, error: err.message };
    }
  };

  const refreshData = () => {
    setLoading(true);
    // Trigger data refresh
    setTimeout(() => {
      setMembershipData({ ...mockMembershipData });
      setProposals([...mockProposals]);
      setLoading(false);
    }, 500);
  };

  return {
    membershipData,
    proposals,
    loading,
    error,
    voteOnProposal,
    refreshData
  };
};

export default useDaoMembership;