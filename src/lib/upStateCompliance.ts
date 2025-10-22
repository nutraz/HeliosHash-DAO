/**
 * Uttar Pradesh State Compliance Module
 * Comprehensive state-level regulatory compliance for HHDAO operations
 * Covers business registration, labor laws, subsidies, and local regulations
 */

export interface UPBusinessRegistration {
  registrationId: string;
  businessName: string;
  businessType:
    | 'SHG'
    | 'FARMER_PRODUCER_ORGANIZATION'
    | 'COOPERATIVE'
    | 'PRIVATE_LIMITED'
    | 'PARTNERSHIP';
  registrationNumber: string;
  panNumber: string;
  gstNumber?: string;
  udyamNumber?: string; // MSME registration
  registrationDate: Date;
  expiryDate?: Date;
  district: string;
  tehsil: string;
  village: string;
  status: 'ACTIVE' | 'EXPIRED' | 'SUSPENDED' | 'CANCELLED';
}

export interface UPSubsidyProgram {
  id: string;
  name: string;
  department: string;
  maxAmount: number;
  coveragePercentage: number;
  eligibilityCriteria: string[];
  requiredDocuments: string[];
  applicationProcess: string[];
  processingTime: string;
  contactInfo: {
    office: string;
    phone: string;
    email: string;
    address: string;
  };
}

export interface LaborComplianceRequirement {
  id: string;
  title: string;
  applicableFor: string[];
  description: string;
  requiredDocuments: string[];
  renewalPeriod?: string;
  penaltyForNonCompliance: string;
  contactAuthority: string;
}

export interface UPLandRecord {
  khataNumber: string;
  khasraNumber: string;
  ownerName: string;
  fatherName: string;
  area: number; // in acres
  landType: 'AGRICULTURAL' | 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL';
  irrigationType: 'IRRIGATED' | 'RAIN_FED' | 'PARTIALLY_IRRIGATED';
  soilType: string;
  district: string;
  tehsil: string;
  village: string;
  revenue: number; // annual revenue assessment
  mutations: Array<{
    date: Date;
    type: string;
    fromOwner: string;
    toOwner: string;
    registrationNumber: string;
  }>;
}

export interface ElectricityConnection {
  connectionNumber: string;
  connectionType: 'DOMESTIC' | 'COMMERCIAL' | 'INDUSTRIAL' | 'AGRICULTURAL';
  sanctionedLoad: number; // in KW
  tariffCategory: string;
  connectedDate: Date;
  meterNumber: string;
  distributionCompany: 'UPPCL' | 'PVVNL' | 'DVVNL' | 'MVVNL' | 'PUVVNL';
  subdivision: string;
  feederName: string;
  status: 'ACTIVE' | 'DISCONNECTED' | 'PERMANENT_DISCONNECTION';
}

export class UPStateComplianceService {
  private readonly UP_DISTRICTS = [
    'Baghpat',
    'Meerut',
    'Ghaziabad',
    'Gautam Buddha Nagar',
    'Bulandshahr',
    'Aligarh',
    'Mathura',
    'Agra',
    'Firozabad',
    'Mainpuri',
    'Etah',
    'Kasganj',
    // ... add more districts as needed
  ];

