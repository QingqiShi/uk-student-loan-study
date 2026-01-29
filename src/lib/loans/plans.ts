// =============================================================================
// ANNUAL UPDATE SECTION - Update these values when GOV.UK announces changes
// Source: https://www.gov.uk/repaying-your-student-loan/what-you-pay
// =============================================================================

/**
 * Plan configurations for all UK student loan types.
 * All monetary values are monthly thresholds in GBP.
 */
export const PLAN_CONFIGS = {
  PLAN_1: {
    monthlyThreshold: 2172, // £26,065/12
    repaymentRate: 0.09, // 9%
    writeOffYears: 25,
  },
  PLAN_2: {
    monthlyThreshold: 2372, // £28,470/12
    repaymentRate: 0.09, // 9%
    writeOffYears: 30,
    interestLowerThreshold: 28470,
    interestUpperThreshold: 51245,
  },
  PLAN_4: {
    monthlyThreshold: 2728, // £32,745/12
    repaymentRate: 0.09, // 9%
    writeOffYears: 30,
  },
  PLAN_5: {
    monthlyThreshold: 2083, // £25,000/12
    repaymentRate: 0.09, // 9%
    writeOffYears: 40,
  },
  POSTGRADUATE: {
    monthlyThreshold: 1750, // £21,000/12
    repaymentRate: 0.06, // 6%
    writeOffYears: 30,
  },
} as const;

/**
 * Current interest rates for loan calculations.
 * Update these when new rates are announced.
 */
export const CURRENT_RATES = {
  rpi: 3.2, // Sept 2025 - Aug 2026
  boeBaseRate: 4.0,
} as const;

// =============================================================================
// END OF ANNUAL UPDATE SECTION
// =============================================================================
