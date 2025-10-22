'use client';

/**
 * TODO: Deprecation Notice - JobFilters singular properties
 * The singular alias arrays (category, location, experienceLevel, workType, minCompensation, maxCompensation)
 * are marked deprecated in `JobFilters` and will be removed in v2.1.0. Migrate UI to use canonical plural forms:
 * - category  -> categories
 * - location  -> locations
 * - experienceLevel -> experienceLevels
 * - workType -> workTypes
 * - minCompensation/maxCompensation -> compensationRange.{min,max}
 * Tracking Issue: [DEPRECATION] Replace JobFilters singular properties with array-based properties
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CATEGORY_SKILLS,
  CURRENCIES,
  Currency,
  EXPERIENCE_LEVELS,
  JOB_CATEGORIES,
  JobCategory,
  JobFilters,
  WORK_TYPES,
} from '@/types/jobs';
import { X } from 'lucide-react';

interface JobFiltersPanelProps {
  filters: JobFilters;
  onFiltersChange: (filters: JobFilters) => void;
  className?: string;
}

export default function JobFiltersPanel({
  filters,
  onFiltersChange,
  className,
}: JobFiltersPanelProps) {
  const updateFilter = <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const addToArrayFilter = <K extends keyof JobFilters>(
    key: K,
    value: string,
    currentArray: string[] = []
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as JobFilters[K]);
  };

  const removeFromArrayFilter = <K extends keyof JobFilters>(
    key: K,
    value: string,
    currentArray: string[] = []
  ) => {
    const newArray = currentArray.filter((item) => item !== value);
    updateFilter(key, newArray as JobFilters[K]);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getFilterCount = () => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      if (Array.isArray(value)) return count + value.length;
      if (value !== undefined && value !== null && value !== '') return count + 1;
      return count;
    }, 0);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Header */}
      <Card>
        <CardHeader className='pb-3'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-lg'>Filters</CardTitle>
            {getFilterCount() > 0 && (
              <Button variant='ghost' size='sm' onClick={clearAllFilters}>
                Clear All
              </Button>
            )}
          </div>
          {getFilterCount() > 0 && (
            <p className='text-sm text-muted-foreground'>
              {getFilterCount()} filter{getFilterCount() !== 1 ? 's' : ''} applied
            </p>
          )}
        </CardHeader>
      </Card>

      {/* Job Category */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Category</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {JOB_CATEGORIES.map((category) => (
            <div key={category.value} className='flex items-center space-x-2'>
              <Checkbox
                id={`category-${category.value}`}
                checked={filters.category?.includes(category.value as JobCategory) || false}
                onCheckedChange={() =>
                  addToArrayFilter('category', category.value, filters.category as string[])
                }
              />
              <Label
                htmlFor={`category-${category.value}`}
                className='flex items-center gap-2 cursor-pointer flex-1'
              >
                <span>{category.icon}</span>
                <span className='text-sm'>{category.label}</span>
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Location Type */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Work Location</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {['Remote', 'OnSite', 'Hybrid'].map((location) => (
            <div key={location} className='flex items-center space-x-2'>
              <Checkbox
                id={`location-${location}`}
                checked={filters.location?.includes(location as any) || false}
                onCheckedChange={() =>
                  addToArrayFilter('location', location, filters.location as string[])
                }
              />
              <Label htmlFor={`location-${location}`} className='cursor-pointer'>
                {location === 'OnSite' ? 'On-site' : location}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Experience Level */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Experience Level</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {EXPERIENCE_LEVELS.map((level) => (
            <div key={level.value} className='flex items-center space-x-2'>
              <Checkbox
                id={`experience-${level.value}`}
                checked={filters.experienceLevel?.includes(level.value as any) || false}
                onCheckedChange={() =>
                  addToArrayFilter(
                    'experienceLevel',
                    level.value,
                    filters.experienceLevel as string[]
                  )
                }
              />
              <Label htmlFor={`experience-${level.value}`} className='cursor-pointer text-sm'>
                {level.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Work Type */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Employment Type</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {WORK_TYPES.map((type) => (
            <div key={type.value} className='flex items-center space-x-2'>
              <Checkbox
                id={`worktype-${type.value}`}
                checked={filters.workType?.includes(type.value as any) || false}
                onCheckedChange={() =>
                  addToArrayFilter('workType', type.value, filters.workType as string[])
                }
              />
              <Label htmlFor={`worktype-${type.value}`} className='cursor-pointer'>
                {type.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Compensation Range */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Salary Range</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Currency Selection */}
          <div className='space-y-2'>
            <Label className='text-sm'>Currency</Label>
            <Select
              value={filters.currency?.[0] || 'INR'}
              onValueChange={(value) => updateFilter('currency', [value as Currency])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.symbol} {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Min/Max Inputs */}
          <div className='grid grid-cols-2 gap-2'>
            <div className='space-y-1'>
              <Label className='text-xs'>Min</Label>
              <Input
                type='number'
                placeholder='0'
                value={filters.minCompensation || ''}
                onChange={(e) =>
                  updateFilter('minCompensation', Number(e.target.value) || undefined)
                }
              />
            </div>
            <div className='space-y-1'>
              <Label className='text-xs'>Max</Label>
              <Input
                type='number'
                placeholder='No limit'
                value={filters.maxCompensation || ''}
                onChange={(e) =>
                  updateFilter('maxCompensation', Number(e.target.value) || undefined)
                }
              />
            </div>
          </div>

          {/* Quick Range Buttons */}
          <div className='grid grid-cols-2 gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                updateFilter('minCompensation', 20000);
                updateFilter('maxCompensation', 50000);
              }}
            >
              ₹20K - ₹50K
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                updateFilter('minCompensation', 50000);
                updateFilter('maxCompensation', 100000);
              }}
            >
              ₹50K - ₹1L
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Skills</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          {/* Selected Skills */}
          {filters.skills && filters.skills.length > 0 && (
            <div className='flex flex-wrap gap-1 mb-3'>
              {filters.skills.map((skill) => (
                <Badge key={skill} variant='secondary' className='text-xs'>
                  {skill}
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-auto p-0 ml-1'
                    onClick={() => removeFromArrayFilter('skills', skill, filters.skills)}
                  >
                    <X className='h-3 w-3' />
                  </Button>
                </Badge>
              ))}
            </div>
          )}

          {/* Skill Categories */}
          {filters.category && filters.category.length > 0 && (
            <div className='space-y-3'>
              {filters.category.map((cat) => (
                <div key={cat}>
                  <Label className='text-xs font-medium text-muted-foreground mb-2 block'>
                    {cat} Skills
                  </Label>
                  <div className='flex flex-wrap gap-1'>
                    {CATEGORY_SKILLS[cat as JobCategory]?.slice(0, 6).map((skill) => (
                      <Button
                        key={skill}
                        variant={filters.skills?.includes(skill) ? 'default' : 'outline'}
                        size='sm'
                        className='text-xs h-6'
                        onClick={() => addToArrayFilter('skills', skill, filters.skills)}
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Skill Input */}
          <div className='space-y-2'>
            <Label className='text-sm'>Add Custom Skill</Label>
            <div className='flex gap-2'>
              <Input
                placeholder='e.g. Python, Solar Installation'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.currentTarget.value.trim();
                    if (value) {
                      addToArrayFilter('skills', value, filters.skills);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Filters */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Additional Filters</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='featured-only'
              checked={filters.featured || false}
              onCheckedChange={(checked) => updateFilter('featured', checked as boolean)}
            />
            <Label htmlFor='featured-only' className='cursor-pointer'>
              Featured jobs only
            </Label>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm'>Posted Within</Label>
            <Select
              value={filters.posted || 'All'}
              onValueChange={(value) => updateFilter('posted', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='All'>All Time</SelectItem>
                <SelectItem value='Today'>Today</SelectItem>
                <SelectItem value='Week'>Past Week</SelectItem>
                <SelectItem value='Month'>Past Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm'>Priority Level</Label>
            <div className='space-y-2'>
              {['Critical', 'High', 'Medium', 'Low'].map((urgency) => (
                <div key={urgency} className='flex items-center space-x-2'>
                  <Checkbox
                    id={`urgency-${urgency}`}
                    checked={filters.urgency?.includes(urgency as any) || false}
                    onCheckedChange={() =>
                      addToArrayFilter('urgency', urgency, filters.urgency as string[])
                    }
                  />
                  <Label htmlFor={`urgency-${urgency}`} className='cursor-pointer text-sm'>
                    {urgency}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
