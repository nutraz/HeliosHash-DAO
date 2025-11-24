"use client";
import React from "react";
import ProfileCard from "@/components/dashboard/ProfileCard";
import QuickActions from "@/components/dashboard/QuickActions";
import NFTGallery from "@/components/dashboard/NFTGallery";
import WalletPanel from "@/components/dashboard/WalletPanel";
import RewardsHubButton from "@/components/dashboard/RewardsHubButton";
import OpportunitiesButton from "@/components/dashboard/OpportunitiesButton";
import SocialHubButton from "@/components/dashboard/SocialHubButton";

const dummyNfts = [
  { id: "1", title: "Membership #1", issuer: "HHDAO", date: "2025-05-28" },
  { id: "2", title: "Validator Badge", issuer: "HHDAO", date: "2025-06-01" },
];

export default function DashboardPage() {
  const actions = [
    { id: "nfts", title: "My NFTs", subtitle: "View collection" },
    { id: "wallet", title: "Wallet", subtitle: "Balances & history" },
    { id: "rewards", title: "Rewards Hub", subtitle: "Redeem" },
    { id: "opps", title: "Opportunities", subtitle: "Jobs & tasks" },
  ];

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <ProfileCard
            name="Dharmendra Sharma"
            roleTags={["Landowner", "Validator"]}
            level={3}
            reputation={720}
            badges={["KYC Verified", "Validator"]}
            onEdit={() => alert("Edit profile")}
            onViewNFTs={() => alert("Open NFTs")}
          />
          <WalletPanel balance={{ ICP: 12.5, USDC: 200, INR: 12000 }} onDeposit={() => alert("Deposit")} onWithdraw={() => alert("Withdraw")} />
          <div className="grid grid-cols-1 gap-3">
            <RewardsHubButton onClick={() => alert("Rewards")} />
            <OpportunitiesButton onClick={() => alert("Opportunities")} />
            <SocialHubButton onClick={() => alert("Social")} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <QuickActions actions={actions.map(a => ({ ...a, onClick: () => alert(a.title) }))} />
          <section>
            <h3 className="text-lg font-semibold my-3">My NFT Collection</h3>
            <NFTGallery items={dummyNfts} onOpen={(id) => alert(`Open NFT ${id}`)} />
          </section>

          <section>
            <h3 className="text-lg font-semibold my-3">Activity Feed</h3>
            <div className="bg-white/80 dark:bg-slate-900/70 p-4 rounded-lg">No activity yet — contribute to your first validator task!</div>
          </section>
        </div>
      </div>
    </main>
  );
}

