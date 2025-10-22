import { NextRequest, NextResponse } from 'next/server';
import { privacyService } from '../../../src/services/privacyComplianceService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const dashboard = await privacyService.getPrivacyDashboard(userId);

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('Privacy dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy dashboard' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId, data } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'obtainConsent':
        result = await privacyService.obtainConsent(
          userId,
          data.consentLevel,
          data.privacySettings,
          request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          request.headers.get('user-agent') || undefined
        );
        break;

      case 'storeGender':
        result = await privacyService.storeGenderData(userId, data.gender);
        break;

      case 'updateGender':
        result = await privacyService.updateGenderData(userId, data.gender);
        break;

      case 'withdrawConsent':
        result = await privacyService.withdrawConsentAndDeleteData(userId, data.reason);
        break;

      case 'getAuditLog':
        // Admin only - in production, add authentication check
        const auditLog = privacyService.getAuditLog(userId, data.limit || 100);
        return NextResponse.json({ success: true, data: auditLog });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Privacy API error:', error);
    return NextResponse.json(
      { error: 'Privacy operation failed' },
      { status: 500 }
    );
  }
}
