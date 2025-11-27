import React, { useState, useRef, useEffect } from "react";
import { 
  MapPin, 
  Filter, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  Layers, 
  Satellite,
  Globe,
  ChevronDown,
  Clock,
  Zap,
  Users,
  Building,
  Wind,
  Sun,
  Battery,
  AlertCircle,
  CheckCircle
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  type: 'solar' | 'wind' | 'hydro' | 'mining' | 'storage';
  status: 'active' | 'development' | 'planned' | 'completed';
  stage: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    region: string;
  };
  capacity: string;
  output: string;
  completion: number;
  impact: {
    households: number;
    jobs: number;
    co2Reduction: string;
  };
  lastUpdated: string;
}

const MapView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'solar' | 'wind' | 'hydro' | 'mining' | 'storage'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'development' | 'planned' | 'completed'>('all');
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'terrain'>('standard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // Default: Delhi
  const mapRef = useRef<HTMLDivElement>(null);

  // Sample project data
  const projects: Project[] = [
    {
      id: 'solar-delhi',
      name: 'Delhi Solar Mining Hub',
      type: 'solar',
      status: 'active',
      stage: 'Phase 2 Operational',
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: 'Delhi NCR',
        region: 'Northern India'
      },
      capacity: '5 MW',
      output: '18.5 MWh/day',
      completion: 85,
      impact: {
        households: 450,
        jobs: 8,
        co2Reduction: '12,500 tons/year'
      },
      lastUpdated: '2024-01-15'
    },
    {
      id: 'wind-rajasthan',
      name: 'Rajasthan Wind Farm',
      type: 'wind',
      status: 'development',
      stage: 'Construction Phase',
      location: {
        lat: 26.9124,
        lng: 75.7873,
        address: 'Jaisalmer, Rajasthan',
        region: 'Western India'
      },
      capacity: '50 MW',
      output: '125 MWh/day',
      completion: 45,
      impact: {
        households: 1200,
        jobs: 15,
        co2Reduction: '45,000 tons/year'
      },
      lastUpdated: '2024-01-10'
    },
    {
      id: 'solar-baghpat',
      name: 'Baghpat Village Solar',
      type: 'solar',
      status: 'completed',
      stage: 'Fully Operational',
      location: {
        lat: 29.0000,
        lng: 77.2167,
        address: 'Baghpat, Uttar Pradesh',
        region: 'Northern India'
      },
      capacity: '500 KW',
      output: '2.1 MWh/day',
      completion: 100,
      impact: {
        households: 85,
        jobs: 6,
        co2Reduction: '850 tons/year'
      },
      lastUpdated: '2024-01-12'
    },
    {
      id: 'hydro-uttarakhand',
      name: 'Uttarakhand Micro-Hydro',
      type: 'hydro',
      status: 'planned',
      stage: 'Feasibility Study',
      location: {
        lat: 30.0668,
        lng: 79.0193,
        address: 'Chamoli, Uttarakhand',
        region: 'Northern India'
      },
      capacity: '2 MW',
      output: '8 MWh/day',
      completion: 15,
      impact: {
        households: 300,
        jobs: 12,
        co2Reduction: '6,800 tons/year'
      },
      lastUpdated: '2024-01-08'
    },
    {
      id: 'storage-mumbai',
      name: 'Mumbai Battery Storage',
      type: 'storage',
      status: 'development',
      stage: 'Installation Phase',
      location: {
        lat: 19.0760,
        lng: 72.8777,
        address: 'Mumbai, Maharashtra',
        region: 'Western India'
      },
      capacity: '20 MWh',
      output: 'Grid Stabilization',
      completion: 60,
      impact: {
        households: 2000,
        jobs: 10,
        co2Reduction: '8,200 tons/year'
      },
      lastUpdated: '2024-01-14'
    },
    {
      id: 'mining-hyderabad',
      name: 'Hyderabad Mining Facility',
      type: 'mining',
      status: 'active',
      stage: 'Expansion Phase',
      location: {
        lat: 17.3850,
        lng: 78.4867,
        address: 'Hyderabad, Telangana',
        region: 'Southern India'
      },
      capacity: '10 MW',
      output: '45 MWh/day',
      completion: 90,
      impact: {
        households: 600,
        jobs: 18,
        co2Reduction: '15,000 tons/year'
      },
      lastUpdated: '2024-01-13'
    },
    {
      id: 'solar-chennai',
      name: 'Chennai Solar Park',
      type: 'solar',
      status: 'planned',
      stage: 'Land Acquisition',
      location: {
        lat: 13.0827,
        lng: 80.2707,
        address: 'Chennai, Tamil Nadu',
        region: 'Southern India'
      },
      capacity: '25 MW',
      output: '100 MWh/day',
      completion: 5,
      impact: {
        households: 1800,
        jobs: 25,
        co2Reduction: '32,000 tons/year'
      },
      lastUpdated: '2024-01-09'
    },
    {
      id: 'wind-gujarat',
      name: 'Gujarat Offshore Wind',
      type: 'wind',
      status: 'planned',
      stage: 'Environmental Review',
      location: {
        lat: 22.2587,
        lng: 71.1924,
        address: 'Gulf of Khambhat, Gujarat',
        region: 'Western India'
      },
      capacity: '100 MW',
      output: '320 MWh/day',
      completion: 10,
      impact: {
        households: 3500,
        jobs: 35,
        co2Reduction: '78,000 tons/year'
      },
      lastUpdated: '2024-01-07'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesType = activeFilter === 'all' || project.type === activeFilter;
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const getProjectIcon = (project: Project) => {
    const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform cursor-pointer";
    
    const statusIndicator = project.status === 'active' ? 'ring-2 ring-green-400 animate-pulse' :
                           project.status === 'development' ? 'ring-2 ring-blue-400' :
                           project.status === 'planned' ? 'ring-2 ring-yellow-400' :
                           'ring-2 ring-purple-400';

    const typeColors = {
      solar: 'bg-orange-500',
      wind: 'bg-blue-500',
      hydro: 'bg-cyan-500',
      mining: 'bg-gray-600',
      storage: 'bg-green-500'
    };

    const icons = {
      solar: <Sun size={16} />,
      wind: <Wind size={16} />,
      hydro: <Globe size={16} />,
      mining: <Zap size={16} />,
      storage: <Battery size={16} />
    };

    return (
      <div 
        className={`${baseClasses} ${typeColors[project.type]} ${statusIndicator}`}
        onClick={() => setSelectedProject(project)}
      >
        {icons[project.type]}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900';
      case 'development': return 'text-blue-400 bg-blue-900';
      case 'planned': return 'text-yellow-400 bg-yellow-900';
      case 'completed': return 'text-purple-400 bg-purple-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'solar': return 'text-orange-400 bg-orange-900';
      case 'wind': return 'text-blue-400 bg-blue-900';
      case 'hydro': return 'text-cyan-400 bg-cyan-900';
      case 'mining': return 'text-gray-400 bg-gray-900';
      case 'storage': return 'text-green-400 bg-green-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 15));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 3));

  const handleRecenter = () => {
    setCenter({ lat: 28.6139, lng: 77.2090 });
    setZoom(5);
  };

  // Simulated map interaction
  useEffect(() => {
    if (selectedProject) {
      setCenter(selectedProject.location);
      setZoom(8);
    }
  }, [selectedProject]);

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white mb-2">Project Map</h1>
          <p className="text-gray-400 text-sm">Explore HHDAO energy projects across India</p>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects or regions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-white">Filters</h3>
            <Filter className="w-4 h-4 text-gray-400" />
          </div>

          {/* Project Type Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Project Type</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All', icon: <Globe size={14} /> },
                { id: 'solar', label: 'Solar', icon: <Sun size={14} /> },
                { id: 'wind', label: 'Wind', icon: <Wind size={14} /> },
                { id: 'hydro', label: 'Hydro', icon: <Globe size={14} /> },
                { id: 'mining', label: 'Mining', icon: <Zap size={14} /> },
                { id: 'storage', label: 'Storage', icon: <Battery size={14} /> }
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveFilter(type.id as any)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === type.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'development', label: 'Development' },
                { id: 'planned', label: 'Planned' },
                { id: 'completed', label: 'Completed' }
              ].map((status) => (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(status.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === status.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">
                Projects ({filteredProjects.length})
              </h3>
              <span className="text-xs text-gray-400">
                Showing {filteredProjects.length} of {projects.length}
              </span>
            </div>

            <div className="space-y-3">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className={`p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors border ${
                    selectedProject?.id === project.id ? 'border-blue-500' : 'border-gray-600'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-white text-sm">{project.name}</h4>
                    {getProjectIcon(project)}
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(project.type)}`}>
                      {project.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <div className="text-xs text-gray-400 space-y-1">
                    <div className="flex items-center space-x-1">
                      <MapPin size={12} />
                      <span>{project.location.region}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap size={12} />
                      <span>{project.capacity} • {project.output}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{project.completion}% complete</span>
                      <span className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{project.lastUpdated}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-gray-800">
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 space-y-2">
          {/* Zoom Controls */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-700 rounded-t-lg transition-colors"
            >
              <ZoomIn className="w-5 h-5 text-gray-300" />
            </button>
            <div className="border-t border-gray-700">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-gray-700 rounded-b-lg transition-colors"
              >
                <ZoomOut className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Map Style Controls */}
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700">
            <button
              onClick={() => setMapStyle('standard')}
              className={`p-2 rounded-t-lg transition-colors ${
                mapStyle === 'standard' ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              <Globe className="w-5 h-5 text-gray-300" />
            </button>
            <div className="border-t border-gray-700">
              <button
                onClick={() => setMapStyle('satellite')}
                className={`p-2 transition-colors ${
                  mapStyle === 'satellite' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <Satellite className="w-5 h-5 text-gray-300" />
              </button>
            </div>
            <div className="border-t border-gray-700">
              <button
                onClick={() => setMapStyle('terrain')}
                className={`p-2 rounded-b-lg transition-colors ${
                  mapStyle === 'terrain' ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
              >
                <Layers className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Recenter Button */}
          <button
            onClick={handleRecenter}
            className="p-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:bg-gray-700 transition-colors"
          >
            <Navigation className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        {/* Map Visualization */}
        <div 
          ref={mapRef}
          className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"
        >
          {/* Simulated Map Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-blue-900 via-green-900 to-yellow-900" />
          </div>

          {/* Project Markers */}
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${((project.location.lng + 180) / 360) * 100}%`,
                top: `${((90 - project.location.lat) / 180) * 100}%`,
              }}
              onClick={() => setSelectedProject(project)}
            >
              {getProjectIcon(project)}
            </div>
          ))}

          {/* Selected Project Highlight */}
          {selectedProject && (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${((selectedProject.location.lng + 180) / 360) * 100}%`,
                top: `${((90 - selectedProject.location.lat) / 180) * 100}%`,
              }}
            >
              <div className="w-4 h-4 bg-blue-400 rounded-full animate-ping" />
            </div>
          )}

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 rounded-lg p-4 border border-gray-700">
            <h4 className="font-semibold text-white text-sm mb-2">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-300">Solar Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300">Wind Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                <span className="text-gray-300">Hydro Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                <span className="text-gray-300">Mining Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">Storage Projects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Project Panel */}
        {selectedProject && (
          <div className="absolute bottom-4 right-4 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-white text-lg">{selectedProject.name}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(selectedProject.type)}`}>
                    {selectedProject.type}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status}
                  </span>
                </div>

                <div className="text-sm text-gray-300 space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin size={14} />
                    <span>{selectedProject.location.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap size={14} />
                    <span>Capacity: {selectedProject.capacity}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building size={14} />
                    <span>Output: {selectedProject.output}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">Completion</span>
                    <span className="text-white">{selectedProject.completion}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${selectedProject.completion}%` }}
                    ></div>
                  </div>
                </div>

                {/* Impact Stats */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-700 rounded p-2">
                    <Users className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <div className="text-white font-semibold">{selectedProject.impact.households}</div>
                    <div className="text-xs text-gray-400">Households</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <Building className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <div className="text-white font-semibold">{selectedProject.impact.jobs}</div>
                    <div className="text-xs text-gray-400">Jobs</div>
                  </div>
                  <div className="bg-gray-700 rounded p-2">
                    <Wind className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <div className="text-white font-semibold text-xs">{selectedProject.impact.co2Reduction}</div>
                    <div className="text-xs text-gray-400">CO₂ Reduction</div>
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                  View Project Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;