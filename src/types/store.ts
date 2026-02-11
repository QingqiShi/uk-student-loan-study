import type { Loan } from "@/lib/loans/types";

/**
 * Core loan state values stored in the application state.
 */
export interface LoanState {
  /** Array of loans with plan type and balance */
  loans: Loan[];
  /** Current salary for annotation on charts */
  salary: number;

  // Overpay analysis fields
  /** Monthly overpayment amount in GBP (0-500) */
  monthlyOverpayment: number;
  /** Expected salary growth rate as decimal (e.g., 0.04 = 4%) */
  salaryGrowthRate: number;
  /** Expected threshold growth rate as decimal (e.g., 0.02 = 2%) */
  thresholdGrowthRate: number;
  /** One-off lump sum payment in GBP */
  lumpSumPayment: number;
}

/**
 * Store actions for updating loan state.
 */
export interface LoanActions {
  /** Update a single field in the store */
  updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) => void;
}

/**
 * Complete store interface with state values and actions.
 */
export type LoanStore = LoanState & LoanActions;
