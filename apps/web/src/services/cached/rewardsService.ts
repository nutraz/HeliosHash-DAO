import { cache } from '../cache';
import { MockRewardsService } from '../mock/rewardsService';
import { RewardsData, RewardsService, RewardsSource } from '../types';

export class CachedRewardsService implements RewardsService {
  private inner: RewardsService;
  constructor(inner: RewardsService = new MockRewardsService()) {
    this.inner = inner;
  }
  async getRewardsSummary(): Promise<RewardsData> {
    const key = 'rewards:summary';
    const cached = cache.get<RewardsData>(key);
    if (cached) return cached;
    const data = await this.inner.getRewardsSummary();
    cache.set(key, data);
    return data;
  }
  async getRewardsBySource(): Promise<RewardsSource[]> {
    const key = 'rewards:sources';
    const cached = cache.get<RewardsSource[]>(key);
    if (cached) return cached;
    const data = await this.inner.getRewardsBySource();
    cache.set(key, data);
    return data;
  }
  clearCache() {
    cache.clear('rewards:summary');
    cache.clear('rewards:sources');
  }
}

export const cachedRewardsService = new CachedRewardsService();
