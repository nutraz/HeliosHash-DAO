import { treasury } from '@/declarations/treasury';
import type { _SERVICE as TreasuryService } from '@/declarations/treasury/treasury.did';
import { logger } from '@/utils/logger';
import { retry } from '@/utils/retry';
// Relax DFINITY actor types to `any` to avoid namespace-as-type TS errors
import { Principal } from '@dfinity/principal';
import { WalletError, WalletErrorCodes } from './errors';

export class TreasuryIntegrationService {
  private treasuryActor: any = null;

  constructor(private identity: any | null = null) {}

  private async getTreasuryActor(): Promise<any> {
    if (!this.treasuryActor) {
      // Patch: allow stubbed actor for local build
      this.treasuryActor = (await treasury.createActor()) as any;
    }
    return this.treasuryActor;
  }

  async getBalance(principal: Principal): Promise<bigint> {
    return retry(
      async () => {
        try {
          const actor = await this.getTreasuryActor();
          const balance = await actor.balanceOf(principal);
          return balance;
        } catch (error) {
          logger.error('Failed to fetch balance', { principal: principal.toText(), error });
          throw new WalletError(
            'Unable to fetch balance from treasury',
            WalletErrorCodes.BALANCE_FETCH_ERROR,
            error
          );
        }
      },
      {
        maxAttempts: 3,
        backoffMs: 1000,
        onRetry: (attempt, error) => {
          logger.warn(`Balance fetch retry ${attempt}`, { error });
        },
      }
    );
  }

  async getTransactions(
    principal: Principal,
    limit: number = 50,
    offset: number = 0
  ): Promise<any[]> {
    return retry(
      async () => {
        try {
          const actor = await this.getTreasuryActor();
          return await actor.getTransactions(principal, BigInt(limit), BigInt(offset));
        } catch (error) {
          logger.error('Failed to fetch transactions', { principal: principal.toText(), error });
          throw new WalletError(
            'Unable to fetch transactions from treasury',
            WalletErrorCodes.TRANSACTION_ERROR,
            error
          );
        }
      },
      {
        maxAttempts: 3,
        backoffMs: 1000,
      }
    );
  }

  async getPendingRewards(principal: Principal): Promise<bigint> {
    return retry(
      async () => {
        try {
          const actor = await this.getTreasuryActor();
          return await actor.getPendingRewards(principal);
        } catch (error) {
          logger.error('Failed to fetch pending rewards', { principal: principal.toText(), error });
          throw new WalletError(
            'Unable to fetch pending rewards',
            WalletErrorCodes.TREASURY_ERROR,
            error
          );
        }
      },
      {
        maxAttempts: 3,
        backoffMs: 1000,
      }
    );
  }

  async getStakedAmount(principal: Principal): Promise<bigint> {
    return retry(
      async () => {
        try {
          const actor = await this.getTreasuryActor();
          return await actor.getStakedAmount(principal);
        } catch (error) {
          logger.error('Failed to fetch staked amount', { principal: principal.toText(), error });
          throw new WalletError(
            'Unable to fetch staked amount',
            WalletErrorCodes.TREASURY_ERROR,
            error
          );
        }
      },
      {
        maxAttempts: 3,
        backoffMs: 1000,
      }
    );
  }
}
