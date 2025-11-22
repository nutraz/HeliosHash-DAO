"use client";

import React from 'react';
import UserProfileCard from '../dashboard/UserProfileCard';
import StatsCards from '../dashboard/StatsCards';

export interface ProfileStats {
  contributions: number;
  rewards: number;
  projectCount: number;
}

export interface ProfileSectionProps {
  user: any;
  balance: number;
  stats: ProfileStats;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user, balance, stats }) => {
  // Map HHDAO stats into the generic StatsCards shape
  const mappedStats = {
    projectsStarted: stats.projectCount,
    projectsHelped: stats.contributions,
    membersAdded: stats.rewards,
  };

  return (
    <div className="space-y-6">
      <UserProfileCard user={user} balance={balance} />
      <StatsCards stats={mappedStats} />
    </div>
  );
};

export default ProfileSection;
