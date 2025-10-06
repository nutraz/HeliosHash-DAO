'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Investment {
  id: number;
  name: string;
  amount: number;
  percentage: number;
  timestamp: string;
}

/**
 * Display the InvestmentsPage dashboard for managing and viewing solar co-ownership investments.
 *
 * Shows a breakdown of co-owner investments, allows adding a new co-owner (recalculating ownership percentages),
 * and presents energy generation, monthly revenue distribution, and system/reality-check status.
 *
 * @returns The component's JSX tree representing the interactive investments dashboard.
 */
export default function InvestmentsPage() {
  const [investments, setInvestments] = useState<Investment[]>([
    { id: 1, name: 'You (Nutraz)', amount: 100000, percentage: 33.33, timestamp: '2025-10-06' },
    { id: 2, name: 'Co-owner 2', amount: 100000, percentage: 33.33, timestamp: '2025-10-06' },
    { id: 3, name: 'Co-owner 3', amount: 100000, percentage: 33.34, timestamp: '2025-10-06' },
  ]);

  const [newInvestor, setNewInvestor] = useState({ name: '', amount: '' });

  const totalInvestment = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const todaysGeneration = 18.5; // kWh
  const myShare = ((investments[0]?.percentage || 0) / 100) * todaysGeneration;
  const monthlyRevenue = 5000; // INR

  const addInvestment = () => {
    if (newInvestor.name && newInvestor.amount) {
      const amount = parseFloat(newInvestor.amount);
      const newTotal = totalInvestment + amount;

      // Recalculate all percentages
      const updatedInvestments = investments.map((inv) => ({
        ...inv,
        percentage: (inv.amount / newTotal) * 100,
      }));

      const newInvestment: Investment = {
        id: Date.now(),
        name: newInvestor.name,
        amount: amount,
        percentage: (amount / newTotal) * 100,
        timestamp: new Date().toISOString().split('T')[0],
      };

      setInvestments([...updatedInvestments, newInvestment]);
      setNewInvestor({ name: '', amount: '' });
    }
  };

  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-4xl font-bold text-gray-900'>5kW Solar Co-Ownership MVP</h1>
        <p className='text-lg text-gray-600'>Reality check: 30-day validation with real money</p>
        <Badge variant='outline' className='text-sm'>
          {investments.length} Co-owners | ₹{totalInvestment.toLocaleString('en-IN')} Total
        </Badge>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Investment Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              Investment Breakdown
              <Badge variant='secondary'>₹{totalInvestment.toLocaleString('en-IN')}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {investments.map((inv) => (
              <div
                key={inv.id}
                className='flex justify-between items-center p-3 bg-gray-50 rounded-lg'
              >
                <div className='space-y-1'>
                  <span className='font-medium'>{inv.name}</span>
                  <div className='text-sm text-gray-600'>{inv.timestamp}</div>
                </div>
                <div className='text-right space-y-1'>
                  <div className='font-bold'>₹{inv.amount.toLocaleString('en-IN')}</div>
                  <div className='text-sm text-green-600'>{inv.percentage.toFixed(2)}%</div>
                </div>
              </div>
            ))}

            {/* Add new investment */}
            <div className='mt-6 p-4 border-2 border-dashed border-gray-200 rounded-lg'>
              <h3 className='font-medium mb-3'>Add New Co-owner</h3>
              <div className='grid grid-cols-2 gap-3'>
                <Input
                  placeholder='Name'
                  value={newInvestor.name}
                  onChange={(e) => setNewInvestor({ ...newInvestor, name: e.target.value })}
                />
                <Input
                  placeholder='Amount (₹)'
                  type='number'
                  value={newInvestor.amount}
                  onChange={(e) => setNewInvestor({ ...newInvestor, amount: e.target.value })}
                />
              </div>
              <Button
                onClick={addInvestment}
                className='w-full mt-3'
                disabled={!newInvestor.name || !newInvestor.amount}
              >
                Add Investment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Energy & Revenue Dashboard */}
        <div className='space-y-6'>
          {/* Today's Generation */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Energy Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-center space-y-2'>
                <div className='text-4xl font-bold text-green-600'>{todaysGeneration} kWh</div>
                <div className='text-lg'>
                  Your share:{' '}
                  <span className='font-bold text-blue-600'>{myShare.toFixed(2)} kWh</span>
                </div>
                <div className='text-sm text-gray-600'>
                  Based on your {investments[0]?.percentage.toFixed(2)}% ownership
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue Split</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    ₹{monthlyRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className='text-sm text-gray-600'>This month's revenue</div>
                </div>

                {investments.map((inv) => {
                  const share = (inv.percentage / 100) * monthlyRevenue;
                  return (
                    <div key={inv.id} className='flex justify-between items-center'>
                      <span>{inv.name}</span>
                      <span className='font-bold text-green-600'>
                        ₹{share.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>System Size</span>
                  <span className='font-bold'>5kW</span>
                </div>
                <div className='flex justify-between'>
                  <span>Installation Status</span>
                  <Badge variant='outline'>Simulated Data</Badge>
                </div>
                <div className='flex justify-between'>
                  <span>Co-owners</span>
                  <span className='font-bold'>{investments.length}/5 max</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reality Check Status */}
      <Card className='bg-yellow-50 border-yellow-200'>
        <CardHeader>
          <CardTitle className='text-yellow-800'>30-Day Reality Check Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-y-1'>
              <div className='text-sm font-medium'>Real Money Invested</div>
              <div className='text-lg font-bold text-yellow-800'>
                {investments.filter((inv) => inv.amount > 0).length}/3 people
              </div>
            </div>
            <div className='space-y-1'>
              <div className='text-sm font-medium'>Platform Working</div>
              <div className='text-lg font-bold text-green-600'>✅ Yes</div>
            </div>
            <div className='space-y-1'>
              <div className='text-sm font-medium'>User Feedback</div>
              <div className='text-lg font-bold text-yellow-600'>⏳ Pending</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}