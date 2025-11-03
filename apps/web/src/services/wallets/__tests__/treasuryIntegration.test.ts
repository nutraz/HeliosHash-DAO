import { Principal } from "@dfinity/principal";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { WalletError } from "../errors";
import { TreasuryIntegrationService } from "../treasuryIntegration";

// Mock the treasury module
vi.mock("@/declarations/treasury", () => ({
  treasury: {
    createActor: vi.fn(),
  },
}));

describe("TreasuryIntegrationService", () => {
  let treasuryService: TreasuryIntegrationService;
  let testPrincipal: Principal;
  let mockActor: any;

  beforeEach(() => {
    mockActor = {
      balanceOf: vi.fn().mockResolvedValue(BigInt(1000000)),
      getTransactions: vi
        .fn()
        .mockImplementation((principal, limit, offset) => {
          return Promise.resolve(
            Array(Math.min(Number(limit), 10)).fill({
              id: "1",
              amount: BigInt(100),
            })
          );
        }),
      getPendingRewards: vi.fn().mockResolvedValue(BigInt(500000)),
      getStakedAmount: vi.fn().mockResolvedValue(BigInt(2000000)),
    };

    const { treasury } = require("@/declarations/treasury");
    treasury.createActor.mockResolvedValue(mockActor);

    treasuryService = new TreasuryIntegrationService();
    testPrincipal = Principal.fromText("aaaaa-aa");
  });

  describe("getBalance", () => {
    it("should fetch balance from treasury canister", async () => {
      const balance = await treasuryService.getBalance(testPrincipal);
      expect(balance).toBeDefined();
      expect(typeof balance).toBe("bigint");
      expect(balance).toBe(BigInt(1000000));
    });

    it("should handle errors gracefully", async () => {
      mockActor.balanceOf.mockRejectedValueOnce(new Error("Test error"));
      mockActor.balanceOf.mockRejectedValueOnce(new Error("Test error"));
      mockActor.balanceOf.mockRejectedValueOnce(new Error("Test error"));

      await expect(treasuryService.getBalance(testPrincipal)).rejects.toThrow(
        WalletError
      );
    });

    it("should retry on failure", async () => {
      let attempts = 0;
      mockActor.balanceOf.mockImplementation(async () => {
        attempts++;
        if (attempts < 3) throw new Error("Test error");
        return BigInt(123);
      });

      const balance = await treasuryService.getBalance(testPrincipal);
      expect(attempts).toBeGreaterThan(1);
      expect(balance).toBe(BigInt(123));
    });
  });

  describe("getTransactions", () => {
    it("should fetch transaction history", async () => {
      const txns = await treasuryService.getTransactions(testPrincipal, 10);
      expect(Array.isArray(txns)).toBe(true);
      expect(txns.length).toBeLessThanOrEqual(10);
    });

    it("should handle pagination correctly", async () => {
      const page1 = await treasuryService.getTransactions(testPrincipal, 5, 0);
      const page2 = await treasuryService.getTransactions(testPrincipal, 5, 5);
      expect(Array.isArray(page1)).toBe(true);
      expect(Array.isArray(page2)).toBe(true);
    });
  });

  describe("getPendingRewards", () => {
    it("should fetch pending rewards", async () => {
      const rewards = await treasuryService.getPendingRewards(testPrincipal);
      expect(rewards).toBeDefined();
      expect(typeof rewards).toBe("bigint");
      expect(rewards).toBe(BigInt(500000));
    });
  });

  describe("getStakedAmount", () => {
    it("should fetch staked amount", async () => {
      const staked = await treasuryService.getStakedAmount(testPrincipal);
      expect(staked).toBeDefined();
      expect(typeof staked).toBe("bigint");
      expect(staked).toBe(BigInt(2000000));
    });
  });
});
