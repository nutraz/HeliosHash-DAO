"use client";

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import SidebarNavigation from "./SidebarNavigation";
import WalletPanel from "./WalletPanel";
import NFTCollection from "./NFTCollection";
import OpportunitiesPanel from "./OpportunitiesPanel";
import ProjectHub from "./ProjectHub";
import RewardsPanel from "./RewardsPanel";
import SocialHub from "./SocialHub";
import DAOCenter from "./DAOCenter";
import UrgamUDashboard from "./UrgamUDashboard";

export default function MainDashboard() {
  const [activeModule, setActiveModule] = useState<string>("home");

  const renderModule = () => {
    switch (activeModule) {
      case "wallet":
        return <WalletPanel />;
      case "nft":
        return <NFTCollection />;
      case "opportunities":
        return <OpportunitiesPanel />;
      case "projects":
        return <ProjectHub />;
      case "rewards":
        return <RewardsPanel />;
      case "social":
        return <SocialHub />;
      case "dao":
        return <DAOCenter />;
      case "urgamU":
        return <UrgamUDashboard />;
      default:
        return <div className="p-6">Welcome to HeliosHash / UrgamU Platform!</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarNavigation setActiveModule={setActiveModule} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="flex-1 p-4 overflow-auto">{renderModule()}</div>
      </div>
    </div>
  );
}
