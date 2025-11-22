/**
 * Test Data Factories for HeliosHash DAO
 * Provides consistent, realistic test data generation for all test categories
 */

import { faker } from '@faker-js/faker';

// Seed faker for consistent test data across runs
faker.seed(12345);

// Types for test data
export interface TestUser {
  id: string;
  principal: string;
  name: string;
  email: string;
  isWomenLed: boolean;
  location: string;
  membershipTier: 'Tier1' | 'Tier2' | 'Tier3' | 'Tier4' | 'Tier5' | 'Tier6' | 'Tier7';
  walletAddress?: string;
}

export interface TestApplication {
  id?: number;
  title: string;
  description: string;
  category:
    | 'SolarInstallation'
    | 'WomenEntrepreneurship'
    | 'CommunityDevelopment'
    | 'TechnicalTraining'
    | 'EnergyAccess';
  tier: 'Tier1' | 'Tier2' | 'Tier3' | 'Tier4' | 'Tier5' | 'Tier6' | 'Tier7';
  isWomenLed: boolean;
  requestedAmount: number;
  expectedImpact: string;
  timeline: string;
  documents: string[];
  applicant?: TestUser;
  status?: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected';
  createdAt?: Date;
}

export interface TestProject {
  id: string;
  name: string;
  location: string;
  capacity: number;
  status: 'Planning' | 'InProgress' | 'Operational' | 'Maintenance';
  energyGenerated: number;
  beneficiaries: number;
  coordinates: { lat: number; lng: number };
}

export interface TestProposal {
  id: number;
  title: string;
  description: string;
  category: 'Funding' | 'Policy' | 'Technical' | 'Community';
  requestedAmount?: number;
  votingPeriod: number;
  status: 'Active' | 'Passed' | 'Failed' | 'Executed';
  proposer: TestUser;
}

/**
 * User Factory - Generate test users with various profiles
 */
export class UserFactory {
  /**
   * Create a standard women entrepreneur user
   */
  static createWomenEntrepreneur(overrides: Partial<TestUser> = {}): TestUser {
    return {
      id: faker.string.uuid(),
      principal: faker.string.alphanumeric(27),
      name: faker.person.fullName({ sex: 'female' }),
      email: faker.internet.email(),
      isWomenLed: true,
      location: faker.location.city() + ', ' + faker.location.state(),
      membershipTier: faker.helpers.arrayElement(['Tier2', 'Tier3', 'Tier4']),
      walletAddress: faker.finance.ethereumAddress(),
      ...overrides,
    };
  }

  /**
   * Create a community leader user
   */
  static createCommunityLeader(overrides: Partial<TestUser> = {}): TestUser {
    return {
      id: faker.string.uuid(),
      principal: faker.string.alphanumeric(27),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      isWomenLed: faker.datatype.boolean(),
      location: `Rural ${faker.location.city()}, ${faker.location.state()}`,
      membershipTier: faker.helpers.arrayElement(['Tier3', 'Tier4', 'Tier5']),
      walletAddress: faker.finance.ethereumAddress(),
      ...overrides,
    };
  }

  /**
   * Create a technical expert user
   */
  static createTechnicalExpert(overrides: Partial<TestUser> = {}): TestUser {
    return {
      id: faker.string.uuid(),
      principal: faker.string.alphanumeric(27),
      name: faker.person.fullName(),
      email: faker.internet.email({ provider: 'tech.com' }),
      isWomenLed: faker.datatype.boolean({ probability: 0.4 }),
      location: faker.location.city() + ', ' + faker.location.state(),
      membershipTier: faker.helpers.arrayElement(['Tier4', 'Tier5', 'Tier6']),
      walletAddress: faker.finance.ethereumAddress(),
      ...overrides,
    };
  }