  private readonly SUBSIDY_PROGRAMS: UPSubsidyProgram[] = [
    {
      id: 'upneda-solar',
      name: 'UPNEDA Solar Subsidy Scheme',
      department: 'Uttar Pradesh New and Renewable Energy Development Agency',
      maxAmount: 2000000, // ₹20 lakh
      coveragePercentage: 40,
      eligibilityCriteria: [
        'UP resident for minimum 5 years',
        'Agricultural land ownership',
        'No previous solar subsidy claimed',
        'Annual income less than ₹3 lakh',
        'Land should be free from encumbrance',
      ],
      requiredDocuments: [
        'Land ownership documents (Khatauni/Revenue records)',
        'Aadhaar card',
        'Bank account details',
        'Income certificate',
        'Caste certificate (if applicable)',
        'Electricity connection proof',
        'Technical feasibility report',
      ],
      applicationProcess: [
        'Online application on UPNEDA portal',
        'Document verification by SDM office',
        'Technical inspection by UPNEDA team',
        'Financial approval by district collector',
        'Installation and commissioning',
        'Final inspection and subsidy release',
      ],
      processingTime: '90-120 days',
      contactInfo: {
        office: 'UPNEDA Regional Office, Meerut',
        phone: '+91-121-2661234',
        email: 'meerut@upneda.org.in',
        address: 'Shastri Nagar, Meerut, Uttar Pradesh 250001',
      },
    },
    {
      id: 'pmkusum-component-a',
      name: 'PM-KUSUM Component A - Ground Mounted Solar',
      department: 'Ministry of New and Renewable Energy (Central) + UP Govt',
      maxAmount: 18000000, // ₹1.8 crore for 2MW
      coveragePercentage: 60, // 30% central + 30% state
      eligibilityCriteria: [
        'Farmer/Farmer groups/FPO/Cooperatives',
        'Minimum 10 acres of wasteland/fallow land',
        'Land should be contiguous',
        'Grid connectivity available within 5km',
        'Water availability for cleaning panels',
      ],
      requiredDocuments: [
        'Land documents proving ownership/lease (minimum 25 years)',
        'Farmer certificate from patwari',
        'No objection certificate from gram panchayat',
        'Feasibility study report',
        'Environmental clearance (if required)',
        'Power evacuation agreement with DISCOM',
      ],
      applicationProcess: [
        'Expression of Interest (EoI) submission',
        'District level verification committee review',
        'State level approval committee clearance',
        'Bidding process for developer selection',
        'Power Purchase Agreement signing',
        'Implementation and commissioning',
      ],
      processingTime: '180-365 days',
      contactInfo: {
        office: 'UPNEDA Head Office',
        phone: '+91-522-2238902',
        email: 'upneda@up.gov.in',
        address: 'Vibhuti Khand, Gomti Nagar, Lucknow 226010',
      },
    },
    {
      id: 'up-rooftop-solar',
      name: 'UP Grid Connected Rooftop Solar Scheme',
      department: 'Uttar Pradesh Power Corporation Limited',
      maxAmount: 78000, // ₹78,000 for 3kW system
      coveragePercentage: 60, // 40% central + 20% state
      eligibilityCriteria: [
        'Own building with clear title',
        'Electricity connection available',
        'Roof area minimum 300 sq ft',
        'Structural stability of roof',
        'No shading issues',
      ],
      requiredDocuments: [
        'Electricity bill and connection documents',
        'Building ownership proof',
        'Structural stability certificate',
        'Aadhaar card and PAN card',
        'Bank account details',
        'Roof rights certificate',
      ],
      applicationProcess: [
        'Online application on national solar portal',
        'Technical feasibility assessment',
        'Approval from electricity department',
        'Empaneled vendor installation',
        'Net metering installation',
        'Subsidy disbursement',
      ],
      processingTime: '45-60 days',
      contactInfo: {
        office: 'UPPCL Regional Office',
        phone: '+91-121-2765432',
        email: 'rooftop@uppcl.org',
        address: 'Urja Bhawan, Lucknow 226001',
      },
    },
  ];

