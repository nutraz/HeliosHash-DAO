import { useAppStore } from '@/lib/store';
import { CheckCircle, Clock, Users, Vote, XCircle } from 'lucide-react';
import { useState } from 'react';

const GovernanceDashboard = () => {
  const { proposals, votingPower, user } = useAppStore();
  const [selectedProposal, setSelectedProposal] = useState<string | null>(null);

  const handleVote = (proposalId: string, vote: 'for' | 'against') => {
    // In a real app, this would submit the vote to the blockchain
    console.log(`Voting ${vote} on proposal ${proposalId}`);

    // Add notification
    useAppStore.getState().addNotification({
      id: Date.now().toString(),
      type: 'success',
      message: `Vote ${vote === 'for' ? 'in favor of' : 'against'} proposal submitted!`,
      timestamp: Date.now(),
      read: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-yellow-400';
      case 'passed': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Vote className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Governance Overview */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-4">Governance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Vote className="w-5 h-5 text-blue-400" />
              <p className="text-blue-300 text-sm">Your Voting Power</p>
            </div>
            <p className="text-2xl font-bold text-white">{votingPower} HH</p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <p className="text-blue-300 text-sm">Active Proposals</p>
            </div>
            <p className="text-2xl font-bold text-white">
              {proposals.filter(p => p.status === 'active').length}
            </p>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <p className="text-blue-300 text-sm">Total Proposals</p>
            </div>
            <p className="text-2xl font-bold text-white">{proposals.length}</p>
          </div>
        </div>
      </div>

      {/* Proposals List */}
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Proposals</h3>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition cursor-pointer"
              onClick={() => setSelectedProposal(
                selectedProposal === proposal.id ? null : proposal.id
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold mb-1">{proposal.title}</h4>
                  <p className="text-blue-300 text-sm mb-2">{proposal.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-blue-300">By: {proposal.creator.slice(0, 6)}...{proposal.creator.slice(-4)}</span>
                    <span className="text-blue-300">
                      Ends: {new Date(proposal.endTime).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 ${getStatusColor(proposal.status)}`}>
                  {getStatusIcon(proposal.status)}
                  <span className="text-sm capitalize">{proposal.status}</span>
                </div>
              </div>

              {/* Voting Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-400">For: {proposal.votesFor.toLocaleString()}</span>
                  <span className="text-red-400">Against: {proposal.votesAgainst.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(proposal.votesFor / (proposal.votesFor + proposal.votesAgainst)) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Voting Actions (only for active proposals) */}
              {proposal.status === 'active' && selectedProposal === proposal.id && (
                <div className="flex space-x-3 pt-3 border-t border-blue-500/20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(proposal.id, 'for');
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Vote For
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVote(proposal.id, 'against');
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Vote Against
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {proposals.length === 0 && (
          <div className="text-center py-8">
            <Vote className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <p className="text-blue-300">No proposals available</p>
          </div>
        )}
      </div>

      {/* Create Proposal Button */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-2xl shadow-lg transform transition hover:scale-105">
          Create New Proposal
        </button>
      </div>
    </div>
  );
};

export default GovernanceDashboard;