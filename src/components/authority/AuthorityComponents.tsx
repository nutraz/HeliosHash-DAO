// Advanced UI Components for Authority Dashboard
'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ApprovalItem, IoTSensor } from '@/services/telemetryService';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Thermometer,
  Wind,
  XCircle,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

// Real-time IoT Sensor Card Component
export const IoTSensorCard = ({
  sensor,
  onViewDetails,
}: {
  sensor: IoTSensor;
  onViewDetails: (sensorId: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'energy_production':
        return <Zap className='w-4 h-4' />;
      case 'mining_heat':
        return <Thermometer className='w-4 h-4' />;
      case 'emissions':
        return <Wind className='w-4 h-4' />;
      case 'grid_status':
        return <Activity className='w-4 h-4' />;
      default:
        return <Activity className='w-4 h-4' />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-400';
      case 'high':
        return 'text-orange-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const isThresholdExceeded = () => {
    const { value } = sensor.lastReading;
    const { min, max, critical } = sensor.thresholds;

    if (critical && value >= critical) return 'critical';
    if (max && value >= max) return 'high';
    if (min && value <= min) return 'low';
    return 'normal';
  };

  const thresholdStatus = isThresholdExceeded();

  return (
    <Card className='bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors'>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='p-2 bg-blue-500/20 rounded-lg'>{getSensorIcon(sensor.type)}</div>
            <div>
              <CardTitle className='text-sm font-medium text-white'>{sensor.name}</CardTitle>
              <p className='text-xs text-gray-400'>{sensor.location.address}</p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(sensor.status)}`} />
            <Badge variant='secondary' className='text-xs'>
              {sensor.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Current Reading */}
        <div className='flex items-center justify-between'>
          <div>
            <div
              className={`text-2xl font-bold ${
                thresholdStatus === 'critical'
                  ? 'text-red-400'
                  : thresholdStatus === 'high'
                    ? 'text-orange-400'
                    : thresholdStatus === 'low'
                      ? 'text-yellow-400'
                      : 'text-green-400'
              }`}
            >
              {sensor.lastReading.value.toFixed(1)}
            </div>
            <div className='text-xs text-gray-400'>{sensor.lastReading.unit}</div>
          </div>
          {thresholdStatus !== 'normal' && (
            <AlertTriangle
              className={`w-5 h-5 ${
                thresholdStatus === 'critical'
                  ? 'text-red-400'
                  : thresholdStatus === 'high'
                    ? 'text-orange-400'
                    : 'text-yellow-400'
              }`}
            />
          )}
        </div>

        {/* Threshold Indicator */}
        {sensor.thresholds.max && (
          <div>
            <div className='flex justify-between text-xs mb-1'>
              <span className='text-gray-400'>Threshold</span>
              <span className='text-gray-400'>
                {sensor.thresholds.min && `${sensor.thresholds.min} - `}
                {sensor.thresholds.max} {sensor.lastReading.unit}
              </span>
            </div>
            <Progress
              value={Math.min((sensor.lastReading.value / sensor.thresholds.max) * 100, 100)}
              className='h-2'
            />
          </div>
        )}

        {/* Alerts */}
        {sensor.alerts.count > 0 && (
          <div className='p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg'>
            <div className='flex items-center justify-between text-xs'>
              <span className={getSeverityColor(sensor.alerts.severity)}>
                {sensor.alerts.count} active alerts
              </span>
              {sensor.alerts.lastAlert && (
                <span className='text-gray-400'>{sensor.alerts.lastAlert}</span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onViewDetails(sensor.id)}
            className='flex-1 text-xs'
          >
            <Eye className='w-3 h-3 mr-1' />
            Details
          </Button>
          {sensor.alerts.count > 0 && (
            <Button
              variant='outline'
              size='sm'
              className='flex-1 text-xs text-orange-400 border-orange-400/30'
            >
              <AlertTriangle className='w-3 h-3 mr-1' />
              Alerts
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Approval Item Card with Workflow Actions
export const ApprovalItemCard = ({
  item,
  onApprove,
  onReject,
  onEscalate,
  onViewDocuments,
}: {
  item: ApprovalItem;
  onApprove: (id: string, notes?: string) => void;
  onReject: (id: string, notes?: string) => void;
  onEscalate: (id: string, reason: string) => void;
  onViewDocuments: (id: string) => void;
}) => {
  const [showActions, setShowActions] = useState(false);
  const [notes, setNotes] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'under_review':
        return 'text-blue-400';
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      case 'escalated':
        return 'text-purple-400';
      default:
        return 'text-gray-400';
    }
  };

  const getComplianceScore = () => {
    const checks = Object.values(item.complianceChecks);
    const passed = checks.filter(Boolean).length;
    return (passed / checks.length) * 100;
  };

  const isOverdue = () => {
    return new Date(item.dueDate) < new Date();
  };

  return (
    <Card className='bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors'>
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <div className='flex items-center space-x-2 mb-2'>
              <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`} />
              <Badge variant='secondary' className='text-xs'>
                {item.type.replace('_', ' ')}
              </Badge>
              <Badge variant='outline' className={`text-xs ${getStatusColor(item.status)}`}>
                {item.status.replace('_', ' ')}
              </Badge>
            </div>
            <CardTitle className='text-sm font-medium text-white mb-1'>{item.title}</CardTitle>
            <p className='text-xs text-gray-400 line-clamp-2'>{item.description}</p>
          </div>
          {isOverdue() && <AlertCircle className='w-5 h-5 text-red-400' />}
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Requestor and Timing */}
        <div className='flex justify-between text-xs'>
          <div>
            <span className='text-gray-400'>Requestor: </span>
            <span className='text-white'>{item.requestor.name}</span>
          </div>
          <div>
            <span className={isOverdue() ? 'text-red-400' : 'text-gray-400'}>
              Due: {new Date(item.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Compliance Score */}
        <div>
          <div className='flex justify-between text-xs mb-1'>
            <span className='text-gray-400'>Compliance Checks</span>
            <span className='text-white'>{getComplianceScore().toFixed(0)}%</span>
          </div>
          <Progress value={getComplianceScore()} className='h-2' />
          <div className='flex justify-between text-xs mt-1'>
            {Object.entries(item.complianceChecks).map(([key, passed]) => (
              <span key={key} className={passed ? 'text-green-400' : 'text-red-400'}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            ))}
          </div>
        </div>

        {/* Documents */}
        <div className='flex items-center justify-between'>
          <span className='text-xs text-gray-400'>{item.documents.length} documents</span>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onViewDocuments(item.id)}
            className='text-xs'
          >
            <FileText className='w-3 h-3 mr-1' />
            View Docs
          </Button>
        </div>

        {/* Action Buttons */}
        {item.status === 'pending' && !showActions && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowActions(true)}
            className='w-full text-xs'
          >
            Review & Take Action
          </Button>
        )}

        {showActions && item.status === 'pending' && (
          <div className='space-y-3 p-3 bg-gray-700/30 rounded-lg'>
            <textarea
              placeholder='Add review notes (optional)...'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className='w-full p-2 bg-gray-600 text-white text-xs rounded border border-gray-500 resize-none'
              rows={2}
            />
            <div className='flex space-x-2'>
              <Button
                size='sm'
                onClick={() => onApprove(item.id, notes)}
                className='flex-1 text-xs bg-green-600 hover:bg-green-700'
              >
                <CheckCircle className='w-3 h-3 mr-1' />
                Approve
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => onReject(item.id, notes)}
                className='flex-1 text-xs text-red-400 border-red-400/30'
              >
                <XCircle className='w-3 h-3 mr-1' />
                Reject
              </Button>
              <Button
                size='sm'
                variant='outline'
                onClick={() => onEscalate(item.id, notes || 'Escalated for further review')}
                className='flex-1 text-xs text-purple-400 border-purple-400/30'
              >
                <AlertTriangle className='w-3 h-3 mr-1' />
                Escalate
              </Button>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowActions(false)}
              className='w-full text-xs'
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Compliance Report Generator Component
export const ComplianceReportGenerator = ({
  onGenerateReport,
}: {
  onGenerateReport: (params: any) => void;
}) => {
  const [reportParams, setReportParams] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    format: 'pdf' as 'pdf' | 'csv',
    includeProjects: [] as string[],
    sections: {
      environmental: true,
      financial: true,
      technical: true,
      governance: true,
    },
  });

  const handleGenerate = () => {
    onGenerateReport({
      period: {
        start: reportParams.startDate,
        end: reportParams.endDate,
      },
      format: reportParams.format,
      sections: Object.entries(reportParams.sections)
        .filter(([_, included]) => included)
        .map(([section]) => section),
    });
  };

  return (
    <Card className='bg-gray-800/50 border-gray-700'>
      <CardHeader>
        <CardTitle className='text-white flex items-center'>
          <FileText className='w-5 h-5 mr-2' />
          Generate Compliance Report
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Date Range */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-xs text-gray-400 block mb-1'>Start Date</label>
            <input
              type='date'
              value={reportParams.startDate}
              onChange={(e) => setReportParams((prev) => ({ ...prev, startDate: e.target.value }))}
              className='w-full p-2 bg-gray-600 text-white text-xs rounded border border-gray-500'
            />
          </div>
          <div>
            <label className='text-xs text-gray-400 block mb-1'>End Date</label>
            <input
              type='date'
              value={reportParams.endDate}
              onChange={(e) => setReportParams((prev) => ({ ...prev, endDate: e.target.value }))}
              className='w-full p-2 bg-gray-600 text-white text-xs rounded border border-gray-500'
            />
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <label className='text-xs text-gray-400 block mb-2'>Report Format</label>
          <div className='flex space-x-2'>
            <Button
              variant={reportParams.format === 'pdf' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setReportParams((prev) => ({ ...prev, format: 'pdf' }))}
              className='flex-1 text-xs'
            >
              PDF Report
            </Button>
            <Button
              variant={reportParams.format === 'csv' ? 'default' : 'outline'}
              size='sm'
              onClick={() => setReportParams((prev) => ({ ...prev, format: 'csv' }))}
              className='flex-1 text-xs'
            >
              CSV Data
            </Button>
          </div>
        </div>

        {/* Sections */}
        <div>
          <label className='text-xs text-gray-400 block mb-2'>Include Sections</label>
          <div className='space-y-2'>
            {Object.entries(reportParams.sections).map(([section, included]) => (
              <label key={section} className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={included}
                  onChange={(e) =>
                    setReportParams((prev) => ({
                      ...prev,
                      sections: { ...prev.sections, [section]: e.target.checked },
                    }))
                  }
                  className='rounded border-gray-500 bg-gray-600'
                />
                <span className='text-xs text-white capitalize'>{section} Compliance</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={handleGenerate} className='w-full'>
          <Download className='w-4 h-4 mr-2' />
          Generate Report
        </Button>
      </CardContent>
    </Card>
  );
};
