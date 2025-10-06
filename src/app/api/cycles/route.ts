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
 * Handle incoming GET requests and respond with simulated ICP cycles data.
 *
 * Returns a JSON response containing `success`, `data` (a `CycleData` object with overall metrics and canister details), and `message` when successful. If an error occurs, responds with `success: false`, an `error` message, and an HTTP 500 status.
 *
 * @returns A NextResponse JSON payload with the simulated cycles data on success; on failure, a JSON payload with `success: false`, an `error` string, and `message`, delivered with HTTP status 500.
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
 * Handle cycle top-up and transfer requests for canisters.
 *
 * @param request - Incoming HTTP request whose JSON body must include `action` (`'topup'` or `'transfer'`), `canisterId` (string), and `amount` (number)
 * @returns A JSON response object:
 * - On success: `{ success: true, message: string, transactionId: string }`
 * - On invalid action: `{ success: false, error: 'Invalid action', message: string }` with HTTP status 400
 * - On internal failure: `{ success: false, error: 'Failed to process cycles request', message: 'Internal server error' }` with HTTP status 500
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