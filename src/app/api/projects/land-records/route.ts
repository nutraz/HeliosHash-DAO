import { NextRequest, NextResponse } from 'next/server';

// Land Records Management Types
export interface LandRecord {
  id: string;
  surveyNumber: string;
  subDivision?: string;
  village: string;
  tehsil: string;
  district: string;
  state: string;
  pincode: string;
  area: number; // in acres
  boundaries: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  ownerDetails: {
    name: string;
    fatherName: string;
    address: string;
    phone: string;
    email?: string;
    aadharNumber: string;
    panNumber?: string;
  };
  ownershipType: 'Individual' | 'Joint' | 'Community' | 'Government' | 'Leased' | 'Cooperative';
  landClassification:
    | 'Agricultural'
    | 'Residential'
    | 'Commercial'
    | 'Industrial'
    | 'Barren'
    | 'Forest';
  currentUse: string;
  irrigationType: 'Irrigated' | 'Rain-fed' | 'Mixed' | 'None';
  soilDetails: {
    type: string;
    fertility: 'High' | 'Medium' | 'Low';
    ph: number;
    nutrients: string[];
  };
  infrastructure: {
    roadAccess: boolean;
    roadType?: 'Paved' | 'Gravel' | 'Dirt';
    electricityAccess: boolean;
    waterSource: boolean;
    drainage: boolean;
    gridConnection: boolean;
    distanceToGrid: number; // in meters
  };
  location: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
    elevation: number; // in meters
    slope: number; // in degrees
    aspect: string; // compass direction
  };
  legalStatus: {
    registrationNumber: string;
    registrationDate: number;
    registrarOffice: string;
    marketValue: number;
    stampDuty: number;
    registrationFee: number;
  };
  documents: {
    titleDeed: string[];
    surveySettlement: string[];
    mutationRecords: string[];
    encumbranceCertificate: string[];
    revenueMaps: string[];
    photos: string[];
  };
  restrictions: {
    landCeiling: boolean;
    environmentalClearance: boolean;
    heritageRestrictions: boolean;
    zoneRestrictions: string[];
  };
  solarPotential: {
    averageSunlight: number; // hours per day
    solarIrradiation: number; // kWh/m2/day
    shadingAnalysis: string;
    optimalTiltAngle: number;
    estimatedCapacity: number; // kW potential
  };
  verification: {
    verified: boolean;
    verifiedBy?: string;
    verificationDate?: number;
    verificationNotes?: string;
    fieldSurveyDone: boolean;
    gpsVerified: boolean;
  };
  history: {
    previousOwners: string[];
    transactionHistory: {
      date: number;
      type: 'Sale' | 'Inheritance' | 'Partition' | 'Mutation' | 'Lease';
      amount?: number;
      description: string;
    }[];
  };
  createdDate: number;
  lastUpdated: number;
  status: 'Active' | 'Disputed' | 'Frozen' | 'Under Litigation';
}

