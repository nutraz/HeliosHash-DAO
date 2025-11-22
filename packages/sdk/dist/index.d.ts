import type { ContractInfo } from '@helioshash/types';
export type SDKOptions = {
    baseUrl?: string;
};
export declare function createClient(options?: SDKOptions): {
    getContractInfo(name: string): Promise<ContractInfo>;
};
export default createClient;
