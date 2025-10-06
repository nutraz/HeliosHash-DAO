import { NextResponse } from 'next/server';

interface CycleData {
  totalCycles: number;
  availableCycles: number;
  usedCycles: number;
  dailyConsumption: number;
  monthlyConsumption: number;
  canisters: {
    id: string;
    name: string;
    cycles: number;
    status: 'active' | 'idle' | 'frozen';
  }[];
}

/**
 * Provide simulated ICP cycles metrics and per-canister details as a JSON HTTP response.
 *
 * @returns A `NextResponse` whose successful body is `{ success: true, data: CycleData, message: string }`.
 *          On failure the response body is `{ success: false, error: string, message: string }` and the HTTP status is 500.
 */
export async function GET() {
  try {
    // Simulate ICP cycles data
    const cycleData: CycleData = {
      totalCycles: 50000000000, // 50B cycles
      availableCycles: 35000000000, // 35B cycles
      usedCycles: 15000000000, // 15B cycles
      dailyConsumption: 500000000, // 500M cycles
      monthlyConsumption: 15000000000, // 15B cycles
      canisters: [
        {
          id: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
          name: 'Solar Mining Canister',
          cycles: 8500000000,
          status: 'active',
        },
        {
          id: 'rrkah-fqaaa-aaaaa-aaaaq-cai',
          name: 'DAO Governance Canister',
          cycles: 3200000000,
          status: 'active',
        },
        {
          id: 'r7inp-6aaaa-aaaaa-aaabq-cai',
          name: 'NFT Marketplace Canister',
          cycles: 2100000000,
          status: 'idle',
        },
        {
          id: 'renrk-eyaaa-aaaaa-aaada-cai',
          name: 'User Management Canister',
          cycles: 1200000000,
          status: 'active',
        },
      ],
    };

    return NextResponse.json({
      success: true,
      data: cycleData,
      message: 'ICP cycles data retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching cycles data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch cycles data',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Handle canister cycle actions ('topup' or 'transfer') from a JSON request and return a JSON response describing the outcome.
 *
 * @param request - HTTP request whose JSON body must include `action` ('topup' | 'transfer'), `canisterId`, and `amount`
 * @returns A NextResponse containing JSON:
 * - On success: `{ success: true, message, transactionId }`
 * - If `action` is invalid: `{ success: false, error: 'Invalid action', message }` with HTTP status 400
 * - On internal failure: `{ success: false, error: 'Failed to process cycles request', message }` with HTTP status 500
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, canisterId, amount } = body;

    if (action === 'topup') {
      // Simulate cycle topup
      return NextResponse.json({
        success: true,
        message: `Successfully topped up ${amount} cycles to canister ${canisterId}`,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
    }

    if (action === 'transfer') {
      // Simulate cycle transfer
      return NextResponse.json({
        success: true,
        message: `Successfully transferred ${amount} cycles from canister ${canisterId}`,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Invalid action',
        message: 'Please specify a valid action (topup or transfer)',
      },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing cycles request:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process cycles request',
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}