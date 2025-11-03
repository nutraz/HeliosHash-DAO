import { vi, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import "@testing-library/jest-dom";

// Setup DOM environment
import { cleanup } from "@testing-library/react";

// Fix for jsdom not supporting some APIs
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Setup React context for tests
beforeEach(() => {
  // Ensure React is available globally
  if (!globalThis.React) {
    globalThis.React = React;
  }
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Global mocks
vi.mock("@dfinity/auth-client", () => ({
  AuthClient: {
    create: vi.fn().mockResolvedValue({
      isAuthenticated: vi.fn().mockReturnValue(Promise.resolve(false)),
      login: vi.fn(),
      logout: vi.fn(),
      getIdentity: vi.fn(),
      tryCompleteAuthentication: vi.fn(),
    }),
  },
}));

// Mock window.ic (Internet Computer) object
Object.defineProperty(window, "ic", {
  value: {
    plug: {
      requestConnect: vi.fn(),
      isConnected: vi.fn(),
      createActor: vi.fn(),
      agent: vi.fn(),
    },
  },
  writable: true,
});
