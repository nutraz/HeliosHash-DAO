import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Actor, HttpAgent } from "@dfinity/agent";
import { createActor, treasury } from "../index";

// Mock the idlFactory
vi.mock("../treasury.did.js", () => ({
  idlFactory: vi.fn(),
}));

// Mock @dfinity/agent
vi.mock("@dfinity/agent", () => ({
  Actor: {
    createActor: vi.fn(),
  },
  HttpAgent: vi.fn(),
}));

describe("createActor", () => {
  const canisterId = "test-canister-id";
  const mockAgentOptions = { host: "http://localhost:8000" };
  const mockOptions = { agentOptions: mockAgentOptions };
  const mockActor = { test: "actor" };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(HttpAgent).mockImplementation(
      () =>
        ({
          fetchRootKey: vi.fn().mockResolvedValue(undefined),
        } as any)
    );
    vi.mocked(Actor.createActor).mockReturnValue(mockActor as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create an HttpAgent with provided options", () => {
    createActor(canisterId, mockOptions);

    expect(HttpAgent).toHaveBeenCalledWith(mockAgentOptions);
  });

  it("should create an HttpAgent with empty options if none provided", () => {
    createActor(canisterId);

    expect(HttpAgent).toHaveBeenCalledWith({});
  });

  it("should fetch root key in non-production environment", async () => {
    vi.stubEnv("NODE_ENV", "development");

    const mockFetchRootKey = vi.fn().mockResolvedValue(undefined);
    vi.mocked(HttpAgent).mockImplementation(
      () =>
        ({
          fetchRootKey: mockFetchRootKey,
        } as any)
    );

    await createActor(canisterId);

    expect(mockFetchRootKey).toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("should not fetch root key in production environment", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const mockFetchRootKey = vi.fn().mockResolvedValue(undefined);
    vi.mocked(HttpAgent).mockImplementation(
      () =>
        ({
          fetchRootKey: mockFetchRootKey,
        } as any)
    );

    await createActor(canisterId);

    expect(mockFetchRootKey).not.toHaveBeenCalled();

    vi.unstubAllEnvs();
  });

  it("should create an Actor with correct parameters", () => {
    const mockAgentInstance = {
      agent: "instance",
      fetchRootKey: vi.fn().mockResolvedValue(undefined),
    };
    vi.mocked(HttpAgent).mockReturnValue(mockAgentInstance as any);

    createActor(canisterId, mockOptions);

    expect(Actor.createActor).toHaveBeenCalledWith(
      expect.any(Function), // idlFactory
      {
        agent: mockAgentInstance,
        canisterId,
      }
    );
  });

  it("should return the created Actor", () => {
    const result = createActor(canisterId);

    expect(result).toBe(mockActor);
  });
});

describe("treasury", () => {
  it("should export createActor function", () => {
    expect(treasury.createActor).toBe(createActor);
  });
});
