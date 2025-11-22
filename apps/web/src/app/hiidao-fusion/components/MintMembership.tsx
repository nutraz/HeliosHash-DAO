"use client";

import React, { useEffect, useState } from 'react';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';
import { createActor } from '../../../lib/actorFactory';
import { resolveCanisterId } from '../../../lib/canisterIds';

const idlFactory: IDL.InterfaceFactory = ({ IDL }) =>
  IDL.Service({
    mint: IDL.Func([IDL.Principal, IDL.Nat, IDL.Vec(IDL.Nat8)], [IDL.Bool], []),
    totalSupply: IDL.Func([], [IDL.Nat], ['query']),
    tierDistribution: IDL.Func([], IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat)), ['query']),
  });

export default function MintMembership() {
  const [total, setTotal] = useState<number | null>(null);
  const [distribution, setDistribution] = useState<Array<{ tier: number; count: number }>>([]);
  const [loading, setLoading] = useState(false);

  const canisterId = resolveCanisterId('nft_membership');

  async function getTotal(actor?: any) {
    try {
      const a = actor ?? (await createActor<any>(canisterId, idlFactory));
      const res = await a.totalSupply();
      setTotal(Number(res ?? 0n));
      // fetch tier distribution if method exists
      try {
        if (a.tierDistribution) {
          const dist = await a.tierDistribution();
          const mapped = (dist || []).map((t: any) => ({ tier: Number(t[0]), count: Number(t[1]) }));
          setDistribution(mapped);
        }
      } catch (err) {
        console.debug('tierDistribution fetch failed', err);
        setDistribution([]);
      }
    } catch (e) {
      console.error('totalSupply error', e);
      setTotal(null);
    }
  }

  useEffect(() => {
    getTotal();
  }, []);

  async function handleMint() {
    setLoading(true);
    try {
      const actor = await createActor<any>(canisterId, idlFactory);
      const ownerText = process.env.NEXT_PUBLIC_DEMO_PRINCIPAL || 'ryjl3-tyaaa-aaaaa-aaaba-cai';
      const owner = Principal.fromText(ownerText);
      const tier = BigInt(1);
      const metadata = new Uint8Array([0]);
      await actor.mint(owner, tier, metadata);
      await getTotal(actor);
    } catch (e) {
      console.error('mint error', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-2">Membership NFT</h3>
      <p className="text-sm mb-3">Total supply: {total === null ? '—' : total}</p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        onClick={handleMint}
        disabled={loading}
      >
        {loading ? 'Minting…' : 'Mint Demo Membership'}
      </button>
    </div>
  );
}
