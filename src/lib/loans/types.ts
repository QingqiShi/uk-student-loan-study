import type { PLAN_CONFIGS } from "./plans";

/**
 * All supported UK student loan plan types.
 */
export type PlanType = keyof typeof PLAN_CONFIGS;

/**
 * Undergraduate plan types (excludes POSTGRADUATE).
 */
export type UndergraduatePlanType = Exclude<PlanType, "POSTGRADUATE">;

/**
 * A single loan with its plan type and balance.
 */
export interface Loan {
  planType: PlanType;
  balance: number;
}

/**
 * Input parameters for running a loan simulation.
 */
export interface SimulationInput {
  loans: Loan[];
  annualSalary: number;
  repaymentStartDate: Date;
  rpiRate?: number;
  boeBaseRate?: number;
}

/**
 * Result of simulating a single loan.
 */
export interface LoanResult {
  planType: PlanType;
  totalPaid: number;
  monthsToPayoff: number;
  remainingBalance: number;
  writtenOff: boolean;
}

/**
 * Combined result of simulating all loans.
 */
export interface SimulationResult {
  loanResults: LoanResult[];
  totalRepayment: number;
  totalMonths: number;
}

/**
 * Function that extracts a chart value from a simulation result.
 */
export type SimulationMapper = (result: SimulationResult) => number;

// =============================================================================
// TIME-SERIES SIMULATION ENGINE TYPES
// =============================================================================

/**
 * Single month snapshot for one loan in the simulation.
 */
export interface LoanMonthState {
  planType: PlanType;
  openingBalance: number;
  interestApplied: number;
  repayment: number;
  closingBalance: number;
  writtenOff: boolean;
}

/**
 * Full simulation snapshot for one month.
 */
export interface MonthSnapshot {
  /** 0-indexed month from start */
  month: number;
  /** Current annual salary (with growth applied) */
  salary: number;
  /** State of each loan this month */
  loans: LoanMonthState[];
  /** Sum of all loan repayments this month */
  totalRepayment: number;
}

/**
 * Enhanced input for the unified simulation engine.
 */
export interface SimulationConfig {
  loans: Loan[];
  annualSalary: number;
  /** Months already elapsed since repayment started (0 = simulate from start) */
  monthsElapsed?: number;
  /** Annual salary growth rate (default 0) */
  salaryGrowthRate?: number;
  /** Extra payment per month distributed across loans (default 0) */
  monthlyOverpayment?: number;
  rpiRate?: number;
  boeBaseRate?: number;
}

/**
 * Complete simulation output with time-series data.
 */
export interface SimulationTimeSeries {
  snapshots: MonthSnapshot[];
  summary: {
    totalPaid: number;
    totalWrittenOff: number;
    monthsToPayoff: number;
    /** Per-loan results for backward compatibility */
    perLoan: LoanResult[];
  };
}
