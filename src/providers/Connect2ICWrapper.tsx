import { createClient } from '@connect2ic/core';
import { defaultProviders } from '@connect2ic/core/providers';
import '@connect2ic/core/style.css';
import { Connect2ICProvider } from '@connect2ic/react';

// Import our canister definitions
import * as dao from '../declarations/dao';
import * as identity from '../declarations/identity';
import * as telemetry from '../declarations/telemetry';

const client = createClient({
  canisters: {
    identity,
    dao,
    telemetry,
  },
  providers: defaultProviders,
  globalProviderConfig: {
    // Optionally provide global configuration for all providers
    host: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943',
    dev: process.env.NODE_ENV !== 'production',
  },
});

export function Connect2ICWrapper({ children }: { children: React.ReactNode }) {
  return <Connect2ICProvider client={client}>{children}</Connect2ICProvider>;
}
