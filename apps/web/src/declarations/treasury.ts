// Mock treasury declarations for testing
export const treasury = {
  balanceOf: () => Promise.resolve(BigInt(0)),
  transfer: () => Promise.resolve({ Ok: true }),
  getTransactions: () => Promise.resolve([])
};

export default treasury;
