import { useAppStore } from '@/lib/store';
import { useState } from 'react';

const StakingInterface = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [stakingPeriod, setStakingPeriod] = useState('30');
  const { wallet, addTransaction, addNotification } = useAppStore();

  const apyRates = {
    '30': 12.5,
    '90': 15,
    '365': 20,
  };

  const calculateRewards = () => {
    const amount = parseFloat(stakeAmount || '0');
    const apy = apyRates[stakingPeriod as keyof typeof apyRates] / 100;
    const years = parseInt(stakingPeriod) / 365;
    return (amount * apy * years).toFixed(2);
  };

  const calculateTotal = () => {
    const amount = parseFloat(stakeAmount || '0');
    const rewards = parseFloat(calculateRewards());
    return (amount + rewards).toFixed(2);
  };

  const handleStake = () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: 'Please enter a valid staking amount',
        timestamp: Date.now(),
        read: false,
      });
      return;
    }

    // Add staking transaction
    addTransaction({
      id: Date.now().toString(),
      type: 'stake',
      amount: stakeAmount,
      valueUSD: (parseFloat(stakeAmount) * 1.25).toFixed(2), // Mock USD value
      timestamp: Date.now(),
      description: `Staked ${stakeAmount} HH tokens for ${stakingPeriod} days`,
    });

    // Add success notification
    addNotification({
      id: (Date.now() + 1).toString(),
      type: 'success',
      message: `Successfully staked ${stakeAmount} HH tokens!`,
      timestamp: Date.now(),
      read: false,
    });

    // Reset form
    setStakeAmount('');
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/20">
      <h2 className="text-2xl font-bold text-white mb-6">Stake HH Tokens</h2>

      <div className="space-y-6">
        {/* Current Balance */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm mb-2">Available Balance</p>
          <p className="text-2xl font-bold text-white">{wallet?.balance || '0'} ETH</p>
          <p className="text-blue-300 text-sm">≈ 1,250 HH tokens available</p>
        </div>

        {/* Staking Amount Input */}
        <div>
          <label className="text-blue-300 text-sm mb-2 block">Amount to Stake (HH)</label>
          <input
            type="number"
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            className="w-full bg-slate-700/50 border border-blue-500/20 rounded-lg px-4 py-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            placeholder="0.00"
            min="0"
            step="0.01"
          />
        </div>

        {/* Staking Period Selection */}
        <div>
          <label className="text-blue-300 text-sm mb-2 block">Staking Period</label>
          <select
            value={stakingPeriod}
            onChange={(e) => setStakingPeriod(e.target.value)}
            className="w-full bg-slate-700/50 border border-blue-500/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            aria-label="Staking period selection"
          >
            <option value="30">30 Days - {apyRates['30']}% APY</option>
            <option value="90">90 Days - {apyRates['90']}% APY</option>
            <option value="365">365 Days - {apyRates['365']}% APY</option>
          </select>
        </div>

        {/* Rewards Calculation */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Staking Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-300">Staking Amount</span>
              <span className="text-white font-semibold">{stakeAmount || '0'} HH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-300">APY Rate</span>
              <span className="text-white font-semibold">{apyRates[stakingPeriod as keyof typeof apyRates]}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-300">Estimated Rewards</span>
              <span className="text-green-400 font-semibold">+{calculateRewards()} HH</span>
            </div>
            <hr className="border-blue-500/20" />
            <div className="flex justify-between">
              <span className="text-blue-300">Total after period</span>
              <span className="text-white font-bold">{calculateTotal()} HH</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleStake}
            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg transform transition hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            Stake Tokens
          </button>
          <button className="px-6 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-blue-300 hover:text-white rounded-2xl border border-blue-500/20 transition">
            Unstake
          </button>
        </div>

        {/* Staking Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-300 font-semibold mb-2">Staking Benefits</h4>
          <ul className="text-blue-200 text-sm space-y-1">
            <li>• Earn passive income through staking rewards</li>
            <li>• Help secure the HeliosHash network</li>
            <li>• Contribute to solar infrastructure development</li>
            <li>• Longer staking periods = Higher APY rates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StakingInterface;