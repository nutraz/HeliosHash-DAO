"use client"

import React from 'react';

export default function SocialHub() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Social Hub</h2>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Community Feed</h3>
          <p className="text-gray-600">Community discussions and updates will appear here.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Recent Activity</h4>
            <ul className="mt-2 text-sm text-blue-700">
              <li>• New project proposal created</li>
              <li>• Community vote completed</li>
              <li>• Member joined the DAO</li>
            </ul>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800">Community Stats</h4>
            <div className="mt-2 text-sm text-green-700 space-y-1">
              <div>Members: 1,247</div>
              <div>Active Projects: 23</div>
              <div>Total Votes: 8,956</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
