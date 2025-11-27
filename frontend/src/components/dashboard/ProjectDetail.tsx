"use client";

import { Zap, Building, Briefcase, DollarSign, Shield, Wrench, Eye, Store, Image, Users, MapPin, MessageSquare } from 'lucide-react';
import { Project } from '@/lib/types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onCommunityClick: () => void;
}

const getColorClasses = (color: string) => {
  const colors: Record<string, any> = {
    green: { text: 'text-green-400' },
    yellow: { text: 'text-yellow-400' },
    orange: { text: 'text-orange-400' },
    blue: { text: 'text-blue-400' },
    grey: { text: 'text-gray-400' }
  };
  return colors[color] || colors.grey;
};

export default function ProjectDetail({ project, onBack, onCommunityClick }: ProjectDetailProps) {
  const colorClasses = getColorClasses((project as any).color || 'grey');

  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Size</p>
            <p className="text-2xl font-bold text-white">{(project as any).size}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Completion</p>
            <p className="text-2xl font-bold text-green-400">{(project as any).completion}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Funding</p>
            <p className="text-2xl font-bold text-blue-400">{(project as any).funding}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Stage</p>
            <div className="flex items-center space-x-2">
              <p className={`text-lg font-bold capitalize ${colorClasses.text}`}>
                {((project as any).stage || '').replace('-', ' ')}
              </p>
              {(project as any).isLive && (
                <span className="flex items-center space-x-1 text-xs bg-red-500 text-white px-2 py-1 rounded-full animate-pulse">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span>LIVE</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-start space-x-3">
            <Zap className="text-orange-400 mt-1" size={20} />
            <div>
              <p className="font-semibold text-white">Prime Consumer</p>
              <p className="text-gray-400">{(project as any).energySupply}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Building className="text-blue-400 mt-1" size={20} />
            <div>
              <p className="font-semibold text-white">Surplus Energy Consumer</p>
              <p className="text-gray-400">{(project as any).surplus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Data */}
      {(project as any).isLive && (project as any).liveData && (
        <div className="bg-gradient-to-r from-cyan-900 to-purple-900 bg-opacity-50 border border-cyan-500 rounded-xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Zap className="text-cyan-400" />
              <span>Live Project Data</span>
            </h3>
            <span className="flex items-center space-x-2 text-sm bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
              <span>LIVE</span>
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-cyan-500">
              <p className="text-xs text-cyan-300 mb-1">Solar Panels</p>
              <p className="text-2xl font-bold text-cyan-400">{(project as any).liveData.panels}</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-green-500">
              <p className="text-xs text-green-300 mb-1">Current Output</p>
              <p className="text-2xl font-bold text-green-400">{(project as any).liveData.currentOutput} kW</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-purple-500">
              <p className="text-xs text-purple-300 mb-1">Today's Energy</p>
              <p className="text-2xl font-bold text-purple-400">{(project as any).liveData.todayEnergy} kWh</p>
            </div>
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-amber-500">
              <p className="text-xs text-amber-300 mb-1">Uptime</p>
              <p className="text-2xl font-bold text-amber-400">{(project as any).liveData.uptime}</p>
            </div>
            {(project as any).liveData.hashrate && (
              <>
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-orange-500">
                  <p className="text-xs text-orange-300 mb-1">Hashrate</p>
                  <p className="text-2xl font-bold text-orange-400">{(project as any).liveData.hashrate}</p>
                </div>
                <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4 border border-yellow-500">
                  <p className="text-xs text-yellow-300 mb-1">BTC Mined Today</p>
                  <p className="text-2xl font-bold text-yellow-400">{(project as any).liveData.btcMined}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Detailed Info */}
      {(project as any).detailedInfo && (
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Location</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Project Type</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Capacity</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.capacity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Technology</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.technology}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Storage</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.storage}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Architecture</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.architecture}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Governance</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.governance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Revenue Model</p>
                <p className="text-white font-medium">{(project as any).detailedInfo.revenueModel}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Project Partners</h3>
            <div className="flex flex-wrap gap-2">
              {(project as any).detailedInfo.partners.map((partner: string, idx: number) => (
                <span key={idx} className="bg-blue-900 bg-opacity-50 text-blue-300 border border-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {partner}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Project Milestones</h3>
            <div className="space-y-3">
              {(project as any).detailedInfo.milestones.map((milestone: any, idx: number) => (
                <div key={idx} className="flex items-start space-x-4 border-l-4 border-blue-500 pl-4 py-2">
                  <div className="min-w-24">
                    <p className="text-sm font-semibold text-blue-400">{milestone.date}</p>
                  </div>
                  <p className="text-gray-300">{milestone.event}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900 to-teal-900 bg-opacity-50 border border-green-500 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Community Impact</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries((project as any).detailedInfo.impact).map(([key, value], idx) => (
                <div key={idx} className="bg-gray-900 bg-opacity-50 rounded-lg p-4">
                  <p className="text-xs text-green-300 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                  <p className="text-lg font-bold text-green-400">{String(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Opportunities */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Briefcase className="text-blue-400" />
          <span>Project Opportunities</span>
        </h3>
        <div className="space-y-3">
          {(project as any).opportunities.map((opp: any, idx: number) => (
            <div key={idx} className="border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors bg-gray-900 bg-opacity-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {opp.type.includes('Funding') && <DollarSign className="text-green-400" size={20} />}
                  {opp.type.includes('Guard') && <Shield className="text-blue-400" size={20} />}
                  {opp.type.includes('Engineer') && <Wrench className="text-orange-400" size={20} />}
                  {opp.type.includes('Inspector') && <Eye className="text-purple-400" size={20} />}
                  {opp.type.includes('Supplier') && <Store className="text-indigo-400" size={20} />}
                  {opp.type.includes('NFT') && <Image className="text-pink-400" size={20} />}
                  {opp.type.includes('Contractor') && <Building className="text-gray-400" size={20} />}
                  {opp.type.includes('Tech') && <Wrench className="text-blue-400" size={20} />}
                  {opp.type.includes('Manager') && <Users className="text-purple-400" size={20} />}
                  {opp.type.includes('Survey') && <MapPin className="text-orange-400" size={20} />}
                  <div>
                    <p className="font-semibold text-white">{opp.type}</p>
                    {opp.positions && (
                      <p className="text-sm text-gray-400">{opp.positions} position{opp.positions > 1 ? 's' : ''} available</p>
                    )}
                    {opp.amount && (
                      <p className="text-sm text-green-400 font-medium">{opp.amount} required</p>
                    )}
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Hub Button */}
      <button 
        onClick={onCommunityClick}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2 font-bold text-lg shadow-xl"
      >
        <MessageSquare size={24} />
        <span>Open {(project as any).name} Community Hub</span>
      </button>
    </div>
  );
}

