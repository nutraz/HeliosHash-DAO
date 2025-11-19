import type { ContractInfo } from '@helioshash/types';

export type SDKOptions = {
  baseUrl?: string;
};

export function createClient(options?: SDKOptions) {
  const base = options?.baseUrl ?? 'http://localhost:8000';

  return {
    async getContractInfo(name: string): Promise<ContractInfo> {
      // placeholder request — replace with real endpoint or canister calls
      const res = await fetch(`${base}/api/contracts/${encodeURIComponent(name)}`);
      if (!res.ok) throw new Error(`Failed to fetch contract ${name}`);
      return (await res.json()) as ContractInfo;
    },
  };
}

export default createClient;
