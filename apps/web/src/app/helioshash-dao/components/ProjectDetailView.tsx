import React, { useState } from "react";
import { 
  MapPin, 
  Zap, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield,
  Building,
  Battery,
  Sun,
  Wind,
  BarChart3,
  MessageSquare,
  Heart,
  Share2,
  Bookmark,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Download,
  Eye
} from "lucide-react";

interface ProjectData {
  id: string;
  name: string;
  status: 'active' | 'development' | 'planning' | 'completed';
  stage: string;
  location: string;
  capacity: string;
  technology: string;
  energyOutput: string;
  completion: number;
  funding: {
    total: string;
    raised: string;
    progress: number;
  };
  timeline: {
    start: string;
    estimatedCompletion: string;
    milestones: Array<{
      title: string;
      date: string;
      status: 'completed' | 'in-progress' | 'upcoming';
    }>;
  };
  team: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
  realTimeData?: {
    currentOutput: string;
    dailyProduction: string;
    efficiency: string;
    uptime: string;
    co2Saved: string;
  };
  impact: {
    households: number;
    jobsCreated: number;
    co2Reduction: string;
    communityBenefits: string[];
  };
  gallery: Array<{
    id: string;
    type: 'image' | 'video';
    url: string;
    caption: string;
  }>;
}

