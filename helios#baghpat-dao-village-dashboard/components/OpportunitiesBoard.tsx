
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

const OpportunitiesBoard: React.FC = () => {
    const launchPlan = [
        { time: '+2h', action: 'Bridge OWP NFTs → ICP (testnet)' },
        { time: '+6h', action: 'Deploy solar_monitor canister' },
        { time: '+12h', action: 'Add Helios node to Project Map' },
        { time: '+24h', action: 'Open Community Hub (invite-only)' },
        { time: '+48h', action: 'Public launch + tweet from @nutraazz' },
    ];
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Next 48-Hour Launch Plan">
                 <ul className="space-y-3">
                    {launchPlan.map(item => (
                        <li key={item.time} className="flex items-start p-3 bg-slate-900/50 rounded-lg">
                            <span className="font-bold text-cyan-400 w-16">{item.time}</span>
                            <span className="text-slate-300 flex-1">{item.action}</span>
                        </li>
                    ))}
                </ul>
            </Card>
             <Card title="Call to Action (@nutraazz)">
                 <ol className="space-y-4 list-decimal list-inside text-slate-300">
                    <li><span className="font-bold text-white">Bridge your OWP NFT</span> → Get ICRC-7 access pass</li>
                    <li><span className="font-bold text-white">Tweet the link</span> → <code className="text-amber-300 bg-slate-900 p-1 rounded">dapp.oneworldproject.io/map#helios-baghpat</code></li>
                    <li><span className="font-bold text-white">Host first DAO call</span> in Voice Chat (tomorrow 7 PM IST)</li>
                </ol>
             </Card>
             <div className="md:col-span-2">
                 <Card title="Bounties & Jobs (Coming Soon)">
                    <div className="text-center text-slate-400 p-8">
                        <p>The opportunities board is under construction.</p>
                        <p>Check back soon for bounties paid in ENERGY tokens.</p>
                    </div>
                 </Card>
            </div>
        </div>
    );
};

export default OpportunitiesBoard;