  private readonly LABOR_COMPLIANCE: LaborComplianceRequirement[] = [
    {
      id: 'contract-labor-license',
      title: 'Contract Labour License',
      applicableFor: ['Companies employing 20+ workers through contractors'],
      description:
        'Mandatory license for engaging contract workers for construction and installation work',
      requiredDocuments: [
        'Application form XIX',
        'Site plan and layout',
        'Memorandum of Association (for companies)',
        'PAN and GST registration',
        'Contractor agreement copy',
        'Bank guarantee/security deposit',
      ],
      renewalPeriod: 'Annual',
      penaltyForNonCompliance: 'Fine up to ₹1 lakh + imprisonment up to 1 year',
      contactAuthority: 'Assistant Labour Commissioner (Central), UP',
    },
    {
      id: 'factories-act-license',
      title: 'Factories Act License',
      applicableFor: [
        'Manufacturing units with 10+ workers (with power) or 20+ workers (without power)',
      ],
      description: 'License for operating manufacturing or assembly operations',
      requiredDocuments: [
        'Application form in prescribed format',
        'Site plan with dimensions',
        'Machinery details and layout',
        'Environmental clearance certificate',
        'Fire safety certificate',
        'Building plan approval',
      ],
      renewalPeriod: 'Annual',
      penaltyForNonCompliance: 'Fine up to ₹2 lakh + closure of operations',
      contactAuthority: 'District Magistrate/Chief Inspector of Factories',
    },
    {
      id: 'epf-registration',
      title: 'Employees Provident Fund Registration',
      applicableFor: ['Establishments with 20+ employees'],
      description: 'Mandatory registration for PF deduction and employer contribution',
      requiredDocuments: [
        'Form 1 (employer registration)',
        'Bank account details',
        'Employee list with Aadhaar and bank details',
        'Salary register',
        'Establishment proof',
        'PAN and GST certificates',
      ],
      renewalPeriod: 'Ongoing (monthly returns required)',
      penaltyForNonCompliance: 'Penalty 12% p.a. on delayed contributions + criminal prosecution',
      contactAuthority: 'Regional Provident Fund Commissioner',
    },
  ];

  /**
   * Check subsidy eligibility for solar projects in UP
   */
  async checkSubsidyEligibility(criteria: {
    projectType: 'GROUND_MOUNTED' | 'ROOFTOP' | 'AGRICULTURAL_PUMP';
    applicantType: 'FARMER' | 'SHG' | 'FPO' | 'INDIVIDUAL' | 'COMMERCIAL';
    district: string;
    landArea?: number; // in acres
    annualIncome?: number;
    hasElectricityConnection: boolean;
    hasPreviousSubsidy: boolean;
  }): Promise<{
    eligiblePrograms: UPSubsidyProgram[];
    ineligiblePrograms: Array<{
      program: UPSubsidyProgram;
      reasons: string[];
    }>;
    recommendedActions: string[];
  }> {
    const eligiblePrograms: UPSubsidyProgram[] = [];
    const ineligiblePrograms: Array<{ program: UPSubsidyProgram; reasons: string[] }> = [];
    const recommendedActions: string[] = [];

    for (const program of this.SUBSIDY_PROGRAMS) {
      const reasons: string[] = [];

      // Check basic eligibility
      if (criteria.hasPreviousSubsidy && program.id.includes('solar')) {
        reasons.push('Previous solar subsidy already claimed');
      }

      if (!criteria.hasElectricityConnection && program.id === 'up-rooftop-solar') {
        reasons.push('Electricity connection required for rooftop solar');
      }

      // Income criteria check
      if (
        criteria.annualIncome &&
        criteria.annualIncome > 300000 &&
        program.id === 'upneda-solar'
      ) {
        reasons.push('Annual income exceeds ₹3 lakh limit for UPNEDA scheme');
      }

      // Land area requirements
      if (program.id === 'pmkusum-component-a') {
        if (!criteria.landArea || criteria.landArea < 10) {
          reasons.push('Minimum 10 acres of land required for PM-KUSUM Component A');
        }
        if (criteria.applicantType !== 'FARMER' && criteria.applicantType !== 'FPO') {
          reasons.push('Only farmers/FPOs eligible for PM-KUSUM Component A');
        }
      }

      // District check
      if (!this.UP_DISTRICTS.includes(criteria.district)) {
        reasons.push('District not in Uttar Pradesh or not covered under the scheme');
      }

      if (reasons.length === 0) {
        eligiblePrograms.push(program);
      } else {
        ineligiblePrograms.push({ program, reasons });
      }
    }

    // Generate recommendations
    if (eligiblePrograms.length === 0) {
      recommendedActions.push('Consider addressing eligibility gaps identified above');
      if (criteria.hasPreviousSubsidy) {
        recommendedActions.push(
          'Explore private financing options or different family member application'
        );
      }
      if (!criteria.hasElectricityConnection) {
        recommendedActions.push('Apply for electricity connection before solar installation');
      }
    }

    if (criteria.projectType === 'GROUND_MOUNTED' && eligiblePrograms.length > 1) {
      recommendedActions.push(
        'PM-KUSUM offers higher capacity and better returns for ground-mounted systems'
      );
    }

    return {
      eligiblePrograms,
      ineligiblePrograms,
      recommendedActions,
    };
  }

