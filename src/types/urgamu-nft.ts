// === UrgamU NFT Types ===
// NFT marketplace for supporting UrgamU Valley transformation and Asia rebuilding

export interface UrgamUNFT {
  id: string;
  tokenId: number;
  name: string;
  description: string;
  image: string;
  category: NFTCategory;
  tier: NFTTier;
  owpPrice: number; // Price in OWP tokens
  usdPrice?: number;
  owner: string;
  creator: string;
  projectBenefit: ProjectBenefit;
  isForSale: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: NFTMetadata;
  rebuildingImpact: RebuildingImpact;

  /**
   * VIEW-MODEL OPTIONALS (temporary until component normalized)
   * These are added to satisfy current marketplace component expectations.
   */
  // Legacy alias expected by component (price vs owpPrice)
  price?: number;
  // Collection context injected at runtime when flattening collections
  collectionId?: string;
  // Temporary alias referencing projectBenefit as plural form
  projectBenefits?: ProjectBenefitAlias;
}

export type NFTCategory =
  | 'urgamu_valley'
  | 'solar_infrastructure'
  | 'community_membership'
  | 'energy_certificate'
  | 'rebuilding_asia'
  | 'himalayan_project'
  | 'subcontinental_unity';

export type NFTTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'founder';

export interface ProjectBenefit {
  solarCapacityContribution: number; // kW contributed
  communityJobsSupported: number;
  carbonOffsetGenerated: number; // tons CO2
  villagesImpacted: number;
  directFunding: number; // USD value to project
  owpTokensGenerated: number; // OWP rewards for holder
}

// Alias shape used by marketplace (expected field names there)
export interface ProjectBenefitAlias {
  solarCapacityKW: number;
  jobsCreated: number;
  carbonOffsetTons: number;
  villagesImpacted?: number;
  directFundingUSD: number;
  owpTokensGenerated: number;
}

export interface RebuildingImpact {
  region: 'uttarakhand' | 'himalayan_region' | 'northern_india' | 'subcontinent' | 'asia';
  impactType:
    | 'infrastructure'
    | 'energy_independence'
    | 'community_development'
    | 'education'
    | 'healthcare';
  beneficiaries: number; // People directly impacted
  sustainabilityScore: number; // 0-100
  replicationPotential: 'village' | 'district' | 'state' | 'national' | 'regional';
  /**
   * Optional view-only fields referenced in UI (scale, targetRegion, etc.).
   * Will be normalized or removed in future refactor.
   */
  scale?: 'village' | 'district' | 'regional' | 'national' | 'continental';
  targetRegion?: string;
  communitiesImpacted?: number;
  crossBorderCollaboration?: boolean;
}

export interface NFTMetadata {
  externalUrl?: string;
  animationUrl?: string;
  backgroundColor?: string;
  attributes: NFTAttribute[];
  projectPhase: 'pilot' | 'scaling' | 'replication' | 'established';
  geographicScope: string;
  sustainabilityMetrics: {
    renewableEnergyGenerated: number; // kWh
    jobsCreated: number;
    familiesBenefited: number;
    educationAccess: boolean;
    healthcareAccess: boolean;
  };
}

export interface NFTAttribute {
  traitType: string;
  value: string | number;
  displayType?: 'boost_number' | 'boost_percentage' | 'number' | 'date';
  maxValue?: number;
}

// NFT Collections
export interface NFTCollection {
  id: string;
  name: string;
  description: string;
  image: string;
  category: NFTCategory;
  totalSupply: number;
  mintedCount: number;
  floorPriceOWP: number;
  projectFocus: string;
  rebuildingGoal: string;
  impactMetrics: CollectionImpactMetrics;
}

export interface CollectionImpactMetrics {
  totalFundingRaised: number; // USD
  solarCapacityBuilt: number; // kW
  communitiesTransformed: number;
  jobsCreated: number;
  owpTokensDistributed: number;
  carbonOffset: number; // tons CO2
}

// Mock UrgamU NFT Collections
export const urgamUCollections: NFTCollection[] = [
  {
    id: 'urgamu-founders',
    name: 'UrgamU Valley Founders',
    description:
      'Founding members of the UrgamU Valley transformation project. Exclusive access to governance and lifetime solar dividend rewards.',
    image: '/nft/urgamu-founders.png',
    category: 'urgamu_valley',
    totalSupply: 100,
    mintedCount: 47,
    floorPriceOWP: 500,
    projectFocus: 'Urgam Valley Pilot Project - 50kW to 500kW solar transformation',
    rebuildingGoal: 'Transform disconnected Himalayan valley into sustainable smart community',
    impactMetrics: {
      totalFundingRaised: 125000,
      solarCapacityBuilt: 50,
      communitiesTransformed: 1,
      jobsCreated: 18,
      owpTokensDistributed: 23500,
      carbonOffset: 85.3,
    },
  },
  {
    id: 'himalayan-solar-certificates',
    name: 'Himalayan Solar Energy Certificates',
    description:
      'Each NFT represents 1 MWh of clean solar energy generated in the Himalayas, supporting remote mountain communities.',
    image: '/nft/himalayan-solar.png',
    category: 'energy_certificate',
    totalSupply: 10000,
    mintedCount: 2347,
    floorPriceOWP: 25,
    projectFocus: 'Himalayan Solar Grid - Multi-valley energy independence',
    rebuildingGoal: 'Energy independence for 1000+ remote Himalayan villages',
    impactMetrics: {
      totalFundingRaised: 2347000,
      solarCapacityBuilt: 2347,
      communitiesTransformed: 47,
      jobsCreated: 890,
      owpTokensDistributed: 117350,
      carbonOffset: 3234.5,
    },
  },
  {
    id: 'subcontinent-unity',
    name: 'Subcontinental Unity Network',
    description:
      'Cross-border collaboration NFTs supporting energy and infrastructure projects across India, Nepal, Bangladesh, and beyond.',
    image: '/nft/subcontinent-unity.png',
    category: 'subcontinental_unity',
    totalSupply: 5000,
    mintedCount: 892,
    floorPriceOWP: 100,
    projectFocus: 'Cross-border renewable energy and infrastructure cooperation',
    rebuildingGoal: 'Unified sustainable development across South Asian subcontinent',
    impactMetrics: {
      totalFundingRaised: 892000,
      solarCapacityBuilt: 445,
      communitiesTransformed: 89,
      jobsCreated: 2340,
      owpTokensDistributed: 89200,
      carbonOffset: 1247.8,
    },
  },
];

