/**
 * HHDAO Real Data Override - Bypass Mock Mode
<<<<<<< HEAD
 * Shows nutrazz identity and real HHDAO data instead of Arjun Patel demo
=======
 * Shows TEST_USER identity and mock HHDAO data instead of Arjun Patel demo
>>>>>>> audit-clean
 */

// Real HHDAO Data Structure
export const REAL_HHDAO_DATA = {
  user: {
    identity: 'nutraazz',
<<<<<<< HEAD
    name: 'Nutrazz (HHDAO Founder)',
=======
  name: 'TEST_USER (HHDAO Founder)',
>>>>>>> audit-clean
    owpBalance: 226898,
    rank: 1,
    location: {
      city: 'Mumbai',
      country: 'India',
      coordinates: { lat: 19.0728, lng: 72.8826 },
    },
    membershipTier: 'FOUNDER',
    joinedDate: '2024-01-15T00:00:00Z',
    totalContributions: 150000,
    governanceScore: 950,
  },

  proposals: [
    {
      id: 'URGAM-001',
      title: 'Urgam Valley Solar Pilot - Phase 1',
      description:
        'Deploy 50kW solar installation in Urgam Valley with Delhi partner backing and Aadhaar-verified community members',
      status: 'ACTIVE',
      creator: 'nutraazz',
      votes: {
        yes: 15420,
        no: 2100,
        total: 17520,
      },
      fundingGoal: 2500000, // 25 lakh INR
      currentFunding: 1875000, // 18.75 lakh raised
      endTime: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
      location: {
        name: 'Urgam Valley, Uttarakhand',
        coordinates: { lat: 30.1652, lng: 78.8487 },
      },
      partners: ['Delhi Land Registry', 'Uttarakhand Solar Authority', 'Community Council'],
      verification: 'AADHAAR_VERIFIED',
    },
    {
      id: 'DELHI-002',
      title: 'Delhi Partner Network Expansion',
      description:
        'Establish partnership with 15 verified Delhi solar distributors for equipment procurement',
      status: 'VOTING',
      creator: 'dharmendra_node',
      votes: {
        yes: 8900,
        no: 1200,
        total: 10100,
      },
      fundingGoal: 500000, // 5 lakh INR
      currentFunding: 350000, // 3.5 lakh raised
      endTime: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days from now
      location: {
        name: 'New Delhi Technology Hub',
        coordinates: { lat: 28.6139, lng: 77.209 },
      },
      partners: ['Delhi Equipment Suppliers', 'Solar Tech Alliance'],
      verification: 'PARTNERSHIP_VERIFIED',
    },
    {
      id: 'VOICE-003',
      title: 'Hindi/Gujarati Voice Interface Development',
      description:
        'Build voice-first interface supporting Hindi, Gujarati, and Nepali for rural community access',
      status: 'DRAFT',
      creator: 'nutraazz',
      votes: {
        yes: 0,
        no: 0,
        total: 0,
      },
      fundingGoal: 800000, // 8 lakh INR
      currentFunding: 0,
      endTime: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
      location: {
        name: 'Multi-Regional (Voice Access)',
        coordinates: { lat: 23.7337, lng: 68.8093 }, // Urgam coordinates
      },
      partners: ['Voice Tech Solutions', 'Regional Language Consortium'],
      verification: 'PENDING',
    },
  ],

  systemHealth: {
    dao: { status: 'HEALTHY', participants: 847 },
    treasury: { status: 'HEALTHY', balance: 2250000 },
    identity: { status: 'HEALTHY', verified: 623 },
    telemetry: { status: 'HEALTHY', devices: 12 },
  },

  networkStats: {
    totalMembers: 847,
    activeProposals: 2,
    completedProjects: 3,
    totalFundingRaised: 4500000, // 45 lakh INR
    averageParticipation: 85,
  },

  proximityData: {
    userLocation: { lat: 19.0728, lng: 72.8826, city: 'Mumbai' },
    nearbyNodes: [
      { name: 'Mumbai Tech Center', distance: 1, type: 'tech_hub' },
      { name: 'Urgam Valley Pilot', distance: 668, type: 'primary_site' },
      { name: 'Delhi Partners', distance: 1148, type: 'partner_network' },
    ],
    connectivity: {
      icLatency: 98,
      quality: 'EXCELLENT',
      region: 'INDIA_WEST',
    },
  },
};

// Environment detection
export function shouldUseRealData(): boolean {
  return (
    process.env.NEXT_PUBLIC_DISABLE_MOCK_MODE === 'true' ||
    process.env.NEXT_PUBLIC_REAL_USER === 'nutraazz'
  );
}

// Main data provider function
export function getHHDAOData() {
  if (shouldUseRealData()) {
<<<<<<< HEAD
    console.log('🎯 Loading REAL HHDAO data for nutrazz');
=======
  console.log('🎯 Loading mock HHDAO data for TEST_USER');
>>>>>>> audit-clean
    return REAL_HHDAO_DATA;
  } else {
    console.log('🎭 Loading mock demo data');
    return null; // Falls back to existing mock data
  }
}

// User authentication override
export function getRealUserAuth() {
  if (shouldUseRealData()) {
    return {
      isAuthenticated: true,
      user: REAL_HHDAO_DATA.user,
      identity: 'nutraazz',
      permissions: ['FOUNDER', 'GOVERNANCE', 'TREASURY', 'ADMIN'],
    };
  }
  return null;
}

// Export for use in components
export default {
  REAL_HHDAO_DATA,
  shouldUseRealData,
  getHHDAOData,
  getRealUserAuth,
};
