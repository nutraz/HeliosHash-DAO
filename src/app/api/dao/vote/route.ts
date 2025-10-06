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
 * Record a vote for a proposal and return the resulting vote status.
 *
 * This HTTP POST handler validates the request body, simulates recording the vote,
 * and returns a `VoteResponse` describing the outcome. Note: this implementation
 * simulates processing and does not persist votes.
 *
 * @returns A `VoteResponse` object:
 * - On success (`success: true`): includes `voteId` and the updated `currentVotes`.
 * - On validation failure (`success: false`): contains an `error` and `message`, returned with HTTP 400.
 * - On internal failure (`success: false`): contains an `error` and `message`, returned with HTTP 500.
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
 * Provide voting-related data determined by query parameters.
 *
 * When the `userId` query parameter is present, returns that user's voting history.
 * When the `proposalId` query parameter is present, returns detailed voting information for the specified proposal.
 * If neither parameter is present, returns aggregated voting statistics.
 *
 * @returns A JSON object with `success` and `message`, and `data` that varies by request:
 * - If `userId` was provided: `data` is an array of vote history entries (`VoteHistory[]`) and `count` is the number of entries.
 * - If `proposalId` was provided: `data` is an object with proposal voting details (`proposalId`, `totalVotes`, `votes` breakdown, `quorum`, `quorumReached`, `votingPowerDistribution`, `timeRemaining`, `userVoted`, `userVote`).
 * - Otherwise: `data` is an object of general voting statistics (`totalProposals`, `activeProposals`, `completedProposals`, `totalVotesCast`, `averageVoterParticipation`, `votingTrends`).
 * In error cases returns an object with `success: false`, `error`, and `message`.
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
 * Checks whether a given user has voted on a specified proposal.
 *
 * @param request - The incoming HTTP request whose URL search parameters must include `proposalId` and `userId`.
 * @returns A JSON payload. On success: `success` is `true` and `data` contains `hasVoted` (`true` or `false`), `vote` (`'for' | 'against' | 'abstain'` or `null`), `votingPower` (number), and `timestamp` (ISO string or `null`). On client error or failure: `success` is `false` and the response includes `error` and `message` fields.
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