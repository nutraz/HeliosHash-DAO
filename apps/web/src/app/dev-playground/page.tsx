import React from "react";
import JoinModal from "../../components/Auth/JoinModal";
import ProfilePage from "../../components/Profile/ProfilePage";
import ProjectDashboard from "../../components/Project/ProjectDashboard";
import WalletPanel from "../../components/Wallet/WalletPanel";
import ValidatorConsole from "../../components/Validator/ValidatorConsole";
import DisputeCard from "../../components/Dispute/DisputeCard";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <JoinModal />
      <div className="max-w-6xl mx-auto py-8 grid gap-6">
        <ProfilePage />
        <ProjectDashboard />
        <div className="grid grid-cols-2 gap-4">
          <WalletPanel />
          <ValidatorConsole />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Disputes</h3>
          <DisputeCard />
        </div>
      </div>
    </div>
  );
}