// Mock Land Records Data
const mockLandRecords: LandRecord[] = [
  {
    id: 'LAND001',
    surveyNumber: '123/4A',
    subDivision: '4A1',
    village: 'Urgam',
    tehsil: 'Bhuj',
    district: 'Kachchh',
    state: 'Gujarat',
    pincode: '370105',
    area: 2.5,
    boundaries: {
      north: 'Road to Bhuj',
      south: 'Survey No. 123/3',
      east: 'Nalla (Stream)',
      west: 'Survey No. 124/1',
    },
    ownerDetails: {
      name: 'Rajesh Kumar Patel',
      fatherName: 'Ramesh Patel',
      address: 'Village Urgam, Bhuj, Kachchh, Gujarat - 370105',
      phone: '+91-9876543210',
      email: 'rajesh.patel@email.com',
      aadharNumber: '1234-5678-9012',
      panNumber: 'ABCDE1234F',
    },
    ownershipType: 'Individual',
    landClassification: 'Residential',
    currentUse: 'Residential with open space',
    irrigationType: 'None',
    soilDetails: {
      type: 'Sandy Loam',
      fertility: 'Medium',
      ph: 7.2,
      nutrients: ['Nitrogen', 'Phosphorus', 'Potassium'],
    },
    infrastructure: {
      roadAccess: true,
      roadType: 'Paved',
      electricityAccess: true,
      waterSource: true,
      drainage: true,
      gridConnection: true,
      distanceToGrid: 50,
    },
    location: {
      coordinates: {
        latitude: 23.2599,
        longitude: 69.6667,
      },
      elevation: 75,
      slope: 2.5,
      aspect: 'South-East',
    },
    legalStatus: {
      registrationNumber: 'REG/2019/456789',
      registrationDate: Date.now() - 86400000 * 365 * 2,
      registrarOffice: 'Sub-Registrar Office, Bhuj',
      marketValue: 5000000,
      stampDuty: 100000,
      registrationFee: 25000,
    },
    documents: {
      titleDeed: ['title_deed_123_4A.pdf'],
      surveySettlement: ['survey_settlement_2019.pdf'],
      mutationRecords: ['mutation_entry_456.pdf'],
      encumbranceCertificate: ['encumbrance_cert_2022.pdf'],
      revenueMaps: ['revenue_map_urgam.pdf'],
      photos: ['land_photo_1.jpg', 'land_photo_2.jpg', 'boundary_photo.jpg'],
    },
    restrictions: {
      landCeiling: false,
      environmentalClearance: false,
      heritageRestrictions: false,
      zoneRestrictions: ['Residential Zone R1'],
    },
    solarPotential: {
      averageSunlight: 8.5,
      solarIrradiation: 5.2,
      shadingAnalysis: 'Minimal shading from 10 AM to 4 PM',
      optimalTiltAngle: 23,
      estimatedCapacity: 12.5,
    },
    verification: {
      verified: true,
      verifiedBy: 'Revenue Inspector - Suresh Desai',
      verificationDate: Date.now() - 86400000 * 30,
      verificationNotes: 'Field verification completed. All boundaries and ownership confirmed.',
      fieldSurveyDone: true,
      gpsVerified: true,
    },
    history: {
      previousOwners: ['Ramesh Patel (Father)'],
      transactionHistory: [
        {
          date: Date.now() - 86400000 * 365 * 2,
          type: 'Inheritance',
          description: 'Inherited from father Ramesh Patel',
        },
      ],
    },
    createdDate: Date.now() - 86400000 * 365 * 2,
    lastUpdated: Date.now() - 86400000 * 7,
    status: 'Active',
  },
  {
    id: 'LAND002',
    surveyNumber: '456/7B',
    village: 'Pragpar',
    tehsil: 'Bhuj',
    district: 'Kachchh',
    state: 'Gujarat',
    pincode: '370020',
    area: 5.0,
    boundaries: {
      north: 'Village Road',
      south: 'Agricultural Land',
      east: 'Community Grazing Land',
      west: 'Survey No. 456/7A',
    },
    ownerDetails: {
      name: 'Fatima Sheikh',
      fatherName: 'Abdul Rahman Sheikh',
      address: 'Pragpar Village, Bhuj, Kachchh - 370020',
      phone: '+91-9123456789',
      email: 'fatima.sheikh@email.com',
      aadharNumber: '5678-9012-3456',
    },
    ownershipType: 'Individual',
    landClassification: 'Agricultural',
    currentUse: 'Fallow land suitable for solar installation',
    irrigationType: 'Rain-fed',
    soilDetails: {
      type: 'Clay Loam',
      fertility: 'Low',
      ph: 8.1,
      nutrients: ['Limited nutrients - requires improvement'],
    },
    infrastructure: {
      roadAccess: true,
      roadType: 'Gravel',
      electricityAccess: false,
      waterSource: false,
      drainage: false,
      gridConnection: false,
      distanceToGrid: 1200,
    },
    location: {
      coordinates: {
        latitude: 23.2842,
        longitude: 69.6692,
      },
      elevation: 85,
      slope: 1.2,
      aspect: 'South',
    },
    legalStatus: {
      registrationNumber: 'REG/2020/789123',
      registrationDate: Date.now() - 86400000 * 365,
      registrarOffice: 'Sub-Registrar Office, Bhuj',
      marketValue: 2500000,
      stampDuty: 50000,
      registrationFee: 12500,
    },
    documents: {
      titleDeed: ['title_deed_456_7B.pdf'],
      surveySettlement: ['survey_settlement_2020.pdf'],
      mutationRecords: ['mutation_entry_789.pdf'],
      encumbranceCertificate: ['encumbrance_cert_2023.pdf'],
      revenueMaps: ['revenue_map_pragpar.pdf'],
      photos: ['agricultural_land_1.jpg', 'access_road.jpg'],
    },
    restrictions: {
      landCeiling: true,
      environmentalClearance: true,
      heritageRestrictions: false,
      zoneRestrictions: ['Agricultural Zone A2', 'Solar Development Permitted'],
    },
    solarPotential: {
      averageSunlight: 9.2,
      solarIrradiation: 5.8,
      shadingAnalysis: 'Excellent exposure, no shading issues',
      optimalTiltAngle: 23,
      estimatedCapacity: 25.0,
    },
    verification: {
      verified: true,
      verifiedBy: 'District Collector Office - Technical Team',
      verificationDate: Date.now() - 86400000 * 15,
      verificationNotes:
        'Verified for solar development project. Environmental clearance in process.',
      fieldSurveyDone: true,
      gpsVerified: true,
    },
    history: {
      previousOwners: ['Abdul Rahman Sheikh (Father)'],
      transactionHistory: [
        {
          date: Date.now() - 86400000 * 365,
          type: 'Inheritance',
          description: 'Inherited agricultural land from father',
        },
      ],
    },
    createdDate: Date.now() - 86400000 * 365,
    lastUpdated: Date.now() - 86400000 * 2,
    status: 'Active',
  },
];

