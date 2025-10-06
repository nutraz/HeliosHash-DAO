/**
 * HeliosHash DAO System Constants - MVP Edition
 */

export const SYSTEM_SPECS = {
  PILOT_CAPACITY_KW: 50,
  PILOT_EXPECTED_DAILY_KWH: 225,
  PILOT_BUDGET_INR: 5000000,
  COST_PER_KW_INR: 100000,
} as const;

export const FORMATTERS = {
  capacity: (kW: number) => `${kW} kW`,
  energy: (kWh: number) => `${kWh} kWh`,
  currency: (inr: number) => `₹${(inr / 100000).toFixed(1)} lakh`,
} as const;
