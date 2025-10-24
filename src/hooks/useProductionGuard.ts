"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface ProductionGuardConfig {
  enableWarnings: boolean;
  blockRealTransactions: boolean;
  showCountdown: boolean;
  auditStatus: 'pending' | 'in-progress' | 'completed';
  estimatedMonthsToProduction: number;
}

interface TransactionAttempt {
  type: 'transfer' | 'vote' | 'investment' | 'withdrawal' | 'contract_interaction';
  amount?: number;
  currency?: string;
  description: string;
  timestamp: Date;
}

interface ProductionGuardState {
  isProductionReady: boolean;
  showWarningModal: boolean;
  blockedTransaction: TransactionAttempt | null;
  countdownDays: number;
  auditStatus: 'pending' | 'in-progress' | 'completed';
  warningsShown: number;
}

const PRODUCTION_CONFIG: ProductionGuardConfig = {
  enableWarnings: true,
  blockRealTransactions: true,
  showCountdown: true,
  auditStatus: 'pending',
  estimatedMonthsToProduction: 8
};

const PRODUCTION_WARNINGS = [
  "🚨 ALPHA VERSION - NOT PRODUCTION READY",
  "💰 NO REAL FUNDS - TEST ENVIRONMENT ONLY",
  "⚠️ SMART CONTRACTS NOT AUDITED",
  "⏱️ ESTIMATED 8-12 MONTHS TO PRODUCTION",
  "🚫 DO NOT USE WITH REAL MONEY"
];

export function useProductionGuard() {
  const router = useRouter();
  const [state, setState] = useState<ProductionGuardState>({
    isProductionReady: false,
    showWarningModal: false,
    blockedTransaction: null,
    countdownDays: PRODUCTION_CONFIG.estimatedMonthsToProduction * 30,
    auditStatus: PRODUCTION_CONFIG.auditStatus,
    warningsShown: 0
  });

  // Calculate countdown to production readiness
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const estimatedCompletion = new Date();
      estimatedCompletion.setMonth(now.getMonth() + PRODUCTION_CONFIG.estimatedMonthsToProduction);
      const diffTime = estimatedCompletion.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setState(prev => ({ ...prev, countdownDays: Math.max(0, diffDays) }));
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000 * 60 * 60); // Update hourly
    return () => clearInterval(interval);
  }, []);

  // Show periodic warnings
  useEffect(() => {
    if (!PRODUCTION_CONFIG.enableWarnings) return;

    const showWarning = () => {
      const warningIndex = state.warningsShown % PRODUCTION_WARNINGS.length;
      console.warn(`[PRODUCTION GUARD] ${PRODUCTION_WARNINGS[warningIndex]}`);

      setState(prev => ({
        ...prev,
        warningsShown: prev.warningsShown + 1
      }));
    };

    // Show warning every 5 minutes
    const interval = setInterval(showWarning, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [state.warningsShown]);

  // Intercept and block real transactions
  const interceptTransaction = useCallback(async (transaction: TransactionAttempt): Promise<boolean> => {
    if (!PRODUCTION_CONFIG.blockRealTransactions) {
      return true; // Allow transaction
    }

    // Check if this looks like a real transaction (has amount and currency)
    const isRealTransaction = transaction.amount && transaction.amount > 0 && transaction.currency;

    if (isRealTransaction) {
      setState(prev => ({
        ...prev,
        showWarningModal: true,
        blockedTransaction: transaction
      }));

      // Log the blocked attempt
      console.error(`[PRODUCTION GUARD] BLOCKED REAL TRANSACTION ATTEMPT:`, {
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        timestamp: transaction.timestamp
      });

      return false; // Block transaction
    }

    return true; // Allow test transaction
  }, []);

  // Dismiss warning modal
  const dismissWarning = useCallback(() => {
    setState(prev => ({
      ...prev,
      showWarningModal: false,
      blockedTransaction: null
    }));
  }, []);

  // Force redirect to safe page
  const forceSafeRedirect = useCallback(() => {
    router.push('/dashboard'); // Redirect to dashboard
  }, [router]);

  // Get audit status display
  const getAuditStatusDisplay = useCallback(() => {
    switch (state.auditStatus) {
      case 'pending':
        return { status: '❌ PENDING', color: 'text-red-600', description: 'Professional audit required' };
      case 'in-progress':
        return { status: '🔄 IN PROGRESS', color: 'text-yellow-600', description: 'Audit underway' };
      case 'completed':
        return { status: '✅ COMPLETED', color: 'text-green-600', description: 'Audit passed' };
      default:
        return { status: '❓ UNKNOWN', color: 'text-gray-600', description: 'Status unknown' };
    }
  }, [state.auditStatus]);

  // Check if current page should show warnings
  const shouldShowWarnings = useCallback((pathname: string) => {
    const sensitivePages = ['/wallet', '/payment', '/bridge', '/governance/vote'];
    return sensitivePages.some(page => pathname.includes(page));
  }, []);

  return {
    // State
    isProductionReady: state.isProductionReady,
    showWarningModal: state.showWarningModal,
    blockedTransaction: state.blockedTransaction,
    countdownDays: state.countdownDays,
    auditStatus: state.auditStatus,
    warningsShown: state.warningsShown,

    // Configuration
    config: PRODUCTION_CONFIG,

    // Actions
    interceptTransaction,
    dismissWarning,
    forceSafeRedirect,
    getAuditStatusDisplay,
    shouldShowWarnings,

    // Warnings
    productionWarnings: PRODUCTION_WARNINGS
  };
}

// Hook for components to easily check production status
export function useIsProductionReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // In a real implementation, this would check environment variables
    // or canister status to determine production readiness
    const checkProductionStatus = () => {
      const isProd = process.env.NODE_ENV === 'production' &&
                    process.env.NEXT_PUBLIC_IS_PRODUCTION_READY === 'true';
      setIsReady(isProd);
    };

    checkProductionStatus();
  }, []);

  return isReady;
}

// Utility function to wrap transaction functions with production guard
export function withProductionGuard<T extends any[], R>(
  fn: (...args: T) => Promise<R> | R,
  transactionType: TransactionAttempt['type'],
  description: string
) {
  return async (...args: T): Promise<R | null> => {
    const guard = useProductionGuard();

    const transaction: TransactionAttempt = {
      type: transactionType,
      description,
      timestamp: new Date(),
      // Extract amount and currency from args if available
      amount: (args[0] as any)?.amount,
      currency: (args[0] as any)?.currency
    };

    const allowed = await guard.interceptTransaction(transaction);
    if (!allowed) {
      return null; // Transaction blocked
    }

    return fn(...args);
  };
}
