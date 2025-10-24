// === Enhanced Solar Projects Management ===
// Interactive map, real-time data, applications, and community integration

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import EnergyDashboard from '../../components/energy-dashboard';
import ProjectApplicationSystem from '../../components/project-application-system';
// ProjectMap removed - using governance/ProposalMap instead
import { MOCK_SOLAR_PROJECTS, SolarProject } from '../../types/enhanced-solar-project';

type ViewMode = 'map' | 'list' | 'detail' | 'energy' | 'applications';

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedProject, setSelectedProject] = useState<SolarProject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Handle project selection from map
  const handleProjectSelect = (project: SolarProject) => {
    setSelectedProject(project);
    setViewMode('detail');
  };

  // Filter projects based on search and status
  const filteredProjects = MOCK_SOLAR_PROJECTS.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.progress.stage === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Get status color
  const getStatusColor = (stage: string) => {
    switch (stage) {
      case 'operational':
        return 'text-green-400';
      case 'construction':
        return 'text-yellow-400';
      case 'installation':
        return 'text-blue-400';
      case 'planning':
        return 'text-gray-400';
      default:
        return 'text-purple-400';
    }
  };

  // Format capacity
  const formatCapacity = (kw: number) => {
    if (kw >= 1000) return `${(kw / 1000).toFixed(1)} MW`;
    return `${kw} kW`;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900'>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-black/40 backdrop-blur border-b border-white/10 p-6'
      >
        <div className='max-w-7xl mx-auto'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <h1 className='text-3xl font-bold text-white mb-2'>☀️ Solar Projects Hub</h1>
              <p className='text-gray-300'>
                Explore, monitor, and contribute to solar energy projects across India
              </p>
            </div>

            {/* Project Stats */}
            <div className='flex gap-6 text-center'>
              <div>
                <div className='text-2xl font-bold text-yellow-400'>
                  {MOCK_SOLAR_PROJECTS.length}
                </div>
                <div className='text-xs text-gray-400'>Active Projects</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-400'>
                  {formatCapacity(MOCK_SOLAR_PROJECTS.reduce((sum, p) => sum + p.capacity_kw, 0))}
                </div>
                <div className='text-xs text-gray-400'>Total Capacity</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-blue-400'>
                  {MOCK_SOLAR_PROJECTS.reduce(
                    (sum, p) => sum + p.community.households_served,
                    0
                  ).toLocaleString()}
                </div>
                <div className='text-xs text-gray-400'>Homes Powered</div>
              </div>
            </div>
          </div>

          {/* View Mode Switcher */}
          <div className='flex flex-wrap gap-2'>
            {[
              { key: 'map', label: '🗺️ Map View', desc: 'Interactive project locations' },
              { key: 'list', label: '📋 List View', desc: 'Detailed project list' },
              { key: 'energy', label: '⚡ Energy Monitor', desc: 'Real-time energy data' },
              { key: 'applications', label: '💼 Applications', desc: 'Apply for positions' },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key as ViewMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  viewMode === mode.key
                    ? 'bg-yellow-500 text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title={mode.desc}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      {(viewMode === 'list' || viewMode === 'map') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-black/20 backdrop-blur p-4'
        >
          <div className='max-w-7xl mx-auto flex gap-4'>
            {/* Search */}
            <div className='flex-1'>
              <input
                type='text'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search projects by name, location, or state...'
                className='w-full bg-black/40 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-yellow-500 focus:outline-none'
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='bg-black/40 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-yellow-500 focus:outline-none'
            >
              <option value='all'>All Statuses</option>
              <option value='operational'>Operational</option>
              <option value='construction'>Under Construction</option>
              <option value='installation'>Installation Phase</option>
              <option value='planning'>Planning Stage</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className='p-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Map View */}
          {viewMode === 'map' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='h-[600px]'>
              {/* ProjectMap temporarily removed - using governance/ProposalMap instead */}
              <div className='w-full h-full flex items-center justify-center bg-gray-100 rounded'>
                <p className='text-gray-600'>
                  Project map integration moved to governance dashboard
                </p>
              </div>
            </motion.div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className='bg-black/40 backdrop-blur rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500/50 transition-all cursor-pointer'
                  onClick={() => handleProjectSelect(project)}
                >
                  {/* Project Header */}
                  <div className='p-4 border-b border-white/10'>
                    <div className='flex justify-between items-start mb-2'>
                      <h3 className='text-white font-bold text-lg truncate pr-2'>{project.name}</h3>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(
                          project.progress.stage
                        )}`}
                      >
                        {project.progress.stage.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className='text-gray-300 text-sm mb-2'>📍 {project.location.address}</p>
                    <p className='text-gray-400 text-sm'>{project.description.slice(0, 100)}...</p>
                  </div>

                  {/* Project Metrics */}
                  <div className='p-4 space-y-3'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-400'>Capacity:</span>
                      <span className='text-yellow-400 font-bold'>
                        {formatCapacity(project.capacity_kw)}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-400'>Progress:</span>
                      <span className='text-white font-bold'>
                        {project.progress.progress_percent}%
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-400'>Households:</span>
                      <span className='text-blue-400 font-bold'>
                        {project.community.households_served}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span className='text-gray-400'>Jobs Created:</span>
                      <span className='text-green-400 font-bold'>
                        {project.community.local_employment_created}
                      </span>
                    </div>

                    {/* Live Energy Data */}
                    {project.progress.stage === 'operational' && (
                      <div className='bg-green-500/20 rounded p-2 text-xs'>
                        <div className='flex justify-between'>
                          <span className='text-green-400'>🔋 Live Production:</span>
                          <span className='text-white font-bold'>
                            {project.energy_data.current_production_kw.toFixed(1)} kW
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Vacancies */}
                    {project.vacancies.length > 0 && (
                      <div className='bg-yellow-500/20 rounded p-2 text-xs'>
                        <span className='text-yellow-400'>
                          💼 {project.vacancies.length} positions available
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredProjects.length === 0 && (
                <div className='col-span-full text-center py-16'>
                  <div className='text-6xl mb-4'>🔍</div>
                  <h3 className='text-xl font-bold text-white mb-2'>No Projects Found</h3>
                  <p className='text-gray-400'>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Energy Dashboard View */}
          {viewMode === 'energy' && selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <EnergyDashboard project={selectedProject} />
            </motion.div>
          )}

          {/* Applications View */}
          {viewMode === 'applications' && selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ProjectApplicationSystem project={selectedProject} />
            </motion.div>
          )}

          {/* Project Detail View */}
          {viewMode === 'detail' && selectedProject && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='space-y-6'>
              {/* Detail Header */}
              <div className='flex justify-between items-start'>
                <div>
                  <h2 className='text-3xl font-bold text-white mb-2'>{selectedProject.name}</h2>
                  <p className='text-gray-300 text-lg'>{selectedProject.description}</p>
                </div>
                <button
                  onClick={() => setViewMode('map')}
                  className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
                >
                  ← Back to Map
                </button>
              </div>

              {/* Quick Action Tabs */}
              <div className='flex gap-4'>
                <button
                  onClick={() => setViewMode('energy')}
                  className='bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-bold transition-colors'
                >
                  ⚡ View Live Energy Data
                </button>
                <button
                  onClick={() => setViewMode('applications')}
                  className='bg-yellow-600 hover:bg-yellow-700 text-black px-6 py-3 rounded-lg font-bold transition-colors'
                >
                  💼 Apply for Positions ({selectedProject.vacancies.length})
                </button>
              </div>

              {/* Project Overview Grid */}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {/* Location & Ownership */}
                <div className='bg-black/40 rounded-lg p-6'>
                  <h3 className='text-yellow-400 font-bold text-lg mb-4'>
                    📍 Location & Ownership
                  </h3>
                  <div className='space-y-3 text-sm'>
                    <div>
                      <span className='text-gray-400'>Address:</span>
                      <p className='text-white'>{selectedProject.location.address}</p>
                    </div>
                    <div>
                      <span className='text-gray-400'>State:</span>
                      <p className='text-white'>
                        {selectedProject.location.state}, {selectedProject.location.country}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Land Owner:</span>
                      <p className='text-white'>{selectedProject.land_owner.name}</p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Ownership Type:</span>
                      <p className='text-white capitalize'>
                        {selectedProject.land_owner.ownership_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Land Area:</span>
                      <p className='text-white'>
                        {selectedProject.land_owner.land_area_acres} acres
                      </p>
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className='bg-black/40 rounded-lg p-6'>
                  <h3 className='text-blue-400 font-bold text-lg mb-4'>⚙️ Technical Specs</h3>
                  <div className='space-y-3 text-sm'>
                    <div>
                      <span className='text-gray-400'>Capacity:</span>
                      <p className='text-white font-bold'>
                        {formatCapacity(selectedProject.capacity_kw)}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Panel Count:</span>
                      <p className='text-white'>
                        {selectedProject.panel_count.toLocaleString()} panels
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Panel Type:</span>
                      <p className='text-white'>{selectedProject.panel_type}</p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Inverter:</span>
                      <p className='text-white'>{selectedProject.inverter_type}</p>
                    </div>
                    {selectedProject.battery_storage_kwh && (
                      <div>
                        <span className='text-gray-400'>Battery Storage:</span>
                        <p className='text-white'>
                          {selectedProject.battery_storage_kwh.toLocaleString()} kWh
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Community Impact */}
                <div className='bg-black/40 rounded-lg p-6'>
                  <h3 className='text-green-400 font-bold text-lg mb-4'>🏠 Community Impact</h3>
                  <div className='space-y-3 text-sm'>
                    <div>
                      <span className='text-gray-400'>Households Served:</span>
                      <p className='text-white font-bold'>
                        {selectedProject.community.households_served}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Total Beneficiaries:</span>
                      <p className='text-white'>
                        {selectedProject.community.total_beneficiaries.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Jobs Created:</span>
                      <p className='text-white'>
                        {selectedProject.community.local_employment_created}
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Community Satisfaction:</span>
                      <p className='text-white'>
                        {selectedProject.community.community_feedback_score}/5 ⭐
                      </p>
                    </div>
                    <div>
                      <span className='text-gray-400'>Community Ownership:</span>
                      <p className='text-white'>
                        {selectedProject.community.community_ownership_percent}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* No Project Selected State for Energy/Applications Views */}
          {(viewMode === 'energy' || viewMode === 'applications') && !selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-16'
            >
              <div className='text-6xl mb-4'>🏗️</div>
              <h3 className='text-xl font-bold text-white mb-2'>Select a Project First</h3>
              <p className='text-gray-400 mb-6'>
                Choose a project from the map or list view to access{' '}
                {viewMode === 'energy' ? 'energy monitoring' : 'application system'}
              </p>
              <button
                onClick={() => setViewMode('map')}
                className='bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition-colors'
              >
                Browse Projects on Map
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
