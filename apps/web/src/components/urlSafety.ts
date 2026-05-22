// H15: outbound links (e.g. the OpenSea `permalink`, which can come from an
// untrusted API response) must never be bound directly to an <a href>. Allowlist
// safe URL schemes only (https/http/ipfs); return null for anything else
// (javascript:/data:/file:/…) so callers render an inert placeholder instead of a
// clickable link.
export function safeHref(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.trim() === "") return null;
  try {
    const scheme = new URL(raw).protocol.toLowerCase();
    if (scheme === "https:" || scheme === "http:" || scheme === "ipfs:") return raw;
    return null;
  } catch {
    return null;
  }
}
