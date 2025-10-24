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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/hooks/useAuthContext';
import { Briefcase, MapPin, Plus, Save, Send, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

// ✅ Import constants/types from their actual source
import {
  CATEGORY_SKILLS,
  CURRENCIES,
  Currency,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JobCategory,
  JobPostingFormData,
  WORK_TYPES,
} from '@/types/jobs'; // 👈 VERIFY THIS PATH

interface JobPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobPostingFormData) => void;
}

export default function JobPostForm({ isOpen, onClose, onSubmit }: JobPostFormProps) {
  const { user } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [isRange, setIsRange] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<JobPostingFormData>();

  const selectedCategory = watch('category');
  const locationType = watch('locationType');

  const handleFormSubmit = async (data: JobPostingFormData) => {
    setIsSubmitting(true);
    try {
      const formData: JobPostingFormData = {
        ...data,
        skills,
        requirements,
        benefits,
        compensation: {
          ...data.compensation,
          isRange,
          minAmount: isRange ? data.compensation.minAmount : undefined,
          maxAmount: isRange ? data.compensation.maxAmount : undefined,
        },
      };
      await onSubmit(formData);
      reset();
      setSkills([]);
      setRequirements([]);
      setBenefits([]);
      setIsRange(false);
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (req: string) => {
    setRequirements(requirements.filter((r) => r !== req));
  };

  const addBenefit = () => {
    if (newBenefit.trim() && !benefits.includes(newBenefit.trim())) {
      setBenefits([...benefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefit: string) => {
    setBenefits(benefits.filter((b) => b !== benefit));
  };

  const suggestedSkills = selectedCategory ? CATEGORY_SKILLS[selectedCategory] : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Briefcase className='h-5 w-5' />
            Post a New Job Opportunity
          </DialogTitle>
          <DialogDescription>
            Share opportunities with the HeliosHash community and find the perfect candidates for your solar energy projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-6'>
          {/* Basic Information */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='title'>Job Title *</Label>
              <Input
                id='title'
                {...register('title', { required: 'Job title is required' })}
                placeholder='e.g., Senior Solar Panel Installation Technician'
              />
              {errors.title && <p className='text-sm text-red-600'>{errors.title.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category'>Category *</Label>
              <Select onValueChange={(value) => setValue('category', value as JobCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
                <SelectContent>
                  {JOB_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className='text-sm text-red-600'>{errors.category.message}</p>}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>Job Description *</Label>
            <Textarea
              id='description'
              {...register('description', { required: 'Job description is required' })}
              placeholder='Describe the role, responsibilities, and what makes this opportunity special...'
              rows={4}
            />
            {errors.description && <p className='text-sm text-red-600'>{errors.description.message}</p>}
          </div>

          {/* Location */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='locationType'>Location Type *</Label>
              <Select onValueChange={(value) => setValue('locationType', value as 'OnSite' | 'Remote' | 'Hybrid')}>
                <SelectTrigger>
                  <SelectValue placeholder='Select location type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='OnSite'>On-site</SelectItem>
                  <SelectItem value='Remote'>Remote</SelectItem>
                  <SelectItem value='Hybrid'>Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(locationType === 'OnSite' || locationType === 'Hybrid') && (
              <div className='space-y-2'>
                <Label htmlFor='locationName'>Location Name</Label>
                <Input
                  id='locationName'
                  {...register('locationName')}
                  placeholder='e.g., Urgam Valley, Gujarat'
                />
              </div>
            )}
          </div>

          {/* Compensation */}
          <div className='space-y-4'>
            <Label>Compensation *</Label>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='currency'>Currency</Label>
                <Select onValueChange={(value) => setValue('compensation.currency', value as Currency)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select currency' />
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

              <div className='space-y-2'>
                <Label htmlFor='paymentType'>Payment Type</Label>
                <Select onValueChange={(value) => setValue('compensation.paymentType', value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Hourly'>Hourly</SelectItem>
                    <SelectItem value='Monthly'>Monthly</SelectItem>
                    <SelectItem value='Project'>Project-based</SelectItem>
                    <SelectItem value='Equity'>Equity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='isRange'
                  checked={isRange}
                  onCheckedChange={(checked) => setIsRange(checked as boolean)}
                />
                <Label htmlFor='isRange'>Salary Range</Label>
              </div>
            </div>

            {isRange ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='minAmount'>Minimum Amount</Label>
                  <Input
                    id='minAmount'
                    type='number'
                    {...register('compensation.minAmount', { required: 'Minimum amount is required' })}
                    placeholder='e.g., 30000'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='maxAmount'>Maximum Amount</Label>
                  <Input
                    id='maxAmount'
                    type='number'
                    {...register('compensation.maxAmount', { required: 'Maximum amount is required' })}
                    placeholder='e.g., 50000'
                  />
                </div>
              </div>
            ) : (
              <div className='space-y-2'>
                <Label htmlFor='amount'>Amount</Label>
                <Input
                  id='amount'
                  type='number'
                  {...register('compensation.amount', { required: 'Amount is required' })}
                  placeholder='e.g., 40000'
                />
              </div>
            )}
          </div>

          {/* Experience & Work Type */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='experienceLevel'>Experience Level *</Label>
              <Select onValueChange={(value) => setValue('experienceLevel', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select experience level' />
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

            <div className='space-y-2'>
              <Label htmlFor='workType'>Work Type *</Label>
              <Select onValueChange={(value) => setValue('workType', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select work type' />
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

          {/* Urgency & Deadline */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <Label htmlFor='urgency'>Urgency Level</Label>
              <Select onValueChange={(value) => setValue('urgency', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select urgency' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Low'>Low</SelectItem>
                  <SelectItem value='Medium'>Medium</SelectItem>
                  <SelectItem value='High'>High</SelectItem>
                  <SelectItem value='Critical'>Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='deadline'>Application Deadline</Label>
              <Input
                id='deadline'
                type='date'
                {...register('deadline')}
              />
            </div>
          </div>

          {/* Skills */}
          <div className='space-y-4'>
            <Label>Skills Required</Label>
            <div className='flex gap-2'>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder='Add a skill...'
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type='button' onClick={addSkill} variant='outline' aria-label='Add skill'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {skills.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {skills.map((skill) => (
                  <Badge key={skill} variant='secondary' className='flex items-center gap-1'>
                    {skill}
                    <button
                      type='button'
                      onClick={() => removeSkill(skill)}
                      className='ml-1 hover:text-red-600'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {suggestedSkills.length > 0 && (
              <div className='space-y-2'>
                <Label className='text-sm text-gray-600'>Suggested Skills:</Label>
                <div className='flex flex-wrap gap-2'>
                  {suggestedSkills
                    .filter((skill) => !skills.includes(skill))
                    .slice(0, 8)
                    .map((skill) => (
                      <Badge
                        key={skill}
                        variant='outline'
                        className='cursor-pointer hover:bg-blue-50'
                        onClick={() => setSkills([...skills, skill])}
                      >
                        + {skill}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className='space-y-4'>
            <Label>Job Requirements</Label>
            <div className='flex gap-2'>
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder='Add a requirement...'
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
              />
              <Button type='button' onClick={addRequirement} variant='outline' aria-label='Add requirement'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {requirements.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {requirements.map((req) => (
                  <Badge key={req} variant='secondary' className='flex items-center gap-1'>
                    {req}
                    <button
                      type='button'
                      onClick={() => removeRequirement(req)}
                      className='ml-1 hover:text-red-600'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className='space-y-4'>
            <Label>Benefits & Perks</Label>
            <div className='flex gap-2'>
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder='Add a benefit...'
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBenefit())}
              />
              <Button type='button' onClick={addBenefit} variant='outline' aria-label='Add benefit'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>

            {benefits.length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {benefits.map((benefit) => (
                  <Badge key={benefit} variant='secondary' className='flex items-center gap-1'>
                    {benefit}
                    <button
                      type='button'
                      onClick={() => removeBenefit(benefit)}
                      className='ml-1 hover:text-red-600'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Company Info */}
          <div className='space-y-4'>
            <Label>Company Information</Label>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='companyName'>Company Name</Label>
                <Input
                  id='companyName'
                  {...register('companyInfo.name')}
                  placeholder='e.g., HeliosHash DAO'
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='companyWebsite'>Website</Label>
                <Input
                  id='companyWebsite'
                  {...register('companyInfo.website')}
                  placeholder='https://...'
                />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='companyDescription'>Company Description</Label>
              <Textarea
                id='companyDescription'
                {...register('companyInfo.description')}
                placeholder='Brief description of your organization...'
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type='button' variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Save className='h-4 w-4 mr-2 animate-spin' />
                  Posting...
                </>
              ) : (
                <>
                  <Send className='h-4 w-4 mr-2' />
                  Post Job
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
