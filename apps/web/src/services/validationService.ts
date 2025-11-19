/**
 * Validation Opportunities Service
 * Manages validation tasks, duo matching, and session creation
 */

import { ValidationFilters, ValidationOpportunity, Validator } from '../types/validation';

class ValidationService {
  // Mock validation opportunities data
  private mockValidationOpportunities: ValidationOpportunity[] = [
    {
      id: 'val-001',
      projectId: 'proj-001',
      projectName: 'Rajasthan Solar Farm Installation',
      projectLocation: 'Jodhpur, Rajasthan',
      validationType: 'Installation',
      title: 'Solar Panel Installation Quality Check',
      description:
        'Verify proper installation of 500kW solar panel array including mounting, wiring, and safety protocols. Critical validation for project commissioning.',
      estimatedDuration: 4,
      requiredSkills: ['Solar Installation', 'Electrical Safety', 'Quality Control'],
      experienceLevel: 'Mid',
      supportsDuoValidation: true,
      requiresDuoValidation: false,
  currentValidators: [] as Validator[],
      maxValidators: 2,
      baseReward: 50,
      duoBonus: 25,
      location: {
        type: 'OnSite',
        address: 'Solar Farm Site, Jodhpur Industrial Area',
        coordinates: { lat: 26.2389, lng: 73.0243 },
      },
      scheduledDate: Date.now() + 86400000 * 2, // 2 days from now
      deadline: Date.now() + 86400000 * 7, // 1 week deadline
      status: 'Open',
      priority: 'High',
      createdBy: 'dao-admin',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'val-002',
      projectId: 'proj-002',
      projectName: 'Gujarat Village Microgrid',
      projectLocation: 'Urgam Valley, Gujarat',
      validationType: 'Performance',
      title: 'Monthly Performance Assessment',
      description:
        'Assess solar system performance metrics, energy output, and equipment health for rural microgrid installation serving 200 households.',
      estimatedDuration: 3,
      requiredSkills: ['Performance Analysis', 'Data Collection', 'Solar Systems'],
      experienceLevel: 'Entry',
      supportsDuoValidation: true,
      requiresDuoValidation: false,
      currentValidators: [
        {
          validatorId: 'user-001',
          validatorName: 'Priya Sharma',
          validatorRole: 'Primary',
          assignedAt: Date.now() - 3600000,
          status: 'Confirmed',
          prefersDuoValidation: true,
        },
      ] as Validator[],
      maxValidators: 2,
      baseReward: 40,
      duoBonus: 20,
      location: {
        type: 'OnSite',
        address: 'Village Community Center, Urgam Valley',
        coordinates: { lat: 23.7337, lng: 72.0211 },
      },
      scheduledDate: Date.now() + 86400000 * 5, // 5 days from now
      deadline: Date.now() + 86400000 * 10,
      status: 'PartiallyFilled',
      priority: 'Medium',
      createdBy: 'community-lead',
      createdAt: Date.now() - 172800000,
    },
    {
      id: 'val-003',
      projectId: 'proj-003',
      projectName: 'Tamil Nadu Coastal Solar Park',
      projectLocation: 'Chennai, Tamil Nadu',
      validationType: 'Safety',
      title: 'Safety Compliance Audit',
      description:
        'Comprehensive safety audit of coastal solar installation including saltwater corrosion assessment, grounding systems, and storm protection measures.',
      estimatedDuration: 6,
      requiredSkills: ['Safety Audit', 'Coastal Systems', 'Compliance'],
      experienceLevel: 'Senior',
      supportsDuoValidation: true,
      requiresDuoValidation: true, // Safety audits require duo validation
  currentValidators: [] as Validator[],
      maxValidators: 2,
      baseReward: 80,
      duoBonus: 40,
      location: {
        type: 'OnSite',
        address: 'Coastal Solar Park, ECR Road, Chennai',
        coordinates: { lat: 13.0827, lng: 80.2707 },
      },
      scheduledDate: Date.now() + 86400000 * 3, // 3 days from now
      deadline: Date.now() + 86400000 * 14,
      status: 'Open',
      priority: 'Critical',
      createdBy: 'safety-officer',
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'val-004',
      projectId: 'proj-004',
      projectName: 'Maharashtra Agri-Solar Hybrid',
      projectLocation: 'Pune, Maharashtra',
      validationType: 'Maintenance',
      title: 'Quarterly Maintenance Check',
      description:
        'Routine maintenance validation for agri-solar hybrid system including panel cleaning effectiveness, crop compatibility, and irrigation integration.',
      estimatedDuration: 2,
      requiredSkills: ['Maintenance', 'Agricultural Systems', 'Solar Cleaning'],
      experienceLevel: 'Entry',
      supportsDuoValidation: false, // Simple maintenance, solo only
      requiresDuoValidation: false,
      currentValidators: [],
      maxValidators: 1,
      baseReward: 30,
      location: {
        type: 'OnSite',
        address: 'Agri-Solar Farm, Pune-Nashik Highway',
        coordinates: { lat: 18.5204, lng: 73.8567 },
      },
      scheduledDate: Date.now() + 86400000 * 4, // 4 days from now
      deadline: Date.now() + 86400000 * 12,
      status: 'Open',
      priority: 'Low',
      createdBy: 'maintenance-team',
      createdAt: Date.now() - 259200000,
    },
    {
      id: 'val-005',
      projectId: 'proj-005',
      projectName: 'Karnataka Tech Hub Solar',
      projectLocation: 'Bangalore, Karnataka',
      validationType: 'Compliance',
      title: 'Grid Integration Compliance Check',
      description:
        'Validate grid integration compliance including power quality, synchronization protocols, and regulatory adherence for urban commercial installation.',
      estimatedDuration: 5,
      requiredSkills: ['Grid Integration', 'Power Quality', 'Compliance'],
      experienceLevel: 'Senior',
      supportsDuoValidation: true,
      requiresDuoValidation: false,
      currentValidators: [],
      maxValidators: 2,
      baseReward: 70,
      duoBonus: 35,
      location: {
        type: 'OnSite',
        address: 'Tech Park Solar Installation, Electronic City',
        coordinates: { lat: 12.9716, lng: 77.5946 },
      },
      scheduledDate: Date.now() + 86400000 * 6, // 6 days from now
      deadline: Date.now() + 86400000 * 21,
      status: 'Open',
      priority: 'Medium',
      createdBy: 'tech-team',
      createdAt: Date.now() - 432000000,
    },
  ];

