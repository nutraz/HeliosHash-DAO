import { NextRequest, NextResponse } from 'next/server';

// Government Approval Workflow Types
export interface ApprovalWorkflow {
  id: string;
  applicationId: string;
  departmentId: string;
  departmentName: string;
  approvalType: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  currentStage: string;
  overallStatus:
    | 'Not Started'
    | 'In Progress'
    | 'Under Review'
    | 'Approved'
    | 'Rejected'
    | 'On Hold'
    | 'Conditional';
  submittedDate: number;
  targetCompletionDate: number;
  actualCompletionDate?: number;
  assignedOfficer: {
    id: string;
    name: string;
    designation: string;
    department: string;
    contactInfo: {
      email: string;
      phone: string;
      officeAddress: string;
    };
  };
  requiredDocuments: RequiredDocument[];
  submittedDocuments: SubmittedDocument[];
  approvalStages: ApprovalStage[];
  conditions?: ApprovalCondition[];
  fees: {
    applicationFee: number;
    processingFee: number;
    inspectionFee: number;
    totalPaid: number;
    paymentStatus: 'Pending' | 'Partial' | 'Complete';
    paymentHistory: PaymentRecord[];
  };
  inspections: Inspection[];
  communications: Communication[];
  legalReferences: string[];
  relatedApprovals: string[]; // IDs of dependent approvals
}

export interface RequiredDocument {
  id: string;
  name: string;
  type: string;
  mandatory: boolean;
  description: string;
  format: string[];
  maxSize: number; // in MB
  validityPeriod?: number; // in days
  issuingAuthority?: string;
}

export interface SubmittedDocument {
  id: string;
  requiredDocumentId: string;
  fileName: string;
  fileUrl: string;
  uploadDate: number;
  uploadedBy: string;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected' | 'Needs Correction';
  verifiedBy?: string;
  verificationDate?: number;
  verificationNotes?: string;
  expiryDate?: number;
}

export interface ApprovalStage {
  id: string;
  stageNumber: number;
  stageName: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Rejected' | 'On Hold';
  startDate?: number;
  endDate?: number;
  estimatedDuration: number; // in days
  actualDuration?: number;
  responsibleOfficer: string;
  requiredActions: string[];
  completedActions: string[];
  stageNotes?: string;
  dependencies: string[]; // Stage IDs that must complete first
}

export interface ApprovalCondition {
  id: string;
  condition: string;
  type: 'Technical' | 'Environmental' | 'Safety' | 'Legal' | 'Financial';
  mandatory: boolean;
  status: 'Pending' | 'Satisfied' | 'Not Applicable';
  dueDate?: number;
  satisfiedDate?: number;
  evidenceRequired: string;
  evidenceSubmitted?: string;
  verifiedBy?: string;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  feeType: string;
  paymentMethod: 'Online' | 'Bank Draft' | 'Cash' | 'Cheque';
  transactionId: string;
  paymentDate: number;
  status: 'Successful' | 'Failed' | 'Pending';
  receiptNumber?: string;
}

export interface Inspection {
  id: string;
  type: 'Site Visit' | 'Document Verification' | 'Technical Assessment' | 'Compliance Check';
  scheduledDate: number;
  actualDate?: number;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
  inspector: {
    name: string;
    designation: string;
    department: string;
    licenseNumber: string;
  };
  findings: string[];
  recommendations: string[];
  photosVideos: string[];
  reportUrl?: string;
  nextActions: string[];
}

export interface Communication {
  id: string;
  date: number;
  type: 'Email' | 'Letter' | 'SMS' | 'Phone Call' | 'Meeting' | 'Notice';
  from: string;
  to: string;
  subject: string;
  content: string;
  attachments: string[];
  priority: 'Low' | 'Medium' | 'High';
  status: 'Sent' | 'Delivered' | 'Read' | 'Replied';
  actionRequired: boolean;
  dueDate?: number;
}

