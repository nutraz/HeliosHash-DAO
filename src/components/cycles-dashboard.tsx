'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cyclesApi, CycleInfo, CyclesStats } from '@/services/api';
import { AlertTriangle, CheckCircle, XCircle, Zap, RefreshCw, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CyclesDashboard() {
  const [cyclesData, setCyclesData] = useState<CyclesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [selectedCanister, setSelectedCanister] = useState<string>('');
  const [topUpLoading, setTopUpLoading] = useState(false);

  const fetchCyclesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await cyclesApi.getStatus();
      if (response.success && response.data) {
        setCyclesData(response.data);
      } else {
        setError(response.error || 'Failed to fetch cycles data');
      }
    } catch (err) {
      setError('Network error while fetching cycles data');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    if (!selectedCanister || !topUpAmount) {
      setError('Please select a canister and enter amount');
      return;
    }

    setTopUpLoading(true);
    setError(null);

    try {
      const response = await cyclesApi.topUp(selectedCanister, topUpAmount);
      if (response.success) {
        // Refresh data after successful top-up
        await fetchCyclesData();
        setTopUpAmount('');
        setSelectedCanister('');
      } else {
        setError(response.error || 'Failed to top up cycles');
      }
    } catch (err) {
      setError('Network error during top-up');
    } finally {
      setTopUpLoading(false);
    }
  };

  useEffect(() => {
    fetchCyclesData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchCyclesData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCycles = (cycles: string) => {
    const cyclesNum = BigInt(cycles);
    const trillion = BigInt(1_000_000_000_000);
    const billion = BigInt(1_000_000_000);

    if (cyclesNum >= trillion) {
      return `${(Number(cyclesNum) / Number(trillion)).toFixed(2)}T`;
    } else if (cyclesNum >= billion) {
      return `${(Number(cyclesNum) / Number(billion)).toFixed(2)}B`;
    } else {
      return `${(Number(cyclesNum) / 1_000_000).toFixed(2)}M`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className='w-4 h-4 text-green-500' />;
      case 'warning':
        return <AlertTriangle className='w-4 h-4 text-yellow-500' />;
      case 'critical':
        return <XCircle className='w-4 h-4 text-red-500' />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const calculateProgress = (cycles: string, threshold: string) => {
    const cyclesNum = Number(BigInt(cycles));
    const thresholdNum = Number(BigInt(threshold));
    return Math.min((cyclesNum / thresholdNum) * 100, 100);
  };

  if (loading && !cyclesData) {
    return (
      <div className='space-y-6'>
        <Card className='card-readable'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-center space-x-2'>
              <RefreshCw className='w-4 h-4 animate-spin' />
              <span>Loading cycles data...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !cyclesData) {
    return (
      <Alert>
        <AlertTriangle className='h-4 w-4' />
        <AlertDescription>
          {error}
          <Button onClick={fetchCyclesData} variant='outline' size='sm' className='ml-2'>
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold text-white'>Cycles Management</h1>
          <p className='text-gray-400 mt-2'>Monitor and manage ICP cycles across all canisters</p>
        </div>
        <Button onClick={fetchCyclesData} variant='outline' className='gap-2'>
          <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {cyclesData && (
        <>
          {/* Overview Cards */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <Card className='card-readable'>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-3'>
                  <Zap className='w-8 h-8 text-blue-400' />
                  <div>
                    <p className='text-sm text-gray-400'>Total Cycles</p>
                    <p className='text-xl font-bold text-white'>
                      {formatCycles(cyclesData.totalCycles)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='card-readable'>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-3'>
                  <CheckCircle className='w-8 h-8 text-green-400' />
                  <div>
                    <p className='text-sm text-gray-400'>Healthy Canisters</p>
                    <p className='text-xl font-bold text-white'>{cyclesData.healthyCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='card-readable'>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-3'>
                  <AlertTriangle className='w-8 h-8 text-yellow-400' />
                  <div>
                    <p className='text-sm text-gray-400'>Warning</p>
                    <p className='text-xl font-bold text-white'>{cyclesData.warningCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='card-readable'>
              <CardContent className='p-4'>
                <div className='flex items-center space-x-3'>
                  <XCircle className='w-8 h-8 text-red-400' />
                  <div>
                    <p className='text-sm text-gray-400'>Critical</p>
                    <p className='text-xl font-bold text-white'>{cyclesData.criticalCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue='overview' className='space-y-6'>
            <TabsList className='bg-gray-800 border-gray-700'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='topup'>Top Up</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
              <div className='grid gap-4'>
                {cyclesData.canisters.map((canister) => (
                  <Card key={canister.canister} className='card-readable'>
                    <CardContent className='p-6'>
                      <div className='flex items-center justify-between mb-4'>
                        <div className='flex items-center space-x-3'>
                          <div className='text-lg font-semibold capitalize text-white'>
                            {canister.canister}
                          </div>
                          <Badge className={getStatusColor(canister.status)}>
                            {getStatusIcon(canister.status)}
                            <span className='ml-1 capitalize'>{canister.status}</span>
                          </Badge>
                        </div>
                        <div className='text-right'>
                          <p className='text-lg font-bold text-white'>
                            {formatCycles(canister.cycles)}
                          </p>
                          <p className='text-xs text-gray-400'>cycles</p>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-gray-400'>Usage</span>
                          <span className='text-gray-300'>
                            {calculateProgress(canister.cycles, canister.threshold).toFixed(1)}%
                          </span>
                        </div>
                        <Progress
                          value={calculateProgress(canister.cycles, canister.threshold)}
                          className='h-2'
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='topup' className='space-y-6'>
              <Card className='card-readable'>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <Plus className='w-5 h-5' />
                    Top Up Canister Cycles
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='canister'>Select Canister</Label>
                      <select
                        id='canister'
                        value={selectedCanister}
                        onChange={(e) => setSelectedCanister(e.target.value)}
                        className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white'
                      >
                        <option value=''>Choose canister...</option>
                        {cyclesData?.canisters.map((canister) => (
                          <option key={canister.canister} value={canister.canister}>
                            {canister.canister} ({formatCycles(canister.cycles)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='amount'>Amount (cycles)</Label>
                      <Input
                        id='amount'
                        type='number'
                        placeholder='1000000000000'
                        value={topUpAmount}
                        onChange={(e) => setTopUpAmount(e.target.value)}
                        className='bg-gray-800 border-gray-600 text-white'
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleTopUp}
                    disabled={topUpLoading || !selectedCanister || !topUpAmount}
                    className='w-full'
                  >
                    {topUpLoading ? (
                      <>
                        <RefreshCw className='w-4 h-4 mr-2 animate-spin' />
                        Processing Top-Up...
                      </>
                    ) : (
                      <>
                        <Zap className='w-4 h-4 mr-2' />
                        Top Up Cycles
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Last Updated */}
          <Card className='card-readable'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between text-sm text-gray-400'>
                <span>Last updated: {new Date(cyclesData.lastUpdated).toLocaleString()}</span>
                <span>Auto-refresh every 30 seconds</span>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
