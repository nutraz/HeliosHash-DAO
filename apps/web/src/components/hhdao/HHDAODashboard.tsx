"use client";

import { useState } from "react";
import ProfileSection from "@/components/hhdao/ProfileSection";
import SidebarNavigation from "@/components/hhdao/SidebarNavigation";
import DashboardView from "@/components/hhdao/DashboardView";

export default function HHDAODashboard() {
  const [activePanel, setActivePanel] = useState<string>("projects");

  return (
    <div className="flex gap-6">
      <aside className="w-72">
        <ProfileSection />
        <SidebarNavigation setActivePanel={setActivePanel} />
      </aside>
      <main className="flex-1">
        <DashboardView activePanel={activePanel} />
      </main>
    </div>
  );
}