  /**
   * Get validation opportunities with filtering and duo preference matching
   */
  async getValidationOpportunities(
    filters?: ValidationFilters,
    userLocation?: string,
    userPrefersDuo?: boolean
  ): Promise<ValidationOpportunity[]> {
    let opportunities = [...this.mockValidationOpportunities];

    // Apply filters
    if (filters) {
      if (filters.validationType?.length) {
        opportunities = opportunities.filter((op) =>
          op.validationType && filters.validationType!.includes(op.validationType)
        );
      }

      if (filters.experienceLevel?.length) {
        opportunities = opportunities.filter((op) =>
          op.experienceLevel && filters.experienceLevel!.includes(op.experienceLevel)
        );
      }

      if (filters.location) {
        opportunities = opportunities.filter(
          (op) =>
            (op.location && op.location.address && op.location.address.toLowerCase().includes(filters.location!.toLowerCase())) ||
            (op.projectLocation && op.projectLocation.toLowerCase().includes(filters.location!.toLowerCase()))
        );
      }

      if (filters.duoPreference) {
        switch (filters.duoPreference) {
          case 'solo-only':
            opportunities = opportunities.filter((op) => !op.supportsDuoValidation);
            break;
          case 'duo-only':
            opportunities = opportunities.filter((op) => op.supportsDuoValidation);
            break;
          case 'duo-preferred':
            // Sort duo opportunities first, but include solo
            opportunities.sort((a, b) => {
              if (a.supportsDuoValidation && !b.supportsDuoValidation) return -1;
              if (!a.supportsDuoValidation && b.supportsDuoValidation) return 1;
              return 0;
            });
            break;
          // 'any' - no filtering needed
        }
      }

      if (filters.minReward) {
        opportunities = opportunities.filter((op) =>
          typeof op.baseReward === 'number' && op.baseReward >= filters.minReward!
        );
      }

      if (filters.maxDuration) {
        opportunities = opportunities.filter((op) =>
          typeof op.estimatedDuration === 'number' && op.estimatedDuration <= filters.maxDuration!
        );
      }

      if (filters.dateRange) {
        opportunities = opportunities.filter(
          (op) =>
            typeof op.scheduledDate === 'number' &&
            op.scheduledDate >= filters.dateRange!.start &&
            op.scheduledDate <= filters.dateRange!.end
        );
      }
    }

    // If user prefers duo, prioritize duo opportunities and partially filled opportunities
    if (userPrefersDuo) {
      opportunities.sort((a, b) => {
        // Prioritize partially filled duo opportunities (need a partner)
        if (a.status === 'PartiallyFilled' && b.status !== 'PartiallyFilled') return -1;
        if (a.status !== 'PartiallyFilled' && b.status === 'PartiallyFilled') return 1;

        // Then prioritize duo-supporting opportunities
        if (a.supportsDuoValidation && !b.supportsDuoValidation) return -1;
        if (!a.supportsDuoValidation && b.supportsDuoValidation) return 1;

        // Finally sort by reward (duo bonus considered)
  const aReward = (typeof a.baseReward === 'number' ? a.baseReward : 0) + (a.duoBonus || 0);
  const bReward = (typeof b.baseReward === 'number' ? b.baseReward : 0) + (b.duoBonus || 0);
  return bReward - aReward;
      });
    }

    return opportunities;
  }

