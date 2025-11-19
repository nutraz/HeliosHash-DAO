"use client";
import React, { useState } from 'react';
import { 
  Award, Users, TrendingUp, MapPin, Plus, 
  Wallet, Gift, ShoppingBag, Map, MessageSquare, 
  FileText, DollarSign, Send, 
  ArrowDownLeft, Image, Video, 
  Briefcase, Zap, Building, Shield, Wrench, Eye,
  Store, ChevronRight, CheckCircle, Home, Upload, AlertCircle,
  Settings, Menu, X, Bell, Globe, Lock, User, HelpCircle, LogOut,
  ChevronLeft, ArrowLeft
} from 'lucide-react';

const HHDAODashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [filterStage, setFilterStage] = useState('all');
  const [showNFTCollection, setShowNFTCollection] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeSetting, setActiveSetting] = useState('profile');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
        name: "Helios#Baghpat Village DAO",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=baghpat&backgroundColor=22c55e",
        projectId: 6,
        community: "ICP Solar Village Network"
      },
      {
        id: 7,
        name: "UrgamU Delhi Solar Mining",
        image: "https://api.dicebear.com/7.x/shapes/svg?seed=urgamu&backgroundColor=f59e0b",
        projectId: 7,
        community: "HeliosHash Mining DAO"
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

  // ... large legacy dashboard UI intentionally archived

  return (
    <div>
      <h2>Archived HHDAO Dashboard (legacy)</h2>
      <p>This component has been archived into components/archive/hiidao-fusion for consolidation.</p>
    </div>
  );
};

export default HHDAODashboard;
