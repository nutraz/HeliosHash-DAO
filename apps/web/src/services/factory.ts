import { cachedRewardsService } from './cached/rewardsService';
import { cachedWalletService } from './cached/walletService';
import { treasuryService, TreasuryService } from './treasuryService';
import { RewardsService, WalletService } from './types';

// NOTE: We re-use existing singleton mock instances for now; if class exports are added
// later we can instantiate directly. Factory allows overriding for tests.
export class ServiceFactory {
  private static walletServiceInstance: WalletService | null = null;
  private static rewardsServiceInstance: RewardsService | null = null;
  private static treasuryServiceInstance: TreasuryService | null = null;

  static getWalletService(): WalletService {
    if (!this.walletServiceInstance) this.walletServiceInstance = cachedWalletService;
    return this.walletServiceInstance;
  }

  static getRewardsService(): RewardsService {
    if (!this.rewardsServiceInstance) this.rewardsServiceInstance = cachedRewardsService;
    return this.rewardsServiceInstance;
  }

  static getTreasuryService(): TreasuryService {
    if (!this.treasuryServiceInstance) this.treasuryServiceInstance = treasuryService;
    return this.treasuryServiceInstance;
  }

  static reset(): void {
    this.walletServiceInstance = null;
    this.rewardsServiceInstance = null;
    this.treasuryServiceInstance = null;
  }

  static initialize(
    wallet?: WalletService,
    rewards?: RewardsService,
    treasury?: TreasuryService
  ): void {
    if (wallet) this.walletServiceInstance = wallet;
    if (rewards) this.rewardsServiceInstance = rewards;
    if (treasury) this.treasuryServiceInstance = treasury;
  }
}
