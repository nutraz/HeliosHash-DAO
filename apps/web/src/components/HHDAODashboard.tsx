import React, { useState } from 'react';
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
  const [selectedProject, setSelectedProject] = useState(null);
  const [filterStage, setFilterStage] = useState('all');

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
      {
        id: 1,
        name: "Solar Bitcoin Mining Hub",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=bitcoin&backgroundColor=10b981",
        projectId: 1,
        community: "Green Energy Collective"
      },
      {
        id: 2,
        name: "EV Charging Network",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=ev&backgroundColor=eab308",
        projectId: 2,
        community: "Sustainable Transport DAO"
      },
      {
        id: 3,
        name: "Data Center Green Power",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=data&backgroundColor=f97316",
        projectId: 3,
        community: "Tech Infrastructure Hub"
      },
      {
        id: 4,
        name: "Temple Community Solar",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=temple&backgroundColor=3b82f6",
        projectId: 4,
        community: "Community Power Network"
      },
      {
        id: 5,
        name: "School Solar Initiative",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=school&backgroundColor=6366f1",
        projectId: 5,
        community: "Education Energy Alliance"
      },
      {
        id: 6,
        name: "Urban Rooftop Solar",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=rooftop&backgroundColor=8b5cf6",
        projectId: null,
        community: "Urban Solar Collective"
      },
      {
        id: 7,
        name: "Agricultural Solar Pumps",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=farm&backgroundColor=ec4899",
        projectId: null,
        community: "Agri-Energy Network"
      },
      {
        id: 8,
        name: "Coastal Wind Project",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=wind&backgroundColor=14b8a6",
        projectId: null,
        community: "Renewable Coast Alliance"
      }
    ]
  };

  const projects = [
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
      opportunities: [
        { type: "Security Guard", positions: 2 },
        { type: "Electrical Inspector", positions: 1 },
        { type: "Maintenance Tech", positions: 3 }
      ]
    },
    {
      id: 2,
      name: "EV Charging Network",
      stage: "functioning",
      color: "blue",
      size: "10 MW",
      energySupply: "EV Charging Network",
      surplus: "Public Transport",
      completion: 80,
      funding: "₹3 Cr",
      opportunities: [
        { type: "Electrician", positions: 5 },
        { type: "Project Manager", positions: 2 },
        { type: "Software Engineer", positions: 3 }
      ]
    },
    {
      id: 3,
      name: "Data Center Green Power",
      stage: "functioning",
      color: "orange",
      size: "20 MW",
      energySupply: "Data Center",
      surplus: "Grid",
      completion: 90,
      funding: "₹5 Cr",
      opportunities: [
        { type: "Data Engineer", positions: 4 },
        { type: "Energy Consultant", positions: 2 }
      ]
    },
    {
      id: 4,
      name: "Temple Community Solar",
      stage: "functioning",
      color: "blue",
      size: "5 MW",
      energySupply: "Community Solar",
      surplus: "Temple",
      completion: 100,
      funding: "₹2.5 Cr",
      opportunities: [
        { type: "Community Manager", positions: 2 },
        { type: "Solar Technician", positions: 3 }
      ]
    },
    {
      id: 5,
      name: "School Solar Initiative",
      stage: "functioning",
      color: "purple",
      size: "3 MW",
      energySupply: "School Solar",
      surplus: "School",
      completion: 95,
      funding: "₹1.5 Cr",
      opportunities: [
        { type: "Teacher", positions: 1 },
        { type: "Solar Installer", positions: 4 }
      ]
    }
  ];

  return (
    <div className="hh-dashboard">
      <h1>Helios Hash DAO Dashboard</h1>
      {/* Dashboard content will be added here */}
    </div>
  );
};

export default HHDAODashboard;
