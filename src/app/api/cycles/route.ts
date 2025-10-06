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
 * Provide simulated ICP cycles metrics and canister details as a JSON HTTP response.
 *
 * @returns A JSON object with `success: true`, `data` containing `CycleData` (totalCycles, availableCycles, usedCycles, dailyConsumption, monthlyConsumption, and `canisters` array of {id, name, cycles, status}), and a `message` on success; on failure, an object with `success: false`, an `error` label, and a `message`.
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
 * Handle POST requests to perform a simulated ICP cycles action (topup or transfer).
 *
 * Expects a JSON body with `action`, `canisterId`, and `amount`. If `action` is
 * 'topup' or 'transfer', returns a success response containing a human-readable
 * message and a generated `transactionId`. If `action` is missing or invalid,
 * returns an error response with status 400. On unexpected failures, returns an
 * error response with status 500.
 *
 * @param request - Incoming request whose JSON body must include:
 *   - `action`: either `'topup'` or `'transfer'`
 *   - `canisterId`: the target canister identifier
 *   - `amount`: number of cycles to top up or transfer
 * @returns A JSON HTTP response. On success: an object with `success: true`, `message`, and `transactionId`. On invalid action: `success: false`, `error`, and `message` (HTTP 400). On internal failure: `success: false`, `error`, and `message` (HTTP 500).
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