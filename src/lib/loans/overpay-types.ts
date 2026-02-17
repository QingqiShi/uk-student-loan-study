import type { Loan } from "./types";

/**
 * Input parameters for overpay analysis simulation.
 */
export interface OverpayInput {
  loans: Loan[];
  startingSalary: number;
  repaymentStartDate: Date;
  monthlyOverpayment: number;
  /** Salary growth rate as decimal (e.g., 0.04 = 4%) */
  salaryGrowthRate: number;
  /** Threshold growth rate as decimal (e.g., 0.02 = 2%) */
  thresholdGrowthRate: number;
  rpiRate?: number;
  boeBaseRate?: number;
  lumpSumPayment?: number;
}

/**
 * Result of a single scenario simulation (baseline or overpay).
 */
export interface ScenarioResult {
  totalPaid: number;
  monthsToPayoff: number;
  writtenOff: boolean;
  amountWrittenOff: number;
  finalSalary: number;
}

/**
 * Recommendation type based on analysis.
 */
export type RecommendationType =
  | "dont-overpay" // Loan will be written off anyway
  | "overpay" // Overpaying saves money
  | "marginal" // Within 10% - personal preference
  | "idle"; // No overpayment entered — prompt state

/**
 * A single data point in the balance time series for charting.
 */
export interface BalanceDataPoint {
  month: number;
  year: number;
  baselineBalance: number;
  overpayBalance: number;
}

/**
 * Complete result of the overpay analysis.
 */
export interface OverpayAnalysisResult {
  baseline: ScenarioResult;
  overpay: ScenarioResult;
  recommendation: RecommendationType;
  recommendationReason: string;
  /** Balance comparison over time for charting */
  balanceTimeSeries: BalanceDataPoint[];
  /** The month when the loan is written off (baseline scenario) */
  writeOffMonth: number | null;
  /** Payment difference: baseline.totalPaid - overpay.totalPaid
   * Positive = overpaying saves money (less interest paid)
   * Negative = overpaying costs more (e.g., paying off debt that would be written off) */
  paymentDifference: number;
  /** Extra amount paid when overpaying (overpayment contributions) */
  overpaymentContributions: number;
  /** Number of months saved by overpaying */
  monthsSaved: number;
  /** PV-adjusted baseline total paid */
  pvBaseline?: { totalPaid: number };
  /** PV-adjusted overpay total paid */
  pvOverpay?: { totalPaid: number };
  /** PV-adjusted payment difference (pvBaseline.totalPaid - pvOverpay.totalPaid) */
  pvPaymentDifference?: number;
}
