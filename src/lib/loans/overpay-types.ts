import type { Loan } from "./types";
import type { SalaryGrowthRate } from "@/types/store";

/**
 * Input parameters for overpay analysis simulation.
 */
export interface OverpayInput {
  loans: Loan[];
  startingSalary: number;
  repaymentStartDate: Date;
  monthlyOverpayment: number;
  salaryGrowthRate: SalaryGrowthRate;
  alternativeSavingsRate: number; // Annual return rate as decimal (e.g., 0.05 for 5%)
  rpiRate?: number;
  boeBaseRate?: number;
}

/**
 * Result of a single scenario simulation (baseline, overpay, or invest).
 */
export interface ScenarioResult {
  totalPaid: number;
  monthsToPayoff: number;
  writtenOff: boolean;
  amountWrittenOff: number;
  finalSalary: number;
}

/**
 * Investment portfolio result when choosing to invest instead of overpay.
 */
export interface InvestmentResult {
  portfolioValue: number;
  totalContributed: number;
  investmentGains: number;
}

/**
 * Recommendation type based on analysis.
 */
export type RecommendationType =
  | "dont-overpay" // Loan will be written off anyway
  | "invest-instead" // Investment returns beat interest saved
  | "overpay" // Overpaying saves more than investing would earn
  | "marginal"; // Within 10% - personal preference

/**
 * A single data point in the net worth time series for charting.
 */
export interface NetWorthDataPoint {
  month: number;
  year: number;
  /** Net worth with just baseline payments (no overpay, no invest) */
  baselineNetWorth: number;
  /** Net worth if overpaying (negative loan balance offset by no debt) */
  overpayNetWorth: number;
  /** Net worth if investing (portfolio value minus remaining loan) */
  investNetWorth: number;
}

/**
 * Complete result of the overpay analysis.
 */
export interface OverpayAnalysisResult {
  baseline: ScenarioResult;
  overpay: ScenarioResult;
  investment: InvestmentResult;
  recommendation: RecommendationType;
  recommendationReason: string;
  /** Net worth comparison over time for charting */
  netWorthTimeSeries: NetWorthDataPoint[];
  /** If overpay path beats invest path, the month where it happens */
  crossoverMonth: number | null;
  /** The month when the loan is written off (baseline scenario) */
  writeOffMonth: number | null;
  /** Payment difference: baseline.totalPaid - overpay.totalPaid
   * Positive = overpaying saves money (less interest paid)
   * Negative = overpaying costs more (e.g., paying off debt that would be written off) */
  paymentDifference: number;
  /** Extra amount paid when overpaying (overpayment contributions) */
  overpaymentContributions: number;
}
