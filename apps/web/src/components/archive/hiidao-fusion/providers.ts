// Lightweight auth provider stubs for local development and testing.
// Replace these with real SDK integrations (Internet Identity, Plug, Stoic, NFID).

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type AuthResult = {
  method: string;
  principal?: string;
  name?: string;
};

export async function connectInternetIdentity(): Promise<AuthResult> {
  await delay(700);
  return { method: 'internet-identity', principal: 'ii-ry7zq-abc123', name: 'ii_user' };
}

export async function connectPlug(): Promise<AuthResult> {
  await delay(600);
  return { method: 'plug', principal: 'plug-7x9k-xyz987', name: 'plug_user' };
}

export async function connectStoic(): Promise<AuthResult> {
  await delay(600);
  return { method: 'stoic', principal: 'stoic-44aa-qqq111', name: 'stoic_user' };
}

export async function connectNFID(): Promise<AuthResult> {
  await delay(600);
  return { method: 'nfid', principal: 'nfid-55bb-zzz222', name: 'nfid_user' };
}
