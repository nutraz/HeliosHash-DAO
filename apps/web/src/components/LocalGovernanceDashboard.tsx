import React, { useState } from "react";
import AadhaarKYCDashboard from "@/components/AadhaarKYCDashboard";
import AgriculturalLandDashboard from "@/components/AgriculturalLandDashboard";
import UrgamValleyPilotDashboard from "@/components/UrgamValleyPilotDashboard";
import UPComplianceDashboard from "@/components/UPComplianceDashboard";

// Mock child components for now
const PanchayatDashboard = () => (
  <div>
    <h3>Gram Panchayat Status</h3>
    <p>Baghpat District, Uttar Pradesh (Code: UP0908)</p>
    <p>Village governance system operational</p>
    <button>Generate Offline Proposal</button>
  </div>
);

const SHGOnboarding = () => (
  <div>
    <h3>SHG Bulk Onboarding</h3>
    <p>Baghpat Mahila Samuh</p>
    <p>SHG registration and management</p>
    <button>Onboard SHG Members</button>
  </div>
);

const LocalGovernanceDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("panchayat");

  const tabs = [
    { id: "panchayat", label: "Panchayat", component: PanchayatDashboard },
    { id: "land", label: "Land Records", component: AgriculturalLandDashboard },
    { id: "aadhaar", label: "Aadhaar KYC", component: AadhaarKYCDashboard },
    {
      id: "compliance",
      label: "UP Compliance",
      component: UPComplianceDashboard,
    },
    { id: "shg", label: "SHG Onboarding", component: SHGOnboarding },
    {
      id: "urgam",
      label: "Urgam Valley",
      component: UrgamValleyPilotDashboard,
    },
  ];

  const ActiveComponent =
    tabs.find((tab) => tab.id === activeTab)?.component || PanchayatDashboard;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">🏛️ Local Governance Integration</h1>
        <div className="text-lg text-gray-600 mt-2">Baghpat, Uttar Pradesh</div>
      </header>

      {/* Tab Navigation */}
      <nav className="mb-6">
        <div role="tablist" className="grid grid-cols-6 gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`p-3 text-center border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 font-semibold"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      <main>
        <ActiveComponent />
      </main>
    </div>
  );
};

export default LocalGovernanceDashboard;