/**
 * Fetches land records filtered by role and query parameters and returns the matching records with summary statistics.
 *
 * The response `data` contains `landRecords` (the filtered list) and `summary` with aggregated values:
 * - `totalRecords`: number of matched records
 * - `totalArea`: sum of `area` across matched records
 * - `verifiedRecords`: count of records with verification
 * - `solarSuitableRecords`: count with estimated solar capacity > 5 kW
 * - `totalSolarPotential`: sum of `estimatedCapacity` across matched records
 * - `byOwnershipType`: counts for `Individual`, `Joint`, `Community`, `Government`
 * - `byLandClass`: counts for `Agricultural`, `Residential`, `Commercial`, `Industrial`
 *
 * Query parameters supported: `userRole`, `userId`, `village`, `district`, `ownerName`, `surveyNumber`, `solarSuitable`.
 *
 * @returns An object with `success: true` and `data` containing `landRecords` and `summary`, or `success: false` with `error` and `details` on failure.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('userRole'); // 'landowner', 'government', 'surveyor', 'admin'
    const userId = searchParams.get('userId');
    const village = searchParams.get('village');
    const district = searchParams.get('district');
    const ownerName = searchParams.get('ownerName');
    const surveyNumber = searchParams.get('surveyNumber');
    const solarSuitable = searchParams.get('solarSuitable') === 'true';

    let filteredRecords = mockLandRecords;

    // Role-based filtering
    if (userRole === 'landowner' && userId) {
      // Landowners see only their records
      filteredRecords = filteredRecords.filter(
        (record) =>
          record.ownerDetails.email === `${userId}@email.com` ||
          record.ownerDetails.name.toLowerCase().includes(userId.toLowerCase())
      );
    } else if (userRole === 'government') {
      // Government officials see all records in their jurisdiction
      filteredRecords = filteredRecords.filter((record) => record.verification.verified);
    }

    // Apply search filters
    if (village) {
      filteredRecords = filteredRecords.filter((record) =>
        record.village.toLowerCase().includes(village.toLowerCase())
      );
    }

    if (district) {
      filteredRecords = filteredRecords.filter((record) =>
        record.district.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (ownerName) {
      filteredRecords = filteredRecords.filter((record) =>
        record.ownerDetails.name.toLowerCase().includes(ownerName.toLowerCase())
      );
    }

    if (surveyNumber) {
      filteredRecords = filteredRecords.filter((record) =>
        record.surveyNumber.includes(surveyNumber)
      );
    }

    if (solarSuitable) {
      filteredRecords = filteredRecords.filter(
        (record) =>
          record.solarPotential.averageSunlight > 7 && record.solarPotential.estimatedCapacity > 5
      );
    }

    // Calculate summary statistics
    const summary = {
      totalRecords: filteredRecords.length,
      totalArea: filteredRecords.reduce((sum, record) => sum + record.area, 0),
      verifiedRecords: filteredRecords.filter((record) => record.verification.verified).length,
      solarSuitableRecords: filteredRecords.filter(
        (record) => record.solarPotential.estimatedCapacity > 5
      ).length,
      totalSolarPotential: filteredRecords.reduce(
        (sum, record) => sum + record.solarPotential.estimatedCapacity,
        0
      ),
      byOwnershipType: {
        individual: filteredRecords.filter((r) => r.ownershipType === 'Individual').length,
        joint: filteredRecords.filter((r) => r.ownershipType === 'Joint').length,
        community: filteredRecords.filter((r) => r.ownershipType === 'Community').length,
        government: filteredRecords.filter((r) => r.ownershipType === 'Government').length,
      },
      byLandClass: {
        agricultural: filteredRecords.filter((r) => r.landClassification === 'Agricultural').length,
        residential: filteredRecords.filter((r) => r.landClassification === 'Residential').length,
        commercial: filteredRecords.filter((r) => r.landClassification === 'Commercial').length,
        industrial: filteredRecords.filter((r) => r.landClassification === 'Industrial').length,
      },
    };

    return NextResponse.json({
      success: true,
      data: {
        landRecords: filteredRecords,
        summary,
      },
    });
  } catch (error) {
    console.error('Land records fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch land records',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Creates a new land record from the request body after validating required fields.
 *
 * The endpoint requires `surveyNumber`, `village`, `district`, and `ownerDetails.name` in the JSON body.
 *
 * @returns On success, a JSON object with `success: true`, the created `data` land record, and a success `message` (HTTP 200).
 *          If validation fails, a JSON object with `success: false` and an `error` message (HTTP 400).
 *          On internal failure, a JSON object with `success: false`, an `error` message, and `details` (HTTP 500).
 */
export async function POST(request: NextRequest) {
  try {
    const recordData = await request.json();

    if (
      !recordData.surveyNumber ||
      !recordData.village ||
      !recordData.district ||
      !recordData.ownerDetails?.name
    ) {
      return NextResponse.json(
        { success: false, error: 'Survey number, village, district, and owner name are required' },
        { status: 400 }
      );
    }

    // Create new land record
    const newRecord: LandRecord = {
      id: `LAND${String(Date.now()).slice(-6)}`,
      ...recordData,
      verification: {
        verified: false,
        fieldSurveyDone: false,
        gpsVerified: false,
        ...recordData.verification,
      },
      createdDate: Date.now(),
      lastUpdated: Date.now(),
      status: 'Active',
    };

    return NextResponse.json({
      success: true,
      data: newRecord,
      message: 'Land record created successfully',
    });
  } catch (error) {
    console.error('Land record creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create land record',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}