  /**
   * Verify land records for Baghpat district
   */
  async verifyLandRecord(khataNumber: string, khasraNumber: string): Promise<UPLandRecord | null> {
    // Simulated land records for Baghpat district
    const mockLandRecords: UPLandRecord[] = [
      {
        khataNumber: '145',
        khasraNumber: '287',
        ownerName: 'Dhramendra Kumar',
        fatherName: 'Ram Singh',
        area: 12.5,
        landType: 'AGRICULTURAL',
        irrigationType: 'IRRIGATED',
        soilType: 'Alluvial loam',
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        revenue: 850, // annual revenue assessment
        mutations: [
          {
            date: new Date('2018-03-15'),
            type: 'INHERITANCE',
            fromOwner: 'Ram Singh (deceased)',
            toOwner: 'Dhramendra Kumar',
            registrationNumber: 'BGP/2018/1247',
          },
        ],
      },
    ];

    return (
      mockLandRecords.find(
        (record) => record.khataNumber === khataNumber && record.khasraNumber === khasraNumber
      ) || null
    );
  }

  /**
   * Check electricity connection status
   */
  async checkElectricityConnection(
    connectionNumber: string
  ): Promise<ElectricityConnection | null> {
    // Simulated electricity connections
    const mockConnections: ElectricityConnection[] = [
      {
        connectionNumber: 'BGP123456789',
        connectionType: 'AGRICULTURAL',
        sanctionedLoad: 15,
        tariffCategory: 'AG-1 (Agricultural)',
        connectedDate: new Date('2020-06-10'),
        meterNumber: 'MTR789012345',
        distributionCompany: 'UPPCL',
        subdivision: 'Baghpat Rural',
        feederName: 'Baghpat Feeder-2',
        status: 'ACTIVE',
      },
    ];

    return mockConnections.find((conn) => conn.connectionNumber === connectionNumber) || null;
  }

  /**
   * Get labor compliance requirements based on business type and employee count
   */
  getLaborComplianceRequirements(
    businessType: string,
    employeeCount: number
  ): LaborComplianceRequirement[] {
    const requirements: LaborComplianceRequirement[] = [];

    // Contract Labour License
    if (employeeCount >= 20) {
      requirements.push(this.LABOR_COMPLIANCE.find((r) => r.id === 'contract-labor-license')!);
    }

    // Factories Act License
    if (businessType.includes('MANUFACTURING') || businessType.includes('ASSEMBLY')) {
      const threshold = 10; // with power
      if (employeeCount >= threshold) {
        requirements.push(this.LABOR_COMPLIANCE.find((r) => r.id === 'factories-act-license')!);
      }
    }

    // EPF Registration
    if (employeeCount >= 20) {
      requirements.push(this.LABOR_COMPLIANCE.find((r) => r.id === 'epf-registration')!);
    }

    return requirements;
  }

