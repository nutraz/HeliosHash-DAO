import { NextResponse } from 'next/server';
import { daoService } from '../../../services/daoService';

export async function GET() {
  try {
    console.log('[TEST API] Testing canister connection...');

    // Test initialization
    await daoService.initialize();
    console.log('[TEST API] DAO service initialized successfully');

    // Test getting proposals
    const proposals = await daoService.getAllProposals();
    console.log('[TEST API] Got proposals:', proposals.length);

    return NextResponse.json({
      success: true,
      canisterConnected: true,
      proposalCount: proposals.length,
      message: 'Successfully connected to canister!',
    });
  } catch (error) {
    console.error('[TEST API] Error:', error);
    return NextResponse.json({
      success: false,
      canisterConnected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to canister - running in mock mode',
    });
  }
}
