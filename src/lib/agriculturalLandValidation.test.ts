import { describe, it, expect, beforeEach } from 'vitest';
import { AgriculturalLandValidationService, LandRecord, KYCData } from './agriculturalLandValidation';

describe('AgriculturalLandValidationService', () => {
  let service: AgriculturalLandValidationService;

  beforeEach(() => {
    service = new AgriculturalLandValidationService();
  });

  describe('verifyLandRecords', () => {
    it('should find land records by khata number', async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        khataNumber: '145',
        requestType: 'LAND_RECORDS',
      });
      expect(result.status).toBe('SUCCESS');
      expect(result.data).toBeTruthy();
      expect(result.data![0].khataNumber).toBe('145');
    });

    it('should find land records by khasra number', async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        khasraNumber: '287',
        requestType: 'LAND_RECORDS',
      });
      expect(result.status).toBe('SUCCESS');
      expect(result.data).toBeTruthy();
    });

    it('should find land records by owner name', async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        ownerName: 'Dhramendra',
        requestType: 'LAND_RECORDS',
      });
      expect(result.status).toBe('SUCCESS');
      expect(result.data![0].ownerName).toContain('Dhramendra');
    });

    it('should return error for non-existent records', async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        khataNumber: '999',
        requestType: 'LAND_RECORDS',
      });
      expect(result.status).toBe('ERROR');
      expect(result.data).toBeNull();
    });
  });

  describe('createLeaseAgreement', () => {
    let landRecord: LandRecord;

    beforeEach(async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        khataNumber: '145',
        requestType: 'LAND_RECORDS',
      });
      landRecord = result.data![0];
    });

    it('should create valid lease agreement', async () => {
      const { agreement, validationResults } = await service.createLeaseAgreement(
        landRecord,
        {
          name: 'Test Lessor',
          aadhaar: 'hashed-aadhaar',
          contactNumber: '9876543210',
          address: 'Test Address',
        },
        {
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 10 * 24 * 60 * 60 * 1000),
          renewalOption: true,
          renewalPeriod: 5,
          annualRent: 50000,
          escalationClause: 5,
          securityDeposit: 100000,
        },
        ['SOLAR_INSTALLATION']
      );
      expect(agreement).toBeTruthy();
      expect(agreement.agreementId).toBeTruthy();
      expect(validationResults.isValid).toBe(true);
    });

    it('should flag encumbered land as invalid', async () => {
      const encumberedLand = { ...landRecord, encumbranceStatus: 'MORTGAGED' as const };
      const { validationResults } = await service.createLeaseAgreement(
        encumberedLand,
        {
          name: 'Test',
          aadhaar: 'hash',
          contactNumber: '1234567890',
          address: 'Addr',
        },
        {
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 5 * 24 * 60 * 60 * 1000),
          renewalOption: false,
          annualRent: 30000,
          escalationClause: 3,
          securityDeposit: 60000,
        },
        ['SOLAR_INSTALLATION']
      );
      expect(validationResults.isValid).toBe(false);
      expect(validationResults.errors.length).toBeGreaterThan(0);
    });

    it('should warn for small land area', async () => {
      const smallLand = { ...landRecord, totalArea: 0.5 };
      const { validationResults } = await service.createLeaseAgreement(
        smallLand,
        {
          name: 'Test',
          aadhaar: 'hash',
          contactNumber: '1234567890',
          address: 'Addr',
        },
        {
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 5 * 24 * 60 * 60 * 1000),
          renewalOption: false,
          annualRent: 20000,
          escalationClause: 3,
          securityDeposit: 40000,
        },
        ['SOLAR_INSTALLATION']
      );
      expect(validationResults.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('onboardFarmerBeneficiary', () => {
    let landRecord: LandRecord;

    beforeEach(async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        khataNumber: '145',
        requestType: 'LAND_RECORDS',
      });
      landRecord = result.data![0];
    });

    it('should onboard farmer with eligible land', async () => {
      const { farmer, eligibilityReport } = await service.onboardFarmerBeneficiary(
        {
          name: 'Test Farmer',
          aadhaarHash: 'test-aadhaar',
          fatherName: 'Father Name',
          dateOfBirth: new Date('1980-01-01'),
          gender: 'MALE',
          category: 'GENERAL',
          contactNumber: '9876543210',
          address: {
            village: 'Baghpat',
            block: 'Baghpat',
            district: 'Baghpat',
            state: 'UP',
            pincode: '250609',
          },
        },
        [landRecord],
        {
          bankAccountNumber: '1234567890',
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank',
          branchName: 'Baghpat',
        }
      );
      expect(farmer.farmerId).toBeTruthy();
      expect(eligibilityReport.solarSubsidy.eligible).toBe(true);
    });

    it('should check solar subsidy eligibility', async () => {
      const { eligibilityReport } = await service.onboardFarmerBeneficiary(
        {
          name: 'Test',
          aadhaarHash: 'hash',
          fatherName: 'Father',
          dateOfBirth: new Date('1980-01-01'),
          gender: 'MALE',
          category: 'GENERAL',
          contactNumber: '1234567890',
          address: {
            village: 'V',
            block: 'B',
            district: 'D',
            state: 'S',
            pincode: '123456',
          },
        },
        [landRecord],
        {
          bankAccountNumber: '123',
          ifscCode: 'SBIN123',
          bankName: 'Bank',
          branchName: 'Branch',
        }
      );
      expect(eligibilityReport).toHaveProperty('solarSubsidy');
      expect(eligibilityReport).toHaveProperty('pmKusum');
      expect(eligibilityReport).toHaveProperty('kccEligible');
    });
  });

  describe('bulkLandValidation', () => {
    it('should validate multiple land records', async () => {
      const requests = [
        { khataNumber: '145', khasraNumber: '287', expectedOwner: 'Dhramendra' },
        { khataNumber: '146', khasraNumber: '288', expectedOwner: 'Ramesh' },
      ];
      const result = await service.bulkLandValidation(requests);
      expect(result.summaryReport.totalRequests).toBe(2);
      expect(result.summaryReport.successful).toBeGreaterThan(0);
    });

    it('should identify failed validations', async () => {
      const requests = [
        { khataNumber: '999', khasraNumber: '999', expectedOwner: 'NonExistent' },
      ];
      const result = await service.bulkLandValidation(requests);
      expect(result.failedValidations.length).toBeGreaterThan(0);
    });
  });

  describe('generateUrgamValleyReport', () => {
    it('should generate readiness report', async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        requestType: 'LAND_RECORDS',
      });
      const report = service.generateUrgamValleyReport(result.data!);
      expect(report.pilotReadiness).toBeTruthy();
      expect(report.pilotReadiness.score).toBeGreaterThanOrEqual(0);
      expect(report.pilotReadiness.score).toBeLessThanOrEqual(100);
      expect(report.landSuitability).toBeTruthy();
      expect(report.regulatoryCompliance).toBeTruthy();
      expect(report.recommendations).toBeInstanceOf(Array);
    });

    it('should calculate correct readiness status', async () => {
      const result = await service.verifyLandRecords({
        district: 'Baghpat',
        tehsil: 'Baghpat',
        village: 'Baghpat',
        requestType: 'LAND_RECORDS',
      });
      const report = service.generateUrgamValleyReport(result.data!);
      expect(['NOT_READY', 'PARTIALLY_READY', 'READY', 'EXCELLENT']).toContain(
        report.pilotReadiness.status
      );
    });
  });
});