/**
 * Agricultural Land Validation System for HHDAO
 * Baghpat District Integration with Urgam Valley Pilot Readiness
 * Revenue Department API Integration + Farmer Beneficiary Onboarding
 */

import * as CryptoJS from 'crypto-js';

export interface LandRecord {
  // Primary Identifiers
  khataNumber: string;
  khasraNumber: string;
  gataNumber: string; // Village subdivision number

  // Ownership Details
  ownerName: string;
  fatherName: string;
  ownershipType: 'SOLE' | 'JOINT' | 'COOPERATIVE' | 'LEASED' | 'MORTGAGED';
  ownershipPercentage: number;

  // Land Characteristics
  totalArea: number; // in acres
  cultivableArea: number;
  irrigatedArea: number;
  landClassification:
    | 'BARREN'
    | 'CULTIVABLE_WASTE'
    | 'CURRENT_FALLOW'
    | 'OTHER_FALLOW'
    | 'NET_SOWN';
  soilType: 'ALLUVIAL' | 'BLACK' | 'RED' | 'LATERITE' | 'DESERT' | 'MOUNTAIN';
  irrigationSource: 'TUBEWELL' | 'CANAL' | 'TANK' | 'WELL' | 'RAIN_FED' | 'MIXED';

  // Administrative Details
  district: string;
  tehsil: string;
  block: string;
  village: string;
  gramPanchayat: string;
  pincode: string;

  // Legal Status
  encumbranceStatus: 'CLEAR' | 'MORTGAGED' | 'DISPUTED' | 'COURT_CASE' | 'REVENUE_DEFAULTER';
  registrationDate: Date;
  lastMutationDate: Date;
  revenuePaid: boolean;
  landRevenue: number; // annual amount

  // Agricultural Use
  cropPattern: Array<{
    season: 'KHARIF' | 'RABI' | 'SUMMER';
    crop: string;
    area: number;
    year: number;
  }>;
  pmKisanEligible: boolean;
  kisanCreditCardLinked: boolean;

  // Coordinates & Survey
  gpsCoordinates: {
    latitude: number;
    longitude: number;
    accuracy: number; // in meters
  };
  surveyNumber: string;
  boundaryMarkers: Array<{
    direction: 'NORTH' | 'SOUTH' | 'EAST' | 'WEST';
    boundary: string;
    length: number; // in meters
  }>;
}

export interface LeaseAgreement {
  agreementId: string;
  landRecord: LandRecord;
  lessor: {
    name: string;
    aadhaar: string; // hashed
    contactNumber: string;
    address: string;
  };
  lessee: {
    organizationType: 'HHDAO' | 'SHG' | 'FARMER_PRODUCER_ORGANIZATION' | 'COOPERATIVE';
    organizationName: string;
    registrationNumber: string;
    authorizedSignatory: string;
    contactDetails: string;
  };
  leaseTerms: {
    startDate: Date;
    endDate: Date;
    renewalOption: boolean;
    renewalPeriod?: number; // in years
    annualRent: number;
    escalationClause: number; // percentage per year
    securityDeposit: number;
  };
  permittedUse: Array<'SOLAR_INSTALLATION' | 'AGRICULTURE' | 'GRAZING' | 'AFFORESTATION' | 'MIXED'>;
  restrictions: string[];
  governmentApprovals: Array<{
    authority: string;
    approvalType: string;
    approvalNumber: string;
    validUntil: Date;
  }>;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'EXPIRED' | 'TERMINATED';
}

