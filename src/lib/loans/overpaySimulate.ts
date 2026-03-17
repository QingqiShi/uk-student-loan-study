import { monthsElapsedSince } from "@/lib/dateUtils";
import { toPresent } from "@/utils/presentValue";
import { simulate } from "./engine";
import type {
  OverpayInput,
  OverpayAnalysisResult,
  ScenarioResult,
  BalanceDataPoint,
  RecommendationType,
} from "./overpayTypes";
import { CURRENT_RATES } from "./plans";
import type { Loan, SimulationTimeSeries } from "./types";

/**
 * Applies a lump sum payment by reducing initial loan balances proportionally.
 */
function applyLumpSum(loans: Loan[], lumpSumPayment: number): Loan[] {
  if (lumpSumPayment <= 0) return loans;

  const totalBalance = loans.reduce((sum, l) => sum + l.balance, 0);
  if (totalBalance === 0) return loans;

  return loans.map((loan) => ({
    ...loan,
    balance: Math.max(
      0,
      loan.balance - (loan.balance / totalBalance) * lumpSumPayment,
    ),
  }));
}

/**
 * Simulates overpayment scenarios to help users decide whether to overpay.
 *
 * Runs two simulations:
 * 1. Baseline: Normal repayments with no overpayment
 * 2. Overpay: Normal repayments + monthly overpayment
 *
 * Uses the unified simulation engine which correctly handles multiple loan types
 * with independent thresholds.
 */
