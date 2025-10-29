'use client';

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  Lock,
  Shield,
  Trash2,
  Unlock
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { GDPRComplianceService } from '../lib/compliance';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface PrivacyDashboardProps {
  userId: string;
  userLocation: string;
}

interface DataRequest {
  id: string;
  type: 'access' | 'rectification' | 'erasure' | 'portability';
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  completedAt?: string;
  description: string;
}

interface ConsentRecord {
  id: string;
  type: string;
  granted: boolean;
  timestamp: string;
  expiresAt?: string;
}

export const PrivacyDashboard: React.FC<PrivacyDashboardProps> = ({
  userId,
  userLocation
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [kycStatus, setKycStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);

  // GDPR: No getDataRequests/getConsentHistory/getKYCStatus methods exist, so stub data
  setDataRequests([]);
  setConsentRecords([]);
  setKycStatus({ verified: false, level: 'none' });

    } catch (err) {
      setError('Failed to load privacy data');
    } finally {
      setLoading(false);
    }
  };

  const handleDataRequest = async (type: 'access' | 'rectification' | 'erasure' | 'portability') => {
    try {
      setError('');
      // GDPR: No submitDataRequest/getDataRequests, so stub
      setDataRequests([]);
    } catch (err) {
      setError('Failed to submit data request');
    }
  };

  const handleConsentUpdate = async (consentType: string, granted: boolean) => {
    try {
      setError('');
      // GDPR: No updateConsent/getConsentHistory, so stub
      setConsentRecords([]);
    } catch (err) {
      setError('Failed to update consent');
    }
  };

  const getRequestStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'access':
        return 'Data Access';
      case 'rectification':
        return 'Data Correction';
      case 'erasure':
        return 'Data Deletion';
      case 'portability':
        return 'Data Portability';
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="text-center">Loading privacy dashboard...</div>
        </CardContent>
      </Card>
    );
  }

  const gdprApplicable = GDPRComplianceService.checkGDPRApplicability(userLocation);

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Dashboard
          </CardTitle>
          <CardDescription>
            Manage your personal data and privacy preferences
          </CardDescription>
        </CardHeader>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-rights">Data Rights</TabsTrigger>
          <TabsTrigger value="consents">Consents</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* KYC Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identity Verification</CardTitle>
              </CardHeader>
              <CardContent>
                {kycStatus ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {kycStatus.verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="font-medium">
                        {kycStatus.verified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                    {kycStatus.level && (
                      <Badge variant="secondary">
                        Level: {kycStatus.level}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No KYC data available</p>
                )}
              </CardContent>
            </Card>

            {/* GDPR Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">GDPR Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {gdprApplicable ? (
                      <Lock className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Unlock className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-medium">
                      {gdprApplicable ? 'GDPR Applicable' : 'GDPR Not Applicable'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {gdprApplicable
                      ? 'You have enhanced data protection rights under GDPR'
                      : 'Standard privacy protections apply'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dataRequests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      {getRequestStatusIcon(request.status)}
                      <div>
                        <p className="font-medium">{getRequestTypeLabel(request.type)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={request.status === 'completed' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
                {dataRequests.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No recent data requests
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-rights" className="space-y-4">
          {gdprApplicable ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Right to Access
                  </CardTitle>
                  <CardDescription>
                    Request a copy of all personal data we hold about you
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDataRequest('access')}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Request Data Access
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Right to Rectification
                  </CardTitle>
                  <CardDescription>
                    Request correction of inaccurate personal data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDataRequest('rectification')}
                    className="w-full"
                    variant="outline"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Request Data Correction
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Right to Erasure
                  </CardTitle>
                  <CardDescription>
                    Request deletion of your personal data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDataRequest('erasure')}
                    className="w-full"
                    variant="outline"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Request Data Deletion
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Right to Portability
                  </CardTitle>
                  <CardDescription>
                    Request your data in a portable format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDataRequest('portability')}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Request Data Portability
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="font-semibold">GDPR Rights Not Applicable</h3>
                    <p className="text-muted-foreground">
                      Based on your location, enhanced GDPR rights do not apply.
                      You still have standard privacy rights under applicable local laws.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="consents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consent Management</CardTitle>
              <CardDescription>
                Manage your consent preferences for data processing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {consentRecords.map((consent) => (
                  <div key={consent.id} className="flex items-center justify-between p-4 border rounded">
                    <div>
                      <p className="font-medium capitalize">{consent.type.replace('_', ' ')}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(consent.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={consent.granted ? 'default' : 'secondary'}>
                        {consent.granted ? 'Granted' : 'Revoked'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleConsentUpdate(consent.type, !consent.granted)}
                      >
                        {consent.granted ? 'Revoke' : 'Grant'}
                      </Button>
                    </div>
                  </div>
                ))}
                {consentRecords.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No consent records found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Request History</CardTitle>
              <CardDescription>
                Track the status of your data protection requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getRequestStatusIcon(request.status)}
                        <span className="font-medium">{getRequestTypeLabel(request.type)}</span>
                      </div>
                      <Badge variant={
                        request.status === 'completed' ? 'default' :
                        request.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {request.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(request.createdAt).toLocaleDateString()}
                      {request.completedAt && (
                        <span> • Completed: {new Date(request.completedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
                {dataRequests.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    No data requests found
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