export interface FarmerBeneficiary {
  farmerId: string;
  personalDetails: {
    name: string;
    aadhaarHash: string;
    fatherName: string;
    dateOfBirth: Date;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    category: 'GENERAL' | 'SC' | 'ST' | 'OBC' | 'MINORITY';
    contactNumber: string;
    address: {
      village: string;
      block: string;
      district: string;
      state: string;
      pincode: string;
    };
  };
  landHoldings: LandRecord[];
  financialDetails: {
    bankAccountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    pmKisanId?: string;
    kisanCreditCardNumber?: string;
  };
  schemes: Array<{
    schemeName: string;
    beneficiaryId: string;
    enrollmentDate: Date;
    status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REJECTED';
    lastPayment?: Date;
    totalAmountReceived: number;
  }>;
  eligibility: {
    solarSubsidy: boolean;
    pmKusum: boolean;
    kccEligible: boolean;
    reasons: string[];
  };
  verification: {
    verified: boolean;
    verificationDate?: Date;
    verifiedBy?: string;
    documents: Array<{
      type: string;
      verified: boolean;
      expiryDate?: Date;
    }>;
  };
}

export interface RevenueAPIRequest {
  district: string;
  tehsil: string;
  village: string;
  khataNumber?: string;
  khasraNumber?: string;
  ownerName?: string;
  requestType: 'LAND_RECORDS' | 'OWNERSHIP_VERIFICATION' | 'ENCUMBRANCE_CHECK' | 'MUTATION_HISTORY';
}

export interface RevenueAPIResponse {
  status: 'SUCCESS' | 'ERROR' | 'PARTIAL';
  message: string;
  data: LandRecord[] | null;
  errors?: string[];
  requestId: string;
  timestamp: Date;
}

export class AgriculturalLandValidationService {
  private readonly API_BASE_URL = process.env.UP_REVENUE_API_URL || 'https://upbhulekh.gov.in/api';
  private readonly VERIFICATION_SALT = process.env.LAND_VERIFICATION_SALT || 'hhdao-land-2024';

  // Sample data for Baghpat district (simulating revenue department database)
  private readonly BAGHPAT_LAND_RECORDS: LandRecord[] = [
    {
      khataNumber: '145',
      khasraNumber: '287',
      gataNumber: '12',
      ownerName: 'Dhramendra Kumar',
      fatherName: 'Ram Singh',
      ownershipType: 'SOLE',
      ownershipPercentage: 100,
      totalArea: 12.5,
      cultivableArea: 12.5,
      irrigatedArea: 10.0,
      landClassification: 'NET_SOWN',
      soilType: 'ALLUVIAL',
      irrigationSource: 'TUBEWELL',
      district: 'Baghpat',
      tehsil: 'Baghpat',
      block: 'Baghpat',
      village: 'Baghpat',
      gramPanchayat: 'Baghpat Gram Panchayat',
      pincode: '250609',
      encumbranceStatus: 'CLEAR',
      registrationDate: new Date('2018-03-15'),
      lastMutationDate: new Date('2018-03-15'),
      revenuePaid: true,
      landRevenue: 850,
      cropPattern: [
        { season: 'KHARIF', crop: 'Sugarcane', area: 8.0, year: 2024 },
        { season: 'RABI', crop: 'Wheat', area: 4.5, year: 2024 },
      ],
      pmKisanEligible: true,
      kisanCreditCardLinked: true,
      gpsCoordinates: {
        latitude: 29.0728,
        longitude: 77.2826,
        accuracy: 5,
      },
      surveyNumber: 'SUR/BGP/2024/287',
      boundaryMarkers: [
        { direction: 'NORTH', boundary: 'Village Road', length: 120 },
        { direction: 'SOUTH', boundary: 'Irrigation Canal', length: 120 },
        { direction: 'EAST', boundary: 'Ramesh Singh Plot', length: 150 },
        { direction: 'WEST', boundary: 'Government Land', length: 150 },
      ],
    },
    {
      khataNumber: '146',
      khasraNumber: '288',
      gataNumber: '12',
      ownerName: 'Ramesh Singh',
      fatherName: 'Suresh Singh',
      ownershipType: 'JOINT',
      ownershipPercentage: 60,
      totalArea: 8.0,
      cultivableArea: 7.5,
      irrigatedArea: 6.0,
      landClassification: 'NET_SOWN',
      soilType: 'ALLUVIAL',
      irrigationSource: 'CANAL',
      district: 'Baghpat',
      tehsil: 'Baghpat',
      block: 'Baghpat',
      village: 'Baghpat',
      gramPanchayat: 'Baghpat Gram Panchayat',
      pincode: '250609',
      encumbranceStatus: 'CLEAR',
      registrationDate: new Date('2020-06-10'),
      lastMutationDate: new Date('2020-06-10'),
      revenuePaid: true,
      landRevenue: 560,
      cropPattern: [
        { season: 'KHARIF', crop: 'Rice', area: 4.0, year: 2024 },
        { season: 'RABI', crop: 'Mustard', area: 3.5, year: 2024 },
      ],
      pmKisanEligible: true,
      kisanCreditCardLinked: false,
      gpsCoordinates: {
        latitude: 29.0738,
        longitude: 77.2836,
        accuracy: 8,
      },
      surveyNumber: 'SUR/BGP/2024/288',
      boundaryMarkers: [
        { direction: 'NORTH', boundary: 'Village Pond', length: 100 },
        { direction: 'SOUTH', boundary: 'Agricultural Road', length: 100 },
        { direction: 'EAST', boundary: 'Community Land', length: 120 },
        { direction: 'WEST', boundary: 'Dhramendra Kumar Plot', length: 120 },
      ],
    },
  ];

