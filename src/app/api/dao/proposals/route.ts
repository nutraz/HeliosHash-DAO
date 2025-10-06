import { NextResponse } from 'next/server';

interface DAOProposal {
  id: string;
  title: string;
  description: string;
  category: 'governance' | 'technical' | 'financial' | 'community' | 'development';
  proposer: {
    id: string;
    name: string;
    role: string;
  };
  status: 'draft' | 'active' | 'voting' | 'passed' | 'rejected' | 'executed';
  voting: {
    startDate: string;
    endDate: string;
    quorum: number; // percentage
    votesFor: number;
    votesAgainst: number;
    votesAbstain: number;
    totalVotes: number;
    userVote?: 'for' | 'against' | 'abstain';
  };
  execution: {
    executor?: string;
    executionDate?: string;
    result?: string;
  };
  budget?: {
    amount: number; // in INR
    currency: string;
    description: string;
  };
  tags: string[];
  attachments: {
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  discussion: {
    comments: number;
    views: number;
    lastActivity: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Return a JSON response containing a simulated list of DAO proposals and related metadata.
 *
 * @returns A JSON response with `{ success: true, data: DAOProposal[], count: number, message: string }` on success; on failure returns `{ success: false, error: string, message: string }` and an HTTP 500 status.
 */
export async function GET() {
  try {
    // Simulate DAO proposals data
    const proposals: DAOProposal[] = [
      {
        id: 'proposal_001',
        title: 'Expand Solar Operations to Tamil Nadu',
        description:
          'Proposal to establish new solar infrastructure in Tamil Nadu with an initial investment of ₹5 Crore. The project aims to add 25MW of solar capacity and create approximately 150 jobs in the region.',
        category: 'development',
        proposer: {
          id: 'user_001',
          name: 'Rajesh Kumar',
          role: 'DAO Council Member',
        },
        status: 'voting',
        voting: {
          startDate: '2023-12-01T00:00:00Z',
          endDate: '2023-12-15T23:59:59Z',
          quorum: 10,
          votesFor: 847,
          votesAgainst: 123,
          votesAbstain: 45,
          totalVotes: 1015,
        },
        budget: {
          amount: 50000000,
          currency: 'INR',
          description: 'Initial investment for land acquisition and equipment',
        },
        tags: ['expansion', 'tamil-nadu', 'solar-infrastructure'],
        attachments: [
          {
            name: 'Feasibility Study.pdf',
            url: '/attachments/feasibility-tamil-nadu.pdf',
            type: 'application/pdf',
            size: 2048576,
          },
          {
            name: 'Budget Breakdown.xlsx',
            url: '/attachments/budget-tamil-nadu.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 1048576,
          },
        ],
        discussion: {
          comments: 23,
          views: 456,
          lastActivity: '2023-12-10T14:30:00Z',
        },
        execution: {
          executor: undefined,
          executionDate: undefined,
          result: undefined,
        },
        createdAt: '2023-11-25T10:00:00Z',
        updatedAt: '2023-12-10T14:30:00Z',
      },
      {
        id: 'proposal_002',
        title: 'Increase Mining Rewards by 15%',
        description:
          'Proposal to adjust the mining reward distribution to incentivize more miners to join the HeliosHash network. The increase will be funded by the DAO treasury and is expected to attract new participants.',
        category: 'financial',
        proposer: {
          id: 'user_002',
          name: 'Priya Sharma',
          role: 'Mining Committee',
        },
        status: 'active',
        voting: {
          startDate: '2023-12-05T00:00:00Z',
          endDate: '2023-12-20T23:59:59Z',
          quorum: 15,
          votesFor: 654,
          votesAgainst: 89,
          votesAbstain: 23,
          totalVotes: 766,
        },
        budget: {
          amount: 25000000,
          currency: 'INR',
          description: 'Monthly reward pool increase',
        },
        tags: ['mining', 'rewards', 'incentives'],
        attachments: [
          {
            name: 'Reward Analysis.pdf',
            url: '/attachments/reward-analysis.pdf',
            type: 'application/pdf',
            size: 1536000,
          },
        ],
        discussion: {
          comments: 45,
          views: 789,
          lastActivity: '2023-12-11T09:15:00Z',
        },
        execution: {
          executor: undefined,
          executionDate: undefined,
          result: undefined,
        },
        createdAt: '2023-11-30T14:00:00Z',
        updatedAt: '2023-12-11T09:15:00Z',
      },
      {
        id: 'proposal_003',
        title: 'Community Education Program',
        description:
          'Launch a comprehensive educational initiative to teach solar technology and blockchain concepts in rural areas across India. The program will include workshops, online courses, and hands-on training.',
        category: 'community',
        proposer: {
          id: 'user_003',
          name: 'Amit Patel',
          role: 'Education Team Lead',
        },
        status: 'passed',
        voting: {
          startDate: '2023-11-01T00:00:00Z',
          endDate: '2023-11-15T23:59:59Z',
          quorum: 10,
          votesFor: 1203,
          votesAgainst: 45,
          votesAbstain: 12,
          totalVotes: 1260,
        },
        execution: {
          executor: 'Education Team',
          executionDate: '2023-12-01T00:00:00Z',
          result: 'Program successfully launched in 5 states',
        },
        budget: {
          amount: 15000000,
          currency: 'INR',
          description: 'Education program funding for 6 months',
        },
        tags: ['education', 'community', 'rural-development'],
        attachments: [
          {
            name: 'Program Curriculum.pdf',
            url: '/attachments/education-curriculum.pdf',
            type: 'application/pdf',
            size: 3072000,
          },
          {
            name: 'Implementation Plan.docx',
            url: '/attachments/implementation-plan.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 512000,
          },
        ],
        discussion: {
          comments: 67,
          views: 1234,
          lastActivity: '2023-12-01T16:00:00Z',
        },
        createdAt: '2023-10-25T09:00:00Z',
        updatedAt: '2023-12-01T16:00:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      data: proposals,
      count: proposals.length,
      message: 'DAO proposals retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching DAO proposals:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch DAO proposals',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Create a new DAO proposal from the request JSON and return the created proposal or an error response.
 *
 * @param request - HTTP request whose JSON body must include `title`, `description`, `category`, `proposerId`, and `votingPeriod`; optional fields include `budget` and `attachments`.
 * @returns On success, an object with `success: true`, `data` containing the newly created proposal, and a `message`. If required fields are missing, responds with `success: false`, `error: 'Missing required fields'` and HTTP status 400. On internal failure, responds with `success: false`, `error: 'Failed to create DAO proposal'` and HTTP status 500.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, category, proposerId, budget, votingPeriod, attachments } = body;

    // Validate required fields
    if (!title || !description || !category || !proposerId || !votingPeriod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Please provide all required proposal information',
        },
        { status: 400 }
      );
    }

    // Simulate proposal creation
    const newProposal: Partial<DAOProposal> = {
      id: `proposal_${Date.now()}`,
      title,
      description,
      category,
      proposer: {
        id: proposerId,
        name: 'Current User', // In real app, fetch from user context
        role: 'DAO Member',
      },
      status: 'draft',
      voting: {
        startDate: votingPeriod.startDate,
        endDate: votingPeriod.endDate,
        quorum: 10, // Default quorum
        votesFor: 0,
        votesAgainst: 0,
        votesAbstain: 0,
        totalVotes: 0,
      },
      budget: budget
        ? {
            amount: budget.amount,
            currency: budget.currency || 'INR',
            description: budget.description,
          }
        : undefined,
      tags: [],
      attachments: attachments || [],
      discussion: {
        comments: 0,
        views: 0,
        lastActivity: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newProposal,
      message: 'DAO proposal created successfully',
    });
  } catch (error) {
    console.error('Error creating DAO proposal:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create DAO proposal',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}