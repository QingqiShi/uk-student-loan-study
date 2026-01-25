import dayjs from 'dayjs';
import {
  PLAN2_LT,
  PLAN2_UT,
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
  PLAN2_MONTHLY_THRESHOLD,
  PLAN2_MONTHLY_REPAY_RATE,
  PLAN5_MONTHLY_THRESHOLD,
  PLAN5_MONTHLY_REPAY_RATE,
  POST_GRAD_MONTHLY_THRESHOLD,
  POST_GRAD_MONTHLY_REPAY_RATE,
  PLAN2_WRITE_OFF,
  PLAN5_WRITE_OFF,
  POST_GRAD_WRITE_OFF,
} from '../constants';
import type {
  LoanConfig,
  SimulationResult,
  SimulationMapper,
} from '../types/loan';
import type { DataPoint } from '../types/chart';

/**
 * Calculates the Plan 2 interest rate based on salary using linear interpolation.
 *
 * - Below PLAN2_LT (£27,295): Returns the lower rate
 * - Above PLAN2_UT (£49,130): Returns the upper rate
 * - Between thresholds: Linear interpolation
 *
 * @param salary - Annual salary in GBP
 * @param lowerRate - Interest rate at lower threshold (percentage, e.g., 6.5)
 * @param upperRate - Interest rate at upper threshold (percentage, e.g., 6.5)
 * @returns Interest rate as a percentage
 */
export function getPlan2Rate(
  salary: number,
  lowerRate: number,
  upperRate: number
): number {
  if (salary <= PLAN2_LT) {
    return lowerRate;
  }
  if (salary > PLAN2_UT) {
    return upperRate;
  }
  return (
    ((salary - PLAN2_LT) / (PLAN2_UT - PLAN2_LT)) * (upperRate - lowerRate) +
    lowerRate
  );
}

/**
 * Calculates the monthly repayment amount based on salary.
 *
 * Repayment is calculated as: (monthlySalary - threshold) * rate
 * Returns 0 if salary is below threshold.
 *
 * @param monthlySalary - Monthly salary in GBP (annual / 12)
 * @param threshold - Monthly salary threshold below which no repayment is due
 * @param rate - Repayment rate as a decimal (e.g., 0.09 for 9%)
 * @returns Monthly repayment amount in GBP
 */
export function calculateMonthlyRepayment(
  monthlySalary: number,
  threshold: number,
  rate: number
): number {
  if (monthlySalary <= threshold) {
    return 0;
  }
  return (monthlySalary - threshold) * rate;
}

/**
 * Simulates loan repayment over time for a given salary.
 *
 * Handles both Plan 2 (pre-2023) and Plan 5 (post-2023) undergraduate loans,
 * as well as postgraduate loans which run concurrently.
 *
 * @param salary - Annual salary in GBP
 * @param config - Loan configuration parameters
 * @returns Detailed simulation results
 */
