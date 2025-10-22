'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Handshake,
  MapPin,
  Shield,
  Sun,
  TrendingUp,
  Users,
  Vote,
} from 'lucide-react';
import React, { useState } from 'react';

export type UserRole = 'Community' | 'Investor' | 'Authority' | 'Partner' | 'DAO';

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  benefits: string[];
  responsibilities: string[];
  color: string;
  bgGradient: string;
}

interface OnboardingFormData {
  username: string;
  email: string;
  displayName: string;
  role: UserRole | null;
  location: string;
  aadhaarNumber?: string;
  organization?: string;
  experience?: string;
}

interface RoleBasedOnboardingProps {
  onComplete: (data: OnboardingFormData) => Promise<void>;
  onCancel?: () => void;
}

export const RoleBasedOnboarding = ({ onComplete, onCancel }: RoleBasedOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingFormData>({
    username: '',
    email: '',
    displayName: '',
    role: null,
    location: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions: RoleOption[] = [
    {
      role: 'Community',
      title: 'Community Member',
      description: 'Local residents, farmers, and village participants in solar energy projects',
      icon: <Users className='w-8 h-8' />,
      benefits: [
        'Access to local solar job opportunities',
        'Training and skill development programs',
        'Direct energy savings from local projects',
        'Community governance participation',
      ],
      responsibilities: [
        'Participate in community meetings',
        'Provide local knowledge and support',
        'Help maintain community solar assets',
        'Support project awareness and adoption',
      ],
      color: 'text-green-400',
      bgGradient: 'from-green-500/20 to-blue-500/20',
    },
    {
      role: 'Investor',
      title: 'Solar Investor',
      description: 'Token holders and financial participants supporting solar infrastructure',
      icon: <TrendingUp className='w-8 h-8' />,
      benefits: [
        'OWP token staking and rewards',
        'Project investment opportunities',
        'Transparent ROI tracking',
        'Portfolio diversification in clean energy',
      ],
      responsibilities: [
        'Provide project funding and liquidity',
        'Vote on investment proposals',
        'Monitor project performance',
        'Support sustainable growth initiatives',
      ],
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-orange-500/20',
    },
    {
      role: 'Authority',
      title: 'Government Official',
      description: 'Gram Panchayat members, state officials, and regulatory authorities',
      icon: <Shield className='w-8 h-8' />,
      benefits: [
        'Real-time project monitoring dashboard',
        'Compliance and audit tools',
        'Community impact reporting',
        'Direct communication with stakeholders',
      ],
      responsibilities: [
        'Ensure regulatory compliance',
        'Approve project proposals',
        'Monitor environmental impact',
        'Facilitate government coordination',
      ],
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-purple-500/20',
    },
    {
      role: 'Partner',
      title: 'Strategic Partner',
      description: 'NGOs, corporations, and organizations supporting the solar ecosystem',
      icon: <Handshake className='w-8 h-8' />,
      benefits: [
        'Partnership proposal submission',
        'Collaborative project development',
        'Impact measurement and reporting',
        'Network expansion opportunities',
      ],
      responsibilities: [
        'Provide expertise and resources',
        'Support community engagement',
        'Contribute to project sustainability',
        'Maintain partnership commitments',
      ],
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-pink-500/20',
    },
    {
      role: 'DAO',
      title: 'DAO Governance',
      description: 'Active participants in decentralized autonomous organization governance',
      icon: <Vote className='w-8 h-8' />,
      benefits: [
        'Full voting rights on proposals',
        'Access to governance rewards',
        'Strategic decision participation',
        'Advanced analytics and insights',
      ],
      responsibilities: [
        'Review and vote on all proposals',
        'Maintain active participation',
        'Support community consensus building',
        'Contribute to long-term vision',
      ],
      color: 'text-orange-400',
      bgGradient: 'from-orange-500/20 to-red-500/20',
    },
  ];

  const steps = [
    {
      title: 'Choose Your Role',
      description: 'Select how you want to participate in the solar ecosystem',
    },
    { title: 'Basic Information', description: 'Tell us about yourself' },
    { title: 'Role-Specific Details', description: 'Provide role-specific information' },
    { title: 'Review & Confirm', description: 'Review your information and complete registration' },
  ];

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const updateFormData = (updates: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!formData.role) return;

    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Onboarding failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.role !== null;
      case 1:
        return formData.username && formData.email && formData.displayName && formData.location;
      case 2:
        return true; // Role-specific validation
      case 3:
        return true;
      default:
        return false;
    }
  };

  const selectedRole = roleOptions.find((r) => r.role === formData.role);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex items-center justify-center mb-4'
          >
            <Sun className='w-12 h-12 text-yellow-500 mr-3' />
            <h1 className='text-4xl font-bold text-white'>HeliosHash DAO</h1>
          </motion.div>
          <p className='text-gray-400 text-lg'>Join the decentralized solar energy revolution</p>
        </div>

        {/* Progress Indicator */}
        <div className='flex items-center justify-between mb-8'>
          {steps.map((step, index) => (
            <div key={index} className='flex items-center flex-1'>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  index === currentStep
                    ? 'bg-yellow-500 text-black'
                    : index < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-600 text-gray-300'
                }`}
              >
                {index < currentStep ? <Check className='w-5 h-5' /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-all ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className='text-center mb-6'>
          <h2 className='text-2xl font-bold text-white'>{steps[currentStep].title}</h2>
          <p className='text-gray-400'>{steps[currentStep].description}</p>
        </div>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardContent className='p-8'>
            <AnimatePresence mode='wait'>
              {/* Step 0: Role Selection */}
              {currentStep === 0 && (
                <motion.div
                  key='role-selection'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-4'
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {roleOptions.map((option) => (
                      <motion.div
                        key={option.role}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.role === option.role
                            ? 'border-yellow-500 bg-yellow-500/10'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                        }`}
                        onClick={() => updateFormData({ role: option.role })}
                      >
                        <div
                          className={`bg-gradient-to-br ${option.bgGradient} absolute inset-0 rounded-xl opacity-20`}
                        />
                        <div className='relative'>
                          <div className={`${option.color} mb-3`}>{option.icon}</div>
                          <h3 className='text-xl font-bold text-white mb-2'>{option.title}</h3>
                          <p className='text-gray-300 text-sm mb-4'>{option.description}</p>

                          <div className='space-y-3'>
                            <div>
                              <h4 className='text-green-400 font-semibold text-sm mb-2'>
                                ✅ Benefits:
                              </h4>
                              <ul className='text-xs text-gray-400 space-y-1'>
                                {option.benefits.slice(0, 2).map((benefit, idx) => (
                                  <li key={idx}>• {benefit}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className='text-blue-400 font-semibold text-sm mb-2'>
                                📋 Key Roles:
                              </h4>
                              <ul className='text-xs text-gray-400 space-y-1'>
                                {option.responsibilities.slice(0, 2).map((resp, idx) => (
                                  <li key={idx}>• {resp}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {formData.role === option.role && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className='absolute top-4 right-4'
                            >
                              <Badge className='bg-yellow-500 text-black font-bold'>Selected</Badge>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  key='basic-info'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-6'
                >
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-white font-semibold mb-2'>Display Name *</label>
                      <Input
                        type='text'
                        value={formData.displayName}
                        onChange={(e) => updateFormData({ displayName: e.target.value })}
                        placeholder='Your full name'
                        className='bg-gray-700 border-gray-600 text-white'
                      />
                    </div>

                    <div>
                      <label className='block text-white font-semibold mb-2'>Username *</label>
                      <Input
                        type='text'
                        value={formData.username}
                        onChange={(e) => updateFormData({ username: e.target.value })}
                        placeholder='Choose a username'
                        className='bg-gray-700 border-gray-600 text-white'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-white font-semibold mb-2'>Email Address *</label>
                    <Input
                      type='email'
                      value={formData.email}
                      onChange={(e) => updateFormData({ email: e.target.value })}
                      placeholder='your.email@example.com'
                      className='bg-gray-700 border-gray-600 text-white'
                    />
                  </div>

                  <div>
                    <label className='block text-white font-semibold mb-2'>Location *</label>
                    <div className='relative'>
                      <MapPin className='absolute left-3 top-3 w-4 h-4 text-gray-400' />
                      <Input
                        type='text'
                        value={formData.location}
                        onChange={(e) => updateFormData({ location: e.target.value })}
                        placeholder='Village, District, State'
                        className='bg-gray-700 border-gray-600 text-white pl-10'
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Role-Specific Details */}
              {currentStep === 2 && selectedRole && (
                <motion.div
                  key='role-specific'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-6'
                >
                  <div className={`bg-gradient-to-br ${selectedRole.bgGradient} rounded-lg p-6`}>
                    <div className='flex items-center mb-4'>
                      <div className={selectedRole.color}>{selectedRole.icon}</div>
                      <div className='ml-3'>
                        <h3 className='text-xl font-bold text-white'>{selectedRole.title}</h3>
                        <p className='text-gray-300'>{selectedRole.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Community Member */}
                  {formData.role === 'Community' && (
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-white font-semibold mb-2'>
                          Aadhaar Number (for KYC verification)
                        </label>
                        <Input
                          type='text'
                          value={formData.aadhaarNumber || ''}
                          onChange={(e) => updateFormData({ aadhaarNumber: e.target.value })}
                          placeholder='1234 5678 9012 (optional for now)'
                          className='bg-gray-700 border-gray-600 text-white'
                        />
                        <p className='text-sm text-gray-400 mt-1'>
                          Aadhaar verification enables direct benefit transfer and secure identity
                          management
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Authority */}
                  {formData.role === 'Authority' && (
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-white font-semibold mb-2'>
                          Government Organization/Department
                        </label>
                        <Input
                          type='text'
                          value={formData.organization || ''}
                          onChange={(e) => updateFormData({ organization: e.target.value })}
                          placeholder='e.g., Gram Panchayat, State Energy Department'
                          className='bg-gray-700 border-gray-600 text-white'
                        />
                      </div>
                      <div>
                        <label className='block text-white font-semibold mb-2'>Position/Role</label>
                        <Input
                          type='text'
                          value={formData.experience || ''}
                          onChange={(e) => updateFormData({ experience: e.target.value })}
                          placeholder='e.g., Sarpanch, Energy Officer, District Collector'
                          className='bg-gray-700 border-gray-600 text-white'
                        />
                      </div>
                    </div>
                  )}

                  {/* Partner */}
                  {formData.role === 'Partner' && (
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-white font-semibold mb-2'>
                          Organization Name
                        </label>
                        <Input
                          type='text'
                          value={formData.organization || ''}
                          onChange={(e) => updateFormData({ organization: e.target.value })}
                          placeholder='e.g., Clean Energy NGO, Solar Corporation'
                          className='bg-gray-700 border-gray-600 text-white'
                        />
                      </div>
                      <div>
                        <label className='block text-white font-semibold mb-2'>
                          Partnership Interest/Expertise
                        </label>
                        <Input
                          type='text'
                          value={formData.experience || ''}
                          onChange={(e) => updateFormData({ experience: e.target.value })}
                          placeholder='e.g., Technology Provider, Funding Partner, Implementation Support'
                          className='bg-gray-700 border-gray-600 text-white'
                        />
                      </div>
                    </div>
                  )}

                  {/* Investor */}
                  {formData.role === 'Investor' && (
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-white font-semibold mb-2'>
                          Investment Experience
                        </label>
                        <Input
                          type='text'
                          value={formData.experience || ''}
                          onChange={(e) => updateFormData({ experience: e.target.value })}
                          placeholder='e.g., Clean Energy, DeFi, Traditional Markets'
                          className='bg-gray-700 border-gray-600 text-white'
                        />
                      </div>
                    </div>
                  )}

                  {/* DAO Governance */}
                  {formData.role === 'DAO' && (
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-white font-semibold mb-2'>
                          DAO/Governance Experience
                        </label>
                        <Input
                          type='text'
                          value={formData.experience || ''}
                          onChange={(e) => updateFormData({ experience: e.target.value })}
                          placeholder='e.g., Previous DAO participation, Governance tokens held'
                          className='bg-gray-700 border-gray-600 text-white'
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && selectedRole && (
                <motion.div
                  key='review'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className='space-y-6'
                >
                  <div className='bg-gray-700/50 rounded-lg p-6'>
                    <h3 className='text-xl font-bold text-white mb-4'>Review Your Information</h3>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <h4 className='font-semibold text-gray-300 mb-2'>Basic Information</h4>
                        <div className='space-y-2 text-sm'>
                          <div>
                            <span className='text-gray-400'>Name:</span>{' '}
                            <span className='text-white'>{formData.displayName}</span>
                          </div>
                          <div>
                            <span className='text-gray-400'>Username:</span>{' '}
                            <span className='text-white'>{formData.username}</span>
                          </div>
                          <div>
                            <span className='text-gray-400'>Email:</span>{' '}
                            <span className='text-white'>{formData.email}</span>
                          </div>
                          <div>
                            <span className='text-gray-400'>Location:</span>{' '}
                            <span className='text-white'>{formData.location}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className='font-semibold text-gray-300 mb-2'>Role Information</h4>
                        <div className='space-y-2 text-sm'>
                          <div className='flex items-center'>
                            <span className='text-gray-400 mr-2'>Role:</span>
                            <Badge className={`${selectedRole.color} bg-gray-800`}>
                              {selectedRole.title}
                            </Badge>
                          </div>
                          {formData.organization && (
                            <div>
                              <span className='text-gray-400'>Organization:</span>{' '}
                              <span className='text-white'>{formData.organization}</span>
                            </div>
                          )}
                          {formData.experience && (
                            <div>
                              <span className='text-gray-400'>Experience:</span>{' '}
                              <span className='text-white'>{formData.experience}</span>
                            </div>
                          )}
                          {formData.aadhaarNumber && (
                            <div>
                              <span className='text-gray-400'>Aadhaar:</span>{' '}
                              <span className='text-white'>
                                ***-***-{formData.aadhaarNumber.slice(-4)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='bg-blue-500/20 rounded-lg p-4'>
                    <h4 className='font-bold text-blue-400 mb-2'>🎉 Welcome to HeliosHash DAO!</h4>
                    <p className='text-gray-300 text-sm mb-3'>
                      As a <strong>{selectedRole.title}</strong>, you'll have access to:
                    </p>
                    <ul className='text-sm text-gray-300 space-y-1'>
                      {selectedRole.benefits.map((benefit, idx) => (
                        <li key={idx} className='flex items-start'>
                          <Check className='w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0' />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className='flex justify-between items-center mt-8'>
          <Button
            onClick={currentStep === 0 ? onCancel : prevStep}
            variant='outline'
            className='border-gray-600 text-gray-300 hover:bg-gray-800'
          >
            <ArrowLeft className='w-4 h-4 mr-2' />
            {currentStep === 0 ? 'Cancel' : 'Previous'}
          </Button>

          <div className='text-sm text-gray-400'>
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className='bg-yellow-500 hover:bg-yellow-600 text-black font-semibold'
            >
              Next
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className='bg-green-500 hover:bg-green-600 text-white font-semibold'
            >
              {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
              <Check className='w-4 h-4 ml-2' />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoleBasedOnboarding;
