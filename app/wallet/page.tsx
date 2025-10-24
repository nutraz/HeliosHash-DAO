'use client';

import { useState } from 'react';

export default function WalletPage() {
  const [sourceChain, setSourceChain] = useState('');
  const [targetChain, setTargetChain] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const conversionRate = sourceChain && targetChain ? 1.05 : 0; // Mock rate
  const bridgeFees = transferAmount ? parseFloat(transferAmount) * 0.02 : 0; // Mock fee

  return (
    <main role="main" className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Wallet</h1>
        <p className="text-muted-foreground mb-8">Manage your multi-chain wallet</p>

        {/* Multi-chain Wallet Options */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Select Blockchain</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer bg-card text-card-foreground transition" data-testid="ethereum-option">
              <h3 className="font-medium">Ethereum</h3>
              <p className="text-sm text-muted-foreground">ETH Network</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer bg-card text-card-foreground transition" data-testid="polygon-option">
              <h3 className="font-medium">Polygon</h3>
              <p className="text-sm text-muted-foreground">MATIC Network</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer bg-card text-card-foreground transition" data-testid="bsc-option">
              <h3 className="font-medium">BSC</h3>
              <p className="text-sm text-muted-foreground">Binance Smart Chain</p>
            </div>
            <div className="p-4 border border-border rounded-lg hover:bg-muted cursor-pointer bg-card text-card-foreground transition" data-testid="ic-option">
              <h3 className="font-medium">Internet Computer</h3>
              <p className="text-sm text-muted-foreground">IC Network</p>
            </div>
          </div>
        </section>

        {/* Cross-chain Token Transfer */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Cross-chain Transfer</h2>
          <div className="bg-card p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="source-chain" className="block text-sm font-medium text-muted-foreground mb-1">
                  From Chain
                </label>
                <select
                  id="source-chain"
                  value={sourceChain}
                  onChange={(e) => setSourceChain(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                <label htmlFor="target-chain" className="block text-sm font-medium text-muted-foreground mb-1">
                  To Chain
                </label>
                <select
                  id="target-chain"
                  value={targetChain}
                  onChange={(e) => setTargetChain(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
              <label htmlFor="transfer-amount" className="block text-sm font-medium text-muted-foreground mb-1">
                Transfer Amount (OWP)
              </label>
              <input
                id="transfer-amount"
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                data-testid="transfer-amount"
                placeholder="Enter amount"
              />
            </div>

            {sourceChain && targetChain && transferAmount && (
              <div className="mb-4 p-4 bg-muted rounded-md">
                <div className="flex justify-between mb-2">
                  <span data-testid="conversion-rate" className="text-muted-foreground">Conversion Rate: {conversionRate}</span>
                  <span data-testid="bridge-fees" className="text-muted-foreground">Bridge Fees: {bridgeFees.toFixed(2)} OWP</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  You will receive: {(parseFloat(transferAmount) * conversionRate - bridgeFees).toFixed(2)} OWP
                </div>
              </div>
            )}

            <button
              className="mt-4 w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary font-medium transition"
            >
              Transfer Tokens
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
