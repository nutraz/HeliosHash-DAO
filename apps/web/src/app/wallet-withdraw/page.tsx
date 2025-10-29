"use client";
import { useState } from 'react';

export default function WalletWithdrawPage() {
  const [hhuAmount, setHhuAmount] = useState(100);
  const [inrAmount, setInrAmount] = useState(50);
  const [payoutMethod, setPayoutMethod] = useState<'upi' | 'bank' | 'staking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const conversionRate = 0.5; // 1 HHU = 0.5 INR
  const fee = 10; // ₹10 processing fee
  const tax = Math.round(inrAmount * 0.1); // 10% estimated tax

  const handleHhuChange = (value: number) => {
    setHhuAmount(value);
    setInrAmount(value * conversionRate);
  };

  const handleInrChange = (value: number) => {
    setInrAmount(value);
    setHhuAmount(value / conversionRate);
  };

  const handleConfirm = () => {
    if (termsAccepted) {
      // POST /wallet/convert -> returns conversion_quote_id
      // POST /wallet/withdraw with quote_id, payout_method
      console.log('Withdrawing', { hhuAmount, inrAmount, payoutMethod, upiId });
      alert('Withdrawal request submitted');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {/* Current Balance */}
      <div className="card">
        <div className="flex justify-between">
          <div>
            <div className="text-sm text-gray">Current HHU</div>
            <div className="text-2xl font-bold text-saffron">1,250</div>
          </div>
          <div>
            <div className="text-sm text-gray">INR Equivalent</div>
            <div className="text-2xl font-bold">₹625</div>
          </div>
        </div>
      </div>

      {/* Convert Slider */}
      <div className="card">
        <h3 className="font-semibold mb-4">Convert HHU to INR</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="hhu-amount" className="block text-sm text-gray mb-2">HHU Amount</label>
            <input
              id="hhu-amount"
              type="range"
              min="10"
              max="1000"
              value={hhuAmount}
              onChange={(e) => handleHhuChange(Number(e.target.value))}
              className="w-full"
            />
            <input
              id="hhu-number"
              type="number"
              value={hhuAmount}
              onChange={(e) => handleHhuChange(Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label htmlFor="inr-target" className="block text-sm text-gray mb-2">INR Target</label>
            <input
              id="inr-target"
              type="number"
              value={inrAmount}
              onChange={(e) => handleInrChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Fee & Tax Estimator */}
      <div className="card">
        <h3 className="font-semibold mb-4">Fee & Tax Breakdown</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Processing fee:</span>
            <span>₹{fee}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax withheld (estimated):</span>
            <span>₹{tax}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Net amount:</span>
            <span>₹{inrAmount - fee - tax}</span>
          </div>
        </div>
      </div>

      {/* Payout Method */}
      <div className="card">
        <h3 className="font-semibold mb-4">Choose Payout Method</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="payout"
              value="upi"
              checked={payoutMethod === 'upi'}
              onChange={(e) => setPayoutMethod(e.target.value as 'upi')}
              className="mr-2"
            />
            UPI (Link new)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="payout"
              value="bank"
              checked={payoutMethod === 'bank'}
              onChange={(e) => setPayoutMethod(e.target.value as 'bank')}
              className="mr-2"
            />
            Bank Transfer (KYC required)
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="payout"
              value="staking"
              checked={payoutMethod === 'staking'}
              onChange={(e) => setPayoutMethod(e.target.value as 'staking')}
              className="mr-2"
            />
            HHU Staking
          </label>
        </div>
        {payoutMethod === 'upi' && (
          <div className="mt-2">
            <label htmlFor="upi-id" className="block text-sm text-gray mb-1">UPI ID</label>
            <input
              id="upi-id"
              type="text"
              placeholder="Enter UPI ID"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Confirm */}
      <div className="card">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="terms" className="text-sm">
              I accept the Terms & Conditions
            </label>
          </div>
          <button
            onClick={handleConfirm}
            disabled={!termsAccepted}
            className={`w-full py-3 rounded-lg font-semibold ${
              termsAccepted ? 'bg-saffron text-navy' : 'bg-gray-600 text-gray cursor-not-allowed'
            }`}
          >
            Withdraw to {payoutMethod.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
}
