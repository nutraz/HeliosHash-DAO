// Placeholder canister actor loader.
// Tests should mock this module (`vi.mock('@/lib/canister-actors')`).

export const getCanisterActors = async () => {
  // In local/dev this should create actors via generated declarations.
  // For now, return a stub that matches the expected shape so code doesn't crash.
  return {
    hhdao: {
      getProjects: async () => [],
    },
  };
};