  /**
   * Create multiple users for testing
   */
  static createBatch(
    count: number,
    type: 'women' | 'community' | 'technical' = 'women'
  ): TestUser[] {
    const users: TestUser[] = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'women':
          users.push(this.createWomenEntrepreneur());
          break;
        case 'community':
          users.push(this.createCommunityLeader());
          break;
        case 'technical':
          users.push(this.createTechnicalExpert());
          break;
      }
    }
    return users;
  }

  /**
   * Create edge case users for security testing
   */
  static createMaliciousUser(overrides: Partial<TestUser> = {}): TestUser {
    return {
      id: '<script>alert("xss")</script>',
      principal: 'invalid-principal-format',
      name: '<img src=x onerror=alert("xss")>',
      email: 'invalid-email-format',
      isWomenLed: true,
      location: 'javascript:alert("xss")',
      membershipTier: 'Tier1',
      ...overrides,
    };
  }
}

/**
 * Application Factory - Generate grant applications
 */
export class ApplicationFactory {
  /**
   * Create a valid women's empowerment application
   */
  static createWomensEmpowermentApp(overrides: Partial<TestApplication> = {}): TestApplication {
    const womenFocusedTitles = [
      'Women-Led Solar Cooperative Initiative',
      'Rural Women Energy Access Program',
      'Women Entrepreneurs Solar Training Hub',
      'Community Women Solar Installation Project',
      "Women's Clean Energy Microfinance Program",
    ];

    return {
      title: faker.helpers.arrayElement(womenFocusedTitles),
      description: `This comprehensive initiative aims to ${faker.lorem.sentence(
        8
      )} focusing on empowering rural women through sustainable solar energy solutions. The project will establish training programs, provide microfinance opportunities, and create long-term employment for women in the clean energy sector.`,
      category: 'WomenEntrepreneurship',
      tier: faker.helpers.arrayElement(['Tier2', 'Tier3', 'Tier4']),
      isWomenLed: true,
      requestedAmount: faker.number.int({ min: 25000, max: 150000 }),
      expectedImpact: `Train ${faker.number.int({
        min: 10,
        max: 50,
      })} women, create ${faker.number.int({
        min: 5,
        max: 25,
      })} sustainable jobs, install ${faker.number.int({ min: 20, max: 100 })}kW solar capacity`,
      timeline: `${faker.number.int({
        min: 3,
        max: 12,
      })} months implementation with ${faker.number.int({ min: 1, max: 3 })}-month training phase`,
      documents: [
        'business-plan.pdf',
        'community-endorsement-letters.pdf',
        'technical-specifications.pdf',
        'financial-projections.xlsx',
      ],
      applicant: UserFactory.createWomenEntrepreneur(),
      status: 'Pending',
      createdAt: faker.date.recent({ days: 30 }),
      ...overrides,
    };
  }

  /**
   * Create a technical training application
   */
  static createTechnicalTrainingApp(overrides: Partial<TestApplication> = {}): TestApplication {
    return {
      title: `Solar Technology Training Center - ${faker.location.city()}`,
      description: `Establishment of a comprehensive solar technology training facility to build local technical capacity. The center will offer certification programs, hands-on workshops, and ongoing technical support for solar installations and maintenance.`,
      category: 'TechnicalTraining',
      tier: faker.helpers.arrayElement(['Tier3', 'Tier4', 'Tier5']),
      isWomenLed: faker.datatype.boolean({ probability: 0.6 }),
      requestedAmount: faker.number.int({ min: 50000, max: 200000 }),
      expectedImpact: `Train ${faker.number.int({
        min: 100,
        max: 500,
      })} technicians, establish ${faker.number.int({
        min: 1,
        max: 3,
      })} training centers, create ${faker.number.int({ min: 20, max: 100 })} technical jobs`,
      timeline: `${faker.number.int({ min: 6, max: 18 })} months with ongoing training programs`,
      documents: [
        'curriculum-design.pdf',
        'facility-requirements.pdf',
        'instructor-qualifications.pdf',
        'certification-framework.pdf',
      ],
      applicant: UserFactory.createTechnicalExpert(),
      status: 'Pending',
      createdAt: faker.date.recent({ days: 60 }),
      ...overrides,
    };
  }

