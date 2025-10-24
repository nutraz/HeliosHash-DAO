// e2e/utils/mock-wallet.ts
export class MockWallet {
  static async setup(page: any) {
    // Mock wallet connection by adding ethereum object to window
    await page.addInitScript(() => {
      (window as any).ethereum = {
        request: async (args: any) => {
          if (args.method === 'eth_requestAccounts') {
            return ['0x1234567890abcdef1234567890abcdef12345678'];
          }
          throw new Error('Method not supported');
        }
      };
    });
  }
}
