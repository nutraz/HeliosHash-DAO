// Create file: tests/mocks/wallet.js
class MockWallet {
  constructor() {
    this.isConnected = false;
    this.address = '0x1234567890123456789012345678901234567890';
  }

  async connect() {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.isConnected = true;
    return this.address;
  }

  async disconnect() {
    this.isConnected = false;
    return true;
  }
}

// Export for use in tests
global.mockWallet = new MockWallet();

// Mock window.ethereum for tests
if (typeof window !== 'undefined') {
  window.ethereum = {
    request: async ({ method }) => {
      if (method === 'eth_requestAccounts') {
        return [global.mockWallet.address];
      }
      return [];
    },
    on: (event, callback) => {
      // Mock event listeners
    },
    isConnected: () => true
  };
}