  /**
   * Get opportunities specifically needing partners (partially filled duo validations)
   */
  async getPartnerNeededOpportunities(): Promise<ValidationOpportunity[]> {
    return this.mockValidationOpportunities.filter(
      (op) =>
        op.status === 'PartiallyFilled' &&
        op.supportsDuoValidation &&
        Array.isArray(op.currentValidators) && op.currentValidators.length === 1
    );
  }

  /**
   * Get validation opportunity by ID
   */
  async getValidationOpportunity(id: string): Promise<ValidationOpportunity | null> {
    return this.mockValidationOpportunities.find((op) => op.id === id) || null;
  }

  /**
   * Apply for a validation opportunity
   */
  async applyForValidation(
    opportunityId: string,
    validatorId: string,
    validatorName: string,
    sessionType: 'solo' | 'duo'
  ): Promise<{ success: boolean; message: string }> {
    const opportunity = this.mockValidationOpportunities.find((op) => op.id === opportunityId);

    if (!opportunity) {
      return { success: false, message: 'Validation opportunity not found' };
    }

    if (opportunity.status === 'Full') {
      return { success: false, message: 'This validation opportunity is already full' };
    }

    // Check if user already applied
  const alreadyApplied = Array.isArray(opportunity.currentValidators) && opportunity.currentValidators.some((v) => v.validatorId === validatorId);
    if (alreadyApplied) {
      return { success: false, message: 'You have already applied for this validation' };
    }

    // For solo applications on duo-capable opportunities
    if (
      sessionType === 'solo' &&
      opportunity.supportsDuoValidation &&
      Array.isArray(opportunity.currentValidators) && opportunity.currentValidators.length === 0
    ) {
      // Apply as solo, but leave opportunity open for potential duo partner
      opportunity.currentValidators.push({
        validatorId,
        validatorName,
        validatorRole: 'Primary',
        assignedAt: Date.now(),
        status: 'Confirmed',
      });
      // Update status based on capacity
      if ((opportunity.currentValidators.length as number) === 1) {
        opportunity.status = 'PartiallyFilled';
      } else if ((opportunity.currentValidators.length as number) === opportunity.maxValidators) {
        opportunity.status = 'Full';
      }
      return { success: true, message: 'Applied as solo validator' };
    }

    return { success: false, message: 'Invalid application type' };
  }

  /**
   * Get statistics for validation opportunities
   */
  async getValidationStats(userPrefersDuo?: boolean): Promise<{
    totalOpportunities: number;
    duoOpportunities: number;
    partnerNeeded: number;
    highPriority: number;
    averageReward: number;
    averageDuoReward: number;
  }> {
    const opportunities = this.mockValidationOpportunities;

    const duoOpportunities = opportunities.filter((op) => op.supportsDuoValidation);
    const partnerNeeded = opportunities.filter((op) => op.status === 'PartiallyFilled');
    const highPriority = opportunities.filter(
      (op) => op.priority === 'High' || op.priority === 'Critical'
    );

  const totalReward = opportunities.reduce((sum, op) => sum + (typeof op.baseReward === 'number' ? op.baseReward : 0), 0);
    const averageReward = totalReward / opportunities.length;

    const totalDuoReward = duoOpportunities.reduce(
  (sum, op) => sum + (typeof op.baseReward === 'number' ? op.baseReward : 0) + (op.duoBonus || 0),
      0
    );
    const averageDuoReward =
      duoOpportunities.length > 0 ? totalDuoReward / duoOpportunities.length : 0;

    return {
      totalOpportunities: opportunities.length,
      duoOpportunities: duoOpportunities.length,
      partnerNeeded: partnerNeeded.length,
      highPriority: highPriority.length,
      averageReward,
      averageDuoReward,
    };
  }
}

export const validationService = new ValidationService();
