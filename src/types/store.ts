import type { Loan, PlanType } from "@/lib/loans/types";

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
  /** RPI rate as percentage (e.g., 3.2 = 3.2%), matching CURRENT_RATES format */
  rpiRate: number;
  /** BOE base rate as percentage (e.g., 3.75 = 3.75%), matching CURRENT_RATES format */
  boeBaseRate: number;
  /** One-off lump sum payment in GBP */
  lumpSumPayment: number;

  /** Whether to display monetary values adjusted for inflation (present value) */
  showPresentValue: boolean;
  /** Annual discount rate as decimal for PV calculations (e.g., 0.02 = 2%) */
  discountRate: number;

  /** Plan types discovered via the standalone /which-plan quiz, pending config panel open */
  pendingQuizPlanTypes: PlanType[] | null;
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
