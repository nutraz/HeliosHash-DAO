import { User, Project, NFT, Post } from './types';

export const userData: User = {
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
    { id: 6, name: "Helios#Baghpat Village DAO", image: "https://api.dicebear.com/7.x/shapes/svg?seed=baghpat&backgroundColor=22c55e", projectId: 6, community: "ICP Solar Village Network" },
    { id: 7, name: "UrgamU Delhi Solar Mining", image: "https://api.dicebear.com/7.x/shapes/svg?seed=urgamu&backgroundColor=f59e0b", projectId: 7, community: "HeliosHash Mining DAO" },
    { id: 8, name: "Agricultural Solar Pumps", image: "https://api.dicebear.com/7.x/shapes/svg?seed=farm&backgroundColor=ec4899", projectId: null, community: "Agri-Energy Network" },
    { id: 9, name: "Coastal Wind Project", image: "https://api.dicebear.com/7.x/shapes/svg?seed=wind&backgroundColor=14b8a6", projectId: null, community: "Renewable Coast Alliance" }
  ]
};

export const projects: Project[] = [
  {
    id: 1,
    name: "Solar Bitcoin Mining Hub",
    stage: "functioning",
    color: "green",
    size: "5 MW",
    energySupply: "Bitcoin Mining Operation",
    surplus: "School & Hospital",
    completion: 100,
    funding: "₹2.5 Cr",
    isLive: true,
    location: "Rural Area, Maharashtra",
    status: "active",
    liveData: { panels: 850, currentOutput: 4.8, todayEnergy: 38.5, uptime: "99.2%" },
    opportunities: [ { type: "Security Guard", positions: 2 }, { type: "Electrical Inspector", positions: 1 }, { type: "Maintenance Tech", positions: 3 } ]
  },
  {
    id: 2,
    name: "EV Charging Network",
    stage: "tech-setup",
    color: "yellow",
    size: "2 MW",
    energySupply: "EV Charging Stations",
    surplus: "Community Center",
    completion: 65,
    funding: "₹1.2 Cr",
    isLive: false,
    location: "Urban Area, Delhi",
    status: "in-progress",
    opportunities: [ { type: "Civil Engineer", positions: 1 }, { type: "Funding Required", amount: "₹30L" }, { type: "Supplier - Charging Units", positions: 1 } ]
  },
  {
    id: 3,
    name: "Data Center Green Power",
    stage: "solar-setup",
    color: "orange",
    size: "10 MW",
    energySupply: "Data Center",
    surplus: "Hospital",
    completion: 45,
    funding: "₹5 Cr",
    isLive: false,
    location: "Industrial Area, Pune",
    status: "in-progress",
    opportunities: [ { type: "Solar Panel Supplier", positions: 1 }, { type: "Civil Contractor", positions: 1 }, { type: "Project Auditor", positions: 1 } ]
  },
  {
    id: 4,
    name: "Temple Community Solar",
    stage: "civil-works",
    color: "blue",
    size: "500 KW",
    energySupply: "Temple & Community",
    surplus: "Local Residents",
    completion: 30,
    funding: "₹60L",
    isLive: false,
    location: "Rural Area, Tamil Nadu",
    status: "in-progress",
    opportunities: [ { type: "Electrical Contractor", positions: 2 }, { type: "NFT Art Creator", positions: 1 }, { type: "Tech Support", positions: 1 } ]
  },
  {
    id: 5,
    name: "School Solar Initiative",
    stage: "applied",
    color: "grey",
    size: "300 KW",
    energySupply: "School Campus",
    surplus: "Students & Staff",
    completion: 5,
    funding: "₹40L",
    isLive: false,
    location: "Rural Area, Rajasthan",
    status: "pending",
    opportunities: [ { type: "Funding Required", amount: "₹40L" }, { type: "Land Survey", positions: 1 }, { type: "Community Manager", positions: 1 } ]
  },
  {
    id: 6,
    name: "Helios#Baghpat Village DAO",
    stage: "functioning",
    color: "green",
    size: "42 Panels",
    energySupply: "Village Community",
    surplus: "Local Grid",
    completion: 100,
    funding: "₹85L",
    isLive: true,
    location: "Baghpat, Uttar Pradesh",
    status: "active",
    liveData: { panels: 42, currentOutput: 18.5, todayEnergy: 124.3, uptime: "99.8%", temperature: "28°C" },
    opportunities: [ { type: "Community Manager", positions: 1 }, { type: "Solar Technician", positions: 2 } ],
    detailedInfo: {
      location: "Baghpat, Uttar Pradesh",
      type: "India's first ICP-powered solar village DAO",
      capacity: "42 Tier-1 Monocrystalline Panels",
      technology: "Bifacial Solar Technology with MPPT",
      storage: "LiFePO4 Battery Bank - 40 kWh",
      architecture: "Natural building materials - Rammed earth walls",
      governance: "Web3 DAO with $HHU token",
      revenueModel: "Community energy sharing + Grid export",
      partners: ["1WP DAO", "HeliosHash SubDAO", "Local Village Panchayat"],
      milestones: [ { date: "Jan 2024", event: "Project Initiated" }, { date: "Mar 2024", event: "Solar Installation Complete" }, { date: "May 2024", event: "DAO Launch & Token Distribution" }, { date: "Nov 2024", event: "Full Community Integration" } ],
      impact: { co2Saved: "156 tons/year", householdsServed: 35, jobsCreated: 8, communityRevenue: "₹12L/year" }
    }
  },
  {
    id: 7,
    name: "UrgamU Delhi Solar Mining",
    stage: "functioning",
    color: "green",
    size: "50 kW",
    energySupply: "Bitcoin Mining Operation",
    surplus: "Local Community",
    completion: 100,
    funding: "₹65L",
    isLive: true,
    location: "Delhi NCR Region",
    status: "active",
    liveData: { panels: 85, currentOutput: 48.2, todayEnergy: 387.6, uptime: "99.5%", temperature: "26°C", hashrate: "335 TH/s", btcMined: "0.0034 BTC" },
    opportunities: [ { type: "Mining Technician", positions: 2 }, { type: "Energy Engineer", positions: 1 }, { type: "Web3 Developer", positions: 1 } ],
    detailedInfo: {
      location: "Delhi NCR Region",
      type: "Scalable Web3-Integrated Solar Bitcoin Mining RWA",
      capacity: "Phase 1: 50kW → Scaling to 500kW by Year 3",
      technology: "Antminer S21 Hydro with Immersion Cooling",
      storage: "LiFePO4 Battery Bank - 40 kWh (Phase 1)",
      architecture: "Rammed earth 'Miner Ashram' with green roof",
      governance: "HeliosHash DAO with on-chain revenue distribution",
      revenueModel: "7% to Landowner | 93% to DAO Treasury",
      partners: ["HeliosHash DAO", "1WP SubDAO", "Private Landowner"],
      milestones: [ { date: "Q1 2024", event: "DPR Approved & Landowner Agreement Signed" }, { date: "Q2 2024", event: "Phase 1 Deployment - 50kW Live" }, { date: "Q4 2024", event: "DAO Integration & RWA Module Launch" }, { date: "2025-2026", event: "Scaling to 200kW → 500kW" } ],
      impact: { co2Offset: "Natural cooling reduces energy by 90%", btcGenerated: "~0.15 BTC/month (Phase 1)", landownerEarnings: "₹2.34 Cr over 10 years", jobsCreated: 6 }
    }
  }
];

