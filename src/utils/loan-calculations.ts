import type {
  SimulationResult,
  Loan,
  SimulationMapper,
} from "@/lib/loans/types";
import type { DataPoint } from "@/types/chart";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "@/constants";
import { simulate } from "@/lib/loans/engine";
import { CURRENT_RATES } from "@/lib/loans/plans";

/**
 * Generates a data series for salary-based charts.
 *
 * Iterates through salary range (MIN_SALARY to MAX_SALARY by SALARY_STEP)
 * and applies the mapper function to each simulation result.
 *
 * Uses monthsElapsed: 0 to show total duration from repayment start
 * (e.g., 30 years for Plan 2 write-off) rather than remaining time.
 *
 * @param loans - Array of loans to simulate
 * @param mapper - Function to extract desired value from simulation result
 * @param rpiRate - Optional RPI rate override
 * @returns Array of [salary, value] data points
 */
export function generateSalaryDataSeries(
  loans: Loan[],
  mapper: SimulationMapper,
  rpiRate = CURRENT_RATES.rpi,
): DataPoint[] {
  const data: DataPoint[] = [];

  for (let salary = MIN_SALARY; salary <= MAX_SALARY; salary += SALARY_STEP) {
    const timeSeries = simulate({
      loans,
      annualSalary: salary,
      monthsElapsed: 0, // Simulate from repayment start
      rpiRate,
    });

    // Convert to SimulationResult for mapper compatibility
    const result: SimulationResult = {
      loanResults: timeSeries.summary.perLoan,
      totalRepayment: timeSeries.summary.totalPaid,
      totalMonths: timeSeries.summary.monthsToPayoff,
    };

    data.push({ salary, value: mapper(result) });
  }

  return data;
}

/**
 * Calculates the annualized interest rate (effective interest paid).
 *
 * This is the rate that would produce the same total repayment
 * if compounded annually over the repayment period.
 *
 * Formula: rate = (totalPaid / principal)^(1/years) - 1
 *
 * @param result - Simulation result
 * @param totalPrincipal - Total original loan amount
 * @returns Annualized interest rate as a decimal (e.g., 0.065 for 6.5%)
 */
export function calculateAnnualizedRate(
  result: SimulationResult,
  totalPrincipal: number,
): number {
  if (totalPrincipal === 0 || result.totalMonths === 0) {
    return 0;
  }

  const roi = result.totalRepayment / totalPrincipal;
  const years = result.totalMonths / 12;

  return Math.pow(roi, 1 / years) - 1;
}

// Re-export for convenience
export { simulateLoans } from "@/lib/loans/simulate";
export type { SimulationResult, Loan } from "@/lib/loans/types";
