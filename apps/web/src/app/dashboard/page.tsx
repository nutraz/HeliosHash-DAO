"use client";
import { useState } from 'react';

export default function DashboardPage() {
  const [showInr, setShowInr] = useState(false);

  const handleEarn = () => {
    window.location.href = '/earn-task'; // Placeholder
  };

  const handleClaim = () => {
    window.location.href = '/wallet-withdraw'; // Placeholder
  };

  const handleVote = () => {
    window.location.href = '/governance'; // Placeholder
  };

  const activities = [
    { type: 'payout', description: 'Payout received: ₹500', time: '2 hours ago' },
    { type: 'proposal', description: 'Proposal voted on: Solar Project A', time: '1 day ago' },
    { type: 'update', description: 'Project update: Installation complete', time: '3 days ago' },
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-saffron rounded-full flex items-center justify-center">
            <span className="text-navy font-bold">U</span>
          </div>
          <div>
            <div className="text-sm text-gray">Verified</div>
            <div className="text-xs text-green">KYC Verified</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">1,250 HHU</div>
          <div className="text-sm text-gray">{showInr ? '₹625' : 'Toggle INR'}</div>
        </div>
        <button onClick={() => setShowInr(!showInr)} className="text-saffron">≡</button>
      </div>

      {/* Earnings Card */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-gray">Today's HHU</div>
            <div className="text-2xl font-bold text-saffron">50</div>
          </div>
          <div>
            <div className="text-sm text-gray">Weekly</div>
            <div className="text-xl font-semibold">350</div>
          </div>
        </div>
        <button className="w-full py-2 bg-saffron text-navy rounded-lg font-semibold">
          Claim Earnings
        </button>
        <p className="text-xs text-gray mt-2">Tap to claim or convert to INR</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="font-semibold">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-4">
          <button onClick={handleEarn} className="card text-center">
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm">Scan to check-in</div>
          </button>
          <button onClick={handleClaim} className="card text-center">
            <div className="text-2xl mb-2">💰</div>
            <div className="text-sm">Claim</div>
          </button>
          <button onClick={handleVote} className="card text-center">
            <div className="text-2xl mb-2">🗳️</div>
            <div className="text-sm">Vote</div>
          </button>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="space-y-4">
        <h3 className="font-semibold">Recent Activity</h3>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="card flex justify-between items-center">
              <div>
                <div className="font-medium">{activity.description}</div>
                <div className="text-xs text-gray">{activity.time}</div>
              </div>
              <div className="text-saffron">→</div>
            </div>
          ))
        ) : (
          <div className="card text-center">
            <p className="text-gray">You haven't earned yet — try this quick task.</p>
            <button onClick={handleEarn} className="mt-2 text-saffron underline">
              Start Earning
            </button>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <button className="w-full py-3 bg-green text-navy rounded-lg font-semibold">
        Check Local Opportunities
      </button>
    </div>
  );
}