export function simulateLoanRepayment(
  salary: number,
  config: LoanConfig
): SimulationResult {
  const {
    isPost2023,
    underGradBalance,
    postGradBalance,
    plan2LTRate,
    plan2UTRate,
    plan5Rate,
    postGradRate,
    repaymentDate,
  } = config;

  const monthlySalary = salary / 12;

  // Calculate monthly repayment amounts
  const plan2Repayment = calculateMonthlyRepayment(
    monthlySalary,
    PLAN2_MONTHLY_THRESHOLD,
    PLAN2_MONTHLY_REPAY_RATE
  );
  const plan5Repayment = calculateMonthlyRepayment(
    monthlySalary,
    PLAN5_MONTHLY_THRESHOLD,
    PLAN5_MONTHLY_REPAY_RATE
  );
  const postGradRepayment = calculateMonthlyRepayment(
    monthlySalary,
    POST_GRAD_MONTHLY_THRESHOLD,
    POST_GRAD_MONTHLY_REPAY_RATE
  );

  // Calculate monthly interest rates (convert from percentage to monthly decimal)
  const monthlyPlan2Rate =
    getPlan2Rate(salary, plan2LTRate, plan2UTRate) / 100 / 12;
  const monthlyPlan5Rate = plan5Rate / 100 / 12;
  const monthlyPostGradRate = postGradRate / 100 / 12;

  // Calculate write-off dates and remaining months
  const now = dayjs();
  const plan2EndDate = dayjs(repaymentDate).add(PLAN2_WRITE_OFF, 'years');
  const plan5EndDate = dayjs(repaymentDate).add(PLAN5_WRITE_OFF, 'years');
  const postGradEndDate = dayjs(repaymentDate).add(POST_GRAD_WRITE_OFF, 'years');
  const plan2RemainingMonths = plan2EndDate.diff(now, 'months');
  const plan5RemainingMonths = plan5EndDate.diff(now, 'months');
  const postGradRemainingMonths = postGradEndDate.diff(now, 'months');

  // Initialize tracking variables
  let underGradRemaining = underGradBalance;
  let postGradRemaining = postGradBalance;
  let totalRepayment = 0;
  let plan2Payment = 0;
  let plan5Payment = 0;
  let postGradPayment = 0;
  let months = 0;

  // Simulation loop
  const underGradMaxMonths = isPost2023
    ? plan5RemainingMonths
    : plan2RemainingMonths;

  for (
    let month = 0;
    (month <= underGradMaxMonths || month <= postGradRemainingMonths) &&
    (underGradRemaining > 0 || postGradRemaining > 0);
    month++
  ) {
    // Process undergraduate loan (Plan 2 or Plan 5)
    if (!isPost2023 && month < plan2RemainingMonths && underGradRemaining > 0) {
      underGradRemaining += underGradRemaining * monthlyPlan2Rate;
      const payment = Math.min(plan2Repayment, underGradRemaining);
      underGradRemaining -= payment;
      plan2Payment += payment;
      totalRepayment += payment;
    } else if (
      isPost2023 &&
      month < plan5RemainingMonths &&
      underGradRemaining > 0
    ) {
      underGradRemaining += underGradRemaining * monthlyPlan5Rate;
      const payment = Math.min(plan5Repayment, underGradRemaining);
      underGradRemaining -= payment;
      plan5Payment += payment;
      totalRepayment += payment;
    }

    // Process postgraduate loan
    if (month < postGradRemainingMonths && postGradRemaining > 0) {
      postGradRemaining += postGradRemaining * monthlyPostGradRate;
      const payment = Math.min(postGradRepayment, postGradRemaining);
      postGradRemaining -= payment;
      postGradPayment += payment;
      totalRepayment += payment;
    }

    months = month;
  }

  return {
    totalRepayment,
    monthsToPayoff: months + 1,
    underGradRemaining: Math.max(0, underGradRemaining),
    postGradRemaining: Math.max(0, postGradRemaining),
    plan2Payment,
    plan5Payment,
    postGradPayment,
  };
}

/**
 * Generates a data series for salary-based charts.
 *
 * Iterates through salary range (MIN_SALARY to MAX_SALARY by SALARY_STEP)
 * and applies the mapper function to each simulation result.
 *
 * @param config - Loan configuration parameters
 * @param mapper - Function to extract desired value from simulation result
 * @returns Array of [salary, value] data points
 */
export function generateSalaryDataSeries(
  config: LoanConfig,
  mapper: SimulationMapper
): DataPoint[] {
  const data: DataPoint[] = [];

  for (let salary = MIN_SALARY; salary <= MAX_SALARY; salary += SALARY_STEP) {
    const result = simulateLoanRepayment(salary, config);
    data.push([salary, mapper(result)]);
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
  totalPrincipal: number
): number {
  if (totalPrincipal === 0 || result.monthsToPayoff === 0) {
    return 0;
  }

  const totalPaid =
    result.plan2Payment + result.plan5Payment + result.postGradPayment;
  const roi = totalPaid / totalPrincipal;
  const years = result.monthsToPayoff / 12;

  return Math.pow(roi, 1 / years) - 1;
}
