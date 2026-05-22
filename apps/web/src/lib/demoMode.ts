// H16a: DEMO MODE flag. Next.js exposes env vars as strings, so this is a literal
// string comparison. Production default (var unset) => false, which makes the
// mock "action" services throw "coming soon" instead of returning fake results.
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