// Mock UrgamU NFTs
export const mockUrgamUNFTs: UrgamUNFT[] = [
  {
    id: 'urgamu-001',
    tokenId: 1,
    name: 'UrgamU Valley Pioneer #001',
    description:
      'First founder NFT for the UrgamU Valley transformation. Includes voting rights, solar dividends, and exclusive access to governance decisions.',
    image: '/nft/urgamu-pioneer-001.png',
    category: 'urgamu_valley',
    tier: 'founder',
    owpPrice: 750,
    usdPrice: 2500,
    owner: '0x1234...5678',
    creator: 'UrgamU DAO Council',
    projectBenefit: {
      solarCapacityContribution: 2.5, // kW
      communityJobsSupported: 3,
      carbonOffsetGenerated: 5.2,
      villagesImpacted: 1,
      directFunding: 2500,
      owpTokensGenerated: 15.5, // Monthly OWP rewards
    },
    rebuildingImpact: {
      region: 'uttarakhand',
      impactType: 'infrastructure',
      beneficiaries: 247,
      sustainabilityScore: 94,
      replicationPotential: 'national',
    },
    isForSale: true,
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-09-30'),
    metadata: {
      externalUrl: 'https://urgamu.hhdao.org/nft/001',
      backgroundColor: '#FF6B35',
      attributes: [
        { traitType: 'Founding Tier', value: 'Pioneer' },
        { traitType: 'Solar Contribution', value: 2.5, displayType: 'number' },
        { traitType: 'Community Impact', value: 94, displayType: 'boost_percentage' },
        { traitType: 'Geographic Focus', value: 'Urgam Valley, Uttarakhand' },
        { traitType: 'Project Phase', value: 'Pilot Launch' },
      ],
      projectPhase: 'pilot',
      geographicScope: 'Urgam Valley, Uttarakhand, India',
      sustainabilityMetrics: {
        renewableEnergyGenerated: 12500,
        jobsCreated: 3,
        familiesBenefited: 45,
        educationAccess: true,
        healthcareAccess: true,
      },
    },
  },
  {
    id: 'himalayan-solar-157',
    tokenId: 157,
    name: 'Himalayan Solar Certificate #157',
    description:
      'Represents 1 MWh of clean solar energy generated in remote Himalayan communities. Supports energy independence and job creation.',
    image: '/nft/himalayan-solar-157.png',
    category: 'energy_certificate',
    tier: 'gold',
    owpPrice: 35,
    usdPrice: 120,
    owner: '0xabcd...efgh',
    creator: 'Himalayan Solar Cooperative',
    projectBenefit: {
      solarCapacityContribution: 0.5,
      communityJobsSupported: 1,
      carbonOffsetGenerated: 1.2,
      villagesImpacted: 3,
      directFunding: 120,
      owpTokensGenerated: 2.5,
    },
    rebuildingImpact: {
      region: 'himalayan_region',
      impactType: 'energy_independence',
      beneficiaries: 89,
      sustainabilityScore: 87,
      replicationPotential: 'regional',
    },
    isForSale: false,
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-28'),
    metadata: {
      externalUrl: 'https://himalayan-solar.hhdao.org/nft/157',
      backgroundColor: '#4ECDC4',
      attributes: [
        { traitType: 'Energy Certified', value: '1 MWh' },
        { traitType: 'Mountain Region', value: 'Himalayan Range' },
        { traitType: 'Carbon Offset', value: 1.2, displayType: 'number' },
        { traitType: 'Villages Benefited', value: 3, displayType: 'number' },
      ],
      projectPhase: 'scaling',
      geographicScope: 'Multiple Himalayan villages',
      sustainabilityMetrics: {
        renewableEnergyGenerated: 1000,
        jobsCreated: 1,
        familiesBenefited: 12,
        educationAccess: true,
        healthcareAccess: false,
      },
    },
  },
];

export const URGAMU_NFT_CONTRACT_ADDRESS = '0x...'; // To be filled with actual contract
export const ENERGY_CERTIFICATE_CONTRACT = '0x...'; // Energy certificate contract
