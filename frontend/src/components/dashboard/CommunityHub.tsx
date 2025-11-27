"use client";

import React from 'react';
import { Image, Video, FileText } from 'lucide-react';
import type { Post, Project } from '@/lib/types';
import { posts as mockPosts } from '@/lib/data';

interface CommunityHubProps {
  posts?: Post[];
  selectedProject?: Project | null;
}

const CommunityHub: React.FC<CommunityHubProps> = ({ posts, selectedProject }) => {
  const list = posts ?? mockPosts;

  return (
    <div className="space-y-6">
      {selectedProject && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">{selectedProject.name} Community</h3>
              <p className="text-sm opacity-90">Real-time project updates and discussions</p>
            </div>
            <button
              title="View all communities"
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
            >
              View All Communities
            </button>
          </div>
        </div>
      )}

      {/* Post Creation */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">Share with Community</h3>
        <textarea
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          placeholder={selectedProject ? `Share updates about ${selectedProject.name}...` : "What's on your mind? Share updates, ideas, or questions..."}
        />
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-2">
            <button title="Attach image" aria-label="Attach image" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Image className="text-gray-400" size={20} />
            </button>
            <button title="Attach video" aria-label="Attach video" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <Video className="text-gray-400" size={20} />
            </button>
            <button title="Attach file" aria-label="Attach file" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
              <FileText className="text-gray-400" size={20} />
            </button>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg">
            Post
          </button>
        </div>
      </div>

      {/* Real-Time Data (if project selected) */}
      {selectedProject && (selectedProject as any).liveData && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Project Real-Time Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Energy Generated</p>
              <p className="text-2xl font-bold text-green-400">{Math.floor(Math.random() * 500) + 100} kWh</p>
              <p className="text-xs text-green-400 mt-1">↑ Live</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Active Members</p>
              <p className="text-2xl font-bold text-blue-400">{Math.floor(Math.random() * 50) + 20}</p>
              <p className="text-xs text-blue-400 mt-1">Online now</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">Token Rewards</p>
              <p className="text-2xl font-bold text-purple-400">{Math.floor(Math.random() * 1000) + 500} HHD</p>
              <p className="text-xs text-purple-400 mt-1">This week</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-400 mb-1">CO₂ Saved</p>
              <p className="text-2xl font-bold text-orange-400">{Math.floor(Math.random() * 100) + 50} kg</p>
              <p className="text-xs text-orange-400 mt-1">Today</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">
          {selectedProject ? `${selectedProject.name} - Recent Activity` : 'Recent Activity - All Projects'}
        </h3>
        {list.map((p) => (
          <article key={p.id} className="bg-gray-800/60 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{p.author}</p>
                <p className="text-gray-400 text-sm">{p.time}</p>
              </div>
            </div>
            <p className="mt-3 text-gray-300">{p.content}</p>
          </article>
        ))}
        {list.length === 0 && <p className="text-gray-400">No recent activity.</p>}
        {selectedProject && <p className="text-sm text-gray-400">Viewing community for: {selectedProject.name}</p>}
      </div>
    </div>
  );
};

export default CommunityHub;
