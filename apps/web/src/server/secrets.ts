// H16b: server-only accessor for KYC / privacy secrets.
//
// These env vars must only ever be read from server code, never from a
// client-reachable module. The `server-only` package (which throws at *build*
// time on a client import) is NOT installed in this repo, and adding a dependency
// is outside H16b scope — so the runtime guard below is the equivalent enforcement
// available without a dep change: importing this module in the browser throws.
//
// Future server callers (API routes / server actions) read secrets here and inject
// them into the relevant services (e.g. PrivacyComplianceService's `encryptionKey`
// constructor param).
if (typeof window !== "undefined") {
  throw new Error(
    "apps/web/src/server/secrets.ts is server-only and must not be imported by client code",
  );
}

export function getKycApiKey(): string {
  return process.env.KYC_API_KEY ?? "";
}

export function getKycApiUrl(): string {
  return process.env.KYC_API_URL ?? "https://api.kyc-provider.com";
}

export function getGenderEncryptionKey(): string | undefined {
  return process.env.GENDER_ENCRYPTION_KEY;
}
