import { RewardsData, RewardsService, RewardsSource } from '../types';

export class MockRewardsService implements RewardsService {
  async getRewardsSummary(): Promise<RewardsData> {
    // Simulate network latency
    await new Promise((r) => setTimeout(r, 500));
    return {
      totalEarned: 250.75,
      thisMonth: 35.25,
      lastMonth: 42.5,
      projected: 40,
    };
  }

  async getRewardsBySource(): Promise<RewardsSource[]> {
    await new Promise((r) => setTimeout(r, 450));
    return [
      { name: 'Mining', amount: 150, percentage: 60 },
      { name: 'Staking', amount: 75, percentage: 30 },
      { name: 'Community', amount: 25.75, percentage: 10 },
    ];
  }
}

export const rewardsService: RewardsService = new MockRewardsService();
