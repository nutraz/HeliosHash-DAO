'use client';

import { CheckCircle, Loader2, Shield, Upload, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

interface KycVerificationProps {
  userId: string;
  onVerificationComplete?: (result: any) => void;
}

export const KycVerification: React.FC<KycVerificationProps> = ({
  userId,
  onVerificationComplete
}) => {
  const [step, setStep] = useState<'select' | 'form' | 'uploading' | 'verifying' | 'complete'>('select');
  const [documentType, setDocumentType] = useState<'aadhaar' | 'pan' | 'passport'>('aadhaar');
  const [formData, setFormData] = useState({
    documentNumber: '',
    fullName: '',
    dateOfBirth: '',
    address: ''
  });
  const [files, setFiles] = useState({
    documentImage: null as File | null,
    selfieImage: null as File | null
  });
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleDocumentTypeSelect = async (type: 'aadhaar' | 'pan' | 'passport') => {
    setDocumentType(type);
    setStep('form');

    // Initiate KYC process
    try {
      // Use static KYCComplianceService from lib/compliance
      const { KYCComplianceService } = await import('../lib/compliance');
      const result = await KYCComplianceService.initiateKYC(userId, type);
      if (!result.success) {
        setError(result.error || 'Failed to initiate verification');
      }
    } catch (err) {
      setError('Failed to initiate KYC process');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: 'documentImage' | 'selfieImage', file: File | null) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async () => {
    setError('');
    setStep('uploading');

    try {
      // Upload documents first
      if (files.documentImage) {
        // In production, upload to secure storage
        console.log('Uploading document image...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (files.selfieImage) {
        console.log('Uploading selfie image...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setStep('verifying');

      // Perform verification
      const verificationData = {
        documentType,
        documentNumber: formData.documentNumber,
        fullName: formData.fullName,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        documentImage: files.documentImage,
        selfieImage: files.selfieImage
      };

      // Use static KYCComplianceService from lib/compliance
      const { KYCComplianceService } = await import('../lib/compliance');
      const result = await KYCComplianceService.verifyKYC(userId, verificationData);
      setVerificationResult(result);
      setStep('complete');

      if (onVerificationComplete) {
        onVerificationComplete(result);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
      setStep('form');
    }
  };

  const resetForm = () => {
    setStep('select');
    setFormData({
      documentNumber: '',
      fullName: '',
      dateOfBirth: '',
      address: ''
    });
    setFiles({ documentImage: null, selfieImage: null });
    setVerificationResult(null);
    setError('');
  };

  if (step === 'select') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Identity Verification
          </CardTitle>
          <CardDescription>
            Choose your preferred document type for KYC verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => handleDocumentTypeSelect('aadhaar')}
            >
              <div className="font-semibold">Aadhaar Card</div>
              <div className="text-sm text-muted-foreground">Indian citizens (12-digit number)</div>
              <Badge variant="secondary" className="mt-2">Recommended</Badge>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => handleDocumentTypeSelect('pan')}
            >
              <div className="font-semibold">PAN Card</div>
              <div className="text-sm text-muted-foreground">Indian tax identification</div>
              <Badge variant="secondary" className="mt-2">Standard</Badge>
            </Button>

            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start"
              onClick={() => handleDocumentTypeSelect('passport')}
            >
              <div className="font-semibold">Passport</div>
              <div className="text-sm text-muted-foreground">International document</div>
              <Badge variant="secondary" className="mt-2">Enhanced</Badge>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'form') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Enter Your Details</CardTitle>
          <CardDescription>
            Please provide accurate information matching your {documentType.toUpperCase()} document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="documentNumber">
              {documentType === 'aadhaar' ? 'Aadhaar Number' :
               documentType === 'pan' ? 'PAN Number' : 'Passport Number'}
            </Label>
            <Input
              id="documentNumber"
              placeholder={documentType === 'aadhaar' ? '1234 5678 9012' :
                          documentType === 'pan' ? 'ABCDE1234F' : 'A1234567'}
              value={formData.documentNumber}
              onChange={(e) => handleInputChange('documentNumber', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (as on document)</Label>
            <Input
              id="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
            />
          </div>

          {(documentType === 'pan' || documentType === 'passport') && (
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Enter your address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Document Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('documentImage', e.target.files?.[0] || null)}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600">
                    {files.documentImage ? files.documentImage.name : 'Click to upload document photo'}
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Selfie Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('selfieImage', e.target.files?.[0] || null)}
                  className="hidden"
                  id="selfie-upload"
                />
                <label htmlFor="selfie-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <div className="text-sm text-gray-600">
                    {files.selfieImage ? files.selfieImage.name : 'Click to upload selfie'}
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm} className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={!formData.documentNumber || !formData.fullName || !files.documentImage}
            >
              Submit for Verification
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'uploading' || step === 'verifying') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <div>
              <h3 className="font-semibold">
                {step === 'uploading' ? 'Uploading Documents...' : 'Verifying Identity...'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step === 'uploading'
                  ? 'Please wait while we securely upload your documents'
                  : 'Our system is verifying your identity. This may take a few moments.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'complete') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {verificationResult?.verified ? (
              <>
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="font-semibold text-green-700">Verification Successful!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your identity has been verified. You now have access to enhanced features.
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    KYC Level: {verificationResult.level}
                  </Badge>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-12 w-12 text-red-500 mx-auto" />
                <div>
                  <h3 className="font-semibold text-red-700">Verification Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    {verificationResult?.message || 'We could not verify your identity. Please check your documents and try again.'}
                  </p>
                </div>
              </>
            )}

            <Button onClick={resetForm} className="w-full">
              {verificationResult?.verified ? 'Continue' : 'Try Again'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
