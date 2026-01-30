import dayjs from "dayjs";
import { getAnnualInterestRate } from "./interest";
import { PLAN_CONFIGS, CURRENT_RATES } from "./plans";
import type {
  Loan,
  LoanResult,
  SimulationInput,
  SimulationResult,
} from "./types";

/**
 * Simulates repayment of multiple loans over time.
 *
 * @param input - Simulation parameters including loans, salary, and dates
 * @returns Combined simulation results for all loans
 */
export function simulateLoans(input: SimulationInput): SimulationResult {
  const { loans, annualSalary, repaymentStartDate, rpiRate, boeBaseRate } =
    input;
  const rpi = rpiRate ?? CURRENT_RATES.rpi;
  const boe = boeBaseRate ?? CURRENT_RATES.boeBaseRate;

  const loanResults = loans
    .filter((loan) => loan.balance > 0)
    .map((loan) =>
      simulateSingleLoan(loan, annualSalary, repaymentStartDate, rpi, boe),
    );

  return {
    loanResults,
    totalRepayment: loanResults.reduce((sum, r) => sum + r.totalPaid, 0),
    totalMonths:
      loanResults.length > 0
        ? Math.max(...loanResults.map((r) => r.monthsToPayoff))
        : 0,
  };
}

/**
 * Simulates repayment of a single loan.
 */
function simulateSingleLoan(
  loan: Loan,
  annualSalary: number,
  startDate: Date,
  rpi: number,
  boe: number,
): LoanResult {
  const config = PLAN_CONFIGS[loan.planType];
  const monthlySalary = annualSalary / 12;
  const monthlyRepayment = Math.max(
    0,
    (monthlySalary - config.monthlyThreshold) * config.repaymentRate,
  );
  const annualInterest = getAnnualInterestRate(
    loan.planType,
    annualSalary,
    rpi,
    boe,
  );
  const monthlyInterest = annualInterest / 100 / 12;
  const maxMonths = getRemainingMonths(startDate, config.writeOffYears);

  let balance = loan.balance;
  let totalPaid = 0;
  let months = 0;

  while (months < maxMonths && balance > 0) {
    balance *= 1 + monthlyInterest;
    const payment = Math.min(monthlyRepayment, balance);
    balance -= payment;
    totalPaid += payment;
    months++;
  }

  return {
    planType: loan.planType,
    totalPaid,
    monthsToPayoff: months,
    remainingBalance: Math.max(0, balance),
    writtenOff: balance > 0,
  };
}

/**
 * Calculates remaining months until write-off from a start date.
 */
function getRemainingMonths(startDate: Date, writeOffYears: number): number {
  const writeOffDate = dayjs(startDate).add(writeOffYears, "years");
  return Math.max(0, writeOffDate.diff(dayjs(), "months"));
}
