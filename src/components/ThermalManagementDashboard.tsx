'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  AlertTriangle,
  Battery,
  Download,
  MapPin,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ThermalReading {
  id: string;
  timestamp: string;
  deviceId: string;
  deviceType: 'panel' | 'inverter' | 'battery';
  temperature: number;
  efficiency?: number;
  ambientTemp: number;
  humidity?: number;
  solarIrradiance?: number;
  alertLevel: 'normal' | 'warning' | 'critical';
}

interface ThermalAlert {
  id: string;
  timestamp: string;
  deviceId: string;
  alertType: string;
  severity: 'warning' | 'critical' | 'emergency';
  message: string;
  resolved: boolean;
}

interface ThermalProfile {
  panelTemp: number;
  inverterTemp: number;
  batteryTemp: number;
  efficiency: number;
  ambientTemp: number;
  solarIrradiance: number;
  windSpeed: number;
}

export function ThermalManagementDashboard() {
  const [currentProfile, setCurrentProfile] = useState<ThermalProfile>({
    panelTemp: 45.2,
    inverterTemp: 38.5,
    batteryTemp: 28.3,
    efficiency: 0.89,
    ambientTemp: 32.1,
    solarIrradiance: 750,
    windSpeed: 3.2,
  });

  const [alerts, setAlerts] = useState<ThermalAlert[]>([
    {
      id: '1',
      timestamp: '2025-10-05T14:30:00Z',
      deviceId: 'URGAM_PANEL_001',
      alertType: 'temperature',
      severity: 'warning',
      message: 'Panel temperature approaching maximum threshold (60°C approaching 65°C limit)',
      resolved: false,
    },
  ]);

  const [historicalData, setHistoricalData] = useState<ThermalReading[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial data
    refreshData();

    // Set up real-time data updates
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/thermal?type=current');
      const data = await response.json();

      if (data.success) {
        setCurrentProfile({
          panelTemp: data.data.profile.panelTemp,
          inverterTemp: data.data.profile.inverterTemp,
          batteryTemp: data.data.profile.batteryTemp,
          efficiency: data.data.profile.efficiency,
          ambientTemp: data.data.profile.ambientTemp,
          solarIrradiance: data.data.profile.solarIrradiance,
          windSpeed: data.data.profile.windSpeed,
        });
        setAlerts(data.data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to refresh thermal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportBIMData = async () => {
    try {
      const response = await fetch('/api/thermal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'export-bim' }),
      });

      const result = await response.json();

      if (result.success) {
        const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download =
          result.filename || `urgam-thermal-bim-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('BIM data exported successfully');
      } else {
        throw new Error(result.error || 'Export failed');
      }
    } catch (error) {
      console.error('Failed to export BIM data:', error);
    }
  };

  const getTemperatureColor = (temp: number, maxSafe: number) => {
    const percentage = temp / maxSafe;
    if (percentage < 0.7) return 'text-green-400';
    if (percentage < 0.9) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 0.9) return 'text-green-400';
    if (efficiency >= 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const activeAlerts = alerts.filter((alert) => !alert.resolved);
  const criticalAlerts = activeAlerts.filter((alert) => alert.severity === 'critical');

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <Thermometer className='h-8 w-8 text-orange-500' />
          <div>
            <h1 className='text-2xl font-bold'>IoT Thermal Management</h1>
            <p className='text-muted-foreground flex items-center gap-2'>
              <MapPin className='h-4 w-4' />
              Urgam Valley Solar Installation - Real-time Monitoring
            </p>
          </div>
        </div>

        <div className='flex gap-2'>
          <Button onClick={refreshData} disabled={loading} variant='outline'>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportBIMData} variant='outline'>
            <Download className='h-4 w-4 mr-2' />
            Export BIM
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className='border-red-500 bg-red-50'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>
            <strong>Critical Alert:</strong> {criticalAlerts[0].message}
          </AlertDescription>
        </Alert>
      )}

      {/* Current Status Overview */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Panel Temperature</CardTitle>
            <Thermometer className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${getTemperatureColor(currentProfile.panelTemp, 65)}`}
            >
              {currentProfile.panelTemp.toFixed(1)}°C
            </div>
            <div className='mt-2'>
              <Progress value={(currentProfile.panelTemp / 65) * 100} max={100} className='h-2' />
            </div>
            <p className='text-xs text-muted-foreground mt-1'>Max safe: 65°C</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>System Efficiency</CardTitle>
            <Zap className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEfficiencyColor(currentProfile.efficiency)}`}>
              {(currentProfile.efficiency * 100).toFixed(1)}%
            </div>
            <div className='mt-2'>
              <Progress value={currentProfile.efficiency * 100} max={100} className='h-2' />
            </div>
            <p className='text-xs text-muted-foreground mt-1'>Temperature-adjusted efficiency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Solar Irradiance</CardTitle>
            <Sun className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-yellow-400'>
              {currentProfile.solarIrradiance.toFixed(0)} W/m²
            </div>
            <div className='mt-2'>
              <Progress
                value={(currentProfile.solarIrradiance / 1000) * 100}
                max={100}
                className='h-2'
              />
            </div>
            <p className='text-xs text-muted-foreground mt-1'>Peak: 1000 W/m²</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active Alerts</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                activeAlerts.length > 0 ? 'text-yellow-400' : 'text-green-400'
              }`}
            >
              {activeAlerts.length}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {activeAlerts.length === 0
                ? 'All systems normal'
                : `${criticalAlerts.length} critical`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Battery className='h-5 w-5' />
              Equipment Temperature Status
            </CardTitle>
            <CardDescription>
              Real-time temperature monitoring for all solar equipment
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between p-3 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <Sun className='h-8 w-8 text-yellow-500' />
                <div>
                  <div className='font-medium'>Solar Panels</div>
                  <div className='text-sm text-muted-foreground'>URGAM_PANEL_001</div>
                </div>
              </div>
              <div className='text-right'>
                <div
                  className={`text-lg font-bold ${getTemperatureColor(
                    currentProfile.panelTemp,
                    65
                  )}`}
                >
                  {currentProfile.panelTemp.toFixed(1)}°C
                </div>
                <Badge variant={currentProfile.panelTemp > 60 ? 'destructive' : 'default'}>
                  {currentProfile.panelTemp > 60 ? 'Warning' : 'Normal'}
                </Badge>
              </div>
            </div>

            <div className='flex items-center justify-between p-3 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <Zap className='h-8 w-8 text-blue-500' />
                <div>
                  <div className='font-medium'>Inverter</div>
                  <div className='text-sm text-muted-foreground'>URGAM_INV_001</div>
                </div>
              </div>
              <div className='text-right'>
                <div
                  className={`text-lg font-bold ${getTemperatureColor(
                    currentProfile.inverterTemp,
                    40
                  )}`}
                >
                  {currentProfile.inverterTemp.toFixed(1)}°C
                </div>
                <Badge variant={currentProfile.inverterTemp > 35 ? 'destructive' : 'default'}>
                  {currentProfile.inverterTemp > 35 ? 'Warning' : 'Normal'}
                </Badge>
              </div>
            </div>

            <div className='flex items-center justify-between p-3 border rounded-lg'>
              <div className='flex items-center gap-3'>
                <Battery className='h-8 w-8 text-green-500' />
                <div>
                  <div className='font-medium'>Battery Storage</div>
                  <div className='text-sm text-muted-foreground'>URGAM_BAT_001</div>
                </div>
              </div>
              <div className='text-right'>
                <div
                  className={`text-lg font-bold ${getTemperatureColor(
                    currentProfile.batteryTemp,
                    35
                  )}`}
                >
                  {currentProfile.batteryTemp.toFixed(1)}°C
                </div>
                <Badge variant='default'>Normal</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Wind className='h-5 w-5' />
              Environmental Conditions
            </CardTitle>
            <CardDescription>Ambient conditions affecting thermal performance</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Thermometer className='h-4 w-4' />
                  Ambient Temperature
                </div>
                <div className='text-2xl font-bold'>{currentProfile.ambientTemp.toFixed(1)}°C</div>
              </div>

              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                  <Wind className='h-4 w-4' />
                  Wind Speed
                </div>
                <div className='text-2xl font-bold'>{currentProfile.windSpeed.toFixed(1)} m/s</div>
              </div>
            </div>

            <div className='space-y-2'>
              <div className='text-sm text-muted-foreground'>Cooling Effectiveness</div>
              <div className='flex items-center gap-2'>
                <Progress
                  value={Math.min(100, (currentProfile.windSpeed / 5) * 100)}
                  max={100}
                  className='flex-1 h-2'
                />
                <span className='text-sm'>{currentProfile.windSpeed > 3 ? 'Good' : 'Limited'}</span>
              </div>
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3'>
              <p className='text-xs text-blue-700'>
                <strong>Location:</strong> Urgam Valley, Uttarakhand (1,652m elevation)
                <br />
                <strong>Climate:</strong> Himalayan subtropical with high solar irradiance
                <br />
                <strong>Optimal Operating:</strong> Morning and evening hours for peak efficiency
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      {activeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <AlertTriangle className='h-5 w-5 text-yellow-500' />
              Active Thermal Alerts
            </CardTitle>
            <CardDescription>System alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {activeAlerts.map((alert) => (
                <div key={alert.id} className='flex items-start gap-3 p-3 border rounded-lg'>
                  <AlertTriangle
                    className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-500' : 'text-yellow-500'
                    }`}
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <Badge variant={alert.severity === 'critical' ? 'destructive' : 'default'}>
                        {alert.severity}
                      </Badge>
                      <span className='text-sm text-muted-foreground'>
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className='text-sm'>{alert.message}</p>
                    <p className='text-xs text-muted-foreground mt-1'>Device: {alert.deviceId}</p>
                  </div>
                  <Button size='sm' variant='outline'>
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
