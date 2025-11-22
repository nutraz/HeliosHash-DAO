"use client"

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import SidebarNavigation from "./SidebarNavigation";
import NFTCollection from "./NFTCollection";
import OpportunitiesPanel from "./OpportunitiesPanel";
import ProjectHub from "./ProjectHub";
import RewardsPanel from "./RewardsPanel";
import SocialHub from "./SocialHub";
import DAOCenter from "./DAOCenter";
import UrgamUDashboard from "./UrgamUDashboard";

export default function MainDashboard() {
  const [activeModule, setActiveModule] = useState("projects");

  const renderModule = () => {
    switch (activeModule) {
      case "wallet":
        // Create a simple wallet view instead of using WalletPanel with complex props
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Wallet</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Balance</h3>
                <p className="text-3xl font-bold text-blue-600">0 HHU</p>
                <p className="text-sm text-blue-500">HeliosHash Utility Tokens</p>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded text-center">
                  <div className="text-sm text-gray-500">Contributions</div>
                  <div className="text-xl font-bold">0</div>
                </div>
                <div className="p-4 bg-gray-50 rounded text-center">
                  <div className="text-sm text-gray-500">Rewards</div>
                  <div className="text-xl font-bold">0 HHU</div>
                </div>
                <div className="p-4 bg-gray-50 rounded text-center">
                  <div className="text-sm text-gray-500">Projects</div>
                  <div className="text-xl font-bold">0</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded">
                <h3 className="text-lg font-semibold mb-2">Recent Transactions</h3>
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              </div>
            </div>
          </div>
        );
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
      case "urgam":
        return <UrgamUDashboard />;
      default:
        return <ProjectHub />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <aside className="w-64 bg-white shadow-sm">
          <SidebarNavigation />
        </aside>
        <main className="flex-1 p-6">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}
