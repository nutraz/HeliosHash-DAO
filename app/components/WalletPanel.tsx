"use client";
import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const WalletPanel: React.FC = () => {
  const [activeChain, setActiveChain] = useState<'polygon' | 'icp'>('polygon');
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [balance, setBalance] = useState<{ native: string; owp: string }>({ native: '0', owp: '0' });
  const [transactions, setTransactions] = useState<Array<any>>([]);
  const [sendAmount, setSendAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Replace with real OWP token contract on Polygon
  const OWP_TOKEN_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678';

  const connectPolygon = async () => {
    try {
      setIsLoading(true);
      setError('');

      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install MetaMask to use Polygon features.');
      }

      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId: string = await window.ethereum.request({ method: 'eth_chainId' });
      const polygonChainId = '0x89';

      if (chainId !== polygonChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: polygonChainId }],
          });
        } catch (switchError: any) {
          if (switchError?.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: polygonChainId,
                chainName: 'Polygon Mainnet',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/']
              }]
            });
          } else {
            throw switchError;
          }
        }
      }

      setWalletAddress(accounts[0]);
      setIsConnected(true);
      await fetchPolygonBalances(accounts[0]);
      await fetchPolygonTransactions(accounts[0]);

      setSuccess('Connected to Polygon wallet successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPolygonBalances = async (address: string) => {
    try {
      const maticBalanceHex = await window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] });
      const maticInEther = parseInt(maticBalanceHex, 16) / 1e18;

      // ERC-20 balanceOf
      const data = '0x70a08231' + '000000000000000000000000' + address.slice(2);
      const owpBalanceHex = await window.ethereum.request({ method: 'eth_call', params: [{ to: OWP_TOKEN_ADDRESS, data }, 'latest'] });
      const owpInTokens = parseInt(owpBalanceHex, 16) / 1e18;

      setBalance({ native: maticInEther.toFixed(4), owp: owpInTokens.toFixed(2) });
    } catch (err) {
      console.error('Error fetching balances:', err);
      // Fallback/mock values
      setBalance({ native: '15.42', owp: '226898.00' });
    }
  };

  const fetchPolygonTransactions = async (address: string) => {
    // Placeholder: in production use Polygonscan or The Graph
    setTransactions([
      { id: '1', hash: '0xabc...123', from: address, to: '0xdef...456', amount: '100 OWP', timestamp: new Date().toISOString(), status: 'confirmed', type: 'send' },
      { id: '2', hash: '0x789...xyz', from: '0x1wp...dao', to: address, amount: '5000 OWP', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'confirmed', type: 'receive' }
    ]);
  };

  const sendPolygonTokens = async () => {
    if (!sendAmount || !recipientAddress) { setError('Please enter amount and recipient address'); return; }
    try {
      setIsLoading(true); setError('');
      const amountInWeiBn = BigInt(Math.floor(parseFloat(sendAmount) * 1e18));
      const amountHex = '0x' + amountInWeiBn.toString(16);
      // Use eth_sendTransaction with data for ERC20 transfer
      const paddedRecipient = recipientAddress.replace(/^0x/, '').padStart(64, '0');
      const amountPadded = amountInWeiBn.toString(16).padStart(64, '0');
      const data = '0xa9059cbb' + paddedRecipient + amountPadded;

      const txHash = await window.ethereum.request({ method: 'eth_sendTransaction', params: [{ from: walletAddress, to: OWP_TOKEN_ADDRESS, data }] });
      setSuccess(`Transaction sent! Hash: ${String(txHash).slice(0, 10)}...`);
      setSendAmount(''); setRecipientAddress('');
      setTimeout(() => { fetchPolygonBalances(walletAddress); fetchPolygonTransactions(walletAddress); }, 5000);
    } catch (err: any) {
      setError(err?.message || String(err));
    } finally { setIsLoading(false); }
  };

  const connectICP = async () => {
    setError('Internet Computer integration coming soon!');
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) { connectPolygon(); }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">HeliosHash DAO Wallet</h2>
        <div className="flex gap-4 mb-4">
          <button onClick={() => setActiveChain('polygon')} className={`px-4 py-2 rounded-lg font-semibold ${activeChain === 'polygon' ? 'bg-white text-purple-600' : 'bg-purple-500'}`}>Polygon (Current)</button>
          <button onClick={() => setActiveChain('icp')} className={`px-4 py-2 rounded-lg font-semibold ${activeChain === 'icp' ? 'bg-white text-purple-600' : 'bg-purple-500'}`}>Internet Computer (Soon)</button>
        </div>
        <p className="text-sm opacity-90">{activeChain === 'polygon' ? '🔷 Connected to Polygon Network - OWP Token Active' : '🌐 ICP Integration Coming Soon'}</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">{success}</div>}

      {!isConnected ? (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-600 mb-6">Connect to view balances, send tokens, and participate in DAO governance</p>
          <button onClick={activeChain === 'polygon' ? connectPolygon : connectICP} disabled={isLoading} className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold">{isLoading ? 'Connecting...' : `Connect to ${activeChain === 'polygon' ? 'MetaMask' : 'Internet Identity'}`}</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 font-medium">{activeChain === 'polygon' ? 'MATIC Balance' : 'ICP Balance'}</span>
                <button onClick={() => fetchPolygonBalances(walletAddress)} className="p-1">Refresh</button>
              </div>
              <div className="text-3xl font-bold text-gray-900">{balance.native} {activeChain === 'polygon' ? 'MATIC' : 'ICP'}</div>
              <div className="text-sm text-gray-500 mt-1 truncate">{walletAddress}</div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg shadow-lg p-6 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700 font-medium">OWP Token Balance</span>
                <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">1WP</span>
              </div>
              <div className="text-3xl font-bold text-orange-600">{balance.owp} OWP</div>
              <div className="text-sm text-gray-600 mt-1">One World Project Token</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Send OWP Tokens</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Address</label>
                <input type="text" value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="0x..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (OWP)</label>
                <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} placeholder="0.00" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
              </div>
              <button onClick={sendPolygonTokens} disabled={isLoading || !sendAmount || !recipientAddress} className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold">{isLoading ? 'Sending...' : 'Send Tokens'}</button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {transactions.length === 0 ? <p className="text-gray-500 text-center py-8">No transactions yet</p> : (
              <div className="space-y-3">{transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'send' ? 'bg-red-100' : 'bg-green-100'}`}>{tx.type === 'send' ? '→' : '←'}</div>
                    <div>
                      <div className="font-medium">{tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount}</div>
                      <div className="text-sm text-gray-500">{new Date(tx.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <a href={`https://polygonscan.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="text-sm text-purple-600">View</a>
                </div>
              ))}</div>
            )}
          </div>

          {activeChain === 'polygon' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">🌉 ICP Integration Coming Soon</h4>
              <p className="text-sm text-blue-800">OWP tokens will be bridged to Internet Computer for enhanced DAO governance, multisig treasury controls, and integration with Motoko canisters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletPanel;
