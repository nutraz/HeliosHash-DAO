/**
 * HeliosHash DAO System Constants
 * Single source of truth for all capacity and energy specifications
 * 
 * IMPORTANT: Always import these constants instead of using magic numbers
 */

export const SYSTEM_SPECS = {
  // Phase 1 Pilot System
  PILOT_CAPACITY_KW: 50,
  PILOT_EXPECTED_DAILY_KWH: 225,
  PILOT_PEAK_PRODUCTION_KW: 45,
  PILOT_CAPACITY_FACTOR: 0.19,
  PILOT_BUDGET_INR: 5000000,

  // Phase 2 Urgam Valley
  URGAM_MIN_CAPACITY_KW: 100,
  URGAM_MAX_CAPACITY_KW: 200,
  
  // Load Distribution (for 50kW pilot)
  TIER1_GUARANTEED_KW: 30,    // Grid feed-in, agriculture
  TIER2_COMPUTING_KW: 15,     // Edge computing, AI services
  TIER3_SPECULATIVE_KW: 5,    // Bitcoin mining, rendering
  
  // Production Ranges (50kW system)
  MIN_DAILY_PRODUCTION_KWH: 50,   // Worst weather
  MAX_DAILY_PRODUCTION_KWH: 280,  // Peak conditions
  AVERAGE_DAILY_PRODUCTION_KWH: 225,
  
  // Financial
  COST_PER_KW_INR: 100000,        // ₹1 lakh per kW
  EXPECTED_ANNUAL_ROI: 0.14,       // 14%
  PAYBACK_PERIOD_YEARS: 6.5,
} as const;

export type SystemSpecs = typeof SYSTEM_SPECS;

// Validation functions
export const validateDailyProduction = (kWh: number): boolean => {
  return kWh >= SYSTEM_SPECS.MIN_DAILY_PRODUCTION_KWH && 
         kWh <= SYSTEM_SPECS.MAX_DAILY_PRODUCTION_KWH;
};

export const validateCapacity = (kW: number): boolean => {
  return kW === SYSTEM_SPECS.PILOT_CAPACITY_KW || 
         (kW >= SYSTEM_SPECS.URGAM_MIN_CAPACITY_KW && kW <= SYSTEM_SPECS.URGAM_MAX_CAPACITY_KW);
};

// Helper functions for UI display
export const formatCapacity = (kW: number): string => {
  return `${kW} kW`;
};

export const formatEnergy = (kWh: number): string => {
  return `${kWh.toFixed(1)} kWh`;
};

export const formatCurrency = (amount: number, currency: 'INR' | 'OWP' = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return `${amount.toLocaleString()} OWP`;
};