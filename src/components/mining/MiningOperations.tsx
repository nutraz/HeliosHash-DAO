'use client';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatOWP } from '@/lib/format';

export function MiningOperations() {
  const miningData = {
    hashrate: '110 TH/s',
    powerUsage: '3.2 kW',
    temperature: '62°C',
    dailyRevenue: 12.5, // OWP tokens
    efficiency: '0.38 J/TH',
    uptime: '99.8%',
    status: 'active' as const,
    thermalRecovery: {
      enabled: true,
      heatOutput: '8.5 kW',
      waterHeating: '42°C',
    },
  };

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Hashrate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{miningData.hashrate}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Power Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{miningData.powerUsage}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{miningData.temperature}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-baseline gap-2'>
              <div className='text-2xl font-bold'>
                {formatOWP(miningData.dailyRevenue, { decimals: 2, withFiat: true })}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{miningData.efficiency}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-2'>
              <div className='text-2xl font-bold'>{miningData.uptime}</div>
              <Badge variant={miningData.status === 'active' ? 'default' : 'destructive'}>
                {miningData.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {miningData.thermalRecovery.enabled && (
        <Card>
          <CardHeader>
            <CardTitle>Thermal Recovery System</CardTitle>
            <CardDescription>
              Waste heat from mining operations is utilized for community services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <p className='text-sm text-muted-foreground'>Heat Output</p>
                <p className='text-xl font-semibold'>{miningData.thermalRecovery.heatOutput}</p>
              </div>
              <div>
                <p className='text-sm text-muted-foreground'>Water Heating</p>
                <p className='text-xl font-semibold'>{miningData.thermalRecovery.waterHeating}</p>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-sm text-muted-foreground mb-2'>System Efficiency</p>
              <Progress value={85} className='h-2' />
              <p className='text-xs text-muted-foreground mt-1'>85% heat recovery efficiency</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mining Revenue Distribution</CardTitle>
          <CardDescription>How mining revenue is allocated within the DAO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm'>Community Treasury</span>
                <span className='text-sm font-medium'>60%</span>
              </div>
              <Progress value={60} className='h-2' />
            </div>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm'>Infrastructure Maintenance</span>
                <span className='text-sm font-medium'>25%</span>
              </div>
              <Progress value={25} className='h-2' />
            </div>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm'>Development Fund</span>
                <span className='text-sm font-medium'>10%</span>
              </div>
              <Progress value={10} className='h-2' />
            </div>
            <div>
              <div className='flex justify-between mb-1'>
                <span className='text-sm'>Operational Costs</span>
                <span className='text-sm font-medium'>5%</span>
              </div>
              <Progress value={5} className='h-2' />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
