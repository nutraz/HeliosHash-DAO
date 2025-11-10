import { describe, it, expect } from "vitest";
import { sum } from "./sum";

describe("Social Media Framework - Unit Tests", () => {
  it("sum returns correct total", () => {
    const result = sum(2, 3);
    expect(result.total).toBe(5);
    expect(result.a).toBe(2);
    expect(result.b).toBe(3);
  });
});
