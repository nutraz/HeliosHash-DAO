'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, MapPin, FileText, Users, Shield, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

/**
 * Render the multi-step partnership application page for land partners.
 *
 * Displays a five-step form (Personal, Land Details, Documents, Partnership, Review),
 * manages form state, validation, file uploads, progress, and handles submission navigation.
 *
 * @returns The React element representing the Partnership Application page UI.
 */
export default function PartnershipApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    address: '',

    // Land Details
    landLocation: '',
    landArea: '',
    landType: '',
    soilType: '',
    waterAccess: '',
    roadAccess: '',
    electricityAccess: '',

    // Legal Documents
    landTitle: '',
    ownershipProof: null as File | null,
    surveyDocuments: null as File | null,
    nocs: null as File | null,

    // Partnership Preferences
    partnershipType: '',
    expectedDuration: '',
    compensationPreference: '',
    additionalServices: [] as string[],

    // Experience
    previousPartnership: false,
    experience: '',
    references: '',
  });

  const partnershipTypes = [
    'Land Lease',
    'Revenue Sharing',
    'Joint Venture',
    'Sale Agreement',
    'Development Partnership',
  ];

  const compensationOptions = [
    'Fixed Monthly Rent',
    'Percentage of Energy Revenue',
    'One-time Payment',
    'Hybrid (Rent + Revenue Share)',
    'Equipment/Infrastructure',
  ];

  const additionalServiceOptions = [
    'Site Maintenance',
    'Security Services',
    'Local Coordination',
    'Construction Support',
    'Community Liaison',
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter((s) => s !== service)
        : [...prev.additionalServices, service],
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && formData.address;
      case 2:
        return formData.landLocation && formData.landArea && formData.landType;
      case 3:
        return formData.landTitle && formData.ownershipProof;
      case 4:
        return formData.partnershipType && formData.compensationPreference;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Here you would submit to your API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Success - redirect with success message
      router.push('/partnerships?applied=true');
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressValue = (currentStep / 5) * 100;

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='flex items-center space-x-4 mb-6'>
          <Button
            onClick={() => router.back()}
            variant='outline'
            size='sm'
            className='border-gray-600 text-gray-300 hover:bg-gray-800'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            Back
          </Button>
          <div>
            <h1 className='text-2xl font-bold text-white'>Apply as Land Partner</h1>
            <p className='text-gray-400'>
              Join HeliosHash DAO as a land partner for solar projects
            </p>
          </div>
        </div>

        {/* Partnership Benefits */}
        <Card className='bg-blue-500/10 border-blue-500/20 mb-6'>
          <CardContent className='p-6'>
            <h3 className='text-white font-semibold mb-4'>Partnership Benefits</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='flex items-center space-x-2'>
                <Badge className='bg-blue-500'>💰</Badge>
                <span className='text-white text-sm'>Steady Income Stream</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Badge className='bg-green-500'>🌱</Badge>
                <span className='text-white text-sm'>Environmental Impact</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Badge className='bg-purple-500'>⚡</Badge>
                <span className='text-white text-sm'>Free Electricity Access</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <Card className='bg-gray-800/50 border-gray-700 mb-6'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-400'>Application Progress</span>
              <span className='text-sm text-gray-400'>Step {currentStep} of 5</span>
            </div>
            <Progress value={progressValue} className='mb-2' />
            <div className='flex justify-between text-xs text-gray-500'>
              <span className={currentStep >= 1 ? 'text-blue-400' : ''}>Personal</span>
              <span className={currentStep >= 2 ? 'text-blue-400' : ''}>Land Details</span>
              <span className={currentStep >= 3 ? 'text-blue-400' : ''}>Documents</span>
              <span className={currentStep >= 4 ? 'text-blue-400' : ''}>Partnership</span>
              <span className={currentStep >= 5 ? 'text-blue-400' : ''}>Review</span>
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-6'>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <Users className='w-12 h-12 text-blue-400 mx-auto mb-2' />
                  <h2 className='text-xl font-bold text-white mb-2'>Personal Information</h2>
                  <p className='text-gray-400'>Tell us about yourself</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <Label htmlFor='fullName' className='text-white'>
                      Full Name *
                    </Label>
                    <Input
                      id='fullName'
                      placeholder='Enter your full name'
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='email' className='text-white'>
                      Email Address *
                    </Label>
                    <Input
                      id='email'
                      type='email'
                      placeholder='your.email@example.com'
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='phone' className='text-white'>
                      Phone Number *
                    </Label>
                    <Input
                      id='phone'
                      placeholder='+91 98765 43210'
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div className='md:col-span-1'>
                    <Label htmlFor='address' className='text-white'>
                      Current Address *
                    </Label>
                    <Textarea
                      id='address'
                      placeholder='Enter your current address'
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Land Details */}
            {currentStep === 2 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <MapPin className='w-12 h-12 text-blue-400 mx-auto mb-2' />
                  <h2 className='text-xl font-bold text-white mb-2'>Land Information</h2>
                  <p className='text-gray-400'>Details about your land for solar installation</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='md:col-span-2'>
                    <Label htmlFor='landLocation' className='text-white'>
                      Land Location *
                    </Label>
                    <Input
                      id='landLocation'
                      placeholder='Village, District, State'
                      value={formData.landLocation}
                      onChange={(e) => handleInputChange('landLocation', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='landArea' className='text-white'>
                      Land Area (Acres) *
                    </Label>
                    <Input
                      id='landArea'
                      type='number'
                      placeholder='e.g., 5'
                      value={formData.landArea}
                      onChange={(e) => handleInputChange('landArea', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='landType' className='text-white'>
                      Land Type *
                    </Label>
                    <Select
                      value={formData.landType}
                      onValueChange={(value) => handleInputChange('landType', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select land type' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='agricultural' className='text-white'>
                          Agricultural
                        </SelectItem>
                        <SelectItem value='barren' className='text-white'>
                          Barren/Wasteland
                        </SelectItem>
                        <SelectItem value='residential' className='text-white'>
                          Residential
                        </SelectItem>
                        <SelectItem value='commercial' className='text-white'>
                          Commercial
                        </SelectItem>
                        <SelectItem value='industrial' className='text-white'>
                          Industrial
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='soilType' className='text-white'>
                      Soil Type
                    </Label>
                    <Input
                      id='soilType'
                      placeholder='e.g., Clay, Sandy, Loam'
                      value={formData.soilType}
                      onChange={(e) => handleInputChange('soilType', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='waterAccess' className='text-white'>
                      Water Access
                    </Label>
                    <Select
                      value={formData.waterAccess}
                      onValueChange={(value) => handleInputChange('waterAccess', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Water availability' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='borewell' className='text-white'>
                          Borewell
                        </SelectItem>
                        <SelectItem value='canal' className='text-white'>
                          Canal
                        </SelectItem>
                        <SelectItem value='river' className='text-white'>
                          River/Stream
                        </SelectItem>
                        <SelectItem value='none' className='text-white'>
                          No Water Source
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='roadAccess' className='text-white'>
                      Road Access
                    </Label>
                    <Select
                      value={formData.roadAccess}
                      onValueChange={(value) => handleInputChange('roadAccess', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Road connectivity' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='paved' className='text-white'>
                          Paved Road
                        </SelectItem>
                        <SelectItem value='dirt' className='text-white'>
                          Dirt Road
                        </SelectItem>
                        <SelectItem value='limited' className='text-white'>
                          Limited Access
                        </SelectItem>
                        <SelectItem value='none' className='text-white'>
                          No Direct Access
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='electricityAccess' className='text-white'>
                      Electricity Grid Access
                    </Label>
                    <Select
                      value={formData.electricityAccess}
                      onValueChange={(value) => handleInputChange('electricityAccess', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Grid connectivity' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='connected' className='text-white'>
                          Grid Connected
                        </SelectItem>
                        <SelectItem value='nearby' className='text-white'>
                          Grid Nearby (&lt;1km)
                        </SelectItem>
                        <SelectItem value='distant' className='text-white'>
                          Grid Distant (&gt;1km)
                        </SelectItem>
                        <SelectItem value='none' className='text-white'>
                          No Grid Access
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Legal Documents */}
            {currentStep === 3 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <FileText className='w-12 h-12 text-blue-400 mx-auto mb-2' />
                  <h2 className='text-xl font-bold text-white mb-2'>Legal Documentation</h2>
                  <p className='text-gray-400'>Upload required legal documents</p>
                </div>

                <div className='space-y-6'>
                  <div>
                    <Label htmlFor='landTitle' className='text-white'>
                      Land Title/Registry Number *
                    </Label>
                    <Input
                      id='landTitle'
                      placeholder='Enter registry/khata number'
                      value={formData.landTitle}
                      onChange={(e) => handleInputChange('landTitle', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label className='text-white'>Land Ownership Documents *</Label>
                    <div className='mt-2 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center'>
                      <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-400 text-sm'>
                        Upload land title, sale deed, patta documents
                      </p>
                      <input
                        type='file'
                        multiple
                        className='hidden'
                        id='ownershipProof'
                        onChange={(e) =>
                          handleFileUpload('ownershipProof', e.target.files?.[0] || null)
                        }
                      />
                      <Button
                        type='button'
                        variant='outline'
                        className='mt-2'
                        onClick={() => document.getElementById('ownershipProof')?.click()}
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className='text-white'>Survey Documents</Label>
                    <div className='mt-2 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center'>
                      <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-400 text-sm'>
                        Upload survey settlement, boundary maps
                      </p>
                      <input
                        type='file'
                        multiple
                        className='hidden'
                        id='surveyDocuments'
                        onChange={(e) =>
                          handleFileUpload('surveyDocuments', e.target.files?.[0] || null)
                        }
                      />
                      <Button
                        type='button'
                        variant='outline'
                        className='mt-2'
                        onClick={() => document.getElementById('surveyDocuments')?.click()}
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className='text-white'>NOCs & Clearances</Label>
                    <div className='mt-2 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center'>
                      <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-400 text-sm'>
                        NOC from village panchayat, pollution board clearances
                      </p>
                      <input
                        type='file'
                        multiple
                        className='hidden'
                        id='nocs'
                        onChange={(e) => handleFileUpload('nocs', e.target.files?.[0] || null)}
                      />
                      <Button
                        type='button'
                        variant='outline'
                        className='mt-2'
                        onClick={() => document.getElementById('nocs')?.click()}
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Partnership Preferences */}
            {currentStep === 4 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <Shield className='w-12 h-12 text-blue-400 mx-auto mb-2' />
                  <h2 className='text-xl font-bold text-white mb-2'>Partnership Preferences</h2>
                  <p className='text-gray-400'>Choose your preferred partnership model</p>
                </div>

                <div className='space-y-6'>
                  <div>
                    <Label htmlFor='partnershipType' className='text-white'>
                      Partnership Type *
                    </Label>
                    <Select
                      value={formData.partnershipType}
                      onValueChange={(value) => handleInputChange('partnershipType', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select partnership model' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        {partnershipTypes.map((type) => (
                          <SelectItem key={type} value={type} className='text-white'>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='compensationPreference' className='text-white'>
                      Compensation Preference *
                    </Label>
                    <Select
                      value={formData.compensationPreference}
                      onValueChange={(value) => handleInputChange('compensationPreference', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select compensation model' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        {compensationOptions.map((option) => (
                          <SelectItem key={option} value={option} className='text-white'>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='expectedDuration' className='text-white'>
                      Expected Partnership Duration (Years)
                    </Label>
                    <Input
                      id='expectedDuration'
                      type='number'
                      placeholder='e.g., 25'
                      value={formData.expectedDuration}
                      onChange={(e) => handleInputChange('expectedDuration', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label className='text-white'>Additional Services You Can Provide</Label>
                    <div className='mt-2 space-y-2'>
                      {additionalServiceOptions.map((service) => (
                        <div key={service} className='flex items-center space-x-2'>
                          <Checkbox
                            id={service}
                            checked={formData.additionalServices.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                            className='border-gray-600'
                          />
                          <Label htmlFor={service} className='text-white text-sm'>
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='previousPartnership'
                        checked={formData.previousPartnership}
                        onCheckedChange={(checked) =>
                          handleInputChange('previousPartnership', checked)
                        }
                        className='border-gray-600'
                      />
                      <Label htmlFor='previousPartnership' className='text-white'>
                        I have previous experience with solar partnerships
                      </Label>
                    </div>
                  </div>

                  {formData.previousPartnership && (
                    <div>
                      <Label htmlFor='experience' className='text-white'>
                        Previous Experience Details
                      </Label>
                      <Textarea
                        id='experience'
                        placeholder='Describe your previous solar partnership experience...'
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className='bg-gray-700 border-gray-600 text-white mt-2'
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-bold text-white mb-2'>Review Application</h2>
                  <p className='text-gray-400'>
                    Review your partnership application before submission
                  </p>
                </div>

                <div className='space-y-4'>
                  <Card className='bg-gray-700/50 border-gray-600'>
                    <CardHeader>
                      <CardTitle className='text-white'>Application Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='text-gray-400'>Applicant:</span>
                          <span className='text-white ml-2'>{formData.fullName}</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Email:</span>
                          <span className='text-white ml-2'>{formData.email}</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Land Location:</span>
                          <span className='text-white ml-2'>{formData.landLocation}</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Land Area:</span>
                          <span className='text-white ml-2'>{formData.landArea} Acres</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Partnership Type:</span>
                          <span className='text-white ml-2'>{formData.partnershipType}</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Compensation:</span>
                          <span className='text-white ml-2'>{formData.compensationPreference}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className='flex justify-between mt-8 pt-6 border-t border-gray-700'>
              <Button
                variant='outline'
                onClick={prevStep}
                disabled={currentStep === 1}
                className='border-gray-600 text-gray-300'
              >
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className='bg-gradient-to-r from-blue-500 to-blue-600'
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='bg-gradient-to-r from-green-500 to-green-600'
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}