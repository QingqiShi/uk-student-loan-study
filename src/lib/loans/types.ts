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
