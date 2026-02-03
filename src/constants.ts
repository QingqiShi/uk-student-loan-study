// Chart salary range
export const MIN_SALARY = 25_000;
export const MAX_SALARY = 150_000;
export const DEFAULT_SALARY = 65_000;
export const SALARY_STEP = 5_000;

// Overpay analysis constants
export const MIN_MONTHLY_OVERPAYMENT = 0;
export const MAX_MONTHLY_OVERPAYMENT = 500;
export const OVERPAYMENT_STEP = 25;

/** Annual salary growth rates by preset type */
export const SALARY_GROWTH_RATES = {
  none: 0, // 0% - no salary growth
  conservative: 0.02, // 2% - matches inflation only
  moderate: 0.04, // 4% - typical career progression
  aggressive: 0.06, // 6% - fast-track careers (tech, finance)
} as const;

/** Annual threshold growth rates by preset type.
 * Thresholds are typically RPI-linked (2-3% historically).
 * Note: Government has announced threshold freeze through 2027.
 */
export const THRESHOLD_GROWTH_RATES = {
  none: 0, // 0% - frozen thresholds (current policy)
  conservative: 0.02, // 2% - below-inflation growth
  moderate: 0.03, // 3% - typical RPI-linked growth
  aggressive: 0.04, // 4% - above-inflation growth
} as const;

// Formatters for chart display
export const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const percentageFormatter = (value: number) =>
  `${(value * 100).toFixed(1)}%`;
export const yearsFormatter = (value: number) => value.toFixed(1);
