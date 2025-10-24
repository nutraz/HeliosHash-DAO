'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  MapPin,
  Zap,
  IndianRupee,
  Users,
  Calendar,
  FileText,
  AlertCircle,
} from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function CreateProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    description: '',
    location: '',
    state: '',
    district: '',

    // Technical Details
    capacity: '',
    technology: '',
    estimatedCost: '',
    estimatedReturn: '',
    timeline: '',

    // Land & Legal
    landArea: '',
    landOwnership: '',
    landDocuments: null as File | null,
    environmentalClearance: '',

    // Financial
    fundingGoal: '',
    minInvestment: '',
    maxInvestors: '',

    // Government
    governmentApprovals: [] as string[],
    subsidyEligible: false,
    gridConnection: '',
  });

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
  ];

  const solarTechnologies = [
    'Crystalline Silicon (c-Si)',
    'Thin Film Solar',
    'Concentrated Solar Power (CSP)',
    'Floating Solar (Floatovoltaics)',
    'Agri-voltaics',
    'Building Integrated Photovoltaics (BIPV)',
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

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.description && formData.location && formData.state;
      case 2:
        return formData.capacity && formData.technology && formData.estimatedCost;
      case 3:
        return formData.landArea && formData.landOwnership;
      case 4:
        return formData.fundingGoal && formData.minInvestment;
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
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // Success - redirect to projects with success message
      router.push('/projects?created=true');
    } catch (error) {
      console.error('Error creating project:', error);
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
            <h1 className='text-2xl font-bold text-white'>Create Solar Project</h1>
            <p className='text-gray-400'>Launch a new community solar initiative</p>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className='bg-gray-800/50 border-gray-700 mb-6'>
          <CardContent className='p-4'>
            <div className='flex justify-between items-center mb-2'>
              <span className='text-sm text-gray-400'>Project Creation Progress</span>
              <span className='text-sm text-gray-400'>Step {currentStep} of 5</span>
            </div>
            <Progress value={progressValue} className='mb-2' />
            <div className='flex justify-between text-xs text-gray-500'>
              <span className={currentStep >= 1 ? 'text-orange-400' : ''}>Basic Info</span>
              <span className={currentStep >= 2 ? 'text-orange-400' : ''}>Technical</span>
              <span className={currentStep >= 3 ? 'text-orange-400' : ''}>Land & Legal</span>
              <span className={currentStep >= 4 ? 'text-orange-400' : ''}>Financial</span>
              <span className={currentStep >= 5 ? 'text-orange-400' : ''}>Review</span>
            </div>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-6'>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-bold text-white mb-2'>Basic Project Information</h2>
                  <p className='text-gray-400'>Tell us about your solar project vision</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='md:col-span-2'>
                    <Label htmlFor='name' className='text-white'>
                      Project Name *
                    </Label>
                    <Input
                      id='name'
                      placeholder='e.g., Mumbai Solar Grid Extension'
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <Label htmlFor='description' className='text-white'>
                      Project Description *
                    </Label>
                    <Textarea
                      id='description'
                      placeholder='Describe your solar project, its goals, and community impact...'
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2 min-h-[120px]'
                    />
                  </div>

                  <div>
                    <Label htmlFor='location' className='text-white'>
                      Location/Address *
                    </Label>
                    <Input
                      id='location'
                      placeholder='e.g., Sector 45, Noida'
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='state' className='text-white'>
                      State *
                    </Label>
                    <Select
                      value={formData.state}
                      onValueChange={(value) => handleInputChange('state', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select state' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state} className='text-white'>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='district' className='text-white'>
                      District
                    </Label>
                    <Input
                      id='district'
                      placeholder='e.g., Gautam Buddha Nagar'
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Technical Details */}
            {currentStep === 2 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-bold text-white mb-2'>Technical Specifications</h2>
                  <p className='text-gray-400'>Define the technical aspects of your project</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <Label htmlFor='capacity' className='text-white'>
                      Capacity (MW) *
                    </Label>
                    <Input
                      id='capacity'
                      type='number'
                      placeholder='e.g., 50'
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='technology' className='text-white'>
                      Solar Technology *
                    </Label>
                    <Select
                      value={formData.technology}
                      onValueChange={(value) => handleInputChange('technology', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select technology' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        {solarTechnologies.map((tech) => (
                          <SelectItem key={tech} value={tech} className='text-white'>
                            {tech}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor='estimatedCost' className='text-white'>
                      Estimated Cost (₹ Crores) *
                    </Label>
                    <Input
                      id='estimatedCost'
                      type='number'
                      placeholder='e.g., 25'
                      value={formData.estimatedCost}
                      onChange={(e) => handleInputChange('estimatedCost', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='estimatedReturn' className='text-white'>
                      Estimated Return (%)
                    </Label>
                    <Input
                      id='estimatedReturn'
                      type='number'
                      placeholder='e.g., 12'
                      value={formData.estimatedReturn}
                      onChange={(e) => handleInputChange('estimatedReturn', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='timeline' className='text-white'>
                      Project Timeline (months)
                    </Label>
                    <Input
                      id='timeline'
                      type='number'
                      placeholder='e.g., 18'
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='gridConnection' className='text-white'>
                      Grid Connection Type
                    </Label>
                    <Select
                      value={formData.gridConnection}
                      onValueChange={(value) => handleInputChange('gridConnection', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select connection type' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='on-grid' className='text-white'>
                          On-Grid
                        </SelectItem>
                        <SelectItem value='off-grid' className='text-white'>
                          Off-Grid
                        </SelectItem>
                        <SelectItem value='hybrid' className='text-white'>
                          Hybrid
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Land & Legal */}
            {currentStep === 3 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-bold text-white mb-2'>Land & Legal Requirements</h2>
                  <p className='text-gray-400'>Provide land and legal documentation details</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <Label htmlFor='landArea' className='text-white'>
                      Land Area (Acres) *
                    </Label>
                    <Input
                      id='landArea'
                      type='number'
                      placeholder='e.g., 100'
                      value={formData.landArea}
                      onChange={(e) => handleInputChange('landArea', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='landOwnership' className='text-white'>
                      Land Ownership *
                    </Label>
                    <Select
                      value={formData.landOwnership}
                      onValueChange={(value) => handleInputChange('landOwnership', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select ownership type' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='owned' className='text-white'>
                          Owned
                        </SelectItem>
                        <SelectItem value='leased' className='text-white'>
                          Leased
                        </SelectItem>
                        <SelectItem value='government' className='text-white'>
                          Government Land
                        </SelectItem>
                        <SelectItem value='community' className='text-white'>
                          Community Land
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='md:col-span-2'>
                    <Label htmlFor='landDocuments' className='text-white'>
                      Land Documents
                    </Label>
                    <div className='mt-2 p-4 border-2 border-dashed border-gray-600 rounded-lg text-center'>
                      <Upload className='w-8 h-8 text-gray-400 mx-auto mb-2' />
                      <p className='text-gray-400 text-sm'>
                        Upload land title, survey documents, NOCs
                      </p>
                      <input
                        type='file'
                        multiple
                        className='hidden'
                        id='landDocuments'
                        onChange={(e) =>
                          handleFileUpload('landDocuments', e.target.files?.[0] || null)
                        }
                      />
                      <Button
                        type='button'
                        variant='outline'
                        className='mt-2'
                        onClick={() => document.getElementById('landDocuments')?.click()}
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor='environmentalClearance' className='text-white'>
                      Environmental Clearance
                    </Label>
                    <Select
                      value={formData.environmentalClearance}
                      onValueChange={(value) => handleInputChange('environmentalClearance', value)}
                    >
                      <SelectTrigger className='bg-gray-700 border-gray-600 text-white mt-2'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent className='bg-gray-700 border-gray-600'>
                        <SelectItem value='obtained' className='text-white'>
                          Obtained
                        </SelectItem>
                        <SelectItem value='in-progress' className='text-white'>
                          In Progress
                        </SelectItem>
                        <SelectItem value='not-required' className='text-white'>
                          Not Required
                        </SelectItem>
                        <SelectItem value='pending' className='text-white'>
                          Pending Application
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Financial Details */}
            {currentStep === 4 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-bold text-white mb-2'>Financial Structure</h2>
                  <p className='text-gray-400'>Set up funding and investment parameters</p>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <Label htmlFor='fundingGoal' className='text-white'>
                      Funding Goal (₹ Crores) *
                    </Label>
                    <Input
                      id='fundingGoal'
                      type='number'
                      placeholder='e.g., 20'
                      value={formData.fundingGoal}
                      onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='minInvestment' className='text-white'>
                      Minimum Investment (₹) *
                    </Label>
                    <Input
                      id='minInvestment'
                      type='number'
                      placeholder='e.g., 50000'
                      value={formData.minInvestment}
                      onChange={(e) => handleInputChange('minInvestment', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>

                  <div>
                    <Label htmlFor='maxInvestors' className='text-white'>
                      Maximum Investors
                    </Label>
                    <Input
                      id='maxInvestors'
                      type='number'
                      placeholder='e.g., 1000'
                      value={formData.maxInvestors}
                      onChange={(e) => handleInputChange('maxInvestors', e.target.value)}
                      className='bg-gray-700 border-gray-600 text-white mt-2'
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <div className='space-y-6'>
                <div className='text-center mb-6'>
                  <h2 className='text-xl font-bold text-white mb-2'>Review & Submit</h2>
                  <p className='text-gray-400'>Review your project details before submission</p>
                </div>

                <div className='space-y-4'>
                  <Card className='bg-gray-700/50 border-gray-600'>
                    <CardHeader>
                      <CardTitle className='text-white'>Project Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                          <span className='text-gray-400'>Name:</span>
                          <span className='text-white ml-2'>{formData.name}</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Location:</span>
                          <span className='text-white ml-2'>
                            {formData.location}, {formData.state}
                          </span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Capacity:</span>
                          <span className='text-white ml-2'>{formData.capacity} MW</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Technology:</span>
                          <span className='text-white ml-2'>{formData.technology}</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Funding Goal:</span>
                          <span className='text-white ml-2'>₹{formData.fundingGoal} Crores</span>
                        </div>
                        <div>
                          <span className='text-gray-400'>Land Area:</span>
                          <span className='text-white ml-2'>{formData.landArea} Acres</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className='border-orange-500/50 bg-orange-500/10'>
                    <AlertCircle className='h-4 w-4 text-orange-400' />
                    <AlertDescription className='text-orange-400'>
                      By submitting this project, you agree to HeliosHash DAO's terms and
                      conditions. Your project will be reviewed by the community before going live.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <Separator className='my-6' />
            <div className='flex justify-between'>
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
                  className='bg-gradient-to-r from-orange-500 to-red-500'
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className='bg-gradient-to-r from-green-500 to-green-600'
                >
                  {isSubmitting ? 'Creating Project...' : 'Submit Project'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
