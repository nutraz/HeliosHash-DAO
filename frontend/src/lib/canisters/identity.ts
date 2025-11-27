import { createActor } from '@/lib/actorFactory';

// Minimal IDL for identity canister that may expose minting or registration
// methods. These names are best-effort; if the real canister differs the
// functions will no-op gracefully.
const idlFactory = ({ IDL }: any) =>
  IDL.Service({
    mint_id_nft: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], []),
    register_principal: IDL.Func([IDL.Text], [IDL.Bool], []),
    get_profile: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
  });

export async function getIdentityActor(identity?: any) {
  const canisterId = process.env.NEXT_PUBLIC_IDENTITY_CANISTER_ID || process.env.NEXT_PUBLIC_IDENTITY_CANISTER;
  if (!canisterId) {
    // No identity canister configured; return null so callers can fallback.
    return null;
  }

  try {
    const actor = await createActor(canisterId, idlFactory, identity as any);
    return actor;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to create identity actor', e);
    return null;
  }
}

export async function ensureKycAndMint(identity: any, principalText: string, profileMeta: { name?: string; email?: string }) {
  try {
    // Call backend KYC endpoint which should return { status: 'approved' }
    const res = await fetch('/api/kyc', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ principal: principalText, profile: profileMeta }),
    });
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn('KYC endpoint returned non-ok status', res.status);
      return { kyc: 'unknown' };
    }
    const body = await res.json();
    const kycStatus = body?.status || body?.kycStatus || 'unknown';

    if (kycStatus === 'approved') {
      const actor = await getIdentityActor(identity);
      if (!actor) return { kyc: 'approved', minted: false };

      // Try common mint method names; handle absence gracefully
      try {
        if (typeof actor.mint_id_nft === 'function') {
          const minted = await actor.mint_id_nft(principalText, JSON.stringify(profileMeta));
          return { kyc: 'approved', minted: !!minted };
        }
        if (typeof actor.register_principal === 'function') {
          const ok = await actor.register_principal(principalText);
          return { kyc: 'approved', minted: !!ok };
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Identity canister call failed', e);
        return { kyc: 'approved', minted: false };
      }
    }

    return { kyc: kycStatus };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('KYC + mint flow failed', e);
    return { kyc: 'error' };
  }
}
