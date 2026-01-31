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

/**
 * User-friendly display information for each undergraduate plan type.
 * yearlyThreshold and writeOffYears are derived from PLAN_CONFIGS to avoid duplication.
 */
export const PLAN_DISPLAY_INFO = {
  PLAN_1: {
    name: "Plan 1",
    region: "England, Wales & N. Ireland",
    years: "Pre-2012 (all years for NI)",
    description:
      "For English/Welsh students who started before September 2012, or any Northern Irish student",
    yearlyThreshold: PLAN_CONFIGS.PLAN_1.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_1.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_1.repaymentRate,
  },
  PLAN_2: {
    name: "Plan 2",
    region: "England & Wales",
    years: "2012-2023",
    description:
      "For students who started between September 2012 and July 2023",
    yearlyThreshold: PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_2.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_2.repaymentRate,
  },
  PLAN_4: {
    name: "Plan 4",
    region: "Scotland",
    years: "All years",
    description: "For Scottish students",
    yearlyThreshold: PLAN_CONFIGS.PLAN_4.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_4.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_4.repaymentRate,
  },
  PLAN_5: {
    name: "Plan 5",
    region: "England",
    years: "2023+",
    description: "For students who started after August 2023",
    yearlyThreshold: PLAN_CONFIGS.PLAN_5.monthlyThreshold * 12,
    writeOffYears: PLAN_CONFIGS.PLAN_5.writeOffYears,
    repaymentRate: PLAN_CONFIGS.PLAN_5.repaymentRate,
  },
} as const;

/**
 * User-friendly display information for postgraduate loans.
 * Values derived from PLAN_CONFIGS to avoid duplication.
 */
export const POSTGRADUATE_DISPLAY_INFO = {
  name: "Postgraduate",
  region: "UK-wide",
  years: "All years",
  description: "For Master's and Doctoral loans",
  yearlyThreshold: PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold * 12,
  writeOffYears: PLAN_CONFIGS.POSTGRADUATE.writeOffYears,
  repaymentRate: `${String(PLAN_CONFIGS.POSTGRADUATE.repaymentRate * 100)}%`,
} as const;

// =============================================================================
// END OF ANNUAL UPDATE SECTION
// =============================================================================
