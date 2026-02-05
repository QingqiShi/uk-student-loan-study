// Chart salary range
export const MIN_SALARY = 25_000;
export const MAX_SALARY = 150_000;
export const DEFAULT_SALARY = 40_000;
export const SALARY_STEP = 1_000;

// Overpay analysis constants
export const MIN_MONTHLY_OVERPAYMENT = 0;
export const MAX_MONTHLY_OVERPAYMENT = 500;
export const OVERPAYMENT_STEP = 25;

/** Salary growth rate options for toggle buttons */
export const SALARY_GROWTH_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 0, label: "0%", description: "No salary growth" },
  { value: 0.02, label: "2%", description: "Matches inflation only" },
  { value: 0.04, label: "4%", description: "Typical career progression" },
  {
    value: 0.06,
    label: "6%",
    description: "Fast-track careers (tech, finance)",
  },
];

/** Threshold growth rate options for toggle buttons.
 * Thresholds are typically RPI-linked (2-3% historically).
 * Note: Government has announced threshold freeze through 2027.
 */
export const THRESHOLD_GROWTH_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 0, label: "0%", description: "Frozen thresholds (current policy)" },
  { value: 0.02, label: "2%", description: "Below-inflation growth" },
  { value: 0.03, label: "3%", description: "Typical RPI-linked growth" },
  { value: 0.04, label: "4%", description: "Above-inflation growth" },
];

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