// Department Configuration
export interface Department {
  id: string;
  name: string;
  parentDepartment?: string;
  jurisdiction: {
    state: string;
    districts: string[];
    tehsils?: string[];
  };
  approvalTypes: {
    type: string;
    description: string;
    typicalDuration: number; // in days
    fees: number;
    requiredDocuments: string[];
  }[];
  contactInfo: {
    headOfficer: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    workingHours: string;
  };
  slaTargets: {
    acknowledgment: number; // hours
    initialReview: number; // days
    finalApproval: number; // days
  };
}

// Mock Departments Data
const mockDepartments: Department[] = [
  {
    id: 'DEPT001',
    name: 'Gujarat Energy Development Agency (GEDA)',
    jurisdiction: {
      state: 'Gujarat',
      districts: ['Kachchh', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    },
    approvalTypes: [
      {
        type: 'Solar Project Technical Approval',
        description: 'Technical feasibility and safety approval for solar installations',
        typicalDuration: 15,
        fees: 5000,
        requiredDocuments: [
          'Technical Design',
          'Site Plan',
          'Safety Assessment',
          'Equipment Specifications',
        ],
      },
      {
        type: 'Grid Connection Permission',
        description: 'Permission to connect solar installation to electricity grid',
        typicalDuration: 21,
        fees: 10000,
        requiredDocuments: [
          'Technical Approval',
          'Electrical Design',
          'Safety Certificate',
          'Insurance Coverage',
        ],
      },
    ],
    contactInfo: {
      headOfficer: 'Shri R.K. Singh, IAS',
      address: '4th Floor, Block No. 11-12, Udyog Bhavan, Gandhinagar - 382010',
      phone: '+91-79-23977200',
      email: 'info@geda.gujarat.gov.in',
      website: 'https://geda.gujarat.gov.in',
      workingHours: '10:00 AM - 6:00 PM (Mon-Fri)',
    },
    slaTargets: {
      acknowledgment: 24,
      initialReview: 7,
      finalApproval: 15,
    },
  },
  {
    id: 'DEPT002',
    name: 'District Collector Office - Kachchh',
    jurisdiction: {
      state: 'Gujarat',
      districts: ['Kachchh'],
      tehsils: ['Bhuj', 'Anjar', 'Gandhidham', 'Mandvi', 'Nakhatrana'],
    },
    approvalTypes: [
      {
        type: 'Land Use Change Permission',
        description: 'Permission to change land use classification for solar projects',
        typicalDuration: 30,
        fees: 25000,
        requiredDocuments: [
          'Land Records',
          'Survey Map',
          'NOC from Village Panchayat',
          'Environmental Assessment',
        ],
      },
      {
        type: 'Construction Permission',
        description: 'Permission for construction activities related to solar installation',
        typicalDuration: 14,
        fees: 15000,
        requiredDocuments: [
          'Building Plan',
          'Structural Design',
          'Safety Plan',
          'Land Use Approval',
        ],
      },
    ],
    contactInfo: {
      headOfficer: 'Shri A.B. Patel, IAS',
      address: 'Collector Office, Bhuj, Kachchh - 370001',
      phone: '+91-2832-220011',
      email: 'collector-kachchh@gujarat.gov.in',
      workingHours: '10:30 AM - 6:00 PM (Mon-Fri)',
    },
    slaTargets: {
      acknowledgment: 48,
      initialReview: 10,
      finalApproval: 30,
    },
  },
  {
    id: 'DEPT003',
    name: 'Gujarat Pollution Control Board (GPCB)',
    jurisdiction: {
      state: 'Gujarat',
      districts: ['All Districts'],
    },
    approvalTypes: [
      {
        type: 'Environmental Clearance',
        description: 'Environmental impact assessment and clearance for solar projects',
        typicalDuration: 45,
        fees: 50000,
        requiredDocuments: [
          'Environmental Impact Assessment',
          'Site Survey',
          'Water Impact Study',
          'Waste Management Plan',
        ],
      },
      {
        type: 'Consent to Establish',
        description: 'Consent for establishing solar power plant',
        typicalDuration: 21,
        fees: 20000,
        requiredDocuments: [
          'Project Report',
          'Environmental Clearance',
          'Layout Plan',
          'Pollution Control Measures',
        ],
      },
    ],
    contactInfo: {
      headOfficer: 'Shri M.N. Reddy, IFS',
      address: 'Paryavaran Bhavan, CHH Road, Sector-10A, Gandhinagar - 382010',
      phone: '+91-79-23251013',
      email: 'info@gpcb.gov.in',
      website: 'https://gpcb.gov.in',
      workingHours: '10:00 AM - 5:30 PM (Mon-Fri)',
    },
    slaTargets: {
      acknowledgment: 72,
      initialReview: 14,
      finalApproval: 45,
    },
  },
];

// Mock Approval Workflows Data
const mockWorkflows: ApprovalWorkflow[] = [
  {
    id: 'APPR001',
    applicationId: 'APP001',
    departmentId: 'DEPT001',
    departmentName: 'Gujarat Energy Development Agency (GEDA)',
    approvalType: 'Solar Project Technical Approval',
    priority: 'High',
    currentStage: 'Technical Review',
    overallStatus: 'In Progress',
    submittedDate: Date.now() - 86400000 * 10,
    targetCompletionDate: Date.now() + 86400000 * 5,
    assignedOfficer: {
      id: 'OFF001',
      name: 'Dr. Suresh Kumar',
      designation: 'Senior Technical Officer',
      department: 'GEDA',
      contactInfo: {
        email: 'suresh.kumar@geda.gujarat.gov.in',
        phone: '+91-79-23977250',
        officeAddress: 'Technical Wing, GEDA, Gandhinagar',
      },
    },
    requiredDocuments: [
      {
        id: 'DOC001',
        name: 'Technical Design Report',
        type: 'Technical',
        mandatory: true,
        description: 'Detailed technical design and specifications of solar installation',
        format: ['PDF'],
        maxSize: 10,
        issuingAuthority: 'Certified Engineer',
      },
      {
        id: 'DOC002',
        name: 'Site Layout Plan',
        type: 'Technical',
        mandatory: true,
        description: 'Detailed site layout showing solar panel placement and infrastructure',
        format: ['PDF', 'CAD'],
        maxSize: 5,
        issuingAuthority: 'Licensed Surveyor',
      },
    ],
    submittedDocuments: [
      {
        id: 'SDOC001',
        requiredDocumentId: 'DOC001',
        fileName: 'technical_design_report_v2.pdf',
        fileUrl: '/documents/technical_design_report_v2.pdf',
        uploadDate: Date.now() - 86400000 * 8,
        uploadedBy: 'APP001',
        verificationStatus: 'Verified',
        verifiedBy: 'Dr. Suresh Kumar',
        verificationDate: Date.now() - 86400000 * 5,
        verificationNotes: 'Technical specifications meet GEDA standards',
      },
    ],
    approvalStages: [
      {
        id: 'STAGE001',
        stageNumber: 1,
        stageName: 'Document Verification',
        description: 'Initial document completeness and format check',
        status: 'Completed',
        startDate: Date.now() - 86400000 * 10,
        endDate: Date.now() - 86400000 * 8,
        estimatedDuration: 2,
        actualDuration: 2,
        responsibleOfficer: 'Document Verification Officer',
        requiredActions: ['Check document completeness', 'Verify formats', 'Initial screening'],
        completedActions: ['Check document completeness', 'Verify formats', 'Initial screening'],
        dependencies: [],
      },
      {
        id: 'STAGE002',
        stageNumber: 2,
        stageName: 'Technical Review',
        description: 'Technical evaluation of solar system design and specifications',
        status: 'In Progress',
        startDate: Date.now() - 86400000 * 8,
        estimatedDuration: 7,
        responsibleOfficer: 'Dr. Suresh Kumar',
        requiredActions: [
          'Review technical specifications',
          'Validate design calculations',
          'Safety assessment',
        ],
        completedActions: ['Review technical specifications'],
        dependencies: ['STAGE001'],
      },
    ],
    conditions: [
      {
        id: 'COND001',
        condition: 'Install lightning protection system as per IS 2309',
        type: 'Safety',
        mandatory: true,
        status: 'Pending',
        evidenceRequired: 'Lightning protection system installation certificate',
        dueDate: Date.now() + 86400000 * 30,
      },
    ],
    fees: {
      applicationFee: 2000,
      processingFee: 2500,
      inspectionFee: 500,
      totalPaid: 5000,
      paymentStatus: 'Complete',
      paymentHistory: [
        {
          id: 'PAY001',
          amount: 5000,
          feeType: 'Total Application Fees',
          paymentMethod: 'Online',
          transactionId: 'TXN123456789',
          paymentDate: Date.now() - 86400000 * 10,
          status: 'Successful',
          receiptNumber: 'GEDA/2024/001234',
        },
      ],
    },
    inspections: [
      {
        id: 'INSP001',
        type: 'Site Visit',
        scheduledDate: Date.now() + 86400000 * 3,
        status: 'Scheduled',
        inspector: {
          name: 'Eng. Pradeep Shah',
          designation: 'Field Inspector',
          department: 'GEDA',
          licenseNumber: 'GEDA/INSP/2024/045',
        },
        findings: [],
        recommendations: [],
        photosVideos: [],
        nextActions: ['Conduct site inspection', 'Prepare inspection report'],
      },
    ],
    communications: [
      {
        id: 'COMM001',
        date: Date.now() - 86400000 * 5,
        type: 'Email',
        from: 'suresh.kumar@geda.gujarat.gov.in',
        to: 'rajesh.patel@email.com',
        subject: 'Technical Design Approved - Conditions Apply',
        content:
          'Your technical design has been approved subject to installation of lightning protection system.',
        attachments: ['approval_conditions.pdf'],
        priority: 'Medium',
        status: 'Delivered',
        actionRequired: true,
        dueDate: Date.now() + 86400000 * 30,
      },
    ],
    legalReferences: [
      'Gujarat Solar Policy 2021',
      'Central Electricity Authority (Technical Standards) Regulations',
      'IS 2309:1989 - Lightning Protection Code',
    ],
    relatedApprovals: ['APPR002', 'APPR003'],
  },
];

/**
 * Fetches approval workflows filtered by user role and query parameters and returns those workflows with department data and summary statistics.
 *
 * @param request - Incoming request whose query parameters may include `userRole`, `userId`, `departmentId`, `status`, `priority`, and `applicationId` to control filtering.
 * @returns An object with `success: true` and `data` containing `workflows` (filtered ApprovalWorkflow[]), `departments` (Department[]), and `stats` (summary counts and metrics); on failure returns `success: false` and an `error` message with `details`.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userRole = searchParams.get('userRole'); // 'applicant', 'government', 'officer', 'admin'
    const userId = searchParams.get('userId');
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const applicationId = searchParams.get('applicationId');

    let filteredWorkflows = mockWorkflows;

    // Role-based filtering
    if (userRole === 'applicant' && applicationId) {
      filteredWorkflows = filteredWorkflows.filter(
        (workflow) => workflow.applicationId === applicationId
      );
    } else if (userRole === 'government' && departmentId) {
      filteredWorkflows = filteredWorkflows.filter(
        (workflow) => workflow.departmentId === departmentId
      );
    } else if (userRole === 'officer' && userId) {
      filteredWorkflows = filteredWorkflows.filter(
        (workflow) => workflow.assignedOfficer.id === userId
      );
    }

    // Apply additional filters
    if (status) {
      filteredWorkflows = filteredWorkflows.filter((workflow) => workflow.overallStatus === status);
    }

    if (priority) {
      filteredWorkflows = filteredWorkflows.filter((workflow) => workflow.priority === priority);
    }

    // Calculate statistics
    const stats = {
      totalWorkflows: filteredWorkflows.length,
      byStatus: {
        notStarted: filteredWorkflows.filter((w) => w.overallStatus === 'Not Started').length,
        inProgress: filteredWorkflows.filter((w) => w.overallStatus === 'In Progress').length,
        underReview: filteredWorkflows.filter((w) => w.overallStatus === 'Under Review').length,
        approved: filteredWorkflows.filter((w) => w.overallStatus === 'Approved').length,
        rejected: filteredWorkflows.filter((w) => w.overallStatus === 'Rejected').length,
        onHold: filteredWorkflows.filter((w) => w.overallStatus === 'On Hold').length,
      },
      byPriority: {
        low: filteredWorkflows.filter((w) => w.priority === 'Low').length,
        medium: filteredWorkflows.filter((w) => w.priority === 'Medium').length,
        high: filteredWorkflows.filter((w) => w.priority === 'High').length,
        urgent: filteredWorkflows.filter((w) => w.priority === 'Urgent').length,
      },
      avgProcessingTime: 15, // days - would be calculated from actual data
      slaCompliance: 85, // percentage - would be calculated from actual data
    };

    return NextResponse.json({
      success: true,
      data: {
        workflows: filteredWorkflows,
        departments: mockDepartments,
        stats,
      },
    });
  } catch (error) {
    console.error('Government approvals fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch government approvals',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Accepts a workflow submission payload and creates a new government approval workflow record.
 *
 * Expects the request body to be JSON containing at minimum `applicationId`, `departmentId`, and `approvalType`.
 * If any of those fields are missing, responds with a 400 error. On success, returns a newly created workflow
 * object seeded with default status, initial stage, submitted and target completion dates.
 *
 * @param request - Incoming NextRequest whose JSON body contains the workflow data (required fields: `applicationId`, `departmentId`, `approvalType`; optional additional fields are merged into the created workflow)
 * @returns A JSON object with `success` boolean, `data` containing the created workflow summary, and a human-readable `message`; on validation failure returns a 400 response with an `error` field, and on unexpected errors returns a 500 response with `error` and `details`
 */
export async function POST(request: NextRequest) {
  try {
    const workflowData = await request.json();

    if (!workflowData.applicationId || !workflowData.departmentId || !workflowData.approvalType) {
      return NextResponse.json(
        { success: false, error: 'Application ID, department ID, and approval type are required' },
        { status: 400 }
      );
    }

    // Create new approval workflow
    const newWorkflow: Partial<ApprovalWorkflow> = {
      id: `APPR${String(Date.now()).slice(-6)}`,
      ...workflowData,
      overallStatus: 'Not Started',
      currentStage: 'Document Submission',
      submittedDate: Date.now(),
      targetCompletionDate: Date.now() + 86400000 * 30, // 30 days default
      approvalStages: [
        {
          id: 'STAGE001',
          stageNumber: 1,
          stageName: 'Document Submission',
          description: 'Submit all required documents',
          status: 'In Progress',
          startDate: Date.now(),
          estimatedDuration: 3,
          responsibleOfficer: 'Applicant',
          requiredActions: ['Upload required documents', 'Pay application fees'],
          completedActions: [],
          dependencies: [],
        },
      ],
      communications: [],
      inspections: [],
    };

    return NextResponse.json({
      success: true,
      data: newWorkflow,
      message: 'Government approval workflow initiated successfully',
    });
  } catch (error) {
    console.error('Government approval workflow creation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create government approval workflow',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}