  /**
   * Create community development application
   */
  static createCommunityDevelopmentApp(overrides: Partial<TestApplication> = {}): TestApplication {
    return {
      title: `Community Solar Hub - ${faker.location.city()} Village`,
      description: `Integrated community development project combining solar energy infrastructure with social programs. Includes community center with solar power, women's vocational training, children's education programs, and healthcare facility electrification.`,
      category: 'CommunityDevelopment',
      tier: faker.helpers.arrayElement(['Tier4', 'Tier5', 'Tier6']),
      isWomenLed: faker.datatype.boolean({ probability: 0.7 }),
      requestedAmount: faker.number.int({ min: 100000, max: 300000 }),
      expectedImpact: `Serve ${faker.number.int({
        min: 500,
        max: 2000,
      })} community members, establish ${faker.number.int({
        min: 2,
        max: 5,
      })} community programs, generate ${faker.number.int({ min: 50, max: 200 })}kW clean energy`,
      timeline: `${faker.number.int({ min: 12, max: 24 })} months with phased implementation`,
      documents: [
        'community-needs-assessment.pdf',
        'stakeholder-agreements.pdf',
        'environmental-impact-study.pdf',
        'sustainability-plan.pdf',
      ],
      applicant: UserFactory.createCommunityLeader(),
      status: 'Pending',
      createdAt: faker.date.recent({ days: 45 }),
      ...overrides,
    };
  }

  /**
   * Create invalid/malicious application for security testing
   */
  static createMaliciousApp(overrides: Partial<TestApplication> = {}): TestApplication {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert("xss")>',
      'javascript:alert("xss")',
      '<svg onload=alert("xss")>',
    ];

    return {
      title: faker.helpers.arrayElement(xssPayloads),
      description: `<script>document.cookie="malicious=true"</script>${faker.lorem.paragraph()}`,
      category: 'WomenEntrepreneurship',
      tier: 'Tier1',
      isWomenLed: true,
      requestedAmount: -1000, // Invalid negative amount
      expectedImpact: faker.helpers.arrayElement(xssPayloads),
      timeline: '',
      documents: ['../../../etc/passwd', 'file:///etc/hosts'],
      applicant: UserFactory.createMaliciousUser(),
      ...overrides,
    };
  }

  /**
   * Create batch of applications for load testing
   */
  static createBatch(
    count: number,
    type: 'women' | 'technical' | 'community' = 'women'
  ): TestApplication[] {
    const applications: TestApplication[] = [];
    for (let i = 0; i < count; i++) {
      switch (type) {
        case 'women':
          applications.push(this.createWomensEmpowermentApp());
          break;
        case 'technical':
          applications.push(this.createTechnicalTrainingApp());
          break;
        case 'community':
          applications.push(this.createCommunityDevelopmentApp());
          break;
      }
    }
    return applications;
  }
}

/**
 * Project Factory - Generate solar projects
 */
export class ProjectFactory {
  static createSolarProject(overrides: Partial<TestProject> = {}): TestProject {
    const locations = [
      'Maharashtra',
      'Rajasthan',
      'Gujarat',
      'Tamil Nadu',
      'Karnataka',
      'Andhra Pradesh',
      'Uttar Pradesh',
      'Madhya Pradesh',
    ];

    return {
      id: faker.string.uuid(),
      name: `${faker.location.city()} Solar Farm`,
      location: `${faker.location.city()}, ${faker.helpers.arrayElement(locations)}`,
      capacity: faker.number.int({ min: 10, max: 500 }),
      status: faker.helpers.arrayElement(['Planning', 'InProgress', 'Operational']),
      energyGenerated: faker.number.int({ min: 1000, max: 50000 }),
      beneficiaries: faker.number.int({ min: 100, max: 5000 }),
      coordinates: {
        lat: faker.location.latitude({ min: 8, max: 37 }), // India bounds
        lng: faker.location.longitude({ min: 68, max: 97 }),
      },
      ...overrides,
    };
  }