  /**
   * Verify land records through UP Revenue Department API
   */
  async verifyLandRecords(request: RevenueAPIRequest): Promise<RevenueAPIResponse> {
    const requestId = this.generateRequestId();

    try {
      // In production, this would call the actual UP Revenue API
      // For now, simulating with local data

      const filteredRecords = this.BAGHPAT_LAND_RECORDS.filter((record) => {
        let matches = true;

        if (request.khataNumber && record.khataNumber !== request.khataNumber) matches = false;
        if (request.khasraNumber && record.khasraNumber !== request.khasraNumber) matches = false;
        if (
          request.ownerName &&
          !record.ownerName.toLowerCase().includes(request.ownerName.toLowerCase())
        )
          matches = false;

        return matches;
      });

      if (filteredRecords.length === 0) {
        return {
          status: 'ERROR',
          message: 'No land records found matching the criteria',
          data: null,
          errors: ['Record not found in revenue database'],
          requestId,
          timestamp: new Date(),
        };
      }

      return {
        status: 'SUCCESS',
        message: `Found ${filteredRecords.length} matching land record(s)`,
        data: filteredRecords,
        requestId,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'ERROR',
        message: 'Failed to query revenue department API',
        data: null,
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        requestId,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Create and validate lease agreement for solar installation
   */
  async createLeaseAgreement(
    landRecord: LandRecord,
    lessorDetails: LeaseAgreement['lessor'],
    leaseTerms: LeaseAgreement['leaseTerms'],
    permittedUse: LeaseAgreement['permittedUse']
  ): Promise<{
    agreement: LeaseAgreement;
    validationResults: {
      isValid: boolean;
      warnings: string[];
      errors: string[];
      requiredApprovals: string[];
    };
  }> {
    const agreementId = this.generateAgreementId();
    const validationResults = {
      isValid: true,
      warnings: [] as string[],
      errors: [] as string[],
      requiredApprovals: [] as string[],
    };

    // Validate land eligibility
    if (landRecord.encumbranceStatus !== 'CLEAR') {
      validationResults.errors.push(`Land has encumbrance status: ${landRecord.encumbranceStatus}`);
      validationResults.isValid = false;
    }

    if (!landRecord.revenuePaid) {
      validationResults.errors.push('Land revenue is not paid up to date');
      validationResults.isValid = false;
    }

    if (landRecord.totalArea < 1.0) {
      validationResults.warnings.push(
        'Land area less than 1 acre - may not be viable for solar installation'
      );
    }

    // Validate lease terms
    const leaseDuration =
      (leaseTerms.endDate.getTime() - leaseTerms.startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (leaseDuration < 5) {
      validationResults.warnings.push(
        'Lease period less than 5 years - may affect solar project viability'
      );
    }

    if (leaseDuration > 30) {
      validationResults.warnings.push(
        'Lease period exceeds 30 years - may require special approvals'
      );
      validationResults.requiredApprovals.push(
        'District Collector Special Permission for Long-term Lease'
      );
    }

    // Required approvals based on permitted use
    if (permittedUse.includes('SOLAR_INSTALLATION')) {
      validationResults.requiredApprovals.push(
        'UPNEDA Technical Clearance',
        'Electricity Department Grid Connection Permission',
        'Gram Panchayat No Objection Certificate'
      );

      if (landRecord.totalArea > 10) {
        validationResults.requiredApprovals.push(
          'District Collector Approval for Large Solar Installation'
        );
      }
    }

    const agreement: LeaseAgreement = {
      agreementId,
      landRecord,
      lessor: lessorDetails,
      lessee: {
        organizationType: 'HHDAO',
        organizationName: 'HeliosHash DAO',
        registrationNumber: 'HHDAO/UP/2024/001',
        authorizedSignatory: 'DAO Governance Council',
        contactDetails: 'contact@helioshash.dao',
      },
      leaseTerms,
      permittedUse,
      restrictions: [
        'Land use must comply with agricultural land conversion guidelines',
        'No permanent structures without additional approvals',
        'Soil conservation measures must be maintained',
        'Water table protection protocols must be followed',
      ],
      governmentApprovals: [],
      status: 'DRAFT',
    };

    return { agreement, validationResults };
  }

  /**
   * Onboard farmer as beneficiary with comprehensive verification
   */
  async onboardFarmerBeneficiary(
    personalDetails: FarmerBeneficiary['personalDetails'],
    landHoldings: LandRecord[],
    financialDetails: FarmerBeneficiary['financialDetails']
  ): Promise<{
    farmer: FarmerBeneficiary;
    eligibilityReport: {
      solarSubsidy: { eligible: boolean; reasons: string[] };
      pmKusum: { eligible: boolean; reasons: string[] };
      kccEligible: { eligible: boolean; reasons: string[] };
    };
  }> {
    const farmerId = this.generateFarmerId();

    // Calculate eligibility
    const totalLandArea = landHoldings.reduce((sum, land) => sum + land.totalArea, 0);
    const irrigatedArea = landHoldings.reduce((sum, land) => sum + land.irrigatedArea, 0);
    const hasCleanTitle = landHoldings.every((land) => land.encumbranceStatus === 'CLEAR');
    const revenueUpToDate = landHoldings.every((land) => land.revenuePaid);

    const eligibilityReport = {
      solarSubsidy: {
        eligible: totalLandArea >= 1 && hasCleanTitle && revenueUpToDate,
        reasons: [] as string[],
      },
      pmKusum: {
        eligible: totalLandArea >= 1 && irrigatedArea >= 0.5 && hasCleanTitle,
        reasons: [] as string[],
      },
      kccEligible: {
        eligible: totalLandArea >= 0.5 && revenueUpToDate && hasCleanTitle,
        reasons: [] as string[],
      },
    };

    // Solar subsidy eligibility
    if (!eligibilityReport.solarSubsidy.eligible) {
      if (totalLandArea < 1)
        eligibilityReport.solarSubsidy.reasons.push('Minimum 1 acre land required');
      if (!hasCleanTitle)
        eligibilityReport.solarSubsidy.reasons.push('Land title must be clear of encumbrances');
      if (!revenueUpToDate)
        eligibilityReport.solarSubsidy.reasons.push('Land revenue must be paid up to date');
    }

    // PM-KUSUM eligibility
    if (!eligibilityReport.pmKusum.eligible) {
      if (totalLandArea < 1)
        eligibilityReport.pmKusum.reasons.push('Minimum 1 acre land required for PM-KUSUM');
      if (irrigatedArea < 0.5)
        eligibilityReport.pmKusum.reasons.push('Minimum 0.5 acre irrigated land required');
      if (!hasCleanTitle) eligibilityReport.pmKusum.reasons.push('Clear land title required');
    }

    // KCC eligibility
    if (!eligibilityReport.kccEligible.eligible) {
      if (totalLandArea < 0.5)
        eligibilityReport.kccEligible.reasons.push('Minimum 0.5 acre land required for KCC');
      if (!revenueUpToDate)
        eligibilityReport.kccEligible.reasons.push('Revenue payments must be current');
      if (!hasCleanTitle)
        eligibilityReport.kccEligible.reasons.push('Land title issues prevent KCC eligibility');
    }

    const farmer: FarmerBeneficiary = {
      farmerId,
      personalDetails: {
        ...personalDetails,
        aadhaarHash: CryptoJS.SHA256(
          personalDetails.aadhaarHash + this.VERIFICATION_SALT
        ).toString(),
      },
      landHoldings,
      financialDetails,
      schemes: [],
      eligibility: {
        solarSubsidy: eligibilityReport.solarSubsidy.eligible,
        pmKusum: eligibilityReport.pmKusum.eligible,
        kccEligible: eligibilityReport.kccEligible.eligible,
        reasons: [
          ...eligibilityReport.solarSubsidy.reasons,
          ...eligibilityReport.pmKusum.reasons,
          ...eligibilityReport.kccEligible.reasons,
        ],
      },
      verification: {
        verified: false,
        documents: [
          { type: 'Aadhaar Card', verified: false },
          { type: 'Land Records', verified: false },
          { type: 'Bank Passbook', verified: false },
        ],
      },
    };

    return { farmer, eligibilityReport };
  }

  /**
   * Bulk land validation for Urgam Valley pilot
   */
  async bulkLandValidation(
    landRequests: Array<{
      khataNumber: string;
      khasraNumber: string;
      expectedOwner: string;
    }>
  ): Promise<{
    validatedLands: LandRecord[];
    failedValidations: Array<{
      request: (typeof landRequests)[0];
      error: string;
    }>;
    summaryReport: {
      totalRequests: number;
      successful: number;
      failed: number;
      totalArea: number;
      eligibleForSolar: number;
    };
  }> {
    const validatedLands: LandRecord[] = [];
    const failedValidations: Array<{ request: (typeof landRequests)[0]; error: string }> = [];

    for (const request of landRequests) {
      try {
        const apiResponse = await this.verifyLandRecords({
          district: 'Baghpat',
          tehsil: 'Baghpat',
          village: 'Baghpat',
          khataNumber: request.khataNumber,
          khasraNumber: request.khasraNumber,
          requestType: 'LAND_RECORDS',
        });

        if (apiResponse.status === 'SUCCESS' && apiResponse.data && apiResponse.data.length > 0) {
          const landRecord = apiResponse.data[0];

          // Verify owner name match
          if (landRecord.ownerName.toLowerCase().includes(request.expectedOwner.toLowerCase())) {
            validatedLands.push(landRecord);
          } else {
            failedValidations.push({
              request,
              error: `Owner mismatch: Expected ${request.expectedOwner}, found ${landRecord.ownerName}`,
            });
          }
        } else {
          failedValidations.push({
            request,
            error: apiResponse.message || 'Land record not found',
          });
        }

        // Small delay to avoid overwhelming the API
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        failedValidations.push({
          request,
          error: error instanceof Error ? error.message : 'Unknown validation error',
        });
      }
    }

    const totalArea = validatedLands.reduce((sum, land) => sum + land.totalArea, 0);
    const eligibleForSolar = validatedLands.filter(
      (land) => land.encumbranceStatus === 'CLEAR' && land.revenuePaid && land.totalArea >= 1
    ).length;

    return {
      validatedLands,
      failedValidations,
      summaryReport: {
        totalRequests: landRequests.length,
        successful: validatedLands.length,
        failed: failedValidations.length,
        totalArea,
        eligibleForSolar,
      },
    };
  }

  /**
   * Generate Urgam Valley pilot land assessment report
   */
  generateUrgamValleyReport(validatedLands: LandRecord[]): {
    pilotReadiness: {
      score: number; // 0-100
      status: 'NOT_READY' | 'PARTIALLY_READY' | 'READY' | 'EXCELLENT';
      summary: string;
    };
    landSuitability: {
      totalArea: number;
      suitablePlots: number;
      averagePlotSize: number;
      soilTypes: Record<string, number>;
      irrigationCoverage: number;
    };
    regulatoryCompliance: {
      clearTitles: number;
      revenueCompliant: number;
      requiredApprovals: string[];
    };
    recommendations: string[];
  } {
    const totalPlots = validatedLands.length;
    const totalArea = validatedLands.reduce((sum, land) => sum + land.totalArea, 0);
    const clearTitles = validatedLands.filter((land) => land.encumbranceStatus === 'CLEAR').length;
    const revenueCompliant = validatedLands.filter((land) => land.revenuePaid).length;
    const suitablePlots = validatedLands.filter(
      (land) => land.encumbranceStatus === 'CLEAR' && land.revenuePaid && land.totalArea >= 1
    ).length;

    const soilTypes = validatedLands.reduce(
      (acc, land) => {
        acc[land.soilType] = (acc[land.soilType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const irrigatedArea = validatedLands.reduce((sum, land) => sum + land.irrigatedArea, 0);
    const irrigationCoverage = totalArea > 0 ? (irrigatedArea / totalArea) * 100 : 0;

    // Calculate readiness score
    let score = 0;
    if (totalPlots > 0) score += 20;
    if (clearTitles / totalPlots > 0.8) score += 25;
    if (revenueCompliant / totalPlots > 0.9) score += 25;
    if (suitablePlots > 3) score += 20;
    if (irrigationCoverage > 50) score += 10;

    let status: 'NOT_READY' | 'PARTIALLY_READY' | 'READY' | 'EXCELLENT';
    if (score >= 90) status = 'EXCELLENT';
    else if (score >= 70) status = 'READY';
    else if (score >= 50) status = 'PARTIALLY_READY';
    else status = 'NOT_READY';

    const recommendations: string[] = [];
    if (clearTitles < totalPlots) {
      recommendations.push(`Resolve title issues for ${totalPlots - clearTitles} plot(s)`);
    }
    if (revenueCompliant < totalPlots) {
      recommendations.push(`Update revenue payments for ${totalPlots - revenueCompliant} plot(s)`);
    }
    if (suitablePlots < 5) {
      recommendations.push(
        'Consider expanding to more suitable plots for viable solar installation'
      );
    }
    if (irrigationCoverage < 30) {
      recommendations.push('Improve irrigation access to increase land productivity');
    }

    return {
      pilotReadiness: {
        score,
        status,
        summary: `${suitablePlots}/${totalPlots} plots ready for solar installation (${totalArea.toFixed(
          1
        )} acres total)`,
      },
      landSuitability: {
        totalArea,
        suitablePlots,
        averagePlotSize: totalArea / totalPlots,
        soilTypes,
        irrigationCoverage,
      },
      regulatoryCompliance: {
        clearTitles,
        revenueCompliant,
        requiredApprovals: [
          'UPNEDA Technical Clearance',
          'Gram Panchayat NOC',
          'Electricity Department Permission',
          'Environmental Impact Assessment (if >10 acres)',
        ],
      },
      recommendations,
    };
  }

  // Helper methods
  private generateRequestId(): string {
    return `REQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateAgreementId(): string {
    return `AGR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateFarmerId(): string {
    return `FARMER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const agriculturalLandService = new AgriculturalLandValidationService();
