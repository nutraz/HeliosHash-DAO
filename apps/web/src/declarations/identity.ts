// Mock identity canister declaration for tests
export const createActor = () => ({
  getProfile: async () => ({
    principal: 'test-principal',
    name: 'Test User',
    email: 'test@example.com',
  }),
});