export function simulateOverpayScenarios(
  input: OverpayInput,
  discountRate?: number,
): OverpayAnalysisResult {
  const {
    loans,
    startingSalary,
    repaymentStartDate,
    monthlyOverpayment,
    salaryGrowthRate,
    thresholdGrowthRate,
    plan2ThresholdSchedule,
    rpiRate,
    boeBaseRate,
    lumpSumPayment = 0,
  } = input;

  const rpi = rpiRate ?? CURRENT_RATES.rpi;
  const boe = boeBaseRate ?? CURRENT_RATES.boeBaseRate;

  // Check for empty scenarios
  const validLoans = loans.filter((l) => l.balance > 0);
  if (validLoans.length === 0) {
    return createEmptyResult();
  }

  // Calculate total balance before lump sum to cap the actual amount used
  const totalBalance = validLoans.reduce((sum, l) => sum + l.balance, 0);
  const actualLumpSumUsed = Math.min(lumpSumPayment, totalBalance);

  // Apply lump sum to overpay scenario only (comparing with vs without lump sum)
  const loansAfterLumpSum = applyLumpSum(validLoans, actualLumpSumUsed).filter(
    (l) => l.balance > 0,
  );
  const lumpSumPaidOffEntireLoan = loansAfterLumpSum.length === 0;

  // Calculate months elapsed since repayment started
  const monthsElapsed = Math.max(0, monthsElapsedSince(repaymentStartDate));

  // Simulate baseline (no lump sum, no monthly overpayment)
  const baselineSimulation = simulate({
    loans: validLoans,
    annualSalary: startingSalary,
    monthsElapsed,
    salaryGrowthRate,
    monthlyOverpayment: 0,
    thresholdGrowthRate,
    plan2ThresholdSchedule,
    rpiRate: rpi,
    boeBaseRate: boe,
  });

  // Simulate with overpayment (lump sum applied + monthly overpayment)
  const overpaySimulation =
    loansAfterLumpSum.length === 0
      ? baselineSimulation // Lump sum paid off entire loan
      : simulate({
          loans: loansAfterLumpSum,
          annualSalary: startingSalary,
          monthsElapsed,
          salaryGrowthRate,
          monthlyOverpayment,
          thresholdGrowthRate,
          plan2ThresholdSchedule,
          rpiRate: rpi,
          boeBaseRate: boe,
        });

  // Convert simulations to scenario results
  const baseline = extractScenarioResult(baselineSimulation);
  const overpayRaw = extractScenarioResult(overpaySimulation);

  // Add lump sum to overpay total (it's paid upfront, not tracked by simulation)
  // Use actualLumpSumUsed to avoid overstating cost when lump sum exceeds balance
  const overpay: ScenarioResult = lumpSumPaidOffEntireLoan
    ? {
        totalPaid: actualLumpSumUsed,
        monthsToPayoff: 0,
        writtenOff: false,
        amountWrittenOff: 0,
        finalSalary: startingSalary,
      }
    : {
        ...overpayRaw,
        totalPaid: overpayRaw.totalPaid + actualLumpSumUsed,
      };

  // Generate balance time series for chart
  const balanceTimeSeries = generateBalanceSeries(
    baselineSimulation,
    overpaySimulation,
    lumpSumPaidOffEntireLoan,
  );

  // Calculate derived values
  const paymentDifference = baseline.totalPaid - overpay.totalPaid;
  const overpaymentContributions =
    overpay.monthsToPayoff * monthlyOverpayment + actualLumpSumUsed;
  const monthsSaved = baseline.monthsToPayoff - overpay.monthsToPayoff;

  // Write-off month for baseline
  const writeOffMonth = baseline.writtenOff ? baseline.monthsToPayoff : null;

  // Determine recommendation
  const hasOverpayment = monthlyOverpayment > 0 || lumpSumPayment > 0;
  const { recommendation, reason } = hasOverpayment
    ? determineRecommendation(
        baseline,
        overpay,
        paymentDifference,
        monthlyOverpayment,
        lumpSumPayment,
      )
    : {
        recommendation: "idle" as RecommendationType,
        reason:
          "Enter a lump sum or monthly amount to see if overpaying saves you money.",
      };

  const result: OverpayAnalysisResult = {
    baseline,
    overpay,
    recommendation,
    recommendationReason: reason,
    balanceTimeSeries,
    writeOffMonth,
    paymentDifference,
    overpaymentContributions,
    monthsSaved,
  };

  if (discountRate !== undefined && discountRate > 0) {
    // PV baseline total: sum of discounted monthly repayments
    let pvBaselineTotalPaid = 0;
    for (const snapshot of baselineSimulation.snapshots) {
      pvBaselineTotalPaid += toPresent(
        snapshot.totalRepayment,
        discountRate,
        snapshot.month,
      );
    }

    // PV overpay total: sum of discounted monthly repayments + lump sum at month 0
    // Lump sum at month 0 is not discounted (toPresent returns nominal for month 0)
    let pvOverpayTotalPaid = actualLumpSumUsed;
    if (!lumpSumPaidOffEntireLoan) {
      for (const snapshot of overpaySimulation.snapshots) {
        pvOverpayTotalPaid += toPresent(
          snapshot.totalRepayment,
          discountRate,
          snapshot.month,
        );
      }
    }

    // Discount balance time series
    result.balanceTimeSeries = balanceTimeSeries.map((point) => ({
      ...point,
      baselineBalance: toPresent(
        point.baselineBalance,
        discountRate,
        point.month,
      ),
      overpayBalance: toPresent(
        point.overpayBalance,
        discountRate,
        point.month,
      ),
    }));

    result.pvBaseline = { totalPaid: pvBaselineTotalPaid };
    result.pvOverpay = { totalPaid: pvOverpayTotalPaid };
    result.pvPaymentDifference = pvBaselineTotalPaid - pvOverpayTotalPaid;
  }

  return result;
}

/**
 * Extracts ScenarioResult from SimulationTimeSeries.
 */
function extractScenarioResult(
  simulation: SimulationTimeSeries,
): ScenarioResult {
  const { summary, snapshots } = simulation;

  // Get final salary from last snapshot
  const finalSalary =
    snapshots.length > 0 ? snapshots[snapshots.length - 1].salary : 0;

  // Check if any loan was written off
  const writtenOff = summary.perLoan.some((l) => l.writtenOff);
  const amountWrittenOff = summary.totalWrittenOff;

  return {
    totalPaid: summary.totalPaid,
    monthsToPayoff: summary.monthsToPayoff,
    writtenOff,
    amountWrittenOff,
    finalSalary,
  };
}

/**
 * Generates month-by-month balance comparison for charting.
 */
