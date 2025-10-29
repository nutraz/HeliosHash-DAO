import '@connect2ic/core/style.css';

// Import our canister definitions

// Temporarily disable Connect2IC client due to version conflicts
// const client = createClient({
//   canisters: {
//     // Temporarily comment out canisters due to version conflicts
//     // identity,
//     // dao,
//     // telemetry,
//   },
//   // Temporarily comment out providers due to version conflicts
//   // providers: defaultProviders,
//   globalProviderConfig: {
//     // Optionally provide global configuration for all providers
//     host: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943',
//     dev: process.env.NODE_ENV !== 'production',
//   },
// });

const client = null;

export function Connect2ICWrapper({ children }: { children: React.ReactNode }) {
  // Temporarily disable Connect2IC due to version conflicts
  return <>{children}</>;
}
