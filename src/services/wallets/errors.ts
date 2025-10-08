export class WalletError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'WalletError';
  }
}

export const WalletErrorCodes = {
  BALANCE_FETCH_ERROR: 'BALANCE_FETCH_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  TREASURY_ERROR: 'TREASURY_ERROR',
  TRANSACTION_ERROR: 'TRANSACTION_ERROR',
  INVALID_PRINCIPAL: 'INVALID_PRINCIPAL',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

export type WalletErrorCode = (typeof WalletErrorCodes)[keyof typeof WalletErrorCodes];