  static createBatch(count: number): TestProject[] {
    return Array.from({ length: count }, () => this.createSolarProject());
  }
}

/**
 * Proposal Factory - Generate DAO proposals
 */
export class ProposalFactory {
  static createFundingProposal(overrides: Partial<TestProposal> = {}): TestProposal {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      title: `Funding Proposal: ${faker.lorem.words(4)}`,
      description: faker.lorem.paragraphs(2),
      category: 'Funding',
      requestedAmount: faker.number.int({ min: 10000, max: 500000 }),
      votingPeriod: faker.number.int({ min: 7, max: 30 }),
      status: faker.helpers.arrayElement(['Active', 'Passed', 'Failed']),
      proposer: UserFactory.createCommunityLeader(),
      ...overrides,
    };
  }

  static createPolicyProposal(overrides: Partial<TestProposal> = {}): TestProposal {
    return {
      id: faker.number.int({ min: 1, max: 1000 }),
      title: `Policy Update: ${faker.lorem.words(3)}`,
      description: faker.lorem.paragraphs(3),
      category: 'Policy',
      votingPeriod: faker.number.int({ min: 14, max: 45 }),
      status: faker.helpers.arrayElement(['Active', 'Passed', 'Failed']),
      proposer: UserFactory.createTechnicalExpert(),
      ...overrides,
    };
  }
}

/**
 * Performance Test Data - Large datasets for load testing
 */
export class PerformanceDataFactory {
  /**
   * Generate large dataset for concurrent testing
   */
  static createConcurrentApplications(count: number = 100): TestApplication[] {
    return ApplicationFactory.createBatch(count, 'women');
  }

  /**
   * Generate users for stress testing
   */
  static createConcurrentUsers(count: number = 50): TestUser[] {
    return UserFactory.createBatch(count, 'women');
  }

  /**
   * Generate projects for pagination testing
   */
  static createLargeProjectDataset(count: number = 1000): TestProject[] {
    return ProjectFactory.createBatch(count);
  }
}

/**
 * Edge Case Factory - Generate problematic data for robustness testing
 */
export class EdgeCaseFactory {
  static createEmptyApplication(): TestApplication {
    return {
      title: '',
      description: '',
      category: 'WomenEntrepreneurship',
      tier: 'Tier1',
      isWomenLed: true,
      requestedAmount: 0,
      expectedImpact: '',
      timeline: '',
      documents: [],
    };
  }

  static createMaxLengthApplication(): TestApplication {
    return {
      title: 'A'.repeat(1000), // Very long title
      description: faker.lorem.paragraphs(50), // Very long description
      category: 'WomenEntrepreneurship',
      tier: 'Tier7',
      isWomenLed: true,
      requestedAmount: Number.MAX_SAFE_INTEGER,
      expectedImpact: 'B'.repeat(500),
      timeline: 'C'.repeat(200),
      documents: Array.from({ length: 100 }, (_, i) => `document-${i}.pdf`),
    };
  }

  static createUnicodeApplication(): TestApplication {
    return {
      title: '太阳能项目 🌞 ☀️ Solar Project',
      description: 'Project with émojis 🚀 and unicode: αβγδε ñáéíóú',
      category: 'WomenEntrepreneurship',
      tier: 'Tier2',
      isWomenLed: true,
      requestedAmount: 50000,
      expectedImpact: 'Impacto esperado con caracteres especiales: ñáéíóú',
      timeline: '6 meses implementación',
      documents: ['documents/प्रस्ताव.pdf', 'files/提案.docx'],
    };
  }
}

/**
 * Factory Registry - Central access to all factories
 */
export const TestDataFactory = {
  User: UserFactory,
  Application: ApplicationFactory,
  Project: ProjectFactory,
  Proposal: ProposalFactory,
  Performance: PerformanceDataFactory,
  EdgeCase: EdgeCaseFactory,
};

export default TestDataFactory;
