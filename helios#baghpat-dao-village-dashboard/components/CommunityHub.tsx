
import React from 'react';

const Card: React.FC<{title: string; children: React.ReactNode; className?: string}> = ({ title, children, className = '' }) => (
    <div className={`bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700 shadow-lg ${className}`}>
        <div className="p-4 border-b border-slate-700">
            <h3 className="font-orbitron text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
);

const CommunityHub: React.FC = () => {
  const features = [
    { feature: 'Live Feed', tech: 'ICP Canister + WebSocket' },
    { feature: 'Voice Chat', tech: 'Huddle01 + ICP Identity' },
    { feature: 'Proposals', tech: 'Snapshot → ICP On-Chain' },
    { feature: 'Bounties', tech: 'ICRC-7 NFT Rewards' },
    { feature: 'Job Board', tech: 'POST /bounty → ENERGY payout' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <Card title="Community Social Hub">
                <div className="space-y-3">
                    {features.map(item => (
                        <div key={item.feature} className="flex flex-col sm:flex-row justify-between p-3 bg-slate-900/50 rounded-lg">
                            <dt className="font-bold text-cyan-400">{item.feature}</dt>
                            <dd className="text-slate-300 text-left sm:text-right">{item.tech}</dd>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
        <div>
             <Card title="DAO Governance Tokens (ICP)">
                <div className="space-y-3">
                    {[
                        { token: 'HONE', standard: 'ICRC-1', utility: 'Voting, Staking' },
                        { token: 'ENERGY', standard: 'ICRC-7 (SBT)', utility: 'Proof of Solar, Access' },
                        { token: 'OWP Bridge NFT', standard: 'ICRC-7', utility: 'Gate Pass' },
                    ].map(item => (
                        <div key={item.token} className="p-3 bg-slate-900/50 rounded-lg">
                            <p className="font-bold text-amber-400">{item.token} <span className="text-xs font-normal text-slate-400">({item.standard})</span></p>
                            <p className="text-slate-300">{item.utility}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </div>
  );
};

export default CommunityHub;
