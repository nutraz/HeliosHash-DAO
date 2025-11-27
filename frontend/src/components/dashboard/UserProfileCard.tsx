import React from 'react';
import { Users, Award, Shield, Wallet } from 'lucide-react';

export const UserProfileCard: React.FC<{ user: any; balance: number }> = ({ user, balance }) => (
  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
          <Users size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user?.name || 'Loading...'}</h2>
          <div className="flex items-center space-x-2 mt-1">
            <Award className="w-5 h-5" />
            <span className="text-blue-100">{user?.rank}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Shield className="w-4 h-4" />
            <span className="text-sm text-blue-100">{user?.communityRole}</span>
          </div>
        </div>
      </div>
      <Wallet className="w-8 h-8" />
    </div>

    <div className="mt-6 bg-white bg-opacity-20 rounded-xl p-4">
      <p className="text-sm text-blue-100">Token Balance</p>
      <p className="text-3xl font-bold">{balance.toLocaleString()} HHD</p>
    </div>
  </div>
);

export default UserProfileCard;
