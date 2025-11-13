'use client';

import React from 'react';

interface FundingProgressProps {
  current: number;
  goal: number;
  project: string;
}

const FundingProgress: React.FC<FundingProgressProps> = ({ current, goal, project }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const remaining = Math.max(goal - current, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Funding Progress</h3>
        <span className="text-sm text-gray-500">{project}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Current Funding</span>
          <span className="font-semibold">₹{(current / 100000).toFixed(1)}L</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Goal</span>
          <span className="font-semibold">₹{(goal / 100000).toFixed(1)}L</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Remaining</span>
          <span className="font-semibold text-orange-600">₹{(remaining / 100000).toFixed(1)}L</span>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <div className="text-center">
        <span className={`text-2xl font-bold ${percentage >= 75 ? 'text-green-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
          {percentage.toFixed(1)}%
        </span>
        <span className="text-gray-500 text-sm ml-2">funded</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition text-sm">
          Invest Now
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition text-sm">
          View Details
        </button>
        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition text-sm">
          Share Project
        </button>
      </div>
    </div>
  );
};

export default FundingProgress;
