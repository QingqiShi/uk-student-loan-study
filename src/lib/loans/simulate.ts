import { monthsElapsedSince } from "@/lib/dateUtils";
import { simulate } from "./engine";
import type { SimulationInput, SimulationResult } from "./types";

/**
 * Simulates repayment of multiple loans over time.
 *
 * This is a backward-compatible wrapper around the unified simulation engine.
 * Calculates elapsed months from repaymentStartDate to simulate remaining time.
 *
 * @param input - Simulation parameters including loans, salary, and dates
 * @returns Combined simulation results for all loans
 */
export function simulateLoans(input: SimulationInput): SimulationResult {
  const { loans, annualSalary, repaymentStartDate, rpiRate, boeBaseRate } =
    input;

  // Calculate months elapsed since repayment started
  const monthsElapsed = Math.max(0, monthsElapsedSince(repaymentStartDate));

  const result = simulate({
    loans,
    annualSalary,
    monthsElapsed,
    rpiRate,
    boeBaseRate,
    // Legacy API doesn't support salary growth or overpayment
    salaryGrowthRate: 0,
    monthlyOverpayment: 0,
  });

  return {
    loanResults: result.summary.perLoan,
    totalRepayment: result.summary.totalPaid,
    totalMonths: result.summary.monthsToPayoff,
  };
}
