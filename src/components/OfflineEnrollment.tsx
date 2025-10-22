'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { withCsrfHeaders } from '@/lib/csrf';
import {
    AlertCircle,
    CheckCircle,
    CreditCard,
    FileText,
    MessageSquare,
    Phone,
    QrCode,
    Shield,
    Smartphone,
} from 'lucide-react';
import { useState } from 'react';

interface EnrollmentStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface USSDRegistration {
  phoneNumber: string;
  verificationCode: string;
  aadhaarLast4: string;
  membershipTier: 'basic' | 'premium' | 'steward';
  status: 'pending' | 'verified' | 'active';
}

export default function OfflineEnrollment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [registration, setRegistration] = useState<USSDRegistration>({
    phoneNumber: '',
    verificationCode: '',
    aadhaarLast4: '',
    membershipTier: 'basic',
    status: 'pending',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enrollmentSteps: EnrollmentStep[] = [
    {
      id: 'phone',
      title: 'Phone Verification',
      description: 'Verify your mobile number for USSD access',
      completed: false,
      required: true,
    },
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Complete Aadhaar-based KYC verification',
      completed: false,
      required: true,
    },
    {
      id: 'membership',
      title: 'Select Membership Tier',
      description: 'Choose your DAO participation level',
      completed: false,
      required: true,
    },
    {
      id: 'payment',
      title: 'Payment Setup',
      description: 'Configure UPI payment for membership',
      completed: false,
      required: false,
    },
    {
      id: 'ussd',
      title: 'USSD Access Setup',
      description: 'Test offline voting capabilities',
      completed: false,
      required: true,
    },
  ];

  const membershipTiers = [
    {
      id: 'basic',
      name: 'Community Member',
      price: '₹500',
      features: ['Vote on proposals', 'USSD/SMS access', 'Basic rewards'],
      description: 'Perfect for community participation',
    },
    {
      id: 'premium',
      name: 'Active Contributor',
      price: '₹2,000',
      features: ['All Basic features', 'Submit proposals', 'Higher rewards', 'Priority support'],
      description: 'For engaged community members',
    },
    {
      id: 'steward',
      name: 'Land Steward',
      price: '₹10,000',
      features: [
        'All Premium features',
        'Governance rights',
        'Land usage votes',
        'Revenue sharing',
      ],
      description: 'For local farmers and land owners',
    },
  ];

  const handlePhoneVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate phone verification API call
      const response = await fetch(
        '/api/verify-phone',
        await withCsrfHeaders({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: registration.phoneNumber }),
        })
      );

      if (response.ok) {
        const data = await response.json();
        setRegistration((prev) => ({ ...prev, verificationCode: data.code }));

        // Mark step as completed
        enrollmentSteps[0].completed = true;
        setCurrentStep(1);
      } else {
        setError('Failed to send verification code');
      }
    } catch (err) {
      setError('Network error during verification');
    } finally {
      setLoading(false);
    }
  };

  const handleIdentityVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulate Aadhaar verification
      const response = await fetch(
        '/api/verify-identity',
        await withCsrfHeaders({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phoneNumber: registration.phoneNumber,
            aadhaarLast4: registration.aadhaarLast4,
          }),
        })
      );

      if (response.ok) {
        enrollmentSteps[1].completed = true;
        setCurrentStep(2);
      } else {
        setError('Identity verification failed');
      }
    } catch (err) {
      setError('Verification service unavailable');
    } finally {
      setLoading(false);
    }
  };

  const handleMembershipSelection = (tier: 'basic' | 'premium' | 'steward') => {
    setRegistration((prev) => ({ ...prev, membershipTier: tier }));
    enrollmentSteps[2].completed = true;
    setCurrentStep(3);
  };

  const handleUSSDTest = async () => {
    setLoading(true);
    setError(null);

    try {
      // Test USSD connectivity
      const response = await fetch(
        '/api/test-ussd',
        await withCsrfHeaders({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phoneNumber: registration.phoneNumber }),
        })
      );

      if (response.ok) {
        enrollmentSteps[4].completed = true;
        setRegistration((prev) => ({ ...prev, status: 'active' }));
      } else {
        setError('USSD test failed');
      }
    } catch (err) {
      setError('Could not test USSD connection');
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = () => {
    const completedSteps = enrollmentSteps.filter((step) => step.completed).length;
    return (completedSteps / enrollmentSteps.length) * 100;
  };

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='text-center space-y-2'>
        <h1 className='text-3xl font-bold'>Offline DAO Enrollment</h1>
        <p className='text-gray-600'>
          Enable smartphone-free participation through USSD/SMS voting
        </p>
        <div className='flex justify-center items-center space-x-4'>
          <Progress value={getStepProgress()} className='w-64' />
          <span className='text-sm text-gray-500'>
            {enrollmentSteps.filter((s) => s.completed).length} / {enrollmentSteps.length} completed
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant='destructive'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs
        value={currentStep.toString()}
        onValueChange={(value) => setCurrentStep(parseInt(value))}
      >
        <TabsList className='grid w-full grid-cols-5'>
          {enrollmentSteps.map((step, index) => (
            <TabsTrigger
              key={step.id}
              value={index.toString()}
              disabled={index > currentStep && !step.completed}
              className='flex items-center space-x-2'
            >
              {step.completed ? (
                <CheckCircle className='h-4 w-4 text-green-500' />
              ) : (
                <span className='text-sm'>{index + 1}</span>
              )}
              <span className='hidden md:inline'>{step.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Step 1: Phone Verification */}
        <TabsContent value='0' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Smartphone className='h-5 w-5' />
                <span>Phone Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='phone'>Mobile Number</Label>
                <Input
                  id='phone'
                  type='tel'
                  placeholder='+91 XXXXX XXXXX'
                  value={registration.phoneNumber}
                  onChange={(e) =>
                    setRegistration((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                />
              </div>

              <Alert>
                <MessageSquare className='h-4 w-4' />
                <AlertDescription>
                  This number will be used for USSD voting access. Make sure it's a valid Indian
                  mobile number.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handlePhoneVerification}
                disabled={!registration.phoneNumber || loading}
                className='w-full'
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>

              {registration.verificationCode && (
                <div className='p-4 bg-green-50 rounded-lg border border-green-200'>
                  <div className='text-sm text-green-800'>
                    Verification code sent! Check your SMS.
                  </div>
                  <div className='font-mono text-lg mt-2'>
                    Code: {registration.verificationCode}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 2: Identity Verification */}
        <TabsContent value='1' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Shield className='h-5 w-5' />
                <span>Identity Verification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='aadhaar'>Last 4 digits of Aadhaar</Label>
                <Input
                  id='aadhaar'
                  type='password'
                  maxLength={4}
                  placeholder='XXXX'
                  value={registration.aadhaarLast4}
                  onChange={(e) =>
                    setRegistration((prev) => ({
                      ...prev,
                      aadhaarLast4: e.target.value,
                    }))
                  }
                />
              </div>

              <Alert>
                <FileText className='h-4 w-4' />
                <AlertDescription>
                  We only collect the last 4 digits for verification. Full Aadhaar details are
                  processed securely and not stored.
                </AlertDescription>
              </Alert>

              <Button
                onClick={handleIdentityVerification}
                disabled={registration.aadhaarLast4.length !== 4 || loading}
                className='w-full'
              >
                {loading ? 'Verifying...' : 'Verify Identity'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 3: Membership Selection */}
        <TabsContent value='2' className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {membershipTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`cursor-pointer transition-all ${
                  registration.membershipTier === tier.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'hover:shadow-md'
                }`}
                onClick={() =>
                  handleMembershipSelection(tier.id as 'basic' | 'premium' | 'steward')
                }
              >
                <CardHeader>
                  <CardTitle className='flex items-center justify-between'>
                    <span>{tier.name}</span>
                    <span className='text-2xl font-bold text-green-600'>{tier.price}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-sm text-gray-600 mb-3'>{tier.description}</p>
                  <ul className='space-y-1'>
                    {tier.features.map((feature, index) => (
                      <li key={index} className='flex items-center space-x-2 text-sm'>
                        <CheckCircle className='h-3 w-3 text-green-500' />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Step 4: Payment Setup */}
        <TabsContent value='3' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <CreditCard className='h-5 w-5' />
                <span>Payment Setup</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='text-center space-y-4'>
                <div className='text-lg font-semibold'>
                  Selected:{' '}
                  {membershipTiers.find((t) => t.id === registration.membershipTier)?.name}
                </div>
                <div className='text-3xl font-bold text-green-600'>
                  {membershipTiers.find((t) => t.id === registration.membershipTier)?.price}
                </div>

                <div className='flex justify-center'>
                  <QrCode className='h-32 w-32 text-gray-400' />
                </div>

                <p className='text-sm text-gray-600'>
                  Scan QR code with any UPI app to complete payment
                </p>

                <Button className='w-full'>Pay with UPI</Button>

                <div className='text-xs text-gray-500'>
                  Or SMS "PAY {registration.membershipTier.toUpperCase()}" to 4567
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Step 5: USSD Test */}
        <TabsContent value='4' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center space-x-2'>
                <Phone className='h-5 w-5' />
                <span>USSD Access Test</span>
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Alert>
                <MessageSquare className='h-4 w-4' />
                <AlertDescription>
                  Test your offline voting access by dialing the USSD code.
                </AlertDescription>
              </Alert>

              <div className='text-center space-y-4'>
                <div className='text-2xl font-bold font-mono'>Dial: *123#</div>
                <p className='text-gray-600'>
                  This will open the HeliosHash DAO voting menu on your phone
                </p>

                <Button onClick={handleUSSDTest} disabled={loading} className='w-full'>
                  {loading ? 'Testing...' : 'Test USSD Connection'}
                </Button>
              </div>

              <div className='space-y-3'>
                <h4 className='font-semibold'>Available Commands:</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <code>*123*1#</code>
                    <span>View active proposals</span>
                  </div>
                  <div className='flex justify-between'>
                    <code>*123*2#</code>
                    <span>Vote on proposals</span>
                  </div>
                  <div className='flex justify-between'>
                    <code>SMS: VOTE 1 YES</code>
                    <span>Direct SMS voting</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success State */}
      {registration.status === 'active' && (
        <Card className='border-green-200 bg-green-50'>
          <CardContent className='p-6 text-center'>
            <CheckCircle className='h-12 w-12 text-green-500 mx-auto mb-4' />
            <h3 className='text-xl font-semibold text-green-800 mb-2'>Enrollment Complete!</h3>
            <p className='text-green-700 mb-4'>
              You can now participate in DAO governance even without a smartphone.
            </p>
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <strong>USSD:</strong> *123#
              </div>
              <div>
                <strong>SMS:</strong> Send to 4567
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
