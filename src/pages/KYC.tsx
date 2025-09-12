

function KYC() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="bg-white/90 rounded-lg shadow-lg p-10 max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">KYC Verification</h2>
        <p className="text-gray-700 mb-6">Complete your KYC to access all features and participate in the DAO.</p>
        <button className="px-6 py-3 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition">Start KYC</button>
      </div>
    </div>
  );
}

export default KYC;
