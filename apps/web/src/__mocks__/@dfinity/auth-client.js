export const AuthClient = {
  create: vi.fn().mockResolvedValue({
    isAuthenticated: vi.fn().mockReturnValue(Promise.resolve(false)),
    login: vi.fn(),
    logout: vi.fn(),
    getIdentity: vi.fn(),
    tryCompleteAuthentication: vi.fn()
  })
};

export default { AuthClient };
