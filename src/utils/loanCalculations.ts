import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "@/constants";
import { simulate } from "@/lib/loans/engine";
import { CURRENT_RATES } from "@/lib/loans/plans";
import type { Loan } from "@/lib/loans/types";
import type { DataPoint, BalanceDataPoint } from "@/types/chart";
import { pvTotal } from "@/utils/presentValue";

/**
 * Generates a total-repayment data series across the salary range.
 *
 * Iterates through salary range (MIN_SALARY to MAX_SALARY by SALARY_STEP)
 * and records the total amount paid for each salary level.
 *
 * Uses monthsElapsed: 0 to show total duration from repayment start
 * (e.g., 30 years for Plan 2 write-off) rather than remaining time.
 *
 * @param loans - Array of loans to simulate
 * @param rpiRate - Optional RPI rate override
 * @param salaryGrowthRate - Annual salary growth rate (default 0)
 * @param thresholdGrowthRate - Annual threshold growth rate (default 0)
 * @returns Array of [salary, value] data points
 */
export function generateSalaryDataSeries(
  loans: Loan[],
  rpiRate: number = CURRENT_RATES.rpi,
  salaryGrowthRate = 0,
  thresholdGrowthRate = 0,
  boeBaseRate: number = CURRENT_RATES.boeBaseRate,
  plan2ThresholdSchedule?: number[],
): DataPoint[] {
  const data: DataPoint[] = [];

  for (let salary = MIN_SALARY; salary <= MAX_SALARY; salary += SALARY_STEP) {
    const timeSeries = simulate({
      loans,
      annualSalary: salary,
      monthsElapsed: 0, // Simulate from repayment start
      rpiRate,
      salaryGrowthRate,
      thresholdGrowthRate,
      boeBaseRate,
      plan2ThresholdSchedule,
    });

    data.push({ salary, value: timeSeries.summary.totalPaid });
  }

  return data;
}

/**
 * Generates a PV-adjusted data series for salary-based charts.
 *
 * Similar to generateSalaryDataSeries but discounts each monthly repayment
 * to present value before summing.
 *
 * @param loans - Array of loans to simulate
 * @param discountRate - Annual discount rate for PV calculation
 * @param rpiRate - Optional RPI rate override
 * @param salaryGrowthRate - Annual salary growth rate (default 0)
 * @param thresholdGrowthRate - Annual threshold growth rate (default 0)
 * @param boeBaseRate - BOE base rate override
 * @returns Array of [salary, value] data points with PV-adjusted values
 */
export function generateSalaryDataSeriesPV(
  loans: Loan[],
  discountRate: number,
  rpiRate: number = CURRENT_RATES.rpi,
  salaryGrowthRate = 0,
  thresholdGrowthRate = 0,
  boeBaseRate: number = CURRENT_RATES.boeBaseRate,
  plan2ThresholdSchedule?: number[],
): DataPoint[] {
  const data: DataPoint[] = [];

  for (let salary = MIN_SALARY; salary <= MAX_SALARY; salary += SALARY_STEP) {
    const timeSeries = simulate({
      loans,
      annualSalary: salary,
      monthsElapsed: 0,
      rpiRate,
      salaryGrowthRate,
      thresholdGrowthRate,
      boeBaseRate,
      plan2ThresholdSchedule,
    });

    const total = pvTotal(
      timeSeries.snapshots.map((s) => ({
        month: s.month,
        amount: s.totalRepayment,
      })),
      discountRate,
    );

    data.push({ salary, value: total });
  }

  return data;
}

/**
 * Result of generating balance time series data.
 */
export interface BalanceTimeSeriesResult {
  data: BalanceDataPoint[];
  writeOffMonth: number | null;
}

/**
 * Generates balance over time data for a specific salary.
 *
 * Runs a single simulation and extracts the total closing balance across
 * all loans at each point in time, sampled annually for chart clarity.
 *
 * @param loans - Array of loans to simulate
 * @param annualSalary - The user's current annual salary
 * @param rpiRate - Optional RPI rate override
 * @param salaryGrowthRate - Annual salary growth rate (default 0)
 * @param thresholdGrowthRate - Annual threshold growth rate (default 0)
 * @returns Balance data points and write-off month if applicable
 */
export function generateBalanceTimeSeries(
  loans: Loan[],
  annualSalary: number,
  rpiRate: number = CURRENT_RATES.rpi,
  salaryGrowthRate = 0,
  thresholdGrowthRate = 0,
  boeBaseRate: number = CURRENT_RATES.boeBaseRate,
  plan2ThresholdSchedule?: number[],
): BalanceTimeSeriesResult {
  if (loans.length === 0 || loans.every((loan) => loan.balance <= 0)) {
    return { data: [], writeOffMonth: null };
  }

  const timeSeries = simulate({
    loans,
    annualSalary,
    monthsElapsed: 0,
    rpiRate,
    salaryGrowthRate,
    thresholdGrowthRate,
    boeBaseRate,
    plan2ThresholdSchedule,
  });

  const data: BalanceDataPoint[] = [];

  // Add initial balance at month 0
  const initialBalance = loans.reduce((sum, loan) => sum + loan.balance, 0);
  data.push({ month: 0, balance: initialBalance });

  // Sample at yearly intervals
  for (const snapshot of timeSeries.snapshots) {
    // Sample annually (every 12 months)
    if ((snapshot.month + 1) % 12 === 0) {
      const totalBalance = snapshot.loans.reduce(
        (sum, loan) => sum + loan.closingBalance,
        0,
      );
      data.push({ month: snapshot.month + 1, balance: totalBalance });
    }
  }

  // If the last snapshot isn't on a year boundary, add the final point
  if (timeSeries.snapshots.length > 0) {
    const lastSnapshot = timeSeries.snapshots[timeSeries.snapshots.length - 1];
    if ((lastSnapshot.month + 1) % 12 !== 0) {
      const totalBalance = lastSnapshot.loans.reduce(
        (sum, loan) => sum + loan.closingBalance,
        0,
      );
      data.push({ month: lastSnapshot.month + 1, balance: totalBalance });
    }
  }

  // Detect write-off from simulation summary
  const hasWriteOff = timeSeries.summary.perLoan.some((l) => l.writtenOff);
  const writeOffMonth = hasWriteOff ? timeSeries.summary.monthsToPayoff : null;

  return { data, writeOffMonth };
}