export const posts: Post[] = [
  { id: 1, author: "Community Member 1", content: "Excited to share progress on our solar project! We have completed the civil works phase and moving to installation next week. 🌞", timestamp: new Date(), projectId: 1 },
  { id: 2, author: "Community Member 2", content: "The new EV charging stations are making a huge difference in our community. Thanks to everyone who contributed!", timestamp: new Date(), projectId: 2 },
  { id: 3, author: "Community Member 3", content: "Our data center is now running on 100% renewable energy. This is a huge milestone for our sustainability goals!", timestamp: new Date(), projectId: 3 }
];

export const applicantTypes = [
  { id: 'landowner', label: 'Land Owner', desc: 'Own land for development' },
  { id: 'solar-contractor', label: 'Solar Contractor', desc: 'Solar energy projects' },
  { id: 'bitcoin-mining', label: 'Bitcoin Mining Setup', desc: 'Crypto mining operations' },
  { id: 'civil-contractor', label: 'Civil Contractor', desc: 'Construction projects' },
  { id: 'supplier', label: 'Supplier', desc: 'Material/service supply' },
  { id: 'entrepreneur', label: 'Entrepreneur', desc: 'New project idea' }
];

export const rewardsMarketplace = [
  { name: "Travel", icon: "✈️", vendors: ["MakeMyTrip", "Yatra", "Goibibo"] },
  { name: "Food", icon: "🍔", vendors: ["Zomato", "Swiggy", "Dunzo"] },
  { name: "Hotels", icon: "🏨", vendors: ["OYO", "Airbnb", "Booking.com"] },
  { name: "Shopping", icon: "🛍️", vendors: ["Amazon", "Flipkart", "Myntra"] },
  { name: "Entertainment", icon: "🎬", vendors: ["BookMyShow", "Netflix"] }
];

export const nfts: NFT[] = userData.nftCollection || [];
