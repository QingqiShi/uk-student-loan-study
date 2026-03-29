import { CURRENT_RATES, LAST_UPDATED } from "@/lib/loans/plans";

// Chart salary range
export const MIN_SALARY = 25_000;
export const MAX_SALARY = 150_000;
export const DEFAULT_SALARY = 45_000;
export const SALARY_STEP = 1_000;

// Overpay analysis constants
export const MIN_MONTHLY_OVERPAYMENT = 0;
export const MAX_MONTHLY_OVERPAYMENT = 500;
export const OVERPAYMENT_STEP = 25;

interface RateOption {
  value: number;
  label: string;
  description: string;
}

/**
 * Short month-year label derived from LAST_UPDATED for "current rate" descriptions.
 * Updates automatically when the GOV.UK automation changes the rates.
 */
const rateDate = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
}).format(new Date(LAST_UPDATED));

function formatRateLabel(value: number): string {
  // Show up to 2 decimal places, trimming trailing zeros
  const str = value.toFixed(2).replace(/\.?0+$/, "");
  return `${str}%`;
}

/** Salary growth rate options for toggle buttons */
export const SALARY_GROWTH_OPTIONS: RateOption[] = [
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
export const THRESHOLD_GROWTH_OPTIONS: RateOption[] = [
  { value: 0, label: "0%", description: "Frozen indefinitely" },
  { value: 0.02, label: "2%", description: "Typical growth" },
  { value: 0.03, label: "3%", description: "RPI-linked growth" },
  { value: 0.04, label: "4%", description: "Above-inflation growth" },
];

/** RPI rate options for the assumptions wizard (percentage format, e.g. 3.2 = 3.2%).
 *  The "current rate" option derives from CURRENT_RATES so it stays in sync
 *  with the daily GOV.UK automation.
 */
export const RPI_OPTIONS: RateOption[] = [
  { value: 0, label: "0%", description: "Prices stay flat" },
  { value: 2, label: "2%", description: "Low and stable" },
  {
    value: CURRENT_RATES.rpi,
    label: formatRateLabel(CURRENT_RATES.rpi),
    description: `Current rate (${rateDate})`,
  },
  { value: 5, label: "5%", description: "Prices rising fast" },
];

/** BOE base rate options for the assumptions wizard (percentage format, e.g. 3.75 = 3.75%).
 *  The "current rate" option derives from CURRENT_RATES so it stays in sync
 *  with the daily GOV.UK automation.
 */
export const BOE_BASE_RATE_OPTIONS: RateOption[] = [
  { value: 2, label: "2%", description: "Low rate environment" },
  { value: 3, label: "3%", description: "Rate-cutting cycle" },
  {
    value: CURRENT_RATES.boeBaseRate,
    label: formatRateLabel(CURRENT_RATES.boeBaseRate),
    description: `Current rate (${rateDate})`,
  },
  { value: 5.25, label: "5.25%", description: "2023 peak rate" },
];

/** Discount rate options for the present value assumptions wizard step */
export const DISCOUNT_RATE_OPTIONS: RateOption[] = [
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
