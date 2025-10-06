'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppHeader } from '@/components/app-header';
import { EnergyCircle } from '@/components/energy-circle';
import { ActionCard } from '@/components/action-card';
import { Zap, TrendingUp, Battery, Home, Factory } from 'lucide-react';

/**
 * Renders the Energy Grid dashboard with live-updating energy metrics and visualizations.
 *
 * The component maintains internal state for current generation, daily generation, grid status, solar efficiency,
 * and battery level, and simulates real-time updates while mounted. The update interval is cleaned up on unmount.
 *
 * @returns The dashboard's React element.
 */
export default function EnergyPage() {
  const [currentGeneration, setCurrentGeneration] = useState(2.4);
  const [dailyGeneration, setDailyGeneration] = useState(18.6);
  const [gridStatus, setGridStatus] = useState(87);
  const [solarEfficiency, setSolarEfficiency] = useState(94);
  const [batteryLevel, setBatteryLevel] = useState(73);

  useEffect(() => {
    // Simulate real-time energy data
    const interval = setInterval(() => {
      setCurrentGeneration((prev) => {
        const change = (Math.random() - 0.5) * 0.3;
        return Math.max(1.5, Math.min(3.5, prev + change));
      });

      setDailyGeneration((prev) => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(15, Math.min(25, prev + change));
      });

      setGridStatus((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(75, Math.min(95, prev + change));
      });

      setSolarEfficiency((prev) => {
        const change = (Math.random() - 0.5) * 1;
        return Math.max(88, Math.min(98, prev + change));
      });

      setBatteryLevel((prev) => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(60, Math.min(90, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='min-h-screen app-container p-4 pb-20'>
      {/* Status Bar */}
      <div className='flex justify-between items-center mb-4 text-sm text-gray-300'>
        <span>9:41</span>
        <div className='flex gap-1'>
          <span>📶</span>
          <span>🔋</span>
        </div>
      </div>

      {/* Header */}
      <AppHeader
        title='Energy Grid'
        stats={[
          { label: 'Current', value: `${currentGeneration.toFixed(1)} kW` },
          { label: 'Daily', value: `${dailyGeneration.toFixed(1)} kWh` },
          { label: 'Efficiency', value: `${solarEfficiency}%` },
        ]}
        showLogo={true}
      />

      {/* Energy Visualization */}
      <Card className='card-readable mb-4'>
        <CardContent className='p-6'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='flex flex-col items-center'>
              <EnergyCircle percentage={gridStatus} size='md' />
              <p className='text-sm mt-2 text-center text-white'>Grid Status</p>
            </div>
            <div className='flex flex-col items-center'>
              <EnergyCircle percentage={batteryLevel} size='md' />
              <p className='text-sm mt-2 text-center text-white'>Battery Level</p>
            </div>
          </div>

          <div className='mt-6 space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-300'>Solar Generation</span>
              <span className='font-semibold text-white'>{currentGeneration.toFixed(1)} kW</span>
            </div>
            <Progress value={(currentGeneration / 3.5) * 100} className='h-2' />

            <div className='flex justify-between items-center'>
              <span className='text-sm text-gray-300'>Daily Target</span>
              <span className='font-semibold text-white'>
                {dailyGeneration.toFixed(1)} / 225 kWh
              </span>
            </div>
            <Progress value={(dailyGeneration / 225) * 100} className='h-2' />
          </div>
        </CardContent>
      </Card>

      {/* Energy Sources */}
      <div className='grid grid-cols-2 gap-4 mb-4'>
        <ActionCard icon='☀️' title='Solar Panels' description='125 panels • 50kW capacity' />

        <ActionCard icon={Battery} title='Battery Storage' description='100kWh • 73% charged' />

        <ActionCard icon={Home} title='Home Usage' description='1.2kW • Real-time' />

        <ActionCard icon={Factory} title='Grid Export' description='1.4kW • To community' />
      </div>

      {/* Energy Statistics */}
      <Tabs defaultValue='live' className='w-full'>
        <TabsList className='grid w-full grid-cols-3 bg-gray-800'>
          <TabsTrigger value='live' className='data-[state=active]:bg-gray-700 text-white'>
            ⚡ Live
          </TabsTrigger>
          <TabsTrigger value='history' className='data-[state=active]:bg-gray-700 text-white'>
            📊 History
          </TabsTrigger>
          <TabsTrigger value='forecast' className='data-[state=active]:bg-gray-700 text-white'>
            🌤️ Forecast
          </TabsTrigger>
        </TabsList>

        <TabsContent value='live' className='space-y-3'>
          <Card className='card-readable'>
            <CardHeader>
              <CardTitle className='text-sm text-white'>Live Energy Flow</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Solar Generation</span>
                <span className='font-semibold text-green-400'>
                  {currentGeneration.toFixed(1)} kW
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Home Consumption</span>
                <span className='font-semibold text-blue-400'>1.2 kW</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Grid Export</span>
                <span className='font-semibold text-yellow-400'>
                  {(currentGeneration - 1.2).toFixed(1)} kW
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Battery Charging</span>
                <span className='font-semibold text-purple-400'>0.3 kW</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='history' className='space-y-3'>
          <Card className='card-readable'>
            <CardHeader>
              <CardTitle className='text-sm text-white'>Today's History</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Peak Generation</span>
                <span className='font-semibold text-white'>3.2 kW at 1:30 PM</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Total Generated</span>
                <span className='font-semibold text-white'>{dailyGeneration.toFixed(1)} kWh</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Self-Consumed</span>
                <span className='font-semibold text-white'>8.4 kWh</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Grid Export</span>
                <span className='font-semibold text-white'>
                  {(dailyGeneration - 8.4).toFixed(1)} kWh
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='forecast' className='space-y-3'>
          <Card className='card-readable'>
            <CardHeader>
              <CardTitle className='text-sm text-white'>Weather Forecast</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Tomorrow</span>
                <div className='flex items-center gap-2'>
                  <span className='text-yellow-400'>☀️</span>
                  <span className='font-semibold text-white'>Sunny • 28°C</span>
                </div>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Expected Generation</span>
                <span className='font-semibold text-white'>22-24 kWh</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Cloud Cover</span>
                <span className='font-semibold text-white'>15%</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-300'>Efficiency Impact</span>
                <span className='font-semibold text-green-400'>+5%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Environmental Impact */}
      <Card className='card-readable'>
        <CardHeader>
          <CardTitle className='text-sm text-white flex items-center gap-2'>
            🌿 Environmental Impact
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-300'>CO₂ Saved Today</span>
            <span className='font-semibold text-green-400'>12.4 kg</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-300'>Trees Equivalent</span>
            <span className='font-semibold text-green-400'>0.6 trees</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-300'>Total CO₂ Saved</span>
            <span className='font-semibold text-green-400'>2.8 tons</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-sm text-gray-300'>Community Contribution</span>
            <span className='font-semibold text-green-400'>4.7%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}