import React, { useState } from "react";
import { 
  Zap, 
  Users, 
  TrendingUp, 
  MapPin, 
  Award, 
  Wallet, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Sun,
  Wind,
  Battery,
  Building,
  Eye,
  ArrowUpRight,
  MoreHorizontal,
  Calendar,
  Target,
  BarChart3
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  type: 'solar' | 'wind' | 'hydro' | 'mining' | 'storage';
  status: 'active' | 'development' | 'planned';
  location: string;
  capacity: string;
  completion: number;
  energyOutput: string;
  lastUpdated: string;
}

interface MetricCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const DashboardView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'analytics'>('overview');

  // Sample user data
  const userData = {
    name: "Alex Chen",
    role: "Community Manager",
    joinDate: "2023-11-15",
    points: 1250,
    tier: "Gold Member"
  };

  // Key metrics data
  const metrics: MetricCard[] = [
    {
      title: "Total Energy Generated",
      value: "45.2 MWh",
      change: "+12.5%",
      icon: <Zap className="w-6 h-6" />,
      color: "text-yellow-500"
    },
    {
      title: "Active Projects",
      value: "8",
      change: "+2",
      icon: <Building className="w-6 h-6" />,
      color: "text-blue-500"
    },
    {
      title: "Community Members",
      value: "1,247",
      change: "+5.2%",
      icon: <Users className="w-6 h-6" />,
      color: "text-green-500"
    },
    {
      title: "Carbon Offset",
      value: "28.5t",
      change: "+8.1%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-emerald-500"
    }
  ];

  // Recent projects data
  const projects: Project[] = [
    {
      id: '1',
      name: 'Delhi Solar Mining Hub',
      type: 'solar',
      status: 'active',
      location: 'Delhi, IN',
      capacity: '5 MW',
      completion: 85,
      energyOutput: '18.5 MWh/day',
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      name: 'Rajasthan Wind Farm',
      type: 'wind',
      status: 'development',
      location: 'Jaisalmer, IN',
      capacity: '50 MW',
      completion: 45,
      energyOutput: '125 MWh/day',
      lastUpdated: '1 day ago'
    },
    {
      id: '3',
      name: 'Mumbai Battery Storage',
      type: 'storage',
      status: 'active',
      location: 'Mumbai, IN',
      capacity: '20 MWh',
      completion: 60,
      energyOutput: 'Grid Support',
      lastUpdated: '3 hours ago'
    },
    {
      id: '4',
      name: 'Hyderabad Mining Facility',
      type: 'mining',
      status: 'active',
      location: 'Hyderabad, IN',
      capacity: '10 MW',
      completion: 90,
      energyOutput: '45 MWh/day',
      lastUpdated: '5 hours ago'
    }
  ];

  // Recent activity data
  const activities = [
    {
      id: 1,
      type: 'project_update',
      project: 'Delhi Solar Mining Hub',
      action: 'Phase 2 completed',
      user: 'Priya Sharma',
      time: '2 hours ago',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />
    },
    {
      id: 2,
      type: 'new_member',
      project: 'Community',
      action: 'Joined HHDAO',
      user: 'Raj Kumar',
      time: '4 hours ago',
      icon: <Users className="w-5 h-5 text-blue-500" />
    },
    {
      id: 3,
      type: 'energy_milestone',
      project: 'All Projects',
      action: 'Reached 45 MWh total',
      user: 'System',
      time: '6 hours ago',
      icon: <Award className="w-5 h-5 text-yellow-500" />
    },
    {
      id: 4,
      type: 'maintenance',
      project: 'Mumbai Storage',
      action: 'Scheduled maintenance',
      user: 'Operations Team',
      time: '1 day ago',
      icon: <AlertCircle className="w-5 h-5 text-orange-500" />
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'development': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'solar': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'wind': return <Wind className="w-5 h-5 text-blue-500" />;
      case 'hydro': return <Building className="w-5 h-5 text-cyan-500" />;
      case 'mining': return <Zap className="w-5 h-5 text-gray-600" />;
      case 'storage': return <Battery className="w-5 h-5 text-green-500" />;
      default: return <Building className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {userData.name}!</h1>
            <p className="text-blue-100 mt-1">Here's what's happening with your projects today.</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Community Tier</div>
            <div className="text-lg font-bold">{userData.tier}</div>
            <div className="text-sm text-blue-200">{userData.points} points</div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.color.replace('text', 'bg')} bg-opacity-10`}>
                {metric.icon}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">{metric.title}</div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              </div>
            </div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>{metric.change} from last period</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(project.type)}
                  <div>
                    <div className="font-medium text-gray-900">{project.name}</div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{project.capacity}</div>
                  <div className="text-sm text-gray-500">{project.completion}% complete</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              See all
            </button>
          </div>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-500">
                    {activity.project} • {activity.user} • {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Energy Production Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Energy Production</h3>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="h-64 bg-gradient-to-b from-blue-50 to-white rounded-lg border border-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Energy production chart for {timeRange} will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">All Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(project.type)}
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{project.name}</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>{project.capacity}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {project.lastUpdated}</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{project.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.completion}%` }}
                  ></div>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Advanced Analytics</h3>
        <div className="text-center text-gray-500 py-12">
          <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-lg">Advanced analytics dashboard coming soon!</p>
          <p className="text-sm mt-2">Track performance metrics, ROI, and community impact.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Monitor your projects and community impact in real-time
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{userData.name}</div>
                  <div className="text-sm text-gray-500">{userData.role}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white p-1 rounded-xl border border-gray-200 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'projects', label: 'Projects', icon: <Building className="w-4 h-4" /> },
            { id: 'analytics', label: 'Analytics', icon: <Target className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        {activeView === 'overview' && renderOverview()}
        {activeView === 'projects' && renderProjects()}
        {activeView === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};

export default DashboardView;