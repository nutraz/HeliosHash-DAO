// @vitest-environment node
import { describe, it, expect } from "vitest";
import { safeHref } from "./urlSafety";

// H15: safeHref is the gate that decides whether the OpenSea permalink renders as a
// clickable <a href> (non-null) or an inert placeholder (null).
describe("safeHref — NFT permalink URL-scheme allowlist (H15)", () => {
  it("allows https/http/ipfs (remain clickable)", () => {
    expect(safeHref("https://opensea.io/assets/0x/1")).toBe("https://opensea.io/assets/0x/1");
    expect(safeHref("http://example.com/a")).toBe("http://example.com/a");
    expect(safeHref("ipfs://bafybeigdyr/x")).toBe("ipfs://bafybeigdyr/x");
  });

  it("rejects javascript: (not clickable)", () => {
    expect(safeHref("javascript:alert(1)")).toBeNull();
    expect(safeHref("JavaScript:alert(1)")).toBeNull();
  });

  it("rejects data: and file: (not clickable)", () => {
    expect(safeHref("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeHref("file:///etc/passwd")).toBeNull();
  });

  it("rejects empty, non-string, and malformed input", () => {
    expect(safeHref("")).toBeNull();
    expect(safeHref(null)).toBeNull();
    expect(safeHref(undefined)).toBeNull();
    expect(safeHref("not a url")).toBeNull();
  });
});
