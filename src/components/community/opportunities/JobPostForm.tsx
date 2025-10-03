'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuthContext';
import {
  CATEGORY_SKILLS,
  CURRENCIES,
  Currency,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JobCategory,
  JobPostingFormData,
  WORK_TYPES,
} from '@/types/jobs';
import { Briefcase, MapPin, Plus, Save, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface JobPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobPostingFormData) => void;
  initialData?: Partial<JobPostingFormData>;
  className?: string;
}

export default function JobPostForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  className,
}: JobPostFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobPostingFormData>({
    defaultValues: {
      title: '',
      description: '',
      category: 'Engineering',
      locationType: 'OnSite',
      locationName: '',
      compensation: {
        amount: 0,
        currency: 'INR',
        paymentType: 'Monthly',
        isRange: false,
        minAmount: 0,
        maxAmount: 0,
      },
      requirements: [''],
      skills: [],
      experienceLevel: 'Entry',
      workType: 'FullTime',
      urgency: 'Medium',
      deadline: '',
      benefits: [''],
      companyInfo: {
        name: 'HeliosHash DAO',
        description: 'Decentralized solar energy infrastructure organization',
        website: 'https://helioshash.org',
      },
      ...initialData,
    },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  // Manual array management for primitive string arrays (useFieldArray targets object arrays)
  const requirements = watch('requirements');
  const benefits = watch('benefits');

  const appendRequirement = () => setValue('requirements', [...requirements, '']);
  const removeRequirement = (index: number) =>
    setValue(
      'requirements',
      requirements.filter((_, i) => i !== index)
    );

  const appendBenefit = () => setValue('benefits', [...(benefits || []), '']);
  const removeBenefit = (index: number) =>
    setValue(
      'benefits',
      (benefits || []).filter((_, i) => i !== index)
    );

  const watchedCategory = watch('category');
  const watchedLocationType = watch('locationType');
  const watchedCompensation = watch('compensation');

  const handleFormSubmit = async (data: JobPostingFormData) => {
    setIsSubmitting(true);
    try {
      // Clean up empty requirements and benefits
      data.requirements = data.requirements.filter((req) => req.trim() !== '');
      data.benefits = data.benefits?.filter((benefit) => benefit.trim() !== '') || [];

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = (skill: string) => {
    const currentSkills = watch('skills') || [];
    if (!currentSkills.includes(skill)) {
      setValue('skills', [...currentSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    const currentSkills = watch('skills') || [];
    setValue(
      'skills',
      currentSkills.filter((s) => s !== skill)
    );
  };

  const suggestedSkills = CATEGORY_SKILLS[watchedCategory as JobCategory] || [];
  const currentSkills = watch('skills') || [];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className='space-y-6'>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='title'>Job Title *</Label>
                <Input
                  id='title'
                  {...register('title', { required: 'Job title is required' })}
                  placeholder='e.g., Solar Panel Installation Technician'
                />
                {errors.title && (
                  <p className='text-sm text-red-500 mt-1'>{errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor='category'>Category *</Label>
                <Select
                  value={watchedCategory}
                  onValueChange={(value) => setValue('category', value as JobCategory)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {JOB_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div className='flex items-center gap-2'>
                          <span>{cat.icon}</span>
                          {cat.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='description'>Job Description *</Label>
                <Textarea
                  id='description'
                  {...register('description', { required: 'Job description is required' })}
                  placeholder='Describe the role, responsibilities, and what makes this opportunity special...'
                  rows={6}
                />
                {errors.description && (
                  <p className='text-sm text-red-500 mt-1'>{errors.description.message}</p>
                )}
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='experienceLevel'>Experience Level</Label>
                  <Select
                    value={watch('experienceLevel')}
                    onValueChange={(value) => setValue('experienceLevel', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPERIENCE_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor='workType'>Employment Type</Label>
                  <Select
                    value={watch('workType')}
                    onValueChange={(value) => setValue('workType', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {WORK_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className='space-y-6'>
            <div>
              <Label>Work Location *</Label>
              <div className='space-y-3 mt-2'>
                {['OnSite', 'Remote', 'Hybrid'].map((type) => (
                  <div key={type} className='flex items-center space-x-2'>
                    <Checkbox
                      id={`location-${type}`}
                      checked={watchedLocationType === type}
                      onCheckedChange={() => setValue('locationType', type as any)}
                    />
                    <Label htmlFor={`location-${type}`} className='cursor-pointer'>
                      <MapPin className='h-4 w-4 inline mr-1' />
                      {type === 'OnSite' ? 'On-site' : type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {(watchedLocationType === 'OnSite' || watchedLocationType === 'Hybrid') && (
              <div>
                <Label htmlFor='locationName'>Location Details</Label>
                <Input
                  id='locationName'
                  {...register('locationName')}
                  placeholder='e.g., Urgam Valley, Gujarat'
                />
              </div>
            )}

            <div className='space-y-4'>
              <Label>Compensation *</Label>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label htmlFor='currency'>Currency</Label>
                  <Select
                    value={watchedCompensation.currency}
                    onValueChange={(value) => setValue('compensation.currency', value as Currency)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.symbol} {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor='paymentType'>Payment Type</Label>
                  <Select
                    value={watchedCompensation.paymentType}
                    onValueChange={(value) => setValue('compensation.paymentType', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Hourly'>Hourly</SelectItem>
                      <SelectItem value='Monthly'>Monthly</SelectItem>
                      <SelectItem value='Project'>Per Project</SelectItem>
                      <SelectItem value='Equity'>Equity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isRange'
                  checked={watchedCompensation.isRange}
                  onCheckedChange={(checked) =>
                    setValue('compensation.isRange', checked as boolean)
                  }
                />
                <Label htmlFor='isRange'>Compensation Range</Label>
              </div>

              {watchedCompensation.isRange ? (
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='minAmount'>Minimum Amount</Label>
                    <Input
                      id='minAmount'
                      type='number'
                      {...register('compensation.minAmount', { valueAsNumber: true })}
                      placeholder='0'
                    />
                  </div>
                  <div>
                    <Label htmlFor='maxAmount'>Maximum Amount</Label>
                    <Input
                      id='maxAmount'
                      type='number'
                      {...register('compensation.maxAmount', { valueAsNumber: true })}
                      placeholder='0'
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor='amount'>Amount *</Label>
                  <Input
                    id='amount'
                    type='number'
                    {...register('compensation.amount', {
                      required: 'Amount is required',
                      valueAsNumber: true,
                    })}
                    placeholder='0'
                  />
                  {errors.compensation?.amount && (
                    <p className='text-sm text-red-500 mt-1'>
                      {errors.compensation.amount.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='urgency'>Priority Level</Label>
                <Select
                  value={watch('urgency')}
                  onValueChange={(value) => setValue('urgency', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Low'>Low</SelectItem>
                    <SelectItem value='Medium'>Medium</SelectItem>
                    <SelectItem value='High'>High</SelectItem>
                    <SelectItem value='Critical'>Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='deadline'>Application Deadline</Label>
                <Input id='deadline' type='date' {...register('deadline')} />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className='space-y-6'>
            <div>
              <Label>Requirements *</Label>
              <div className='space-y-2 mt-2'>
                {requirements.map((_, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      {...register(`requirements.${index}` as const)}
                      placeholder='Enter a requirement...'
                    />
                    {requirements.length > 1 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => removeRequirement(index)}
                      >
                        <X className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' onClick={appendRequirement}>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Requirement
                </Button>
              </div>
            </div>

            <div>
              <Label>Required Skills</Label>

              {currentSkills.length > 0 && (
                <div className='flex flex-wrap gap-1 mt-2 mb-4'>
                  {currentSkills.map((skill) => (
                    <Badge key={skill} variant='secondary' className='text-xs'>
                      {skill}
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='h-auto p-0 ml-1'
                        onClick={() => removeSkill(skill)}
                      >
                        <X className='h-3 w-3' />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}

              <div className='space-y-3'>
                <div>
                  <p className='text-sm font-medium text-muted-foreground mb-2'>
                    Suggested skills for {watchedCategory}:
                  </p>
                  <div className='flex flex-wrap gap-1'>
                    {suggestedSkills.slice(0, 8).map((skill) => (
                      <Button
                        key={skill}
                        type='button'
                        variant={currentSkills.includes(skill) ? 'default' : 'outline'}
                        size='sm'
                        className='text-xs h-6'
                        onClick={() =>
                          currentSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)
                        }
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className='flex gap-2'>
                  <Input
                    placeholder='Add custom skill...'
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addSkill(value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <Label>Benefits (Optional)</Label>
              <div className='space-y-2 mt-2'>
                {(benefits || []).map((_, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      {...register(`benefits.${index}` as const)}
                      placeholder='Enter a benefit...'
                    />
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={() => removeBenefit(index)}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                ))}
                <Button type='button' variant='outline' size='sm' onClick={appendBenefit}>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Benefit
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[700px] max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Briefcase className='h-5 w-5' />
            Post New Job Opportunity
          </DialogTitle>
          <DialogDescription>
            Create a new job posting for the HeliosHash DAO community. Step {step} of 3
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
          {renderStepContent()}

          <DialogFooter className='flex justify-between'>
            <div className='flex gap-2'>
              {step > 1 && (
                <Button type='button' variant='outline' onClick={() => setStep(step - 1)}>
                  Previous
                </Button>
              )}
            </div>

            <div className='flex gap-2'>
              <Button type='button' variant='outline' onClick={onClose}>
                Cancel
              </Button>

              {step < 3 ? (
                <Button type='button' onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              ) : (
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Save className='h-4 w-4 mr-2 animate-spin' />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className='h-4 w-4 mr-2' />
                      Publish Job
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
