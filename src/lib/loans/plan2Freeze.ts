/**
 * Budget 2025 announced Plan 2 threshold values.
 * These are fixed historical/policy facts — do not change when live config updates.
 */
const PLAN_2_FREEZE_TARGET_ANNUAL = 29_385;
const PLAN_2_FREEZE_UNTIL_TAX_YEAR = 2030; // Frozen through 2029/30

/**
 * Returns the current UK tax year (e.g., 2025 for 2025/26).
 * The UK tax year runs from 6 April to 5 April.
 */
function getCurrentTaxYear(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();
  // Before 6 April → still previous tax year
  if (month < 3 || (month === 3 && day < 6)) {
    return year - 1;
  }
  return year;
}

/**
 * Computes the Plan 2 threshold freeze schedule for the simulation engine.
 *
 * Returns an array of monthly threshold values — one per simulation year —
 * representing the known government-announced Plan 2 thresholds. After this
 * schedule, the engine applies the user-chosen thresholdGrowthRate.
 *
 * The schedule automatically adjusts based on the current date:
 * - If the base threshold hasn't stepped up yet (pre-April 2026): includes the step-up year
 * - After the scraper updates to £29,385: just the freeze years
 */
export function computePlan2FreezeSchedule(): number[] {
  const targetMonthly = PLAN_2_FREEZE_TARGET_ANNUAL / 12;
  const currentTaxYear = getCurrentTaxYear();
  const freezeEndTaxYear = PLAN_2_FREEZE_UNTIL_TAX_YEAR;
  // Number of years from the *next* tax year until the freeze ends
  // e.g., currentTaxYear=2025 → nextTaxYear=2026, years = 2030 - 2026 = 4
  const yearsUntilFreezeEnds = Math.max(
    0,
    freezeEndTaxYear - (currentTaxYear + 1),
  );

  if (yearsUntilFreezeEnds === 0) return [];

  return Array.from({ length: yearsUntilFreezeEnds }, () => targetMonthly);
}

/**
 * Returns the frozen Plan 2 annual threshold for display purposes.
 */
export const PLAN_2_FREEZE_TARGET = PLAN_2_FREEZE_TARGET_ANNUAL;

/**
 * Returns the tax year the freeze ends (threshold resumes growing from this year).
 */
export const PLAN_2_FREEZE_END_YEAR = PLAN_2_FREEZE_UNTIL_TAX_YEAR;
