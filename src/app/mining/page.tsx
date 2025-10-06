'use client';

import { MiningSession } from '@/components/mining/MiningSession';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuthContext';
import { formatINR, formatOWP } from '@/lib/format';
import { Bitcoin, LogIn, RefreshCw, Thermometer, TrendingUp, Waves, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MiningData {
  totalHashrate: number;
  activeMiners: number;
  dailyOWPRewards: number; // Changed from dailyRewards to dailyOWPRewards
  energyGenerated: number;
  icpCycles: number;
  uptime: number;
  thermalEfficiency: number;
  heatUtilized: number;
}

interface MinerStats {
  id: string;
  name: string;
  hashrate: number;
  owpRewards: number; // Changed from rewards to owpRewards
  status: 'active' | 'inactive' | 'maintenance';
  location: string;
  operationType: 'bitcoin_asic' | 'ethereum_gpu' | 'immersion_cooling';
  temperature: number;
  thermalOutput: number;
  heatUtilization: number;
}

/**
 * Render the mining dashboard UI with overall stats, miner inventory, heat management, and rewards tabs.
 *
 * The component initializes sample mining and miner data for display, conditionally exposes quick actions
 * when the user is authenticated, and presents interactive sections for Overview, Miners, Heat Management,
 * and Rewards.
 *
 * @returns The component's JSX element representing the mining dashboard.
 */
export default function MiningPage() {
  const { isAuthenticated } = useAuth();
  const [miningData, setMiningData] = useState<MiningData>({
    totalHashrate: 0,
    activeMiners: 0,
    dailyOWPRewards: 0,
    energyGenerated: 0,
    icpCycles: 0,
    uptime: 0,
    thermalEfficiency: 0,
    heatUtilized: 0,
  });

  const [miners, setMiners] = useState<MinerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setMiningData({
        totalHashrate: 125000,
        activeMiners: 847,
        dailyOWPRewards: 452.3, // Changed to OWP tokens instead of rupees
        energyGenerated: 2.4,
        icpCycles: 15400000000,
        uptime: 99.8,
        thermalEfficiency: 94.2,
        heatUtilized: 87.5,
      });

      setMiners([
        {
          id: '1',
          name: 'Gujarat Bitcoin Farm',
          hashrate: 35000,
          owpRewards: 17500,
          status: 'active',
          location: 'Gujarat',
          operationType: 'bitcoin_asic',
          temperature: 65,
          thermalOutput: 450,
          heatUtilization: 92,
        },
        {
          id: '2',
          name: 'Rajasthan Immersion Cooling',
          hashrate: 40000,
          owpRewards: 20000,
          status: 'active',
          location: 'Rajasthan',
          operationType: 'immersion_cooling',
          temperature: 42,
          thermalOutput: 520,
          heatUtilization: 95,
        },
        {
          id: '3',
          name: 'Tamil Nadu Coastal Mining',
          hashrate: 25000,
          owpRewards: 12500,
          status: 'active',
          location: 'Tamil Nadu',
          operationType: 'bitcoin_asic',
          temperature: 58,
          thermalOutput: 320,
          heatUtilization: 85,
        },
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatICP = (cycles: number) => {
    return (cycles / 1000000000).toFixed(1) + 'T Cycles';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOperationTypeIcon = (type: string) => {
    switch (type) {
      case 'bitcoin_asic':
        return <Bitcoin className='h-5 w-5 text-orange-500' />;
      case 'immersion_cooling':
        return <Waves className='h-5 w-5 text-cyan-500' />;
      default:
        return <Zap className='h-5 w-5' />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 40) return 'text-green-600';
    if (temp < 60) return 'text-yellow-600';
    if (temp < 80) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className='min-h-screen bg-background pb-20'>
      <div className='container mx-auto px-4 py-8 max-w-6xl'>
        <MiningSession />
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            <Zap className='h-8 w-8 text-primary' />
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Mining</h1>
              <p className='text-muted-foreground'>Bitcoin mining & thermal management</p>
            </div>
          </div>
          <div className='flex gap-2'>
            <ThemeToggle />
            <Button variant='outline'>
              <RefreshCw className='h-4 w-4 mr-2' />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          <Card className='minimal-card p-6 india-saffron'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Total Hashrate</p>
                <p className='text-2xl font-bold'>{formatNumber(miningData.totalHashrate)} TH/s</p>
              </div>
              <Bitcoin className='h-8 w-8 text-foreground/80' />
            </div>
          </Card>

          <Card className='minimal-card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Energy Generated</p>
                <p className='text-2xl font-bold text-foreground'>
                  {miningData.energyGenerated} MW
                </p>
              </div>
              <Zap className='h-8 w-8 text-primary/60' />
            </div>
          </Card>

          <Card className='minimal-card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-muted-foreground'>Heat Utilization</p>
                <p className='text-2xl font-bold text-foreground'>{miningData.heatUtilized}%</p>
              </div>
              <Thermometer className='h-8 w-8 text-primary/60' />
            </div>
          </Card>

          <Card className='minimal-card p-6 india-green'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium'>Active Miners</p>
                <p className='text-2xl font-bold'>{miningData.activeMiners}</p>
              </div>
              <TrendingUp className='h-8 w-8 text-foreground/80' />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='miners'>Miners</TabsTrigger>
            <TabsTrigger value='thermal'>Heat Management</TabsTrigger>
            <TabsTrigger value='rewards'>Rewards</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <Card className='minimal-card p-6'>
                <h3 className='text-lg font-semibold text-foreground mb-4'>Mining Performance</h3>
                <div className='space-y-4'>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>Network Hashrate</span>
                      <span className='font-medium text-foreground'>
                        {formatNumber(miningData.totalHashrate)} TH/s
                      </span>
                    </div>
                    <Progress value={85} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>Thermal Efficiency</span>
                      <span className='font-medium text-foreground'>
                        {miningData.thermalEfficiency}%
                      </span>
                    </div>
                    <Progress value={miningData.thermalEfficiency} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>Heat Utilization</span>
                      <span className='font-medium text-foreground'>
                        {miningData.heatUtilized}%
                      </span>
                    </div>
                    <Progress value={miningData.heatUtilized} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>Uptime</span>
                      <span className='font-medium text-foreground'>{miningData.uptime}%</span>
                    </div>
                    <Progress value={miningData.uptime} className='h-2' />
                  </div>
                </div>
              </Card>

              {isAuthenticated ? (
                <Card className='minimal-card p-6'>
                  <h3 className='text-lg font-semibold text-foreground mb-4'>Quick Actions</h3>
                  <div className='space-y-3'>
                    <Button className='w-full'>Start New Mining Session</Button>
                    <Button variant='outline' className='w-full'>
                      Add Bitcoin ASIC Farm
                    </Button>
                    <Button variant='outline' className='w-full'>
                      Configure Heat Recovery
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card className='minimal-card p-6 bg-muted/40'>
                  <h3 className='text-lg font-semibold text-foreground mb-2'>Actions Locked</h3>
                  <p className='text-sm text-muted-foreground mb-4'>
                    Log in to start a mining session and configure infrastructure.
                  </p>
                  <Button variant='outline' className='w-full gap-2'>
                    <LogIn className='h-4 w-4' /> Login Required
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value='miners' className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {miners.map((miner) => (
                <Card key={miner.id} className='minimal-card p-6'>
                  <div className='space-y-4'>
                    <div className='flex items-center justify-between'>
                      <h3 className='font-semibold text-foreground'>{miner.name}</h3>
                      <div className='flex items-center gap-2'>
                        {getOperationTypeIcon(miner.operationType)}
                        <div
                          className={`w-3 h-3 rounded-full ${
                            miner.status === 'active'
                              ? 'bg-green-500'
                              : miner.status === 'maintenance'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                          }`}
                        ></div>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>{miner.location}</p>
                    <div className='space-y-2'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Hashrate</span>
                        <span className='font-medium text-foreground'>
                          {formatNumber(miner.hashrate)} TH/s
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Temperature</span>
                        <span className={`font-medium ${getTemperatureColor(miner.temperature)}`}>
                          {miner.temperature}°C
                        </span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Heat Utilization</span>
                        <span className='font-medium text-green-600'>{miner.heatUtilization}%</span>
                      </div>
                      <div className='flex justify-between text-sm'>
                        <span className='text-muted-foreground'>Daily OWP Rewards</span>
                        <span className='font-medium text-foreground'>
                          {formatNumber(miner.owpRewards)} OWP
                        </span>
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <Badge className={getStatusColor(miner.status)}>{miner.status}</Badge>
                      <Button variant='outline' size='sm'>
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value='thermal' className='space-y-6'>
            <Card className='minimal-card p-6'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Heat Recovery Overview</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='text-center p-4 rounded-lg bg-muted/30'>
                  <p className='text-2xl font-bold text-foreground'>1,770 kW</p>
                  <p className='text-sm text-muted-foreground'>Total Thermal Output</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-muted/30'>
                  <p className='text-2xl font-bold text-foreground'>1,549 kW</p>
                  <p className='text-sm text-muted-foreground'>Heat Recovered</p>
                </div>
                <div className='text-center p-4 rounded-lg bg-muted/30'>
                  <p className='text-2xl font-bold text-foreground'>87.5%</p>
                  <p className='text-sm text-muted-foreground'>Efficiency Rate</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value='rewards' className='space-y-6'>
            <Card className='minimal-card p-6'>
              <h3 className='text-lg font-semibold text-foreground mb-4'>Mining Rewards</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='text-center p-4 rounded-lg india-saffron'>
                  <p className='text-2xl font-bold'>
                    {formatOWP(miningData.dailyOWPRewards, { decimals: 2 })}
                  </p>
                  <p className='text-sm font-medium'>Daily OWP Rewards</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    ≈ {formatINR(miningData.dailyOWPRewards * 150, { decimals: 0 })}
                  </p>
                </div>
                <div className='text-center p-4 rounded-lg india-green'>
                  <p className='text-2xl font-bold'>
                    {formatOWP(miningData.dailyOWPRewards * 30, { decimals: 2 })}
                  </p>
                  <p className='text-sm font-medium'>Projected Monthly</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    ≈ {formatINR(miningData.dailyOWPRewards * 30 * 150, { decimals: 0 })}
                  </p>
                </div>
              </div>
              <div className='mt-4'>
                <Button className='w-full'>Claim Rewards</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}