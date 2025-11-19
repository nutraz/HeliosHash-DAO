declare global {
  interface EthereumRequestArgs {
    method: string;
    params?: any[] | object;
  }

  interface EthereumProvider {
    request: (args: EthereumRequestArgs) => Promise<any>;
    on?: (event: string, handler: (...args: any[]) => void) => void;
    removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    isMetaMask?: boolean;
    // Some wallets expose this for convenience
    selectedAddress?: string | null;
  }

  interface Window {
    ethereum?: EthereumProvider;
  }
}

export {};
