import { NextResponse } from 'next/server';

interface VoteRequest {
  proposalId: string;
  vote: 'for' | 'against' | 'abstain';
  userId: string;
  votingPower?: number;
  comment?: string;
}

interface VoteResponse {
  success: boolean;
  message: string;
  voteId?: string;
  currentVotes?: {
    for: number;
    against: number;
    abstain: number;
    total: number;
  };
  error?: string;
}

interface VoteHistory {
  id: string;
  proposalId: string;
  proposalTitle: string;
  vote: 'for' | 'against' | 'abstain';
  votingPower: number;
  timestamp: string;
  comment?: string;
  transactionHash: string;
}

/**
 * Records a vote for a proposal from the JSON body of the incoming HTTP request.
 *
 * @param request - HTTP request whose JSON body must follow `VoteRequest`: contains `proposalId`, `vote` ('for' | 'against' | 'abstain'), and `userId`; optional `votingPower` (defaults to 1) and `comment` are allowed.
 * @returns A `VoteResponse` describing the result. On success, includes `success: true`, a generated `voteId`, and updated `currentVotes`. On validation failure responds with `success: false` and an error message (HTTP 400). On unexpected errors responds with `success: false` and an internal error message (HTTP 500).
 */
export async function POST(request: Request) {
  try {
    const body: VoteRequest = await request.json();
    const { proposalId, vote, userId, votingPower = 1, comment } = body;

    // Validate required fields
    if (!proposalId || !vote || !userId) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Please provide proposalId, vote, and userId',
        },
        { status: 400 }
      );
    }

    // Validate vote type
    if (!['for', 'against', 'abstain'].includes(vote)) {
      return NextResponse.json<VoteResponse>(
        {
          success: false,
          error: 'Invalid vote type',
          message: "Vote must be 'for', 'against', or 'abstain'",
        },
        { status: 400 }
      );
    }

    // Simulate voting process
    // In a real implementation, this would:
    // 1. Check if the user is eligible to vote
    // 2. Check if the user has already voted
    // 3. Verify the proposal is in voting period
    // 4. Record the vote on the blockchain
    // 5. Update the vote counts

    // Simulate current vote counts (in real app, fetch from blockchain)
    const currentVotes = {
      for: 847,
      against: 123,
      abstain: 45,
      total: 1015,
    };

    // Update vote counts based on new vote
    const updatedVotes = {
      for: vote === 'for' ? currentVotes.for + votingPower : currentVotes.for,
      against: vote === 'against' ? currentVotes.against + votingPower : currentVotes.against,
      abstain: vote === 'abstain' ? currentVotes.abstain + votingPower : currentVotes.abstain,
      total: currentVotes.total + votingPower,
    };

    // Generate vote ID and transaction hash
    const voteId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;

    // Simulate blockchain transaction delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return NextResponse.json<VoteResponse>({
      success: true,
      message: 'Vote recorded successfully',
      voteId,
      currentVotes: updatedVotes,
    });
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json<VoteResponse>(
      {
        success: false,
        error: 'Failed to process vote',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Serve voting-related data based on query parameters in the request URL.
 *
 * @param request - Incoming HTTP request whose URL search params control the response: `userId` returns that user's vote history, `proposalId` returns details for that proposal, and absence of both returns general voting statistics.
 * @returns A JSON object with `success` and `data` fields whose shape depends on the query:
 * - If `userId` is provided: `data` is an array of `VoteHistory` entries and `count` is the number of entries.
 * - If `proposalId` is provided: `data` is an object with proposal voting details (totals, breakdown, quorum, distribution, time remaining, and user vote status).
 * - If neither is provided: `data` is an object with general voting statistics (totals, participation, and trends).
 * On error, returns a JSON object with `success: false`, `error`, and `message`, and an HTTP 500 status.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const proposalId = searchParams.get('proposalId');

    if (userId) {
      // Get user's voting history
      const voteHistory: VoteHistory[] = [
        {
          id: 'vote_001',
          proposalId: 'proposal_001',
          proposalTitle: 'Expand Solar Operations to Tamil Nadu',
          vote: 'for',
          votingPower: 1,
          timestamp: '2023-12-08T10:30:00Z',
          comment: 'Great initiative for renewable energy expansion',
          transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        },
        {
          id: 'vote_002',
          proposalId: 'proposal_003',
          proposalTitle: 'Community Education Program',
          vote: 'for',
          votingPower: 1,
          timestamp: '2023-11-10T14:20:00Z',
          transactionHash: '0x8765432109fedcba8765432109fedcba87654321',
        },
      ];

      return NextResponse.json({
        success: true,
        data: voteHistory,
        count: voteHistory.length,
        message: 'User voting history retrieved successfully',
      });
    }

    if (proposalId) {
      // Get voting details for a specific proposal
      const votingDetails = {
        proposalId,
        totalVotes: 1015,
        votes: {
          for: 847,
          against: 123,
          abstain: 45,
        },
        quorum: 10,
        quorumReached: true,
        votingPowerDistribution: {
          '1-10': 234,
          '11-50': 456,
          '51-100': 189,
          '100+': 136,
        },
        timeRemaining: '3 days 14 hours',
        userVoted: false, // In real app, check if current user voted
        userVote: null,
      };

      return NextResponse.json({
        success: true,
        data: votingDetails,
        message: 'Proposal voting details retrieved successfully',
      });
    }

    // Get general voting statistics
    const votingStats = {
      totalProposals: 42,
      activeProposals: 3,
      completedProposals: 39,
      totalVotesCast: 15420,
      averageVoterParticipation: 67.5,
      votingTrends: {
        last7Days: 1234,
        last30Days: 4567,
        last90Days: 12345,
      },
    };

    return NextResponse.json({
      success: true,
      data: votingStats,
      message: 'Voting statistics retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching voting data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch voting data',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Check whether a specific user has cast a vote on a given proposal.
 *
 * Expects `proposalId` and `userId` as URL query parameters and returns the user's vote status.
 *
 * @param request - Incoming HTTP request. Required query parameters: `proposalId`, `userId`.
 * @returns On success, an object with `success: true` and `data` containing:
 * - `hasVoted` (`boolean`) — whether the user has voted,
 * - `vote` (`'for' | 'against' | 'abstain' | null`) — the user's vote or `null` if not voted,
 * - `votingPower` (`number`) — the voting power associated with the vote,
 * - `timestamp` (`string | null`) — ISO timestamp when the vote was recorded or `null` if not voted.
 *
 * On client error (missing query parameters) returns `success: false` with HTTP 400 and an `error` and `message`.
 * On internal failure returns `success: false` with HTTP 500 and an `error` and `message`.
 */
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const proposalId = searchParams.get('proposalId');
    const userId = searchParams.get('userId');

    if (!proposalId || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing parameters',
          message: 'Please provide both proposalId and userId',
        },
        { status: 400 }
      );
    }

    // Simulate checking if user has voted
    // In real app, this would query the blockchain or database
    const hasVoted = Math.random() > 0.5; // Random for demo
    const userVote = hasVoted ? ['for', 'against', 'abstain'][Math.floor(Math.random() * 3)] : null;

    return NextResponse.json({
      success: true,
      data: {
        hasVoted,
        vote: userVote,
        votingPower: 1,
        timestamp: hasVoted ? new Date().toISOString() : null,
      },
      message: 'Vote status checked successfully',
    });
  } catch (error) {
    console.error('Error checking vote status:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check vote status',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}