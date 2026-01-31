import type { UndergraduatePlanType } from "@/lib/loans/types";

/**
 * Salary growth rate presets for overpay analysis.
 */
export type SalaryGrowthRate = "conservative" | "moderate" | "aggressive";

/**
 * Core loan state values stored in the application state.
 */
export interface LoanState {
  /** Undergraduate loan plan type */
  underGradPlanType: UndergraduatePlanType;
  /** Undergraduate loan balance in GBP */
  underGradBalance: number;
  /** Postgraduate loan balance in GBP */
  postGradBalance: number;
  /** Date when loan repayment started */
  repaymentDate: Date | null;
  /** Current salary for annotation on charts */
  salary: number;

  // Overpay analysis fields
  /** Monthly overpayment amount in GBP (0-500) */
  monthlyOverpayment: number;
  /** Expected salary growth rate preset */
  salaryGrowthRate: SalaryGrowthRate;
  /** Alternative investment return rate (0-10%, stored as decimal e.g. 0.05) */
  alternativeSavingsRate: number;
}

/**
 * Store actions for updating loan state.
 */
export interface LoanActions {
  /** Update a single field in the store */
  updateField: <K extends keyof LoanState>(key: K, value: LoanState[K]) => void;
  /** Reset store to initial state */
  reset: () => void;
}

/**
 * Complete store interface with state values and actions.
 */
export type LoanStore = LoanState & LoanActions;
