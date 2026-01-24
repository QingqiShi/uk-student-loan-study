/**
 * Core loan state values stored in the application state.
 */
export interface LoanState {
  /** Whether the loan is under Plan 5 (post-2023) or Plan 2 */
  isPost2023: boolean;
  /** Undergraduate loan balance in GBP */
  underGradBalance: number;
  /** Postgraduate loan balance in GBP */
  postGradBalance: number;
  /** Plan 2 lower threshold interest rate (percentage) */
  plan2LTRate: number;
  /** Plan 2 upper threshold interest rate (percentage) */
  plan2UTRate: number;
  /** Plan 5 interest rate (percentage) */
  plan5Rate: number;
  /** Postgraduate loan interest rate (percentage) */
  postGradRate: number;
  /** Inflation rate for real value calculations (percentage) */
  inflationRate: number;
  /** Date when loan repayment started */
  repaymentDate: Date | null;
  /** Current salary for annotation on charts */
  salary: number;
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
