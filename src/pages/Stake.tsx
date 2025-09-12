

function Stake() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 flex items-center justify-center">
      <div className="bg-white/90 rounded-lg shadow-lg p-10 max-w-lg w-full text-center">
        <h2 className="text-3xl font-bold text-indigo-900 mb-4">Stake Your Tokens</h2>
        <p className="text-gray-700 mb-6">Stake HHDAO tokens to earn rewards and participate in governance.</p>
        <button className="px-6 py-3 rounded bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition">Stake Now</button>
      </div>
    </div>
  );
}

export default Stake;
