'use client';

import { useState } from 'react';

export default function UPIPaymentPage() {
  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [step, setStep] = useState<
    'amount' | 'kyc' | 'payment' | 'processing' | 'success' | 'error'
  >('amount');
  const [paymentError, setPaymentError] = useState('');

  const tokenBalance = 2000.0; // Mock balance
  const tokensToReceive = amount ? (parseFloat(amount) * 2).toFixed(2) : '0.00';

  const handleContinueToKYC = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    setStep('kyc');
  };

  const handleProceedToPayment = () => {
    // TODO(PRIV-004): KYC/PII collection handling. Ensure PII is transmitted over TLS to backend, stored encrypted at rest,
    // and only collected when legally necessary. Reference .github/ISSUES/privacy/004-audit-upi-payment-form.md for requirements.
    if (!name || !email || !phone) {
      alert('Please fill all required fields');
      return;
    }

    // Check KYC limits
    const amt = parseFloat(amount);
    if (amt > 2000 && (!aadhaar || !pan)) {
      setPaymentError('KYC limit exceeded. Aadhaar and PAN required for amounts over ₹2000');
      return;
    }

    setStep('payment');
  };

  const handlePayWithUPI = async () => {
    setStep('processing');

    // Simulate payment processing
    setTimeout(() => {
      // Mock success/failure
      if (Math.random() > 0.1) {
        // 90% success rate
        setStep('success');
      } else {
        setPaymentError('Payment failed. Please try again.');
        setStep('error');
      }
    }, 3000);
  };

  const handleRetry = () => {
    setPaymentError('');
    setStep('payment');
  };

  return (
    <main role='main'>
      <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow'>
        <h1 className='text-2xl font-bold mb-4'>UPI Payment</h1>
        <p className='text-gray-600 mb-6'>Unified Payments Interface</p>

        {/* Token Balance */}
        <div className='mb-4'>
          <p className='text-sm text-gray-600'>Available Balance:</p>
          <p className='text-lg font-semibold' data-testid='owp-tokens'>
            {tokenBalance.toFixed(2)} OWP
          </p>
        </div>

        {step === 'amount' && (
          <div className='space-y-4'>
            <div>
              <label htmlFor='amount' className='block text-sm font-medium text-gray-700 mb-1'>
                Amount
              </label>
              <input
                id='amount'
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder='Enter amount'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                data-testid='amount-input'
              />
            </div>

            {amount && (
              <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
                <p className='text-sm text-green-800'>
                  You will receive: <span data-testid='owp-tokens'>{tokensToReceive} OWP</span>
                </p>
              </div>
            )}

            <button
              onClick={handleContinueToKYC}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              data-testid='continue-to-kyc'
            >
              Continue to KYC
            </button>
          </div>
        )}

        {step === 'kyc' && (
          <div className='space-y-4'>
            <h2 className='text-lg font-semibold mb-4'>KYC Information</h2>

            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                Name *
              </label>
              <input
                id='name'
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter your name'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                data-testid='name-input'
              />
            </div>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Email *
              </label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter your email'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                data-testid='email-input'
              />
            </div>

            <div>
              <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
                Phone *
              </label>
              <input
                id='phone'
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='Enter your phone'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                data-testid='phone-input'
              />
            </div>

            <div>
              <label htmlFor='aadhaar' className='block text-sm font-medium text-gray-700 mb-1'>
                Aadhaar (Required for amounts {'>'} ₹2000)
              </label>
              <input
                id='aadhaar'
                type='text'
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder='Enter Aadhaar number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                data-testid='aadhaar-input'
              />
            </div>

            <div>
              <label htmlFor='pan' className='block text-sm font-medium text-gray-700 mb-1'>
                PAN (Required for amounts {'>'} ₹2000)
              </label>
              <input
                id='pan'
                type='text'
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                placeholder='Enter PAN number'
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                data-testid='pan-input'
              />
            </div>

            {paymentError && (
              <div
                className='p-3 bg-red-50 border border-red-200 rounded-md'
                data-testid='kyc-limit-error'
              >
                <p className='text-sm text-red-800'>{paymentError}</p>
              </div>
            )}

            <button
              onClick={handleProceedToPayment}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400'
              data-testid='proceed-to-payment'
              disabled={!name || !email || !phone}
            >
              Proceed to Payment
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className='space-y-4' data-testid='payment-summary'>
            <h2 className='text-lg font-semibold mb-4'>Payment Summary</h2>

            <div className='p-4 bg-gray-50 rounded-md'>
              <div className='flex justify-between mb-2'>
                <span>Amount:</span>
                <span data-testid='total-amount'>₹{amount}</span>
              </div>
              <div className='flex justify-between mb-2'>
                <span>Tokens to receive:</span>
                <span>{tokensToReceive} OWP</span>
              </div>
              <div className='flex justify-between font-semibold'>
                <span>Total:</span>
                <span>₹{amount}</span>
              </div>
            </div>

            <button
              onClick={handlePayWithUPI}
              className='w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
              data-testid='pay-with-upi'
            >
              Pay with UPI
            </button>
          </div>
        )}

        {step === 'processing' && (
          <div className='text-center py-8' data-testid='processing-indicator'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-lg font-semibold'>Processing Payment...</p>
            <p className='text-gray-600'>Please wait while we process your transaction</p>
          </div>
        )}

        {step === 'success' && (
          <div className='text-center py-8' data-testid='success-message'>
            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M5 13l4 4L19 7'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-green-600 mb-2'>Payment Successful!</h2>
            <p className='text-gray-600 mb-4'>Your transaction has been completed successfully.</p>
            <div className='p-4 bg-green-50 rounded-md'>
              <p className='text-sm text-green-800'>
                Tokens received: <span data-testid='tokens-received'>{tokensToReceive} OWP</span>
              </p>
            </div>
          </div>
        )}

        {step === 'error' && (
          <div className='text-center py-8' data-testid='payment-error'>
            <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-8 h-8 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </div>
            <h2 className='text-xl font-semibold text-red-600 mb-2'>Payment Failed</h2>
            <p className='text-gray-600 mb-4'>{paymentError}</p>
            <button
              onClick={handleRetry}
              className='bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              data-testid='retry-button'
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
