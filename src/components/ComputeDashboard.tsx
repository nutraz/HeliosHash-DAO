'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompute } from '@/hooks/useCompute';
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Coins,
  Cpu,
  Power,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';

export default function ComputeDashboard() {
  const {
    computeStatus,
    recommendations,
    healthStatus,
    loading,
    error,
    pivotComputeMode,
    updateComputeStats,
    fetchComputeStatus,
    emergencyShutdown,
    isConnected,
  } = useCompute();

  const [pivotLoading, setPivotLoading] = useState(false);

  const handlePivot = async (mode: string, trigger: string, threshold: number) => {
    setPivotLoading(true);
    const success = await pivotComputeMode(mode, trigger, threshold);
    setPivotLoading(false);

    if (success) {
      // Show success notification
      console.log(`Successfully pivoted to ${mode} mode`);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Bitcoin':
        return <Coins className='h-5 w-5' />;
      case 'AI':
        return <Brain className='h-5 w-5' />;
      case 'Hybrid':
        return <Cpu className='h-5 w-5' />;
      default:
        return <Cpu className='h-5 w-5' />;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'Bitcoin':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'AI':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Hybrid':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='flex items-center justify-center space-x-2'>
            <RefreshCw className='h-5 w-5 animate-spin' />
            <span>Connecting to compute canister...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h2 className='text-2xl font-bold'>Compute Management</h2>
          <p className='text-gray-600'>Bitcoin Mining ↔ Edge AI Compute Pivot System</p>
        </div>
        <Button variant='outline' onClick={() => fetchComputeStatus()} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertTriangle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center space-x-2'>
            {computeStatus?.mode && getModeIcon(computeStatus.mode)}
            <span>Current Mode: {computeStatus?.mode || 'Unknown'}</span>
            <Badge className={getModeColor(computeStatus?.mode || '')}>Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {computeStatus?.stats ? (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='space-y-2'>
                <div className='text-sm text-gray-600'>Hash Rate</div>
                <div className='text-2xl font-bold'>{computeStatus.stats.hashRate} TH/s</div>
              </div>
              <div className='space-y-2'>
                <div className='text-sm text-gray-600'>AI Workloads</div>
                <div className='text-2xl font-bold'>{computeStatus.stats.aiWorkloads}</div>
              </div>
              <div className='space-y-2'>
                <div className='text-sm text-gray-600'>Efficiency</div>
                <div className='text-2xl font-bold'>
                  {(computeStatus.stats.efficiency * 100).toFixed(1)}%
                </div>
              </div>
              <div className='space-y-2'>
                <div className='text-sm text-gray-600'>Daily Revenue</div>
                <div className='text-2xl font-bold'>${computeStatus.stats.revenue.toFixed(2)}</div>
              </div>
            </div>
          ) : (
            <div className='text-gray-500'>No statistics available</div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue='pivot' className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='pivot'>Pivot Control</TabsTrigger>
          <TabsTrigger value='recommendations'>AI Recommendations</TabsTrigger>
          <TabsTrigger value='health'>System Health</TabsTrigger>
          <TabsTrigger value='history'>Pivot History</TabsTrigger>
        </TabsList>

        {/* Pivot Control Tab */}
        <TabsContent value='pivot' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Coins className='h-5 w-5' />
                  <span>Bitcoin Mining</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600 mb-4'>
                  Traditional cryptocurrency mining with SHA-256 hashing.
                </p>
                <Button
                  onClick={() => handlePivot('bitcoin', 'manual', 0.1)}
                  disabled={pivotLoading || computeStatus?.mode === 'Bitcoin'}
                  className='w-full'
                >
                  {pivotLoading ? <RefreshCw className='h-4 w-4 animate-spin mr-2' /> : null}
                  Switch to Bitcoin
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Brain className='h-5 w-5' />
                  <span>Edge AI Compute</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600 mb-4'>
                  Decentralized AI inference and training workloads.
                </p>
                <Button
                  onClick={() => handlePivot('ai', 'profitability', 0.1)}
                  disabled={pivotLoading || computeStatus?.mode === 'AI'}
                  className='w-full'
                >
                  {pivotLoading ? <RefreshCw className='h-4 w-4 animate-spin mr-2' /> : null}
                  Switch to AI
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className='flex items-center space-x-2'>
                  <Cpu className='h-5 w-5' />
                  <span>Hybrid Mode</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-gray-600 mb-4'>
                  Balanced allocation between Bitcoin mining and AI compute.
                </p>
                <Button
                  onClick={() => handlePivot('hybrid', 'efficiency', 0.15)}
                  disabled={pivotLoading || computeStatus?.mode === 'Hybrid'}
                  className='w-full'
                >
                  {pivotLoading ? <RefreshCw className='h-4 w-4 animate-spin mr-2' /> : null}
                  Switch to Hybrid
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Recommendations Tab */}
        <TabsContent value='recommendations' className='space-y-4'>
          {recommendations.length > 0 ? (
            <div className='space-y-3'>
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardContent className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        {getModeIcon(rec.recommendedMode)}
                        <div>
                          <div className='font-medium'>Switch to {rec.recommendedMode}</div>
                          <div className='text-sm text-gray-600'>{rec.reason}</div>
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-sm text-gray-600'>Estimated Gain</div>
                        <div className='font-bold text-green-600'>
                          +{(rec.estimatedGain * 100).toFixed(1)}%
                        </div>
                        <div className='text-xs text-gray-500'>
                          Confidence: {(rec.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className='p-6 text-center'>
                <TrendingUp className='h-8 w-8 mx-auto text-gray-400 mb-2' />
                <div className='text-gray-500'>No recommendations available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value='health' className='space-y-4'>
          {healthStatus ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div className='flex justify-between'>
                      <span>Status</span>
                      <Badge
                        variant={healthStatus.status === 'operational' ? 'default' : 'destructive'}
                      >
                        {healthStatus.status}
                      </Badge>
                    </div>
                    <div className='flex justify-between'>
                      <span>Active Users</span>
                      <span>{healthStatus.activeUsers.toString()}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span>Total Hash Rate</span>
                      <span>{healthStatus.totalHashRate} TH/s</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-3'>
                    <div>
                      <div className='flex justify-between mb-2'>
                        <span className='text-sm'>Average Efficiency</span>
                        <span className='text-sm'>
                          {(healthStatus.averageEfficiency * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={healthStatus.averageEfficiency * 100} />
                    </div>
                    <div className='flex justify-between'>
                      <span>AI Workloads</span>
                      <span>{healthStatus.totalAIWorkloads.toString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className='p-6 text-center'>
                <BarChart3 className='h-8 w-8 mx-auto text-gray-400 mb-2' />
                <div className='text-gray-500'>Loading health data...</div>
              </CardContent>
            </Card>
          )}

          {/* Emergency Controls */}
          <Card className='border-red-200'>
            <CardHeader>
              <CardTitle className='text-red-600 flex items-center space-x-2'>
                <AlertTriangle className='h-5 w-5' />
                <span>Emergency Controls</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-gray-600 mb-4'>
                Use only in case of system malfunction or emergency situations.
              </p>
              <Button
                variant='destructive'
                onClick={() => emergencyShutdown('Manual emergency shutdown')}
                disabled={loading}
              >
                <Power className='h-4 w-4 mr-2' />
                Emergency Shutdown
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pivot History Tab */}
        <TabsContent value='history' className='space-y-4'>
          {computeStatus?.pivotHistory && computeStatus.pivotHistory.length > 0 ? (
            <div className='space-y-3'>
              {computeStatus.pivotHistory
                .slice(-10)
                .reverse()
                .map(([id, decision], index) => (
                  <Card key={index}>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-3'>
                          {getModeIcon(decision.newMode)}
                          <div>
                            <div className='font-medium'>Pivoted to {decision.newMode}</div>
                            <div className='text-sm text-gray-600'>Trigger: {decision.trigger}</div>
                            <div className='text-xs text-gray-500'>
                              {new Date(Number(decision.timestamp) / 1000000).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className='text-right'>
                          <div className='text-sm text-gray-600'>Impact</div>
                          <div className='font-bold'>
                            +{(decision.estimatedImpact * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <Card>
              <CardContent className='p-6 text-center'>
                <RefreshCw className='h-8 w-8 mx-auto text-gray-400 mb-2' />
                <div className='text-gray-500'>No pivot history available</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
