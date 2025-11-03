// Mock compliance service for testing
export class IndiaComplianceService {
  static checkFEMACompliance(revenue: number) {
    return revenue > 50000000 ? 'FEMA reporting required' : 'No FEMA reporting needed';
  }

  static calculateGST(amount: number) {
    return amount * 0.18; // 18% GST
  }

  static validatePAN(pan: string) {
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan);
  }

  static generateComplianceSummary(operations: any) {
    return {
      alerts: [
        'FEMA reporting required for cross-border transactions',
        'GST registration may be required (annual turnover > 20L)'
      ],
      recommendations: ['Establish Indian subsidiary', 'Register for GST'],
      deadlines: ['Quarterly FEMA reporting due Mar 31']
    };
  }
}

export default IndiaComplianceService;
