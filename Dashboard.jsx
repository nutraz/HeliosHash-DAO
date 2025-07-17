// src/pages/Dashboard.jsx
import { useAccount, useEnsName } from 'wagmi';
import useDaoMembership from '../hooks/useDaoMembership'; // Create this file as shown below

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const isMember = useDaoMembership();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">HeliosHash DAO Dashboard</h1>

      {!isConnected ? (
        <p className="text-gray-700">
          👋 Please connect your wallet to get started.
        </p>
      ) : (
        <>
          <p className="mb-2 text-gray-800">
            👤 Connected as: <span className="font-mono">{ensName || address}</span>
          </p>

          {isMember ? (
            <p className="text-green-600">✅ You are a 1WP DAO Member</p>
          ) : (
            <p className="text-red-500">❌ No 1WP NFT found in this wallet</p>
          )}
        </>
      )}
    </div>
  );
}

