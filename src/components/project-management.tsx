// === Project Management Interface ===
// Comprehensive project creation and management with lifecycle stages

'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { LandOwner, ProjectLocation, SolarProject } from '../types/enhanced-solar-project';

// Utility: narrow plain object (exclude arrays/null)
function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

interface ProjectFormData {
  // Basic Info
  name: string;
  description: string;
  project_type: 'residential' | 'commercial' | 'utility' | 'community' | 'micro_grid' | 'hybrid';

  // Location
  location: Partial<ProjectLocation>;

  // Land Owner
  land_owner: Partial<LandOwner>;

  // Technical Specs
  capacity_kw: number;
  panel_count: number;
  panel_type: string;
  inverter_type: string;
  battery_storage_kwh?: number;
  grid_tie: boolean;

  // Financial
  total_investment_inr: number;
  expected_roi_percent: number;
  funding_needed_owp?: number;

  // Community
  expected_households: number;
  expected_jobs: number;
  community_ownership_percent: number;
}

interface ProjectManagementProps {
  mode: 'create' | 'edit';
  existingProject?: SolarProject;
  onSave?: (projectData: ProjectFormData) => Promise<void>;
  onCancel?: () => void;
  className?: string;
}

export const ProjectManagement = ({
  mode = 'create',
  existingProject,
  onSave,
  onCancel,
  className,
}: ProjectManagementProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: existingProject?.name || '',
    description: existingProject?.description || '',
    project_type: existingProject?.project_type || 'community',
    location: {
      address: existingProject?.location.address || '',
      district: existingProject?.location.district || '',
      state: existingProject?.location.state || '',
      country: existingProject?.location.country || 'India',
      pincode: existingProject?.location.pincode || '',
      latitude: existingProject?.location.latitude || 0,
      longitude: existingProject?.location.longitude || 0,
    },
    land_owner: {
      name: existingProject?.land_owner.name || '',
      contact: existingProject?.land_owner.contact || '',
      email: existingProject?.land_owner.email || '',
      ownership_type: existingProject?.land_owner.ownership_type || 'individual',
      land_area_acres: existingProject?.land_owner.land_area_acres || 0,
      revenue_sharing_percent: existingProject?.land_owner.revenue_sharing_percent || 0,
    },
    capacity_kw: existingProject?.capacity_kw || 0,
    panel_count: existingProject?.panel_count || 0,
    panel_type: existingProject?.panel_type || '',
    inverter_type: existingProject?.inverter_type || '',
    battery_storage_kwh: existingProject?.battery_storage_kwh,
    grid_tie: existingProject?.grid_tie || true,
    total_investment_inr: existingProject?.total_investment_inr || 0,
    expected_roi_percent: existingProject?.roi_percent_annual || 0,
    funding_needed_owp: existingProject?.funding_needed_owp,
    expected_households: existingProject?.community.households_served || 0,
    expected_jobs: existingProject?.community.local_employment_created || 0,
    community_ownership_percent: existingProject?.community.community_ownership_percent || 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const steps = [
    { title: 'Basic Info', description: 'Project name, type, and description' },
    { title: 'Location', description: 'Geographic and land information' },
    { title: 'Technical', description: 'Solar system specifications' },
    { title: 'Financial', description: 'Investment and funding details' },
    { title: 'Community', description: 'Community impact and ownership' },
    { title: 'Review', description: 'Review and submit project' },
  ];

  // Update form data
  const updateFormData = (section: keyof ProjectFormData, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]:
        isPlainObject(data) && isPlainObject(prev[section])
          ? { ...(prev as any)[section], ...(data as any) }
          : data,
    }));
  };

  // Validate current step
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    switch (step) {
      case 0: // Basic Info
        if (!formData.name.trim()) errors.name = 'Project name is required';
        if (!formData.description.trim()) errors.description = 'Description is required';
        break;

      case 1: // Location
        if (!formData.location.address?.trim()) errors.address = 'Address is required';
        if (!formData.location.state?.trim()) errors.state = 'State is required';
        if (!formData.location.pincode?.trim()) errors.pincode = 'Pincode is required';
        if (!formData.land_owner.name?.trim()) errors.landOwnerName = 'Land owner name is required';
        if (!formData.land_owner.contact?.trim()) errors.landOwnerContact = 'Contact is required';
        if (!formData.land_owner.land_area_acres || formData.land_owner.land_area_acres <= 0) {
          errors.landArea = 'Valid land area is required';
        }
        break;

      case 2: // Technical
        if (!formData.capacity_kw || formData.capacity_kw <= 0)
          errors.capacity = 'Valid capacity is required';
        if (!formData.panel_count || formData.panel_count <= 0)
          errors.panelCount = 'Valid panel count is required';
        if (!formData.panel_type.trim()) errors.panelType = 'Panel type is required';
        if (!formData.inverter_type.trim()) errors.inverterType = 'Inverter type is required';
        break;

      case 3: // Financial
        if (!formData.total_investment_inr || formData.total_investment_inr <= 0) {
          errors.investment = 'Valid investment amount is required';
        }
        if (!formData.expected_roi_percent || formData.expected_roi_percent <= 0) {
          errors.roi = 'Valid ROI percentage is required';
        }
        break;

      case 4: // Community
        if (!formData.expected_households || formData.expected_households <= 0) {
          errors.households = 'Expected households must be greater than 0';
        }
        if (
          formData.community_ownership_percent < 0 ||
          formData.community_ownership_percent > 100
        ) {
          errors.ownership = 'Ownership percentage must be between 0 and 100';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Submit project
  const handleSubmit = async () => {
    if (!validateStep(currentStep - 1)) return;

    setIsSubmitting(true);
    try {
      await onSave?.(formData);
    } catch (error) {
      console.error('Failed to save project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate estimated values
  const estimatedPanelCapacity = formData.panel_count * 250; // Assuming 250W panels
  const estimatedAnnualProduction = formData.capacity_kw * 1500; // kWh per year
  const paybackPeriod =
    formData.expected_roi_percent > 0
      ? Math.round((100 / formData.expected_roi_percent) * 10) / 10
      : 0;

  return (
    <div className={`bg-gray-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className='bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-6 border-b border-white/10'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-2xl font-bold text-white mb-2'>
              {mode === 'create' ? '🏗️ Create New Project' : '✏️ Edit Project'}
            </h2>
            <p className='text-gray-300'>
              {mode === 'create'
                ? 'Set up a new solar energy project for your community'
                : `Editing: ${existingProject?.name}`}
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className='bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors'
            >
              Cancel
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className='flex items-center justify-between mt-6'>
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  index === currentStep
                    ? 'bg-yellow-500 text-black'
                    : index < currentStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 transition-colors ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className='mt-2 text-center'>
          <div className='text-white font-bold'>{steps[currentStep].title}</div>
          <div className='text-gray-400 text-sm'>{steps[currentStep].description}</div>
        </div>
      </div>

      {/* Form Content */}
      <div className='p-6'>
        {/* Basic Info Step */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6'
          >
            <div>
              <label className='block text-white font-bold mb-2'>Project Name *</label>
              <input
                type='text'
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder='e.g., UrgamU Valley Solar Initiative'
                className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                  validationErrors.name ? 'border-red-500' : 'border-gray-600'
                } focus:border-yellow-500 focus:outline-none`}
              />
              {validationErrors.name && (
                <p className='text-red-400 text-sm mt-1'>{validationErrors.name}</p>
              )}
            </div>

            <div>
              <label className='block text-white font-bold mb-2'>Project Type</label>
              <select
                value={formData.project_type}
                onChange={(e) => updateFormData('project_type', e.target.value)}
                className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
              >
                <option value='community'>Community Solar</option>
                <option value='residential'>Residential</option>
                <option value='commercial'>Commercial</option>
                <option value='utility'>Utility Scale</option>
                <option value='micro_grid'>Micro Grid</option>
                <option value='hybrid'>Hybrid System</option>
              </select>
            </div>

            <div>
              <label className='block text-white font-bold mb-2'>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder='Describe the project goals, community impact, and unique features...'
                rows={4}
                className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                  validationErrors.description ? 'border-red-500' : 'border-gray-600'
                } focus:border-yellow-500 focus:outline-none resize-none`}
              />
              {validationErrors.description && (
                <p className='text-red-400 text-sm mt-1'>{validationErrors.description}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Location Step */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-white font-bold mb-2'>Address *</label>
                <input
                  type='text'
                  value={formData.location.address || ''}
                  onChange={(e) => updateFormData('location', { address: e.target.value })}
                  placeholder='Full address of the project site'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.address ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.address && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.address}</p>
                )}
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>District</label>
                <input
                  type='text'
                  value={formData.location.district || ''}
                  onChange={(e) => updateFormData('location', { district: e.target.value })}
                  placeholder='District name'
                  className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                />
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <label className='block text-white font-bold mb-2'>State *</label>
                <input
                  type='text'
                  value={formData.location.state || ''}
                  onChange={(e) => updateFormData('location', { state: e.target.value })}
                  placeholder='State name'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.state ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.state && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.state}</p>
                )}
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>Country</label>
                <input
                  type='text'
                  value={formData.location.country || 'India'}
                  onChange={(e) => updateFormData('location', { country: e.target.value })}
                  className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>Pincode *</label>
                <input
                  type='text'
                  value={formData.location.pincode || ''}
                  onChange={(e) => updateFormData('location', { pincode: e.target.value })}
                  placeholder='PIN code'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.pincode ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.pincode && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.pincode}</p>
                )}
              </div>
            </div>

            {/* Land Owner Info */}
            <div className='bg-gray-800/50 rounded-lg p-4'>
              <h3 className='text-white font-bold mb-4'>🏡 Land Owner Information</h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <label className='block text-white font-bold mb-2'>Owner Name *</label>
                  <input
                    type='text'
                    value={formData.land_owner.name || ''}
                    onChange={(e) => updateFormData('land_owner', { name: e.target.value })}
                    placeholder='Land owner full name'
                    className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                      validationErrors.landOwnerName ? 'border-red-500' : 'border-gray-600'
                    } focus:border-yellow-500 focus:outline-none`}
                  />
                  {validationErrors.landOwnerName && (
                    <p className='text-red-400 text-sm mt-1'>{validationErrors.landOwnerName}</p>
                  )}
                </div>

                <div>
                  <label className='block text-white font-bold mb-2'>Contact *</label>
                  <input
                    type='text'
                    value={formData.land_owner.contact || ''}
                    onChange={(e) => updateFormData('land_owner', { contact: e.target.value })}
                    placeholder='Phone number'
                    className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                      validationErrors.landOwnerContact ? 'border-red-500' : 'border-gray-600'
                    } focus:border-yellow-500 focus:outline-none`}
                  />
                  {validationErrors.landOwnerContact && (
                    <p className='text-red-400 text-sm mt-1'>{validationErrors.landOwnerContact}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block text-white font-bold mb-2'>Ownership Type</label>
                  <select
                    value={formData.land_owner.ownership_type || 'individual'}
                    onChange={(e) =>
                      updateFormData('land_owner', { ownership_type: e.target.value })
                    }
                    className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                  >
                    <option value='individual'>Individual</option>
                    <option value='community'>Community</option>
                    <option value='government'>Government</option>
                    <option value='private_company'>Private Company</option>
                  </select>
                </div>

                <div>
                  <label className='block text-white font-bold mb-2'>Land Area (acres) *</label>
                  <input
                    type='number'
                    value={formData.land_owner.land_area_acres || ''}
                    onChange={(e) =>
                      updateFormData('land_owner', { land_area_acres: parseFloat(e.target.value) })
                    }
                    placeholder='0'
                    min='0'
                    step='0.1'
                    className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                      validationErrors.landArea ? 'border-red-500' : 'border-gray-600'
                    } focus:border-yellow-500 focus:outline-none`}
                  />
                  {validationErrors.landArea && (
                    <p className='text-red-400 text-sm mt-1'>{validationErrors.landArea}</p>
                  )}
                </div>

                <div>
                  <label className='block text-white font-bold mb-2'>Revenue Share (%)</label>
                  <input
                    type='number'
                    value={formData.land_owner.revenue_sharing_percent || ''}
                    onChange={(e) =>
                      updateFormData('land_owner', {
                        revenue_sharing_percent: parseFloat(e.target.value),
                      })
                    }
                    placeholder='0'
                    min='0'
                    max='100'
                    className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Technical Step */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-white font-bold mb-2'>System Capacity (kW) *</label>
                <input
                  type='number'
                  value={formData.capacity_kw || ''}
                  onChange={(e) => updateFormData('capacity_kw', parseFloat(e.target.value))}
                  placeholder='0'
                  min='0'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.capacity ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.capacity && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.capacity}</p>
                )}
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>Number of Panels *</label>
                <input
                  type='number'
                  value={formData.panel_count || ''}
                  onChange={(e) => updateFormData('panel_count', parseInt(e.target.value))}
                  placeholder='0'
                  min='0'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.panelCount ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.panelCount && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.panelCount}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-white font-bold mb-2'>Panel Type *</label>
                <input
                  type='text'
                  value={formData.panel_type}
                  onChange={(e) => updateFormData('panel_type', e.target.value)}
                  placeholder='e.g., Monocrystalline Silicon 300W'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.panelType ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.panelType && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.panelType}</p>
                )}
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>Inverter Type *</label>
                <input
                  type='text'
                  value={formData.inverter_type}
                  onChange={(e) => updateFormData('inverter_type', e.target.value)}
                  placeholder='e.g., String Inverters 50kW'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.inverterType ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.inverterType && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.inverterType}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-white font-bold mb-2'>Battery Storage (kWh)</label>
                <input
                  type='number'
                  value={formData.battery_storage_kwh || ''}
                  onChange={(e) =>
                    updateFormData('battery_storage_kwh', parseFloat(e.target.value) || undefined)
                  }
                  placeholder='Optional'
                  min='0'
                  className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                />
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>Grid Connection</label>
                <select
                  value={formData.grid_tie ? 'true' : 'false'}
                  onChange={(e) => updateFormData('grid_tie', e.target.value === 'true')}
                  className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                >
                  <option value='true'>Grid-Tied</option>
                  <option value='false'>Off-Grid</option>
                </select>
              </div>
            </div>

            {/* Estimated Values */}
            <div className='bg-blue-500/20 rounded-lg p-4'>
              <h3 className='text-blue-400 font-bold mb-3'>📊 Estimated Performance</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                <div>
                  <div className='text-gray-400'>Panel Capacity Check:</div>
                  <div
                    className={`font-bold ${
                      Math.abs(estimatedPanelCapacity - formData.capacity_kw) < 50
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {estimatedPanelCapacity} kW (vs {formData.capacity_kw} kW declared)
                  </div>
                </div>
                <div>
                  <div className='text-gray-400'>Annual Production:</div>
                  <div className='text-white font-bold'>
                    ~{estimatedAnnualProduction.toLocaleString()} kWh/year
                  </div>
                </div>
                <div>
                  <div className='text-gray-400'>Land Usage:</div>
                  <div className='text-white font-bold'>
                    ~{((formData.capacity_kw / 1000) * 4).toFixed(1)} acres needed
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Financial Step */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-white font-bold mb-2'>Total Investment (₹) *</label>
                <input
                  type='number'
                  value={formData.total_investment_inr || ''}
                  onChange={(e) =>
                    updateFormData('total_investment_inr', parseFloat(e.target.value))
                  }
                  placeholder='0'
                  min='0'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.investment ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.investment && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.investment}</p>
                )}
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>
                  Expected ROI (% annually) *
                </label>
                <input
                  type='number'
                  value={formData.expected_roi_percent || ''}
                  onChange={(e) =>
                    updateFormData('expected_roi_percent', parseFloat(e.target.value))
                  }
                  placeholder='0'
                  min='0'
                  max='100'
                  step='0.1'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.roi ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.roi && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.roi}</p>
                )}
              </div>
            </div>

            <div>
              <label className='block text-white font-bold mb-2'>
                Additional Funding Needed (OWP Tokens)
              </label>
              <input
                type='number'
                value={formData.funding_needed_owp || ''}
                onChange={(e) =>
                  updateFormData('funding_needed_owp', parseFloat(e.target.value) || undefined)
                }
                placeholder='Optional - if community funding is needed'
                min='0'
                className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
              />
            </div>

            {/* Financial Projections */}
            <div className='bg-green-500/20 rounded-lg p-4'>
              <h3 className='text-green-400 font-bold mb-3'>💰 Financial Projections</h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                <div>
                  <div className='text-gray-400'>Cost per kW:</div>
                  <div className='text-white font-bold'>
                    ₹
                    {formData.capacity_kw > 0
                      ? (formData.total_investment_inr / formData.capacity_kw).toLocaleString()
                      : 0}
                    /kW
                  </div>
                </div>
                <div>
                  <div className='text-gray-400'>Payback Period:</div>
                  <div className='text-white font-bold'>~{paybackPeriod} years</div>
                </div>
                <div>
                  <div className='text-gray-400'>Annual Revenue:</div>
                  <div className='text-white font-bold'>
                    ₹
                    {(
                      (formData.total_investment_inr * formData.expected_roi_percent) /
                      100
                    ).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Community Step */}
        {currentStep === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-white font-bold mb-2'>
                  Expected Households Served *
                </label>
                <input
                  type='number'
                  value={formData.expected_households || ''}
                  onChange={(e) => updateFormData('expected_households', parseInt(e.target.value))}
                  placeholder='0'
                  min='0'
                  className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                    validationErrors.households ? 'border-red-500' : 'border-gray-600'
                  } focus:border-yellow-500 focus:outline-none`}
                />
                {validationErrors.households && (
                  <p className='text-red-400 text-sm mt-1'>{validationErrors.households}</p>
                )}
              </div>

              <div>
                <label className='block text-white font-bold mb-2'>Expected Jobs Created</label>
                <input
                  type='number'
                  value={formData.expected_jobs || ''}
                  onChange={(e) => updateFormData('expected_jobs', parseInt(e.target.value))}
                  placeholder='0'
                  min='0'
                  className='w-full bg-gray-800 text-white rounded-lg p-3 border border-gray-600 focus:border-yellow-500 focus:outline-none'
                />
              </div>
            </div>

            <div>
              <label className='block text-white font-bold mb-2'>
                Community Ownership Percentage
              </label>
              <input
                type='number'
                value={formData.community_ownership_percent || ''}
                onChange={(e) =>
                  updateFormData('community_ownership_percent', parseFloat(e.target.value))
                }
                placeholder='0'
                min='0'
                max='100'
                className={`w-full bg-gray-800 text-white rounded-lg p-3 border ${
                  validationErrors.ownership ? 'border-red-500' : 'border-gray-600'
                } focus:border-yellow-500 focus:outline-none`}
              />
              {validationErrors.ownership && (
                <p className='text-red-400 text-sm mt-1'>{validationErrors.ownership}</p>
              )}
            </div>

            {/* Community Impact Preview */}
            <div className='bg-purple-500/20 rounded-lg p-4'>
              <h3 className='text-purple-400 font-bold mb-3'>🌟 Projected Community Impact</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div>
                  <div className='text-gray-400'>People Benefited:</div>
                  <div className='text-white font-bold'>
                    ~{(formData.expected_households * 4).toLocaleString()}
                  </div>
                  <div className='text-xs text-gray-400'>Assuming 4 people per household</div>
                </div>
                <div>
                  <div className='text-gray-400'>Monthly Savings per Household:</div>
                  <div className='text-white font-bold'>
                    ₹
                    {(
                      (formData.capacity_kw * 125) /
                      Math.max(formData.expected_households, 1)
                    ).toFixed(0)}
                  </div>
                  <div className='text-xs text-gray-400'>Estimated electricity bill reduction</div>
                </div>
                <div>
                  <div className='text-gray-400'>Annual CO₂ Reduction:</div>
                  <div className='text-white font-bold'>
                    {((formData.capacity_kw * 1200 * 0.85) / 1000).toFixed(1)} tons
                  </div>
                  <div className='text-xs text-gray-400'>Carbon footprint reduction</div>
                </div>
                <div>
                  <div className='text-gray-400'>Energy Independence:</div>
                  <div className='text-white font-bold'>
                    {formData.capacity_kw > 0 && formData.expected_households > 0
                      ? ((formData.capacity_kw * 4) / formData.expected_households).toFixed(1)
                      : 0}{' '}
                    kW/household
                  </div>
                  <div className='text-xs text-gray-400'>Average capacity per household</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Review Step */}
        {currentStep === 5 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className='space-y-6'
          >
            <div className='bg-yellow-500/20 rounded-lg p-4 mb-6'>
              <h3 className='text-yellow-400 font-bold mb-3'>📋 Project Summary</h3>
              <p className='text-gray-300 text-sm'>
                Please review all the information below before submitting your project for approval.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Basic Information */}
              <div className='bg-gray-800/50 rounded-lg p-4'>
                <h4 className='text-white font-bold mb-3'>📝 Basic Information</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='text-gray-400'>Name:</span>{' '}
                    <span className='text-white'>{formData.name}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Type:</span>{' '}
                    <span className='text-white capitalize'>
                      {formData.project_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Description:</span>{' '}
                    <span className='text-white'>{formData.description.slice(0, 100)}...</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className='bg-gray-800/50 rounded-lg p-4'>
                <h4 className='text-white font-bold mb-3'>📍 Location</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='text-gray-400'>Address:</span>{' '}
                    <span className='text-white'>{formData.location.address}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>State:</span>{' '}
                    <span className='text-white'>{formData.location.state}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Land Owner:</span>{' '}
                    <span className='text-white'>{formData.land_owner.name}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Land Area:</span>{' '}
                    <span className='text-white'>{formData.land_owner.land_area_acres} acres</span>
                  </div>
                </div>
              </div>

              {/* Technical */}
              <div className='bg-gray-800/50 rounded-lg p-4'>
                <h4 className='text-white font-bold mb-3'>⚙️ Technical Specifications</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='text-gray-400'>Capacity:</span>{' '}
                    <span className='text-white'>{formData.capacity_kw} kW</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Panels:</span>{' '}
                    <span className='text-white'>{formData.panel_count} panels</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Panel Type:</span>{' '}
                    <span className='text-white'>{formData.panel_type}</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Grid Connection:</span>{' '}
                    <span className='text-white'>
                      {formData.grid_tie ? 'Grid-Tied' : 'Off-Grid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Financial */}
              <div className='bg-gray-800/50 rounded-lg p-4'>
                <h4 className='text-white font-bold mb-3'>💰 Financial Details</h4>
                <div className='space-y-2 text-sm'>
                  <div>
                    <span className='text-gray-400'>Investment:</span>{' '}
                    <span className='text-white'>
                      ₹{formData.total_investment_inr.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Expected ROI:</span>{' '}
                    <span className='text-white'>{formData.expected_roi_percent}% annually</span>
                  </div>
                  <div>
                    <span className='text-gray-400'>Payback Period:</span>{' '}
                    <span className='text-white'>~{paybackPeriod} years</span>
                  </div>
                  {formData.funding_needed_owp && (
                    <div>
                      <span className='text-gray-400'>Additional Funding:</span>{' '}
                      <span className='text-white'>
                        {formData.funding_needed_owp.toLocaleString()} OWP
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Community Impact Summary */}
            <div className='bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4'>
              <h4 className='text-white font-bold mb-3'>🌟 Expected Community Impact</h4>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
                <div>
                  <div className='text-2xl font-bold text-green-400'>
                    {formData.expected_households}
                  </div>
                  <div className='text-gray-400 text-sm'>Households Served</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-blue-400'>
                    {formData.expected_jobs || 0}
                  </div>
                  <div className='text-gray-400 text-sm'>Jobs Created</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-purple-400'>
                    {formData.community_ownership_percent}%
                  </div>
                  <div className='text-gray-400 text-sm'>Community Owned</div>
                </div>
                <div>
                  <div className='text-2xl font-bold text-yellow-400'>
                    {((formData.capacity_kw * 1200 * 0.85) / 1000).toFixed(1)}
                  </div>
                  <div className='text-gray-400 text-sm'>CO₂ Tons Reduced</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className='flex justify-between items-center mt-8 pt-6 border-t border-gray-700'>
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className='bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-colors'
          >
            Previous
          </button>

          <div className='text-sm text-gray-400'>
            Step {currentStep + 1} of {steps.length}
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className='bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition-colors'
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className='bg-green-500 hover:bg-green-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-colors'
            >
              {isSubmitting
                ? 'Submitting...'
                : `${mode === 'create' ? 'Create Project' : 'Save Changes'}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectManagement;
