import { getAnnualInterestRate } from "./interest";
import { PLAN_CONFIGS, CURRENT_RATES } from "./plans";
import type {
  Loan,
  LoanResult,
  LoanMonthState,
  MonthSnapshot,
  SimulationConfig,
  SimulationTimeSeries,
} from "./types";

/**
 * Unified time-series simulation engine for UK student loans.
 *
 * This engine iterates month-by-month with all loans in lockstep, producing
 * a complete time-series from which totals can be derived.
 *
 * Key features:
 * - Correct multi-plan handling: each loan uses its own threshold
 * - Salary growth: applied annually (configurable)
 * - Overpayment: distributed proportionally across active loans
 * - Write-off tracking: each loan tracks its own write-off date
 */
export function simulate(config: SimulationConfig): SimulationTimeSeries {
  const {
    loans,
    annualSalary,
    monthsElapsed = 0,
    salaryGrowthRate = 0,
    monthlyOverpayment = 0,
    rpiRate,
    boeBaseRate,
  } = config;

  const rpi = rpiRate ?? CURRENT_RATES.rpi;
  const boe = boeBaseRate ?? CURRENT_RATES.boeBaseRate;

  // Filter to active loans (positive balance)
  const activeLoans = loans.filter((loan) => loan.balance > 0);
  if (activeLoans.length === 0) {
    return createEmptyResult();
  }

  // Initialize loan state tracking
  const loanStates = activeLoans.map((loan) => ({
    loan,
    balance: loan.balance,
    totalPaid: 0,
    lastActiveMonth: 0,
    writtenOff: false,
    writeOffMonth: getWriteOffMonth(loan.planType, monthsElapsed),
  }));

  const snapshots: MonthSnapshot[] = [];
  let currentSalary = annualSalary;
  let month = 0;

  // Continue while any loan is active
  while (hasActiveLoan(loanStates, month)) {
    // Apply annual salary growth (at the start of each year, after first year)
    if (month > 0 && month % 12 === 0) {
      currentSalary *= 1 + salaryGrowthRate;
    }

    const monthLoanStates: LoanMonthState[] = [];
    let totalMonthRepayment = 0;

    // Calculate base repayments for all active loans
    const baseRepayments: { index: number; repayment: number }[] = [];
    for (let i = 0; i < loanStates.length; i++) {
      const state = loanStates[i];
      if (state.balance <= 0 || isWrittenOff(state, month)) {
        continue;
      }
      const repayment = calculateBaseRepayment(
        state.loan.planType,
        currentSalary,
      );
      baseRepayments.push({ index: i, repayment });
    }

    // Distribute overpayment proportionally across active loans
    const totalActiveBalance = baseRepayments.reduce(
      (sum, br) => sum + loanStates[br.index].balance,
      0,
    );

    // Process each loan for this month
    for (let i = 0; i < loanStates.length; i++) {
      const state = loanStates[i];
      const openingBalance = state.balance;

      // Skip inactive loans
      if (openingBalance <= 0) {
        continue;
      }

      // Check if written off this month
      if (isWrittenOff(state, month)) {
        if (!state.writtenOff) {
          state.writtenOff = true;
          monthLoanStates.push({
            planType: state.loan.planType,
            openingBalance,
            interestApplied: 0,
            repayment: 0,
            closingBalance: openingBalance,
            writtenOff: true,
          });
        }
        continue;
      }

      // 1. Apply interest
      const annualInterest = getAnnualInterestRate(
        state.loan.planType,
        currentSalary,
        rpi,
        boe,
      );
      const monthlyInterestRate = annualInterest / 100 / 12;
      const interestApplied = state.balance * monthlyInterestRate;
      const balanceWithInterest = state.balance + interestApplied;

      // 2. Calculate repayment (base + overpay share)
      const baseRepaymentEntry = baseRepayments.find((br) => br.index === i);
      const baseRepayment = baseRepaymentEntry?.repayment ?? 0;

      // Distribute overpayment proportionally by balance
      const overpayShare =
        totalActiveBalance > 0
          ? (state.balance / totalActiveBalance) * monthlyOverpayment
          : 0;

      // Total payment capped at balance
      const totalRepayment = Math.min(
        baseRepayment + overpayShare,
        balanceWithInterest,
      );

      // 3. Update balance
      state.balance = balanceWithInterest - totalRepayment;
      state.totalPaid += totalRepayment;
      state.lastActiveMonth = month;

      totalMonthRepayment += totalRepayment;

      monthLoanStates.push({
        planType: state.loan.planType,
        openingBalance,
        interestApplied,
        repayment: totalRepayment,
        closingBalance: state.balance,
        writtenOff: false,
      });
    }

    snapshots.push({
      month,
      salary: currentSalary,
      loans: monthLoanStates,
      totalRepayment: totalMonthRepayment,
    });

    month++;

    // Safety limit to prevent infinite loops (100 years)
    if (month >= 1200) break;
  }

  // Mark any loans with remaining balance as written off
  for (const state of loanStates) {
    if (state.balance > 0 && !state.writtenOff) {
      state.writtenOff = true;
    }
  }

  return {
    snapshots,
    summary: deriveSummary(loanStates, snapshots),
  };
}

