// Minimal stub for OWP token types/constants

export const OWP_TOKEN_DECIMALS = 8;

export type OwpToken = {
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: bigint;
};
