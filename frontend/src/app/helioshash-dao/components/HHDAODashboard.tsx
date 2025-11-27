"use client"

import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, Users, TrendingUp, MapPin, Plus, 
  Wallet, Gift, ShoppingBag, Map, MessageSquare, 
  FileText, DollarSign, Send, 
  ArrowDownLeft, Image, Video, 
  Briefcase, Zap, Building, Shield, Wrench, Eye,
  Store, ChevronRight, CheckCircle, Home
} from 'lucide-react';

const HHDAODashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filterStage, setFilterStage] = useState('all');
  const [showNFTCollection, setShowNFTCollection] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const applyPositions = () => {
      if (!mapRef.current) return;
      const els = Array.from(mapRef.current.querySelectorAll<HTMLElement>('[data-left]'));
      els.forEach((el) => {
        const left = el.getAttribute('data-left');
        const top = el.getAttribute('data-top');
        if (left) el.style.left = left;
        if (top) el.style.top = top;
      });
    };

    applyPositions();
    window.addEventListener('resize', applyPositions);
    return () => window.removeEventListener('resize', applyPositions);
  }, [filterStage, selectedProject]);

  const userData = {
    name: "Rahul Kumar",
    pfp: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
    rank: "Investor & Collaborator",
    communityRole: "Community Manager",
    stats: {
      projectsStarted: 3,
      projectsHelped: 12,
      membersAdded: 45
    },
    tokenBalance: 15000,
    nftCollection: [
      { id: 1, name: "Solar Bitcoin Mining Hub", image: "https://api.dicebear.com/7.x/shapes/svg?seed=bitcoin&backgroundColor=10b981", projectId: 1, community: "Green Energy Collective" },
      { id: 2, name: "EV Charging Network", image: "https://api.dicebear.com/7.x/shapes/svg?seed=ev&backgroundColor=eab308", projectId: 2, community: "Sustainable Transport DAO" },
      { id: 3, name: "Data Center Green Power", image: "https://api.dicebear.com/7.x/shapes/svg?seed=data&backgroundColor=f97316", projectId: 3, community: "Tech Infrastructure Hub" },
      { id: 4, name: "Temple Community Solar", image: "https://api.dicebear.com/7.x/shapes/svg?seed=temple&backgroundColor=3b82f6", projectId: 4, community: "Community Power Network" },
      { id: 5, name: "School Solar Initiative", image: "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=6366f1", projectId: 5, community: "Education Energy Alliance" },
      { id: 6, name: "Urban Rooftop Solar", image: "https://api.dicebear.com/7.x/shapes/svg?seed=rooftop&backgroundColor=8b5cf6", projectId: null, community: "Urban Solar Collective" },
      { id: 7, name: "Agricultural Solar Pumps", image: "https://api.dicebear.com/7.x/shapes/svg?seed=farm&backgroundColor=ec4899", projectId: null, community: "Agri-Energy Network" },
      { id: 8, name: "Coastal Wind Project", image: "https://api.dicebear.com/7.x/shapes/svg?seed=wind&backgroundColor=14b8a6", projectId: null, community: "Renewable Coast Alliance" }
    ]
  };

  const projects = [
    { id: 1, name: "Solar Bitcoin Mining Hub", stage: "functioning", color: "green", size: "5 MW", energySupply: "Bitcoin Mining Operation", surplus: "School & Hospital", completion: 100, funding: "₹2.5 Cr", opportunities: [ { type: "Security Guard", positions: 2 }, { type: "Electrical Inspector", positions: 1 }, { type: "Maintenance Tech", positions: 3 } ] },
    { id: 2, name: "EV Charging Network", stage: "tech-setup", color: "yellow", size: "2 MW", energySupply: "EV Charging Stations", surplus: "Community Center", completion: 65, funding: "₹1.2 Cr", opportunities: [ { type: "Civil Engineer", positions: 1 }, { type: "Funding Required", amount: "₹30L" }, { type: "Supplier - Charging Units", positions: 1 } ] },
    { id: 3, name: "Data Center Green Power", stage: "solar-setup", color: "orange", size: "10 MW", energySupply: "Data Center", surplus: "Hospital", completion: 45, funding: "₹5 Cr", opportunities: [ { type: "Solar Panel Supplier", positions: 1 }, { type: "Civil Contractor", positions: 1 }, { type: "Project Auditor", positions: 1 } ] },
    { id: 4, name: "Temple Community Solar", stage: "civil-works", color: "blue", size: "500 KW", energySupply: "Temple & Community", surplus: "Local Residents", completion: 30, funding: "₹60L", opportunities: [ { type: "Electrical Contractor", positions: 2 }, { type: "NFT Art Creator", positions: 1 }, { type: "Tech Support", positions: 1 } ] },
    { id: 5, name: "School Solar Initiative", stage: "applied", color: "grey", size: "300 KW", energySupply: "School Campus", surplus: "Students & Staff", completion: 5, funding: "₹40L", opportunities: [ { type: "Funding Required", amount: "₹40L" }, { type: "Land Survey", positions: 1 }, { type: "Community Manager", positions: 1 } ] }
  ];

  const rewardsMarketplace = [
    { name: "Travel", icon: "✈️", vendors: ["MakeMyTrip", "Yatra", "Goibibo"] },
    { name: "Food", icon: "🍔", vendors: ["Zomato", "Swiggy", "Dunzo"] },
    { name: "Hotels", icon: "🏨", vendors: ["OYO", "Airbnb", "Booking.com"] },
    { name: "Shopping", icon: "🛍️", vendors: ["Amazon", "Flipkart", "Myntra"] },
    { name: "Entertainment", icon: "🎬", vendors: ["BookMyShow", "Netflix"] }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, any> = {
      green: { bg: 'bg-green-500', text: 'text-green-400' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-400' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-400' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-400' },
      grey: { bg: 'bg-gray-500', text: 'text-gray-400' }
    };
    return colors[color] || colors.grey;
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <img src={userData.pfp} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
            <div>
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Award className="w-5 h-5" />
                <span className="text-blue-100">{userData.rank}</span>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <Users className="w-4 h-4" />
                <span className="text-sm text-blue-100">{userData.communityRole}</span>
              </div>
            </div>
          </div>
          <Wallet className="w-8 h-8" />
        </div>

        <div className="mt-6 bg-white bg-opacity-20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Token Balance</p>
              <p className="text-3xl font-bold">{userData.tokenBalance.toLocaleString()} HHD</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-1">
                <Send size={16} />
                <span>Send</span>
              </button>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-1">
                <ArrowDownLeft size={16} />
                <span>Receive</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 text-green-400 mb-2">
            <TrendingUp size={20} />
            <span className="text-sm font-medium">Projects Started</span>
          </div>
          <p className="text-3xl font-bold text-white">{userData.stats.projectsStarted}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 text-blue-400 mb-2">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">Projects Helped</span>
          </div>
          <p className="text-3xl font-bold text-white">{userData.stats.projectsHelped}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-2 text-purple-400 mb-2">
            <Users size={20} />
            <span className="text-sm font-medium">Members Added</span>
          </div>
          <p className="text-3xl font-bold text-white">{userData.stats.membersAdded}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button onClick={() => setCurrentView('rewards')} className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6 mb-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
          <Gift className="w-8 h-8 mb-2" />
          <p className="font-bold">Rewards Exchange</p>
          <p className="text-xs mt-1 opacity-90">Redeem tokens</p>
        </button>
        <button onClick={() => setCurrentView('map')} className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all">
          <Map className="w-8 h-8 mb-2" />
          <p className="font-bold">Explore Projects</p>
          <p className="text-xs mt-1 opacity-90">Map view</p>
        </button>
        <button onClick={() => { setCurrentView('community'); setSelectedProject(null); }} className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-6 hover:shadow-2xl hover:scale-105 transition-all">
          <MessageSquare className="w-8 h-8 mb-2" />
          <p className="font-bold">Global Community</p>
          <p className="text-xs mt-1 opacity-90">All projects feed</p>
        </button>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
        <button onClick={() => setShowNFTCollection(!showNFTCollection)} className="w-full p-6 text-left hover:bg-gray-750 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image className="text-purple-400" size={28} />
              <div>
                <h3 className="text-xl font-bold text-white">My NFT Collection</h3>
                <p className="text-sm text-gray-400 mt-1">{userData.nftCollection ? userData.nftCollection.length : 0} projects • Click any NFT to explore the project community and real-time data feed</p>
              </div>
            </div>
            <div className={`transform transition-transform ${showNFTCollection ? 'rotate-180' : ''}`}>
              <ChevronRight className="text-gray-400" size={24} />
            </div>
          </div>
        </button>

        {showNFTCollection && (
          <div className="p-6 pt-0 border-t border-gray-700">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {userData.nftCollection && userData.nftCollection.map((nft) => (
                <button key={nft.id} onClick={() => {
                  if (nft.projectId) {
                    const project = projects.find(p => p.id === nft.projectId);
                    if (project) { setSelectedProject(project); setCurrentView('map'); setShowNFTCollection(false); }
                  } else { import('@/lib/notify').then(({ notify }) => notify.info(`Exploring ${nft.community}... (External project)`)); }
                }} className="group relative bg-gray-900 border-2 border-gray-700 rounded-xl p-3 hover:border-blue-500 hover:shadow-2xl transition-all overflow-hidden">
                  <div className="aspect-square rounded-lg overflow-hidden mb-2 bg-gradient-to-br from-gray-800 to-gray-900">
                    <img src={nft.image} alt={nft.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{nft.name}</h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-1">{nft.community}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-blue-400 font-medium">View Project</span>
                    <ChevronRight className="text-gray-600 group-hover:text-blue-400" size={16} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderRewards = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6 mb-6 shadow-xl">
        <p className="text-lg mb-2">Available Balance</p>
        <p className="text-4xl font-bold">{userData.tokenBalance.toLocaleString()} HHD</p>
        <p className="text-sm mt-2 opacity-90">≈ ₹{(userData.tokenBalance * 10).toLocaleString()}</p>
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
                <button key={vIdx} className="w-full bg-gray-900 bg-opacity-50 hover:bg-blue-900 hover:bg-opacity-30 text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group border border-gray-700 hover:border-blue-500">
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

  const renderMap = () => {
    const filteredProjects = filterStage === 'all' ? projects : projects.filter(p => p.stage === filterStage);

    return (
      <div className="space-y-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-lg">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setFilterStage('all')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStage === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>All Projects</button>
            <button onClick={() => setFilterStage('functioning')} className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${filterStage === 'functioning' ? 'bg-green-600 text-white' : 'bg-green-900 bg-opacity-30 text-green-400 hover:bg-green-900 hover:bg-opacity-50 border border-green-700'}`}><span className="w-3 h-3 rounded-full bg-green-500"></span><span>Functioning</span></button>
            <button onClick={() => setFilterStage('tech-setup')} className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${filterStage === 'tech-setup' ? 'bg-yellow-600 text-white' : 'bg-yellow-900 bg-opacity-30 text-yellow-400 hover:bg-yellow-900 hover:bg-opacity-50 border border-yellow-700'}`}><span className="w-3 h-3 rounded-full bg-yellow-500"></span><span>Tech Setup</span></button>
            <button onClick={() => setFilterStage('solar-setup')} className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${filterStage === 'solar-setup' ? 'bg-orange-600 text-white' : 'bg-orange-900 bg-opacity-30 text-orange-400 hover:bg-orange-900 hover:bg-opacity-50 border border-orange-700'}`}><span className="w-3 h-3 rounded-full bg-orange-500"></span><span>Solar Setup</span></button>
            <button onClick={() => setFilterStage('civil-works')} className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${filterStage === 'civil-works' ? 'bg-blue-600 text-white' : 'bg-blue-900 bg-opacity-30 text-blue-400 hover:bg-blue-900 hover:bg-opacity-50 border border-blue-700'}`}><span className="w-3 h-3 rounded-full bg-blue-500"></span><span>Civil Works</span></button>
            <button onClick={() => setFilterStage('applied')} className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${filterStage === 'applied' ? 'bg-gray-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-600'}`}><span className="w-3 h-3 rounded-full bg-gray-500"></span><span>Applied</span></button>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg h-96 overflow-hidden border border-gray-700">
            <div className="absolute inset-0 opacity-10">
              <Map className="w-full h-full text-blue-500" />
            </div>
            {filteredProjects.map((project) => {
              const colorClasses = getColorClasses(project.color);
              return (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`absolute w-10 h-10 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-2xl hover:scale-125 transition-transform ${colorClasses.bg} ring-4 ring-gray-900`}
                  style={{ left: `${(project.id * 15) + 20}%`, top: `${(project.id * 12) + 25}%` }}
                  aria-label={`Open ${project.name} project`}
                  title={`Open ${project.name}`}
                >
                  <MapPin className="text-white" size={22} />
                </button>
              );
            })}
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2 font-bold text-lg shadow-xl">
          <Plus size={24} />
          <span>Create / Apply for Project</span>
        </button>

        <div className="space-y-4">
          {filteredProjects.map((project) => {
            return (
              <button key={project.id} onClick={() => setSelectedProject(project)} className="w-full bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all text-left">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full ${getColorClasses(project.color).bg} flex items-center justify-center shadow-lg`}>
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{project.size} • {project.energySupply}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">Progress: {project.completion}%</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-green-400 font-medium">{project.funding}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-600" size={24} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProjectDetail = () => {
    if (!selectedProject) return null;
    const colorClasses = getColorClasses(selectedProject.color);
    return (
      <div className="space-y-6">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Size</p>
              <p className="text-2xl font-bold text-white">{selectedProject.size}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Completion</p>
              <p className="text-2xl font-bold text-green-400">{selectedProject.completion}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Funding</p>
              <p className="text-2xl font-bold text-blue-400">{selectedProject.funding}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Stage</p>
              <p className={`text-lg font-bold capitalize ${colorClasses.text}`}>{selectedProject.stage.replace('-', ' ')}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-start space-x-3">
              <Zap className="text-orange-400 mt-1" size={20} />
              <div>
                <p className="font-semibold text-white">Prime Consumer</p>
                <p className="text-gray-400">{selectedProject.energySupply}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Building className="text-blue-400 mt-1" size={20} />
              <div>
                <p className="font-semibold text-white">Surplus Energy Consumer</p>
                <p className="text-gray-400">{selectedProject.surplus}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2"><Briefcase className="text-blue-400" /> <span>Project Opportunities</span></h3>
          <div className="space-y-3">
            {selectedProject.opportunities.map((opp: any, idx: number) => (
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
                      {opp.positions && (<p className="text-sm text-gray-400">{opp.positions} position{opp.positions > 1 ? 's' : ''} available</p>)}
                      {opp.amount && (<p className="text-sm text-green-400 font-medium">{opp.amount} required</p>)}
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg">Apply</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={() => setCurrentView('community')} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center space-x-2 font-bold text-lg shadow-xl">
          <MessageSquare size={24} />
          <span>Open {selectedProject.name} Community Hub</span>
        </button>
      </div>
    );
  };

  const renderCommunity = () => (
    <div className="space-y-6">
      {selectedProject && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">{selectedProject.name} Community</h3>
              <p className="text-sm opacity-90">Real-time project updates and discussions</p>
            </div>
            <button onClick={() => setSelectedProject(null)} className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors">View All Communities</button>
          </div>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">Share with Community</h3>
        <textarea className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" rows={4} placeholder={selectedProject ? `Share updates about ${selectedProject.name}...` : "What's on your mind? Share updates, ideas, or questions..."} />
        <div className="flex items-center justify-between mt-4">
            <div className="flex space-x-2">
            <button aria-label="Attach image" title="Attach image" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"><Image className="text-gray-400" size={20} /></button>
            <button aria-label="Attach video" title="Attach video" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"><Video className="text-gray-400" size={20} /></button>
            <button aria-label="Attach file" title="Attach file" className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"><FileText className="text-gray-400" size={20} /></button>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg">Post</button>
        </div>
      </div>

      {selectedProject && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Project Real-Time Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4"><p className="text-xs text-gray-400 mb-1">Energy Generated</p><p className="text-2xl font-bold text-green-400">{Math.floor(Math.random() * 500) + 100} kWh</p><p className="text-xs text-green-400 mt-1">↑ Live</p></div>
            <div className="bg-gray-900 rounded-lg p-4"><p className="text-xs text-gray-400 mb-1">Active Members</p><p className="text-2xl font-bold text-blue-400">{Math.floor(Math.random() * 50) + 20}</p><p className="text-xs text-blue-400 mt-1">Online now</p></div>
            <div className="bg-gray-900 rounded-lg p-4"><p className="text-xs text-gray-400 mb-1">Token Rewards</p><p className="text-2xl font-bold text-purple-400">{Math.floor(Math.random() * 1000) + 500} HHD</p><p className="text-xs text-purple-400 mt-1">This week</p></div>
            <div className="bg-gray-900 rounded-lg p-4"><p className="text-xs text-gray-400 mb-1">CO₂ Saved</p><p className="text-2xl font-bold text-orange-400">{Math.floor(Math.random() * 100) + 50} kg</p><p className="text-xs text-orange-400 mt-1">Today</p></div>
          </div>
        </div>
      )}

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-white mb-4">Community Moderators</h3>
        <div className="space-y-3">
          {['Priya Singh','Amit Patel','Sarah Johnson'].map((mod, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${mod}`} className="w-10 h-10 rounded-full border-2 border-gray-700" alt={mod} />
                <div><p className="font-semibold text-white">{mod}</p><p className="text-xs text-gray-400">Moderator</p></div>
              </div>
              <button className="bg-blue-900 bg-opacity-50 text-blue-400 border border-blue-700 px-4 py-1 rounded-lg hover:bg-blue-900 hover:bg-opacity-70 transition-colors text-sm font-medium">Message</button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white">{selectedProject ? `${selectedProject.name} - Recent Activity` : 'Recent Activity - All Projects'}</h3>
        {[1,2,3].map((post) => (
          <div key={post} className="bg-gray-800 border border-gray-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-start space-x-3">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=post${post}`} className="w-12 h-12 rounded-full border-2 border-gray-700" alt="User" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div><p className="font-semibold text-white">Community Member {post}</p><p className="text-xs text-gray-400">2 hours ago • {selectedProject ? selectedProject.name : 'EV Charging Network'}</p></div>
                </div>
                <p className="text-gray-300 mb-3">Excited to share progress on our solar project! We have completed the civil works phase and moving to installation next week. 🌞</p>
                <div className="flex items-center space-x-4 text-sm text-gray-400"><button className="hover:text-blue-400 transition-colors">👍 12 Likes</button><button className="hover:text-blue-400 transition-colors">💬 5 Comments</button><button className="hover:text-blue-400 transition-colors">🔄 Share</button></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {currentView !== 'dashboard' && (
              <button onClick={() => { setCurrentView('dashboard'); setSelectedProject(null); }} className="text-blue-400 hover:text-blue-300 font-medium flex items-center space-x-2"><Home size={20} /><span>← Back to Dashboard</span></button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white">HHDAO</h1>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
              <Zap className="text-white" size={24} />
            </div>
          </div>
        </div>

        {selectedProject && (currentView === 'map' || currentView === 'project-detail') ? (
          <div className="mb-6"><h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedProject.name}</h2><button onClick={() => setSelectedProject(null)} className="text-gray-400 hover:text-gray-300 text-sm">← Back to all projects</button></div>
        ) : (
          <div className="mb-6"><h2 className="text-2xl md:text-3xl font-bold text-white">{currentView === 'dashboard' ? 'Dashboard' : currentView === 'rewards' ? 'Rewards Marketplace' : currentView === 'map' ? 'Project Map' : 'Community Hub'}</h2></div>
        )}

        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'rewards' && renderRewards()}
        {currentView === 'map' && !selectedProject && renderMap()}
        {currentView === 'community' && renderCommunity()}
        {selectedProject && (currentView === 'map' || currentView === 'project-detail') && renderProjectDetail()}
      </div>
    </div>
  );
};

export default HHDAODashboard;
