'use client';

import { useState } from 'react';

export default function WalletPage() {
  const [sourceChain, setSourceChain] = useState('');
  const [targetChain, setTargetChain] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const conversionRate = sourceChain && targetChain ? 1.05 : 0; // Mock rate
  const bridgeFees = transferAmount ? parseFloat(transferAmount) * 0.02 : 0; // Mock fee

  return (
    <main role="main">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Wallet</h1>
        <p className="text-gray-600 mb-8">Manage your multi-chain wallet</p>

        {/* Multi-chain Wallet Options */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Select Blockchain</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" data-testid="ethereum-option">
              <h3 className="font-medium">Ethereum</h3>
              <p className="text-sm text-gray-600">ETH Network</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" data-testid="polygon-option">
              <h3 className="font-medium">Polygon</h3>
              <p className="text-sm text-gray-600">MATIC Network</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" data-testid="bsc-option">
              <h3 className="font-medium">BSC</h3>
              <p className="text-sm text-gray-600">Binance Smart Chain</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" data-testid="ic-option">
              <h3 className="font-medium">Internet Computer</h3>
              <p className="text-sm text-gray-600">IC Network</p>
            </div>
          </div>
        </section>

        {/* Cross-chain Token Transfer */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Cross-chain Transfer</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="source-chain" className="block text-sm font-medium text-gray-700 mb-1">
                  From Chain
                </label>
                <select
                  id="source-chain"
                  value={sourceChain}
                  onChange={(e) => setSourceChain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="source-chain"
                >
                  <option value="">Select source chain</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="bsc">BSC</option>
                  <option value="ic">Internet Computer</option>
                </select>
              </div>

              <div>
                <label htmlFor="target-chain" className="block text-sm font-medium text-gray-700 mb-1">
                  To Chain
                </label>
                <select
                  id="target-chain"
                  value={targetChain}
                  onChange={(e) => setTargetChain(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="target-chain"
                >
                  <option value="">Select target chain</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="polygon">Polygon</option>
                  <option value="bsc">BSC</option>
                  <option value="ic">Internet Computer</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="transfer-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Transfer Amount (OWP)
              </label>
              <input
                id="transfer-amount"
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                data-testid="transfer-amount"
                placeholder="Enter amount"
              />
            </div>

            {sourceChain && targetChain && transferAmount && (
              <div className="mb-4 p-4 bg-gray-50 rounded-md">
                <div className="flex justify-between mb-2">
                  <span data-testid="conversion-rate">Conversion Rate: {conversionRate}</span>
                  <span data-testid="bridge-fees">Bridge Fees: {bridgeFees.toFixed(2)} OWP</span>
                </div>
                <div className="text-sm text-gray-600">
                  You will receive: {(parseFloat(transferAmount) * conversionRate - bridgeFees).toFixed(2)} OWP
                </div>
              </div>
            )}

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Transfer Tokens
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