const ProjectDetailView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'team' | 'impact' | 'gallery'>('overview');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Sample project data - in real app this would come from props or API
  const projectData: ProjectData = {
    id: 'proj-001',
    name: 'Solar Bitcoin Mining Hub - Delhi NCR',
    status: 'active',
    stage: 'Phase 2 Expansion',
    location: 'Delhi NCR, India',
    capacity: '5 MW Solar + 2 MW Storage',
    technology: 'Bifacial Solar Panels + LiFePO4 Battery Bank',
    energyOutput: '18,250 MWh/year',
    completion: 75,
    funding: {
      total: '₹2.5 Crore',
      raised: '₹1.8 Crore',
      progress: 72
    },
    timeline: {
      start: 'Jan 2024',
      estimatedCompletion: 'Dec 2024',
      milestones: [
        { title: 'Land Acquisition', date: 'Feb 2024', status: 'completed' },
        { title: 'Solar Installation', date: 'Apr 2024', status: 'completed' },
        { title: 'Mining Setup', date: 'Jun 2024', status: 'in-progress' },
        { title: 'Grid Integration', date: 'Sep 2024', status: 'upcoming' },
        { title: 'Full Operation', date: 'Dec 2024', status: 'upcoming' }
      ]
    },
    team: [
      { name: 'Dr. Priya Sharma', role: 'Project Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
      { name: 'Raj Kumar', role: 'Solar Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Raj' },
      { name: 'Anita Patel', role: 'Community Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita' },
      { name: 'Mike Chen', role: 'Blockchain Expert', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' }
    ],
    realTimeData: {
      currentOutput: '4.2 MW',
      dailyProduction: '38.5 MWh',
      efficiency: '92.5%',
      uptime: '99.2%',
      co2Saved: '28.4 tons'
    },
    impact: {
      households: 350,
      jobsCreated: 12,
      co2Reduction: '15,200 tons/year',
      communityBenefits: [
        'Local employment opportunities',
        'Skill development programs',
        'Community energy sharing',
        'Educational workshops'
      ]
    },
    gallery: [
      { id: '1', type: 'image', url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500', caption: 'Solar Panel Installation' },
      { id: '2', type: 'image', url: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500', caption: 'Mining Equipment Setup' },
      { id: '3', type: 'video', url: 'https://example.com/video1', caption: 'Project Overview Video' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900';
      case 'development': return 'text-blue-400 bg-blue-900';
      case 'planning': return 'text-yellow-400 bg-yellow-900';
      case 'completed': return 'text-purple-400 bg-purple-900';
      default: return 'text-gray-400 bg-gray-900';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-400" />;
      case 'upcoming': return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{projectData.capacity}</div>
              <div className="text-sm text-gray-400">Capacity</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{projectData.completion}%</div>
              <div className="text-sm text-gray-400">Completion</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{projectData.impact.households}</div>
              <div className="text-sm text-gray-400">Households</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{projectData.funding.raised}</div>
              <div className="text-sm text-gray-400">Raised</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Data */}
      {projectData.realTimeData && (
        <div className="bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-500 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Zap className="text-cyan-400" />
            <span>Live Project Data</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{projectData.realTimeData.currentOutput}</div>
              <div className="text-sm text-cyan-200">Current Output</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{projectData.realTimeData.dailyProduction}</div>
              <div className="text-sm text-green-200">Daily Production</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{projectData.realTimeData.efficiency}</div>
              <div className="text-sm text-yellow-200">Efficiency</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{projectData.realTimeData.uptime}</div>
              <div className="text-sm text-purple-200">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{projectData.realTimeData.co2Saved}</div>
              <div className="text-sm text-orange-200">CO₂ Saved Today</div>
            </div>
          </div>
        </div>
      )}

      {/* Project Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Project Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Technology</span>
              <span className="text-white font-medium">{projectData.technology}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Energy Output</span>
              <span className="text-white font-medium">{projectData.energyOutput}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location</span>
              <span className="text-white font-medium flex items-center space-x-1">
                <MapPin size={16} />
                <span>{projectData.location}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stage</span>
              <span className="text-white font-medium">{projectData.stage}</span>
            </div>
          </div>
        </div>

        {/* Funding Progress */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Funding Progress</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Raised</span>
              <span className="text-white font-bold">{projectData.funding.raised}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${projectData.funding.progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Target</span>
              <span className="text-white">{projectData.funding.total}</span>
            </div>
            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold">
              Contribute to Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProgressTab = () => (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Project Timeline</h3>
        <div className="space-y-4">
          {projectData.timeline.milestones.map((milestone, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex flex-col items-center">
                {getMilestoneIcon(milestone.status)}
                {index < projectData.timeline.milestones.length - 1 && (
                  <div className={`w-0.5 h-12 ${
                    milestone.status === 'completed' ? 'bg-green-400' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-white">{milestone.title}</h4>
                  <span className="text-sm text-gray-400">{milestone.date}</span>
                </div>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                  milestone.status === 'completed' ? 'bg-green-900 text-green-400' :
                  milestone.status === 'in-progress' ? 'bg-blue-900 text-blue-400' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {milestone.status.replace('-', ' ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completion Progress */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Overall Progress</h3>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Project Completion</span>
            <span className="text-white font-bold">{projectData.completion}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-1000"
              style={{ width: `${projectData.completion}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">3</div>
              <div className="text-sm text-gray-400">Milestones Done</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">1</div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-400">2</div>
              <div className="text-sm text-gray-400">Upcoming</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamTab = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Project Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projectData.team.map((member, index) => (
            <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
              <img 
                src={member.avatar} 
                alt={member.name}
                className="w-16 h-16 rounded-full border-2 border-gray-600"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-white">{member.name}</h4>
                <p className="text-gray-400">{member.role}</p>
                <div className="flex space-x-2 mt-2">
                  <button className="text-blue-400 hover:text-blue-300 text-sm">Message</button>
                  <button className="text-green-400 hover:text-green-300 text-sm">Connect</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Join the Team</h3>
        <p className="text-gray-400 mb-4">
          We're looking for passionate individuals to help scale this project. Open positions:
        </p>
        <div className="space-y-3">
          {['Solar Technician', 'Community Manager', 'Data Analyst', 'Blockchain Developer'].map((position, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div>
                <div className="font-medium text-white">{position}</div>
                <div className="text-sm text-gray-400">Full-time • Remote</div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderImpactTab = () => (
    <div className="space-y-6">
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-900 to-emerald-900 border border-green-500 rounded-xl p-6 text-center">
          <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white">{projectData.impact.households}</div>
          <div className="text-green-300">Households Powered</div>
        </div>
        <div className="bg-gradient-to-br from-blue-900 to-cyan-900 border border-blue-500 rounded-xl p-6 text-center">
          <Building className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white">{projectData.impact.jobsCreated}</div>
          <div className="text-blue-300">Jobs Created</div>
        </div>
        <div className="bg-gradient-to-br from-orange-900 to-amber-900 border border-orange-500 rounded-xl p-6 text-center">
          <Wind className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white">{projectData.impact.co2Reduction}</div>
          <div className="text-orange-300">CO₂ Reduction/Year</div>
        </div>
      </div>

      {/* Community Benefits */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Community Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectData.impact.communityBenefits.map((benefit, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-white">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Environmental Impact</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Carbon Offset Equivalent</span>
            <span className="text-white font-semibold">3,200 cars off the road</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Trees Planted Equivalent</span>
            <span className="text-white font-semibold">180,000 mature trees</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Energy Independence</span>
            <span className="text-white font-semibold">100% renewable</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGalleryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectData.gallery.map((item) => (
          <div key={item.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-2xl transition-all">
            <div className="aspect-video bg-gray-700 relative">
              {item.type === 'video' ? (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-80" />
                </div>
              ) : (
                <img 
                  src={item.url} 
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute top-2 right-2">
                <button className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <p className="text-white font-medium">{item.caption}</p>
              <div className="flex space-x-2 mt-2">
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center space-x-1">
                  <Download size={14} />
                  <span>Download</span>
                </button>
                <button className="text-green-400 hover:text-green-300 text-sm flex items-center space-x-1">
                  <Share2 size={14} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Project Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(projectData.status)}`}>
                  {projectData.status.charAt(0).toUpperCase() + projectData.status.slice(1)}
                </span>
                <span className="text-gray-400 text-sm">{projectData.stage}</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {projectData.name}
              </h1>
              <div className="flex items-center space-x-4 text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  <span>{projectData.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Started {projectData.timeline.start}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-3 rounded-lg transition-colors ${
                  isBookmarked 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <Bookmark className="w-5 h-5" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  isFollowing 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow Project'}
              </button>
              <button className="p-3 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
              { id: 'progress', label: 'Progress', icon: <TrendingUp size={18} /> },
              { id: 'team', label: 'Team', icon: <Users size={18} /> },
              { id: 'impact', label: 'Impact', icon: <Heart size={18} /> },
              { id: 'gallery', label: 'Gallery', icon: <Eye size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'progress' && renderProgressTab()}
        {activeTab === 'team' && renderTeamTab()}
        {activeTab === 'impact' && renderImpactTab()}
        {activeTab === 'gallery' && renderGalleryTab()}
      </div>

      {/* Quick Actions Footer */}
      <div className="border-t border-gray-700 bg-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <div className="text-gray-400">
              Need help? <button className="text-blue-400 hover:text-blue-300">Contact the team</button>
            </div>
            <div className="flex space-x-3">
              <button className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Join Discussion
              </button>
              <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
                Invest in Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailView;