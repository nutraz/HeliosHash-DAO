'use client';

import { ArrowRight, CreditCard, Smartphone, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'>
      <div className='max-w-6xl mx-auto p-6'>
        {/* Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-4'>
            <Wallet className='w-6 h-6 text-blue-600' />
            <h1 className='text-2xl font-bold text-gray-800'>Payment Hub</h1>
          </div>
          <p className='text-gray-600'>Choose your payment method | अपना भुगतान तरीका चुनें</p>
        </div>

        {/* Payment Options */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {/* UPI Payment */}
          <Link href='/payment/upi' className='group'>
            <div className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group-hover:scale-105'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center'>
                  <Smartphone className='w-6 h-6 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800'>UPI Payment</h3>
                  <p className='text-sm text-gray-600'>GPay, PhonePe, Paytm</p>
                </div>
              </div>
              <p className='text-gray-600 mb-4'>
                Pay instantly with any UPI app. Support for KYC levels and automatic OWP token
                conversion.
              </p>
              <div className='flex items-center text-blue-600 font-medium'>
                Pay with UPI <ArrowRight className='w-4 h-4 ml-2' />
              </div>
            </div>
          </Link>

          {/* 1WP Tier System */}
          <Link href='/payment/tiers' className='group'>
            <div className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group-hover:scale-105'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center'>
                  <CreditCard className='w-6 h-6 text-purple-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800'>1WP Tiers</h3>
                  <p className='text-sm text-gray-600'>7 Membership Levels</p>
                </div>
              </div>
              <p className='text-gray-600 mb-4'>
                Purchase 1WP tier membership with UPI. Includes women's bonus and NFT minting.
              </p>
              <div className='flex items-center text-purple-600 font-medium'>
                Buy 1WP Tier <ArrowRight className='w-4 h-4 ml-2' />
              </div>
            </div>
          </Link>

          {/* Wallet Connection */}
          <Link href='/wallet' className='group'>
            <div className='bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group-hover:scale-105'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center'>
                  <Wallet className='w-6 h-6 text-green-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-800'>Wallet</h3>
                  <p className='text-sm text-gray-600'>Connect & Receive</p>
                </div>
              </div>
              <p className='text-gray-600 mb-4'>
                Connect your wallet to receive OWP tokens and manage your digital assets.
              </p>
              <div className='flex items-center text-green-600 font-medium'>
                Connect Wallet <ArrowRight className='w-4 h-4 ml-2' />
              </div>
            </div>
          </Link>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-lg p-4 text-center'>
            <div className='text-2xl font-bold text-blue-600'>₹500+</div>
            <div className='text-sm text-gray-600'>UPI Payments</div>
          </div>
          <div className='bg-white rounded-lg p-4 text-center'>
            <div className='text-2xl font-bold text-purple-600'>7</div>
            <div className='text-sm text-gray-600'>1WP Tiers</div>
          </div>
          <div className='bg-white rounded-lg p-4 text-center'>
            <div className='text-2xl font-bold text-green-600'>KYC</div>
            <div className='text-sm text-gray-600'>Verified</div>
          </div>
          <div className='bg-white rounded-lg p-4 text-center'>
            <div className='text-2xl font-bold text-orange-600'>Bonus</div>
            <div className='text-sm text-gray-600'>Women's</div>
          </div>
        </div>
      </div>
    </div>
  );
}
