"use client";

import { ShoppingBag } from 'lucide-react';
import { rewardsMarketplace } from '@/lib/data';

export default function RewardsMarketplace() {
  const tokenBalance = 15000;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6 mb-6 shadow-xl">
        <p className="text-lg mb-2">Available Balance</p>
        <p className="text-4xl font-bold">{tokenBalance.toLocaleString()} HHD</p>
        <p className="text-sm mt-2 opacity-90">≈ ₹{(tokenBalance * 10).toLocaleString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rewardsMarketplace.map((category, idx) => (
          <div key={idx} className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:border-blue-500 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">{category.icon}</span>
              <h3 className="text-xl font-bold text-white">{category.name}</h3>
            </div>
            <div className="space-y-2">
              {category.vendors.map((vendor, vIdx) => (
                <button 
                  key={vIdx}
                  className="w-full bg-gray-900 bg-opacity-50 hover:bg-blue-900 hover:bg-opacity-30 text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group border border-gray-700 hover:border-blue-500"
                >
                  <span className="text-gray-200 font-medium">{vendor}</span>
                  <ShoppingBag className="text-gray-500 group-hover:text-blue-400" size={18} />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