  /**
   * Generate UP state compliance summary
   */
  generateComplianceSummary(businessDetails: {
    registrationId: string;
    businessType: string;
    employeeCount: number;
    district: string;
    hasElectricityConnection: boolean;
    landArea?: number;
  }): {
    requiredLicenses: LaborComplianceRequirement[];
    eligibleSubsidies: UPSubsidyProgram[];
    complianceScore: number;
    recommendations: string[];
    nextActions: Array<{
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      action: string;
      deadline?: string;
    }>;
  } {
    const requiredLicenses = this.getLaborComplianceRequirements(
      businessDetails.businessType,
      businessDetails.employeeCount
    );

    const eligibleSubsidies = this.SUBSIDY_PROGRAMS.filter((program) => {
      // Basic eligibility filtering
      return this.UP_DISTRICTS.includes(businessDetails.district);
    });

    // Calculate compliance score (simplified)
    const totalRequirements = requiredLicenses.length + 3; // 3 basic requirements
    const metRequirements =
      (businessDetails.hasElectricityConnection ? 1 : 0) +
      (businessDetails.district in this.UP_DISTRICTS ? 1 : 0) +
      1; // assume business registration is complete

    const complianceScore = Math.round((metRequirements / totalRequirements) * 100);

    const recommendations: string[] = [];
    const nextActions: Array<{
      priority: 'HIGH' | 'MEDIUM' | 'LOW';
      action: string;
      deadline?: string;
    }> = [];

    // Generate recommendations
    if (!businessDetails.hasElectricityConnection) {
      recommendations.push('Obtain electricity connection for solar project eligibility');
      nextActions.push({
        priority: 'HIGH',
        action: 'Apply for electricity connection',
        deadline: '30 days',
      });
    }

    if (requiredLicenses.length > 0) {
      recommendations.push('Ensure all labor law compliance before scaling operations');
      nextActions.push({
        priority: 'MEDIUM',
        action: 'Apply for required labor licenses',
        deadline: '45 days',
      });
    }

    if (eligibleSubsidies.length > 0) {
      recommendations.push('Explore available subsidy programs to reduce project costs');
      nextActions.push({
        priority: 'LOW',
        action: 'Prepare subsidy applications',
        deadline: '60 days',
      });
    }

    return {
      requiredLicenses,
      eligibleSubsidies,
      complianceScore,
      recommendations,
      nextActions,
    };
  }

  /**
   * Get UP government office contacts for specific services
   */
  getGovernmentContacts(
    serviceType: 'SUBSIDY' | 'LABOR' | 'LAND_RECORDS' | 'ELECTRICITY',
    district: string = 'Baghpat'
  ) {
    const contacts = {
      SUBSIDY: {
        office: 'District Renewable Energy Office',
        contactPerson: 'District Program Officer',
        phone: '+91-121-2524567',
        email: 'dreo.baghpat@upneda.org.in',
        address: 'Collectorate Complex, Baghpat, UP 250609',
        workingHours: 'Mon-Fri 10:00 AM - 5:00 PM',
      },
      LABOR: {
        office: 'Office of Assistant Labour Commissioner',
        contactPerson: 'Assistant Labour Commissioner',
        phone: '+91-121-2524890',
        email: 'alc.baghpat@up.gov.in',
        address: 'Labour Department, District Collectorate, Baghpat',
        workingHours: 'Mon-Fri 10:00 AM - 5:00 PM',
      },
      LAND_RECORDS: {
        office: 'Tehsildar Office',
        contactPerson: 'Tehsildar',
        phone: '+91-121-2524321',
        email: 'tehsildar.baghpat@up.gov.in',
        address: 'Tehsil Office, Baghpat, UP 250609',
        workingHours: 'Mon-Sat 10:00 AM - 5:00 PM',
      },
      ELECTRICITY: {
        office: 'UPPCL Sub Division Office',
        contactPerson: 'Sub Divisional Officer (Electrical)',
        phone: '+91-121-2524456',
        email: 'sdo.baghpat@uppcl.org',
        address: 'Electricity Department, Baghpat',
        workingHours: 'Mon-Sat 9:00 AM - 5:00 PM',
      },
    };

    return contacts[serviceType];
  }
}

export const upStateComplianceService = new UPStateComplianceService();
