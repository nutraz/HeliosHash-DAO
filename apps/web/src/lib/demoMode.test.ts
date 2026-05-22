// @vitest-environment node
import { describe, it, expect, vi, afterEach } from "vitest";
import { isDemoMode } from "./demoMode";
import { icpService } from "../services/icpService";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isDemoMode (H16a)", () => {
  it("is true only for the literal string 'true'", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true");
    expect(isDemoMode()).toBe(true);
  });
  it("is false when unset/empty (production default)", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "");
    expect(isDemoMode()).toBe(false);
  });
  it("is false for any other value", () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "1");
    expect(isDemoMode()).toBe(false);
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "TRUE");
    expect(isDemoMode()).toBe(false);
  });
});

describe("icpService action methods (H16a)", () => {
  it("throw 'coming soon' outside demo mode (no fake success)", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "");
    await expect(icpService.createProject("t", "r", 1, "d")).rejects.toThrow("coming soon");
    await expect(icpService.transferTokens("acct", 1)).rejects.toThrow("coming soon");
    await expect(icpService.createOpportunity("p", "t", "d")).rejects.toThrow("coming soon");
    await expect(icpService.createSocialPost("hi")).rejects.toThrow("coming soon");
  });
  it("return mock results in demo mode", async () => {
    vi.stubEnv("NEXT_PUBLIC_DEMO_MODE", "true");
    await expect(icpService.createProject("t", "r", 1, "d")).resolves.toHaveProperty("id");
    await expect(icpService.transferTokens("acct", 1)).resolves.toHaveProperty("txId");
  });
});
