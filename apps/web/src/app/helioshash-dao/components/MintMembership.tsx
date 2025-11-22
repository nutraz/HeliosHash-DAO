"use client";

import React, { useState } from 'react';
import { IDL } from '@dfinity/candid';
import { Principal } from '@dfinity/principal';

const MembershipToken = IDL.Service({
  mint: IDL.Func([IDL.Principal, IDL.Nat, IDL.Vec(IDL.Nat8)], [IDL.Bool], []),
  totalSupply: IDL.Func([], [IDL.Nat], ['query']),
  tierDistribution: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))], ['query']),
});

export default function MintMembership() {
  const [minting, setMinting] = useState(false);
  const [distribution, setDistribution] = useState([]);

  const handleMint = async () => {
    setMinting(true);
    try {
      console.log('Minting membership...');
      // Mock minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Membership minted successfully!');
      alert('Membership minted successfully!');
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting failed. Please try again.');
    } finally {
      setMinting(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Mint HHDAO Membership</h2>
      <p className="text-gray-600 mb-6">
        Mint your HeliosHash DAO membership NFT to access exclusive features and governance rights.
      </p>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800">Membership Benefits</h3>
          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
            <li>Governance voting rights</li>
            <li>Access to exclusive projects</li>
            <li>Revenue sharing</li>
            <li>Community recognition</li>
          </ul>
        </div>

        <button
          onClick={handleMint}
          disabled={minting}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {minting ? 'Minting...' : 'Mint Membership NFT'}
        </button>

        {minting && (
          <div className="text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Processing your membership...
          </div>
        )}
      </div>
    </div>
  );
}
