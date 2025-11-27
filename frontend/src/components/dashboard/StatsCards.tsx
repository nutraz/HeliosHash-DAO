import React from 'react';
import { TrendingUp, CheckCircle, Users } from 'lucide-react';

export const StatsCards: React.FC<{ stats: any }> = ({ stats }) => {
  const cards = [
    { label: 'Projects Started', value: stats?.projectsStarted || 0, icon: TrendingUp, color: 'text-green-400' },
    { label: 'Projects Helped', value: stats?.projectsHelped || 0, icon: CheckCircle, color: 'text-blue-400' },
    { label: 'Members Added', value: stats?.membersAdded || 0, icon: Users, color: 'text-purple-400' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
          <div className={`flex items-center space-x-2 ${card.color} mb-2`}>
            <card.icon size={20} />
            <span className="text-sm font-medium">{card.label}</span>
          </div>
          <p className="text-3xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
