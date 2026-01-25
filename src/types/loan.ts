/**
 * Configuration for loan simulation calculations.
 * All rates are stored as percentages (e.g., 6.5 for 6.5%).
 */
export interface LoanConfig {
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
  /** Date when loan repayment started (for write-off calculation) */
  repaymentDate: Date | null;
}

/**
 * Detailed result of a loan repayment simulation.
 * Contains all data needed by the three different chart components.
 */
export interface SimulationResult {
  /** Total amount repaid across all loans (GBP) */
  totalRepayment: number;
  /** Number of months until all loans are paid off or written off */
  monthsToPayoff: number;
  /** Remaining undergraduate balance after simulation (0 if paid off, >0 if written off) */
  underGradRemaining: number;
  /** Remaining postgraduate balance after simulation (0 if paid off, >0 if written off) */
  postGradRemaining: number;
  /** Total paid toward Plan 2 undergraduate loan (GBP) */
  plan2Payment: number;
  /** Total paid toward Plan 5 undergraduate loan (GBP) */
  plan5Payment: number;
  /** Total paid toward postgraduate loan (GBP) */
  postGradPayment: number;
}

/**
 * Function that maps a simulation result to a chart value.
 */
export type SimulationMapper = (result: SimulationResult) => number;
