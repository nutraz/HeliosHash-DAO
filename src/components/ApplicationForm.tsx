'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  ApplicationData,
  ApplicationPriority,
  applicationService,
  ApplicationType,
  SubmitApplicationRequest,
} from '@/services/applicationService';
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code,
  Coins,
  FileText,
  Info,
  MapPin,
  Plus,
  Upload,
  User,
  Wrench,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ApplicationFormProps {
  onSubmit?: (applicationId: number) => void;
  onCancel?: () => void;
  initialType?: ApplicationType;
}

interface FormStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FormData {
  applicationType: ApplicationType;
  title: string;
  description: string;
  priority: ApplicationPriority;
  applicationData: ApplicationData;
  relatedProjectId?: number;
}

/**
 * Multi-step application form UI for submitting role-specific HHDAO applications.
 *
 * Renders a guided workflow that collects application type, basic info, role-specific details,
 * contact/verification information, and a final review before submitting to the application service.
 *
 * @param props.onSubmit - Optional callback invoked with the created application ID after successful submission.
 * @param props.onCancel - Optional callback invoked when the user cancels the form.
 * @param props.initialType - Optional initial application type to preselect when the form loads.
 * @returns The rendered ApplicationForm component ready for user interaction and submission.
 */
export function ApplicationForm({ onSubmit, onCancel, initialType }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    applicationType: initialType || { LandPartner: null },
    title: '',
    description: '',
    priority: { Medium: null },
    applicationData: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dynamicSkills, setDynamicSkills] = useState<string[]>([]);
  const [dynamicRoles, setDynamicRoles] = useState<string[]>([]);
  const [dynamicReferences, setDynamicReferences] = useState<string[]>(['']);

  const applicationTypes: {
    type: ApplicationType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      type: { LandPartner: null },
      label: 'Land Partner',
      description: 'Offer land for solar installations and earn partnership revenue',
      icon: MapPin,
    },
    {
      type: { TechCollaborator: null },
      label: 'Tech Collaborator',
      description: 'Contribute technical expertise in solar, IoT, or blockchain development',
      icon: Code,
    },
    {
      type: { CommunityContributor: null },
      label: 'Community Contributor',
      description: 'Take on local roles like maintenance, monitoring, or community liaison',
      icon: User,
    },
    {
      type: { Investor: null },
      label: 'Investor',
      description: 'Invest capital in solar projects and earn returns through the DAO',
      icon: Coins,
    },
    {
      type: { Vendor: null },
      label: 'Vendor/Supplier',
      description: 'Provide equipment, services, or materials for solar installations',
      icon: Wrench,
    },
  ];

  const steps: FormStep[] = [
    {
      id: 'type',
      title: 'Application Type',
      description: 'Choose your role in the HHDAO ecosystem',
      icon: User,
    },
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Tell us about your application',
      icon: FileText,
    },
    {
      id: 'specific',
      title: 'Role-Specific Details',
      description: 'Provide details specific to your chosen role',
      icon: Info,
    },
    {
      id: 'contact',
      title: 'Contact & Verification',
      description: 'Contact information and identity verification',
      icon: CheckCircle,
    },
    {
      id: 'review',
      title: 'Review & Submit',
      description: 'Review your application before submission',
      icon: Upload,
    },
  ];

  const getCurrentApplicationTypeKey = (): string => {
    if ('LandPartner' in formData.applicationType) return 'LandPartner';
    if ('TechCollaborator' in formData.applicationType) return 'TechCollaborator';
    if ('CommunityContributor' in formData.applicationType) return 'CommunityContributor';
    if ('Investor' in formData.applicationType) return 'Investor';
    if ('Vendor' in formData.applicationType) return 'Vendor';
    return 'LandPartner';
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const updateApplicationData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      applicationData: {
        ...prev.applicationData,
        [field]: value,
      },
    }));
  };

  const addDynamicField = (fieldType: 'skills' | 'roles' | 'references') => {
    if (fieldType === 'skills') {
      setDynamicSkills((prev) => [...prev, '']);
    } else if (fieldType === 'roles') {
      setDynamicRoles((prev) => [...prev, '']);
    } else if (fieldType === 'references') {
      setDynamicReferences((prev) => [...prev, '']);
    }
  };

  const removeDynamicField = (fieldType: 'skills' | 'roles' | 'references', index: number) => {
    if (fieldType === 'skills') {
      setDynamicSkills((prev) => prev.filter((_, i) => i !== index));
    } else if (fieldType === 'roles') {
      setDynamicRoles((prev) => prev.filter((_, i) => i !== index));
    } else if (fieldType === 'references') {
      setDynamicReferences((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const updateDynamicField = (
    fieldType: 'skills' | 'roles' | 'references',
    index: number,
    value: string
  ) => {
    if (fieldType === 'skills') {
      setDynamicSkills((prev) => prev.map((item, i) => (i === index ? value : item)));
      updateApplicationData(
        'technicalSkills',
        dynamicSkills.filter((skill) => skill.trim())
      );
    } else if (fieldType === 'roles') {
      setDynamicRoles((prev) => prev.map((item, i) => (i === index ? value : item)));
      updateApplicationData(
        'preferredRoles',
        dynamicRoles.filter((role) => role.trim())
      );
    } else if (fieldType === 'references') {
      setDynamicReferences((prev) => prev.map((item, i) => (i === index ? value : item)));
      updateApplicationData(
        'references',
        dynamicReferences.filter((ref) => ref.trim())
      );
    }
  };

  // Sync dynamic fields with application data
  useEffect(() => {
    const appTypeKey = getCurrentApplicationTypeKey();

    // Initialize dynamic fields based on application type
    if (appTypeKey === 'TechCollaborator') {
      if (formData.applicationData.technicalSkills?.length) {
        setDynamicSkills(formData.applicationData.technicalSkills);
      } else if (dynamicSkills.length === 0) {
        setDynamicSkills(['']);
      }
    } else if (appTypeKey === 'CommunityContributor') {
      if (formData.applicationData.preferredRoles?.length) {
        setDynamicRoles(formData.applicationData.preferredRoles);
      } else if (dynamicRoles.length === 0) {
        setDynamicRoles(['']);
      }
    }

    // References for all types
    if (formData.applicationData.references?.length) {
      setDynamicReferences(formData.applicationData.references);
    } else if (dynamicReferences.length === 1 && !dynamicReferences[0]) {
      // Keep single empty field as default
    }
  }, [formData.applicationType]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Type selection
        // Type is always valid as it has a default
        break;

      case 1: // Basic information
        if (!formData.title.trim()) {
          newErrors.title = 'Application title is required';
        }
        if (!formData.description.trim()) {
          newErrors.description = 'Application description is required';
        }
        break;

      case 2: // Role-specific details
        const appTypeKey = getCurrentApplicationTypeKey();

        if (appTypeKey === 'LandPartner') {
          if (!formData.applicationData.landSize || formData.applicationData.landSize <= 0) {
            newErrors.landSize = 'Land size is required and must be greater than 0';
          }
          if (!formData.applicationData.landLocation?.trim()) {
            newErrors.landLocation = 'Land location is required';
          }
        } else if (appTypeKey === 'TechCollaborator') {
          const skills = dynamicSkills.filter((skill) => skill.trim());
          if (skills.length === 0) {
            newErrors.technicalSkills = 'At least one technical skill is required';
          }
          if (!formData.applicationData.experience || formData.applicationData.experience < 0) {
            newErrors.experience = 'Experience is required';
          }
        } else if (appTypeKey === 'Investor') {
          if (
            !formData.applicationData.investmentCapacity ||
            formData.applicationData.investmentCapacity <= 0
          ) {
            newErrors.investmentCapacity =
              'Investment capacity is required and must be greater than 0';
          }
        }
        break;

      case 3: // Contact & verification
        if (!formData.applicationData.contactEmail?.trim()) {
          newErrors.contactEmail = 'Email address is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.applicationData.contactEmail)) {
          newErrors.contactEmail = 'Please enter a valid email address';
        }

        if (!formData.applicationData.contactPhone?.trim()) {
          newErrors.contactPhone = 'Phone number is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Prepare final application data with dynamic fields
      const finalApplicationData: ApplicationData = {
        ...formData.applicationData,
        technicalSkills: dynamicSkills.filter((skill) => skill.trim()),
        preferredRoles: dynamicRoles.filter((role) => role.trim()),
        references: dynamicReferences.filter((ref) => ref.trim()),
      };

      const request: SubmitApplicationRequest = {
        applicationType: formData.applicationType,
        title: formData.title,
        description: formData.description,
        applicationData: finalApplicationData,
        priority: formData.priority,
        relatedProjectId: formData.relatedProjectId,
      };

      const applicationId = await applicationService.submitApplication(request);

      if (onSubmit) {
        onSubmit(applicationId);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderTypeSelection();
      case 1:
        return renderBasicInformation();
      case 2:
        return renderRoleSpecificDetails();
      case 3:
        return renderContactVerification();
      case 4:
        return renderReviewSubmit();
      default:
        return null;
    }
  };

  const renderTypeSelection = () => (
    <div className='space-y-4'>
      <div className='text-center mb-6'>
        <h3 className='text-xl font-semibold text-white mb-2'>Choose Your Role</h3>
        <p className='text-gray-400'>Select how you want to contribute to the HHDAO ecosystem</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {applicationTypes.map((appType) => {
          const isSelected =
            JSON.stringify(formData.applicationType) === JSON.stringify(appType.type);
          const IconComponent = appType.icon;

          return (
            <Card
              key={appType.label}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isSelected
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
              }`}
              onClick={() => updateFormData('applicationType', appType.type)}
            >
              <CardContent className='p-4 text-center'>
                <IconComponent
                  className={`w-8 h-8 mx-auto mb-3 ${
                    isSelected ? 'text-blue-400' : 'text-gray-400'
                  }`}
                />
                <h4 className='font-semibold text-white mb-2'>{appType.label}</h4>
                <p className='text-sm text-gray-400'>{appType.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderBasicInformation = () => (
    <div className='space-y-6'>
      <div>
        <Label htmlFor='title' className='text-white'>
          Application Title *
        </Label>
        <Input
          id='title'
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          placeholder='e.g., Land Partnership - 5 acres in Urgam Valley'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
        {errors.title && <p className='text-red-400 text-sm mt-1'>{errors.title}</p>}
      </div>

      <div>
        <Label htmlFor='description' className='text-white'>
          Description *
        </Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder='Describe your application, goals, and what you bring to the HHDAO ecosystem...'
          className='mt-1 bg-gray-700 border-gray-600 text-white h-24'
        />
        {errors.description && <p className='text-red-400 text-sm mt-1'>{errors.description}</p>}
      </div>

      <div>
        <Label htmlFor='priority' className='text-white'>
          Priority Level
        </Label>
        <select
          id='priority'
          value={
            'High' in formData.priority
              ? 'High'
              : 'Medium' in formData.priority
                ? 'Medium'
                : 'Low' in formData.priority
                  ? 'Low'
                  : 'Urgent'
          }
          onChange={(e) => {
            const priorityMap: Record<string, ApplicationPriority> = {
              Low: { Low: null },
              Medium: { Medium: null },
              High: { High: null },
              Urgent: { Urgent: null },
            };
            updateFormData('priority', priorityMap[e.target.value]);
          }}
          className='mt-1 w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2'
        >
          <option value='Medium'>Medium Priority</option>
          <option value='High'>High Priority</option>
          <option value='Low'>Low Priority</option>
          <option value='Urgent'>Urgent</option>
        </select>
      </div>
    </div>
  );

  const renderRoleSpecificDetails = () => {
    const appTypeKey = getCurrentApplicationTypeKey();

    switch (appTypeKey) {
      case 'LandPartner':
        return renderLandPartnerFields();
      case 'TechCollaborator':
        return renderTechCollaboratorFields();
      case 'CommunityContributor':
        return renderCommunityContributorFields();
      case 'Investor':
        return renderInvestorFields();
      case 'Vendor':
        return renderVendorFields();
      default:
        return <div className='text-gray-400'>No specific fields for this application type.</div>;
    }
  };

  const renderLandPartnerFields = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='landSize' className='text-white'>
            Land Size (acres) *
          </Label>
          <Input
            id='landSize'
            type='number'
            value={formData.applicationData.landSize || ''}
            onChange={(e) => updateApplicationData('landSize', Number(e.target.value))}
            placeholder='5'
            className='mt-1 bg-gray-700 border-gray-600 text-white'
          />
          {errors.landSize && <p className='text-red-400 text-sm mt-1'>{errors.landSize}</p>}
        </div>

        <div>
          <Label className='text-white'>Electricity Access</Label>
          <div className='mt-2 flex gap-4'>
            <label className='flex items-center'>
              <input
                type='radio'
                checked={formData.applicationData.electricityAccess === true}
                onChange={() => updateApplicationData('electricityAccess', true)}
                className='mr-2'
              />
              <span className='text-white'>Yes</span>
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                checked={formData.applicationData.electricityAccess === false}
                onChange={() => updateApplicationData('electricityAccess', false)}
                className='mr-2'
              />
              <span className='text-white'>No</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor='landLocation' className='text-white'>
          Land Location *
        </Label>
        <Input
          id='landLocation'
          value={formData.applicationData.landLocation || ''}
          onChange={(e) => updateApplicationData('landLocation', e.target.value)}
          placeholder='Village/District, State (or GPS coordinates)'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
        {errors.landLocation && <p className='text-red-400 text-sm mt-1'>{errors.landLocation}</p>}
      </div>

      <div>
        <Label htmlFor='currentLandUse' className='text-white'>
          Current Land Use
        </Label>
        <Input
          id='currentLandUse'
          value={formData.applicationData.currentLandUse || ''}
          onChange={(e) => updateApplicationData('currentLandUse', e.target.value)}
          placeholder='e.g., Agricultural - wheat farming, Unused, Residential'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
      </div>
    </div>
  );

  const renderTechCollaboratorFields = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='experience' className='text-white'>
            Years of Experience *
          </Label>
          <Input
            id='experience'
            type='number'
            value={formData.applicationData.experience || ''}
            onChange={(e) => updateApplicationData('experience', Number(e.target.value))}
            placeholder='5'
            className='mt-1 bg-gray-700 border-gray-600 text-white'
          />
          {errors.experience && <p className='text-red-400 text-sm mt-1'>{errors.experience}</p>}
        </div>

        <div>
          <Label htmlFor='availability' className='text-white'>
            Availability
          </Label>
          <select
            id='availability'
            value={formData.applicationData.availability || ''}
            onChange={(e) => updateApplicationData('availability', e.target.value)}
            className='mt-1 w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2'
          >
            <option value=''>Select availability</option>
            <option value='Full-time'>Full-time</option>
            <option value='Part-time'>Part-time</option>
            <option value='Contract'>Contract basis</option>
            <option value='Consulting'>Consulting</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor='specialization' className='text-white'>
          Specialization
        </Label>
        <Input
          id='specialization'
          value={formData.applicationData.specialization || ''}
          onChange={(e) => updateApplicationData('specialization', e.target.value)}
          placeholder='e.g., Solar technology, IoT sensors, Blockchain development'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
      </div>

      <div>
        <Label className='text-white'>Technical Skills *</Label>
        <div className='space-y-2 mt-2'>
          {dynamicSkills.map((skill, index) => (
            <div key={index} className='flex gap-2'>
              <Input
                value={skill}
                onChange={(e) => updateDynamicField('skills', index, e.target.value)}
                placeholder='e.g., Python, Solar Installation, IoT Development'
                className='flex-1 bg-gray-700 border-gray-600 text-white'
              />
              {dynamicSkills.length > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeDynamicField('skills', index)}
                  className='px-2'
                >
                  <X className='w-4 h-4' />
                </Button>
              )}
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => addDynamicField('skills')}
            className='mt-2'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Skill
          </Button>
        </div>
        {errors.technicalSkills && (
          <p className='text-red-400 text-sm mt-1'>{errors.technicalSkills}</p>
        )}
      </div>
    </div>
  );

  const renderCommunityContributorFields = () => (
    <div className='space-y-6'>
      <div>
        <Label className='text-white'>Preferred Roles</Label>
        <div className='space-y-2 mt-2'>
          {dynamicRoles.map((role, index) => (
            <div key={index} className='flex gap-2'>
              <Input
                value={role}
                onChange={(e) => updateDynamicField('roles', index, e.target.value)}
                placeholder='e.g., Panel cleaning, Security monitoring, Community liaison'
                className='flex-1 bg-gray-700 border-gray-600 text-white'
              />
              {dynamicRoles.length > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeDynamicField('roles', index)}
                  className='px-2'
                >
                  <X className='w-4 h-4' />
                </Button>
              )}
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => addDynamicField('roles')}
            className='mt-2'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Role
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor='availability' className='text-white'>
          Availability
        </Label>
        <Input
          id='availability'
          value={formData.applicationData.availability || ''}
          onChange={(e) => updateApplicationData('availability', e.target.value)}
          placeholder='e.g., Weekdays 9AM-5PM, Weekends only, 24/7 on-call'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
      </div>

      <div>
        <Label htmlFor='localKnowledge' className='text-white'>
          Local Knowledge
        </Label>
        <Textarea
          id='localKnowledge'
          value={formData.applicationData.localKnowledge || ''}
          onChange={(e) => updateApplicationData('localKnowledge', e.target.value)}
          placeholder='Describe your familiarity with the local area, languages spoken, community connections...'
          className='mt-1 bg-gray-700 border-gray-600 text-white h-20'
        />
      </div>
    </div>
  );

  const renderInvestorFields = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='investmentCapacity' className='text-white'>
            Investment Capacity (₹) *
          </Label>
          <Input
            id='investmentCapacity'
            type='number'
            value={formData.applicationData.investmentCapacity || ''}
            onChange={(e) => updateApplicationData('investmentCapacity', Number(e.target.value))}
            placeholder='500000'
            className='mt-1 bg-gray-700 border-gray-600 text-white'
          />
          {errors.investmentCapacity && (
            <p className='text-red-400 text-sm mt-1'>{errors.investmentCapacity}</p>
          )}
        </div>

        <div>
          <Label htmlFor='investmentHorizon' className='text-white'>
            Investment Horizon
          </Label>
          <select
            id='investmentHorizon'
            value={formData.applicationData.investmentHorizon || ''}
            onChange={(e) => updateApplicationData('investmentHorizon', e.target.value)}
            className='mt-1 w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2'
          >
            <option value=''>Select horizon</option>
            <option value='Short-term (1-3 years)'>Short-term (1-3 years)</option>
            <option value='Medium-term (3-7 years)'>Medium-term (3-7 years)</option>
            <option value='Long-term (7+ years)'>Long-term (7+ years)</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor='riskTolerance' className='text-white'>
          Risk Tolerance
        </Label>
        <select
          id='riskTolerance'
          value={formData.applicationData.riskTolerance || ''}
          onChange={(e) => updateApplicationData('riskTolerance', e.target.value)}
          className='mt-1 w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2'
        >
          <option value=''>Select risk tolerance</option>
          <option value='Conservative'>Conservative - Lower risk, steady returns</option>
          <option value='Moderate'>Moderate - Balanced risk and return</option>
          <option value='Aggressive'>Aggressive - Higher risk, higher potential returns</option>
        </select>
      </div>
    </div>
  );

  const renderVendorFields = () => (
    <div className='space-y-6'>
      <div>
        <Label htmlFor='specialization' className='text-white'>
          Products/Services Offered
        </Label>
        <Textarea
          id='specialization'
          value={formData.applicationData.specialization || ''}
          onChange={(e) => updateApplicationData('specialization', e.target.value)}
          placeholder='Describe the products or services you can provide (solar panels, inverters, installation services, etc.)'
          className='mt-1 bg-gray-700 border-gray-600 text-white h-20'
        />
      </div>

      <div>
        <Label htmlFor='experience' className='text-white'>
          Years in Business
        </Label>
        <Input
          id='experience'
          type='number'
          value={formData.applicationData.experience || ''}
          onChange={(e) => updateApplicationData('experience', Number(e.target.value))}
          placeholder='10'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
      </div>
    </div>
  );

  const renderContactVerification = () => (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <Label htmlFor='contactEmail' className='text-white'>
            Email Address *
          </Label>
          <Input
            id='contactEmail'
            type='email'
            value={formData.applicationData.contactEmail || ''}
            onChange={(e) => updateApplicationData('contactEmail', e.target.value)}
            placeholder='your.email@example.com'
            className='mt-1 bg-gray-700 border-gray-600 text-white'
          />
          {errors.contactEmail && (
            <p className='text-red-400 text-sm mt-1'>{errors.contactEmail}</p>
          )}
        </div>

        <div>
          <Label htmlFor='contactPhone' className='text-white'>
            Phone Number *
          </Label>
          <Input
            id='contactPhone'
            type='tel'
            value={formData.applicationData.contactPhone || ''}
            onChange={(e) => updateApplicationData('contactPhone', e.target.value)}
            placeholder='+91-9876543210'
            className='mt-1 bg-gray-700 border-gray-600 text-white'
          />
          {errors.contactPhone && (
            <p className='text-red-400 text-sm mt-1'>{errors.contactPhone}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor='aadhaarNumber' className='text-white'>
          Aadhaar Number (Optional)
        </Label>
        <Input
          id='aadhaarNumber'
          value={formData.applicationData.aadhaarNumber || ''}
          onChange={(e) => updateApplicationData('aadhaarNumber', e.target.value)}
          placeholder='1234 5678 9012'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
        <p className='text-sm text-gray-400 mt-1'>
          Aadhaar verification helps speed up the approval process
        </p>
      </div>

      <div>
        <Label htmlFor='bankAccount' className='text-white'>
          Bank Account Details (Optional)
        </Label>
        <Input
          id='bankAccount'
          value={formData.applicationData.bankAccount || ''}
          onChange={(e) => updateApplicationData('bankAccount', e.target.value)}
          placeholder='Account number and IFSC code'
          className='mt-1 bg-gray-700 border-gray-600 text-white'
        />
        <p className='text-sm text-gray-400 mt-1'>
          Required for payment processing if application is approved
        </p>
      </div>

      <div>
        <Label className='text-white'>References (Optional)</Label>
        <div className='space-y-2 mt-2'>
          {dynamicReferences.map((reference, index) => (
            <div key={index} className='flex gap-2'>
              <Input
                value={reference}
                onChange={(e) => updateDynamicField('references', index, e.target.value)}
                placeholder='Name, relationship, and contact information'
                className='flex-1 bg-gray-700 border-gray-600 text-white'
              />
              {dynamicReferences.length > 1 && (
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => removeDynamicField('references', index)}
                  className='px-2'
                >
                  <X className='w-4 h-4' />
                </Button>
              )}
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => addDynamicField('references')}
            className='mt-2'
          >
            <Plus className='w-4 h-4 mr-2' />
            Add Reference
          </Button>
        </div>
      </div>
    </div>
  );

  const renderReviewSubmit = () => {
    const appTypeKey = getCurrentApplicationTypeKey();
    const appTypeLabel =
      applicationTypes.find(
        (t) => JSON.stringify(t.type) === JSON.stringify(formData.applicationType)
      )?.label || '';

    return (
      <div className='space-y-6'>
        <div className='text-center mb-6'>
          <h3 className='text-xl font-semibold text-white mb-2'>Review Your Application</h3>
          <p className='text-gray-400'>Please review all information before submitting</p>
        </div>

        <Card className='bg-gray-800/50 border-gray-700'>
          <CardHeader>
            <CardTitle className='text-white text-lg'>Application Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <span className='text-gray-400'>Type:</span>
                <div className='text-white font-semibold'>{appTypeLabel}</div>
              </div>
              <div>
                <span className='text-gray-400'>Priority:</span>
                <div className='text-white font-semibold'>
                  {'High' in formData.priority
                    ? 'High'
                    : 'Medium' in formData.priority
                      ? 'Medium'
                      : 'Low' in formData.priority
                        ? 'Low'
                        : 'Urgent'}
                </div>
              </div>
            </div>

            <div>
              <span className='text-gray-400'>Title:</span>
              <div className='text-white font-semibold'>{formData.title}</div>
            </div>

            <div>
              <span className='text-gray-400'>Description:</span>
              <div className='text-white'>{formData.description}</div>
            </div>

            <div>
              <span className='text-gray-400'>Contact:</span>
              <div className='text-white'>
                {formData.applicationData.contactEmail} | {formData.applicationData.contactPhone}
              </div>
            </div>

            {/* Role-specific summary */}
            {appTypeKey === 'LandPartner' && (
              <div>
                <span className='text-gray-400'>Land Details:</span>
                <div className='text-white'>
                  {formData.applicationData.landSize} acres at{' '}
                  {formData.applicationData.landLocation}
                  {formData.applicationData.electricityAccess
                    ? ' (Grid connected)'
                    : ' (No grid access)'}
                </div>
              </div>
            )}

            {appTypeKey === 'TechCollaborator' && (
              <div>
                <span className='text-gray-400'>Technical Profile:</span>
                <div className='text-white'>
                  {formData.applicationData.experience} years experience in{' '}
                  {formData.applicationData.specialization}
                </div>
                <div className='text-white'>
                  Skills: {dynamicSkills.filter((s) => s.trim()).join(', ')}
                </div>
              </div>
            )}

            {appTypeKey === 'Investor' && (
              <div>
                <span className='text-gray-400'>Investment Profile:</span>
                <div className='text-white'>
                  ₹{formData.applicationData.investmentCapacity?.toLocaleString()} capacity |{' '}
                  {formData.applicationData.investmentHorizon} |{' '}
                  {formData.applicationData.riskTolerance}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {errors.submit && (
          <Card className='bg-red-500/10 border-red-500'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-red-400'>
                <AlertCircle className='w-4 h-4' />
                <span>{errors.submit}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className='bg-blue-500/10 border border-blue-500 rounded p-4'>
          <div className='flex items-start gap-2 text-blue-400'>
            <Info className='w-5 h-5 mt-0.5' />
            <div>
              <div className='font-semibold'>What happens next?</div>
              <ul className='text-sm mt-1 space-y-1'>
                <li>• Your application will be reviewed by HHDAO authorities</li>
                <li>• You'll receive status updates via email and dashboard</li>
                <li>• Additional documents may be requested if needed</li>
                <li>• Interview or verification calls may be scheduled</li>
                <li>• Approved applications receive next steps and onboarding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className='max-w-4xl mx-auto p-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-2xl font-bold text-white mb-2'>HHDAO Application Form</h1>
        <p className='text-gray-400'>
          Join the solar revolution - apply for your role in the HHDAO ecosystem
        </p>
      </div>

      {/* Progress Bar */}
      <Card className='mb-6 bg-gray-800/50 border-gray-700'>
        <CardContent className='p-4'>
          <div className='flex justify-between mb-2'>
            <span className='text-sm text-gray-400'>Progress</span>
            <span className='text-sm text-gray-300'>
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <Progress value={progressPercentage} className='h-2 mb-4' />

          <div className='flex justify-between'>
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={step.id} className='flex flex-col items-center text-center flex-1'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-600 text-gray-300'
                    }`}
                  >
                    <IconComponent className='w-4 h-4' />
                  </div>
                  <div className='text-xs text-gray-400 hidden sm:block'>{step.title}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className='bg-gray-800/50 border-gray-700 mb-6'>
        <CardHeader>
          <CardTitle className='text-white flex items-center gap-2'>
            {React.createElement(steps[currentStep].icon, { className: 'w-5 h-5' })}
            {steps[currentStep].title}
          </CardTitle>
          <p className='text-gray-400'>{steps[currentStep].description}</p>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className='flex justify-between gap-4'>
        <div>
          {currentStep > 0 && (
            <Button variant='outline' onClick={prevStep} className='flex items-center gap-2'>
              <ChevronLeft className='w-4 h-4' />
              Previous
            </Button>
          )}
        </div>

        <div className='flex gap-2'>
          {onCancel && (
            <Button variant='outline' onClick={onCancel}>
              Cancel
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              onClick={nextStep}
              className='bg-blue-600 hover:bg-blue-700 flex items-center gap-2'
            >
              Next
              <ChevronRight className='w-4 h-4' />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='bg-green-600 hover:bg-green-700 flex items-center gap-2'
            >
              {isSubmitting ? (
                <>
                  <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className='w-4 h-4' />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}