# Create a fixed NFT Gallery component
cat > src/components/NFTGallery.tsx << 'EOF'
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface NFTProject {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  communitySize: number;
  liveData: string;
  badges: string[];
  status: 'active' | 'upcoming' | 'completed';
}

const NFTGallery: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const nftProjects: NFTProject[] = [
    {
      id: 'solar-bitcoin',
      title: 'Solar Bitcoin Mining Hub',
      description: 'Green energy powered Bitcoin mining collective with real-time yield tracking',
      category: 'Green Energy Collective',
      image: '/api/placeholder/400/300',
      communitySize: 1247,
      liveData: '2.4 MW Active • 98% Uptime',
      badges: ['Live', 'High Yield', 'Green'],
      status: 'active'
    },
    {
      id: 'ev-charging',
      title: 'EV Charging Network',
      description: 'Decentralized electric vehicle charging infrastructure across major highways',
      category: 'Sustainable Transport DApp',
      image: '/api/placeholder/400/300',
      communitySize: 892,
      liveData: '47 Stations • 2.3K Charges/Day',
      badges: ['Expanding', 'Gov Partner'],
      status: 'active'
    },
    {
      id: 'data-center',
      title: 'Data Center Green Power',
      description: 'Renewable energy powered data centers for Web3 infrastructure',
      category: 'Tool Infrastructure Hub',
      image: '/api/placeholder/400/300',
      communitySize: 567,
      liveData: '15 MW Capacity • 0 Carbon',
      badges: ['Enterprise', 'Scalable'],
      status: 'active'
    },
    {
      id: 'temple-solar',
      title: 'Temple Community Solar',
      description: 'Community-owned solar power plants for rural temple complexes',
      category: 'Community Power Network',
      image: '/api/placeholder/400/300',
      communitySize: 2341,
      liveData: '12 Temples • 5.6 MW Total',
      badges: ['Community', 'Cultural'],
      status: 'active'
    },
    {
      id: 'hydro-mining',
      title: 'Hydro Mining Collective',
      description: 'Hydropower based crypto mining in Himalayan regions',
      category: 'Renewable Mining',
      image: '/api/placeholder/400/300',
      communitySize: 678,
      liveData: 'Coming Soon • Q1 2024',
      badges: ['Upcoming', 'High Potential'],
      status: 'upcoming'
    },
    {
      id: 'wind-farm',
      title: 'Coastal Wind Farm',
      description: 'Offshore wind energy generation with tokenized ownership',
      category: 'Wind Energy DAO',
      image: '/api/placeholder/400/300',
      communitySize: 1543,
      liveData: '200 Turbines • 150 MW',
      badges: ['Marine', 'Scalable'],
      status: 'active'
    },
    {
      id: 'bio-energy',
      title: 'Bio Energy Plants',
      description: 'Agricultural waste to energy conversion facilities',
      category: 'Circular Economy',
      image: '/api/placeholder/400/300',
      communitySize: 432,
      liveData: '8 Plants • 25 MW Total',
      badges: ['Rural', 'Sustainable'],
      status: 'active'
    },
    {
      id: 'geo-thermal',
      title: 'Geothermal Energy',
      description: 'Harnessing geothermal energy for baseload power generation',
      category: 'Deep Tech Energy',
      image: '/api/placeholder/400/300',
      communitySize: 289,
      liveData: 'Pilot Phase • 5 MW Test',
      badges: ['Innovation', 'R&D'],
      status: 'upcoming'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            My NFT Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Click any NFT to explore project community and real-time data feed
          </p>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
        </motion.div>

        {/* NFT Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {nftProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProject(project.id)}
            >
              {/* NFT Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-4xl">⚡</div>
                <div className="absolute top-3 right-3 flex gap-1">
                  {project.badges.map((badge, i) => (
                    <span 
                      key={i}
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        badge === 'Live' ? 'bg-green-100 text-green-800' :
                        badge === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                        badge === 'High Yield' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* NFT Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-sm text-blue-600 font-semibold mb-3">
                  {project.category}
                </p>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                {/* Live Data */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>👥 {project.communitySize.toLocaleString()} members</span>
                  <span>📊 {project.liveData}</span>
                </div>

                {/* Action Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2">
                  <span>View Project</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-8 text-sm text-gray-600">
            <span>🎯 {nftProjects.length} Projects Total</span>
            <span>⚡ {nftProjects.filter(p => p.status === 'active').length} Active</span>
            <span>🚀 {nftProjects.filter(p => p.status === 'upcoming').length} Upcoming</span>
            <span>👥 {nftProjects.reduce((acc, p) => acc + p.communitySize, 0).toLocaleString()} Community Members</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NFTGallery;
EOF              Explore Community
            </button>
          </div>