interface LoanState {
  loan: Loan;
  balance: number;
  totalPaid: number;
  lastActiveMonth: number;
  writtenOff: boolean;
  writeOffMonth: number;
}

/**
 * Checks if any loan is still active (has balance and not written off).
 */
function hasActiveLoan(loanStates: LoanState[], month: number): boolean {
  return loanStates.some(
    (state) => state.balance > 0 && !isWrittenOff(state, month),
  );
}

/**
 * Checks if a loan has been written off by the given month.
 */
function isWrittenOff(state: LoanState, month: number): boolean {
  return month >= state.writeOffMonth;
}

/**
 * Calculates the remaining months until write-off.
 *
 * @param planType - The loan plan type
 * @param monthsElapsed - Months already elapsed since repayment started
 * @returns Remaining months until write-off (0 if already past write-off)
 */
function getWriteOffMonth(
  planType: Loan["planType"],
  monthsElapsed: number,
): number {
  const writeOffYears = PLAN_CONFIGS[planType].writeOffYears;
  const totalWriteOffMonths = writeOffYears * 12;
  return Math.max(0, totalWriteOffMonths - monthsElapsed);
}

/**
 * Calculates the base monthly repayment for a loan based on salary.
 * Each plan type uses its own threshold.
 */
function calculateBaseRepayment(
  planType: Loan["planType"],
  annualSalary: number,
): number {
  const config = PLAN_CONFIGS[planType];
  const monthlySalary = annualSalary / 12;
  return Math.max(
    0,
    (monthlySalary - config.monthlyThreshold) * config.repaymentRate,
  );
}

/**
 * Derives summary statistics from the simulation.
 */
function deriveSummary(
  loanStates: LoanState[],
  snapshots: MonthSnapshot[],
): SimulationTimeSeries["summary"] {
  const perLoan: LoanResult[] = loanStates.map((state) => ({
    planType: state.loan.planType,
    totalPaid: state.totalPaid,
    monthsToPayoff: state.lastActiveMonth + 1,
    remainingBalance: Math.max(0, state.balance),
    writtenOff: state.writtenOff,
  }));

  const totalPaid = loanStates.reduce((sum, state) => sum + state.totalPaid, 0);
  const totalWrittenOff = loanStates.reduce(
    (sum, state) => sum + Math.max(0, state.balance),
    0,
  );
  const monthsToPayoff =
    snapshots.length > 0
      ? Math.max(...loanStates.map((s) => s.lastActiveMonth)) + 1
      : 0;

  return {
    totalPaid,
    totalWrittenOff,
    monthsToPayoff,
    perLoan,
  };
}

/**
 * Creates an empty result for when there are no active loans.
 */
function createEmptyResult(): SimulationTimeSeries {
  return {
    snapshots: [],
    summary: {
      totalPaid: 0,
      totalWrittenOff: 0,
      monthsToPayoff: 0,
      perLoan: [],
    },
  };
}