function generateBalanceSeries(
  baselineSimulation: SimulationTimeSeries,
  overpaySimulation: SimulationTimeSeries,
  lumpSumPaidOffEntireLoan: boolean,
): BalanceDataPoint[] {
  const maxMonths = baselineSimulation.summary.monthsToPayoff;

  const series: BalanceDataPoint[] = [];

  for (let month = 0; month <= maxMonths; month++) {
    // Get total balance for baseline path from snapshots
    const baselineBalance =
      baselineSimulation.snapshots[month]?.loans.reduce(
        (sum, l) => sum + l.closingBalance,
        0,
      ) ?? 0;

    // Get total balance for overpay path from snapshots
    // If lump sum paid off entire loan, overpay balance is always 0
    const overpayBalance = lumpSumPaidOffEntireLoan
      ? 0
      : (overpaySimulation.snapshots[month]?.loans.reduce(
          (sum, l) => sum + l.closingBalance,
          0,
        ) ?? 0);

    series.push({
      month,
      year: Math.floor(month / 12),
      baselineBalance: Math.max(0, baselineBalance),
      overpayBalance: Math.max(0, overpayBalance),
    });
  }

  return series;
}

/**
 * Builds a human-readable summary of the overpayment inputs.
 */
function formatOverpaymentSummary(
  monthlyOverpayment: number,
  lumpSumPayment: number,
): string {
  const hasMonthly = monthlyOverpayment > 0;
  const hasLumpSum = lumpSumPayment > 0;

  if (hasLumpSum && hasMonthly) {
    return `A lump sum of ${formatCurrency(lumpSumPayment)} and ${formatCurrency(monthlyOverpayment)}/month overpayment`;
  }
  if (hasLumpSum) {
    return `A lump sum of ${formatCurrency(lumpSumPayment)}`;
  }
  return `Overpaying ${formatCurrency(monthlyOverpayment)}/month`;
}

/**
 * Determines the recommendation based on simulation results.
 */
function determineRecommendation(
  baseline: ScenarioResult,
  overpay: ScenarioResult,
  paymentDifference: number,
  monthlyOverpayment: number,
  lumpSumPayment: number,
): { recommendation: RecommendationType; reason: string } {
  const summary = formatOverpaymentSummary(monthlyOverpayment, lumpSumPayment);

  // If baseline loan is written off
  if (baseline.writtenOff) {
    // Check if overpaying prevents write-off
    if (overpay.writtenOff) {
      // Still written off even with overpayment - definitely don't overpay
      return {
        recommendation: "dont-overpay",
        reason: `Your loan will be written off regardless. ${summary} would not reduce the total amount you pay.`,
      };
    }
    // Overpaying prevents write-off - compare total outcomes
    const extraPaidByOverpaying = overpay.totalPaid - baseline.totalPaid;

    if (extraPaidByOverpaying > 0) {
      return {
        recommendation: "dont-overpay",
        reason: `Without overpaying, ${formatCurrency(baseline.amountWrittenOff)} would be written off. ${summary} would increase total repayments by ${formatCurrency(extraPaidByOverpaying)}.`,
      };
    }
  }

  // Compare payment savings as percentage of baseline total paid
  const percentageDiff =
    baseline.totalPaid > 0
      ? Math.abs(paymentDifference) / baseline.totalPaid
      : 0;

  if (percentageDiff < 0.1 && Math.abs(paymentDifference) < 1000) {
    const marginalDetail =
      paymentDifference > 0
        ? `would only save ${formatCurrency(paymentDifference)}`
        : `would only cost an extra ${formatCurrency(Math.abs(paymentDifference))}`;
    return {
      recommendation: "marginal",
      reason: `${summary} ${marginalDetail}. Other factors like flexibility and peace of mind may be worth considering.`,
    };
  }

  if (paymentDifference > 0) {
    return {
      recommendation: "overpay",
      reason: `${summary} could save ${formatCurrency(paymentDifference)} in total interest based on these projections.`,
    };
  }

  return {
    recommendation: "dont-overpay",
    reason: `${summary} would increase total repayments by ${formatCurrency(Math.abs(paymentDifference))} based on these projections.`,
  };
}

/**
 * Creates an empty result for when there's nothing to analyze.
 */
function createEmptyResult(): OverpayAnalysisResult {
  return {
    baseline: {
      totalPaid: 0,
      monthsToPayoff: 0,
      writtenOff: false,
      amountWrittenOff: 0,
      finalSalary: 0,
    },
    overpay: {
      totalPaid: 0,
      monthsToPayoff: 0,
      writtenOff: false,
      amountWrittenOff: 0,
      finalSalary: 0,
    },
    recommendation: "marginal",
    recommendationReason: "Enter an overpayment amount to see analysis.",
    balanceTimeSeries: [],
    writeOffMonth: null,
    paymentDifference: 0,
    overpaymentContributions: 0,
    monthsSaved: 0,
  };
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
