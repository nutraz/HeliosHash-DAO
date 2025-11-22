"use client";

import ProjectsPanel from "@/components/hhdao/ProjectsPanel";
import DAOCenterPanel from "@/components/hhdao/DAOCenterPanel";
import UrgamUDelhiPanel from "@/components/hhdao/UrgamUDelhiPanel";
import WalletPanel from "@/components/hhdao/WalletPanel";
import NFTCollection from "@/components/hhdao/NFTCollection";
import OpportunitiesPanel from "@/components/hhdao/OpportunitiesPanel";
import RewardsPanel from "@/components/hhdao/RewardsPanel";
import SocialHubPanel from "@/components/hhdao/SocialHubPanel";

type Props = { activePanel: string };

export default function DashboardView({ activePanel }: Props) {
  switch (activePanel) {
    case 'projects':
      return <ProjectsPanel />;
    case 'dao':
      return <DAOCenterPanel />;
    case 'urgamu-delhi':
      return <UrgamUDelhiPanel />;
    case 'nfts':
      return <NFTCollection />;
    case 'wallet':
      return <WalletPanel />;
    case 'opportunities':
      return <OpportunitiesPanel />;
    case 'rewards':
      return <RewardsPanel />;
    case 'social':
      return <SocialHubPanel />;
    default:
      return <ProjectsPanel />;
  }
}
