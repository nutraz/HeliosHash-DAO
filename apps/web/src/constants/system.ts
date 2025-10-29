
/**
 * HeliosHash DAO System Constants - MVP Edition
 * Last Updated: October 6, 2025
 * 
 * CANONICAL REFERENCE for all 50kW solar pilot specifications
 */

export const SYSTEM_SPECS = {
  // Phase 1 Pilot System (2025-2026)
  PILOT_CAPACITY_KW: 50,
  PILOT_EXPECTED_DAILY_KWH: 225,
  PILOT_PEAK_PRODUCTION_KW: 45, // Accounting for losses
  PILOT_CAPACITY_FACTOR: 0.19, // 19% realistic for India
  PILOT_BUDGET_INR: 5000000, // ₹50 lakh total
  COST_PER_KW_INR: 100000, // ₹1 lakh per kW

  // Production Ranges (for validation)
  DAILY_PRODUCTION_MIN_KWH: 50,  // Worst case (monsoon)
  DAILY_PRODUCTION_AVG_KWH: 225, // Typical day
  DAILY_PRODUCTION_MAX_KWH: 280, // Peak sunny day
  
  // Financial Constants
  MONTHLY_TARGET_KWH: 6750, // 225 * 30 days
  YEARLY_TARGET_KWH: 82125, // 225 * 365 days
  
  // Revenue Tiers
  TIER1_GUARANTEED_KW: 30, // Base guaranteed capacity
  TIER2_COMPUTING_KW: 15,  // Additional computing workloads  
  TIER3_SPECULATIVE_KW: 5, // Peak/speculative capacity

  // Pilot Location & Timeline
  PILOT_LOCATION: "Near Development Team (Accessible Site)",
  PILOT_TIMELINE: "2025-2026",
  
  // Future Urgam Valley Phase
  URGAM_MIN_CAPACITY_KW: 100,
  URGAM_MAX_CAPACITY_KW: 200,
  URGAM_TIMELINE: "2027+",
} as const;

export const FORMATTERS = {
  capacity: (kW: number) => `${kW} kW`,
  energy: (kWh: number) => `${kWh} kWh`,
  currency: (inr: number) => `₹${(inr / 100000).toFixed(1)} lakh`,
  percentage: (decimal: number) => `${(decimal * 100).toFixed(1)}%`,
  power: (kW: number) => `${kW.toFixed(1)} kW`,
} as const;

export const VALIDATION = {
  isValidDailyProduction: (kWh: number): boolean =>
    kWh >= SYSTEM_SPECS.DAILY_PRODUCTION_MIN_KWH && 
    kWh <= SYSTEM_SPECS.DAILY_PRODUCTION_MAX_KWH,
    
  isValidCapacity: (kW: number): boolean =>
    kW >= 40 && kW <= 60, // Allow some variance around 50kW
    
  isValidBudget: (inr: number): boolean =>
    inr >= 4000000 && inr <= 6000000, // ₹40-60 lakh range
} as const;
