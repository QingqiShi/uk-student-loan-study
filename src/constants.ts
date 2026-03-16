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
 * These represent the long-term growth rate. When the Plan 2 freeze toggle
 * is active, these rates apply after the freeze period ends.
 */
export const THRESHOLD_GROWTH_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 0, label: "0%", description: "Frozen indefinitely" },
  { value: 0.02, label: "2%", description: "Below-inflation growth" },
  { value: 0.03, label: "3%", description: "Typical RPI-linked growth" },
  { value: 0.04, label: "4%", description: "Above-inflation growth" },
];

/** RPI rate options for the assumptions wizard (percentage format, e.g. 3.2 = 3.2%) */
export const RPI_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 0, label: "0%", description: "Prices stay flat" },
  { value: 2, label: "2%", description: "Low and stable" },
  { value: 3.2, label: "3.2%", description: "Current rate (Sept 2025)" },
  { value: 5, label: "5%", description: "Prices rising fast" },
];

/** BOE base rate options for the assumptions wizard (percentage format, e.g. 3.75 = 3.75%) */
export const BOE_BASE_RATE_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 2, label: "2%", description: "Low rate environment" },
  { value: 3, label: "3%", description: "Rate-cutting cycle" },
  { value: 3.75, label: "3.75%", description: "Current rate (Feb 2026)" },
  { value: 5.25, label: "5.25%", description: "2023 peak rate" },
];

/** Discount rate options for the present value assumptions wizard step */
export const DISCOUNT_RATE_OPTIONS: {
  value: number;
  label: string;
  description: string;
}[] = [
  { value: 0, label: "0%", description: "Show future amounts as-is" },
  {
    value: 0.02,
    label: "2%",
    description: "Bank of England target (recommended)",
  },
  { value: 0.03, label: "3%", description: "Cautious estimate" },
  { value: 0.05, label: "5%", description: "If investing instead" },
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
