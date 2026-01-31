import dayjs from "dayjs";
import { simulate } from "./engine";
import { CURRENT_RATES } from "./plans";
import type {
  OverpayInput,
  OverpayAnalysisResult,
  ScenarioResult,
  InvestmentResult,
  NetWorthDataPoint,
  RecommendationType,
} from "./overpay-types";
import type { SimulationTimeSeries } from "./types";
import { SALARY_GROWTH_RATES } from "@/constants";

/**
 * Simulates overpayment scenarios to help users decide whether to overpay or invest.
 *
 * Runs three simulations:
 * 1. Baseline: Normal repayments with no overpayment
 * 2. Overpay: Normal repayments + monthly overpayment
 * 3. Invest: Normal repayments, invest the overpayment amount instead
 *
 * Uses the unified simulation engine which correctly handles multiple loan types
 * with independent thresholds.
 */
export function simulateOverpayScenarios(
  input: OverpayInput,
): OverpayAnalysisResult {
  const {
    loans,
    startingSalary,
    repaymentStartDate,
    monthlyOverpayment,
    salaryGrowthRate,
    alternativeSavingsRate,
    rpiRate,
    boeBaseRate,
  } = input;

  const rpi = rpiRate ?? CURRENT_RATES.rpi;
  const boe = boeBaseRate ?? CURRENT_RATES.boeBaseRate;
  const annualGrowthRate = SALARY_GROWTH_RATES[salaryGrowthRate];

  // Check for empty scenarios
  const validLoans = loans.filter((l) => l.balance > 0);
  if (validLoans.length === 0 || monthlyOverpayment === 0) {
    return createEmptyResult();
  }

  // Calculate months elapsed since repayment started
  const monthsElapsed = Math.max(
    0,
    dayjs().diff(dayjs(repaymentStartDate), "months"),
  );

  // Simulate baseline (no overpayment)
  const baselineSimulation = simulate({
    loans: validLoans,
    annualSalary: startingSalary,
    monthsElapsed,
    salaryGrowthRate: annualGrowthRate,
    monthlyOverpayment: 0,
    rpiRate: rpi,
    boeBaseRate: boe,
  });

  // Simulate with overpayment
  const overpaySimulation = simulate({
    loans: validLoans,
    annualSalary: startingSalary,
    monthsElapsed,
    salaryGrowthRate: annualGrowthRate,
    monthlyOverpayment,
    rpiRate: rpi,
    boeBaseRate: boe,
  });

  // Convert simulations to scenario results
  const baseline = extractScenarioResult(baselineSimulation);
  const overpay = extractScenarioResult(overpaySimulation);

  // Simulate investment alternative (invest for baseline duration)
  const investmentResult = simulateInvestment(
    monthlyOverpayment,
    alternativeSavingsRate,
    baseline.monthsToPayoff,
  );

  // Generate net worth time series for chart
  const netWorthTimeSeries = generateNetWorthSeries(
    baselineSimulation,
    overpaySimulation,
    monthlyOverpayment,
    alternativeSavingsRate,
  );

  // Calculate derived values
  const paymentDifference = baseline.totalPaid - overpay.totalPaid;
  const overpaymentContributions = overpay.monthsToPayoff * monthlyOverpayment;

  // Determine crossover point (if any)
  const crossoverMonth = findCrossoverMonth(netWorthTimeSeries);

  // Write-off month for baseline
  const writeOffMonth = baseline.writtenOff ? baseline.monthsToPayoff : null;

  // Determine recommendation
  const { recommendation, reason } = determineRecommendation(
    baseline,
    overpay,
    investmentResult,
    paymentDifference,
  );

  return {
    baseline,
    overpay,
    investment: investmentResult,
    recommendation,
    recommendationReason: reason,
    netWorthTimeSeries,
    crossoverMonth,
    writeOffMonth,
    paymentDifference,
    overpaymentContributions,
  };
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
 * Simulates investing the overpayment amount instead.
 */
function simulateInvestment(
  monthlyContribution: number,
  annualReturnRate: number,
  months: number,
): InvestmentResult {
  const monthlyReturnRate = Math.pow(1 + annualReturnRate, 1 / 12) - 1;

  let portfolioValue = 0;
  const totalContributed = monthlyContribution * months;

  for (let m = 0; m < months; m++) {
    // Add contribution at start of month
    portfolioValue += monthlyContribution;
    // Apply monthly returns
    portfolioValue *= 1 + monthlyReturnRate;
  }

  return {
    portfolioValue,
    totalContributed,
    investmentGains: portfolioValue - totalContributed,
  };
}

/**
 * Generates month-by-month net worth comparison for charting.
 */
function generateNetWorthSeries(
  baselineSimulation: SimulationTimeSeries,
  overpaySimulation: SimulationTimeSeries,
  monthlyOverpayment: number,
  alternativeSavingsRate: number,
): NetWorthDataPoint[] {
  const monthlyReturnRate = Math.pow(1 + alternativeSavingsRate, 1 / 12) - 1;

  const maxMonths = Math.max(
    baselineSimulation.summary.monthsToPayoff,
    overpaySimulation.summary.monthsToPayoff,
  );

  const series: NetWorthDataPoint[] = [];

  // Track investment portfolio for the invest path
  let portfolioValue = 0;

  for (let month = 0; month <= maxMonths; month++) {
    // Get total balance for overpay path from snapshots
    const overpayBalance =
      overpaySimulation.snapshots[month]?.loans.reduce(
        (sum, l) => sum + l.closingBalance,
        0,
      ) ?? 0;

    // Get total balance for baseline/invest path from snapshots
    const baselineBalance =
      baselineSimulation.snapshots[month]?.loans.reduce(
        (sum, l) => sum + l.closingBalance,
        0,
      ) ?? 0;

    // Calculate net worth for each path
    // Baseline path: just the (negative) remaining debt
    const baselineNetWorth = -Math.max(0, baselineBalance);
    // Overpay path: just the (negative) debt (reduced faster)
    const overpayNetWorth = -Math.max(0, overpayBalance);
    // Invest path: portfolio minus remaining debt (same debt as baseline)
    const investNetWorth = portfolioValue - Math.max(0, baselineBalance);

    series.push({
      month,
      year: Math.floor(month / 12),
      baselineNetWorth,
      overpayNetWorth,
      investNetWorth,
    });

    // Grow investment portfolio for next month
    if (month < maxMonths) {
      portfolioValue += monthlyOverpayment;
      portfolioValue *= 1 + monthlyReturnRate;
    }
  }

  return series;
}

/**
 * Finds the month where overpay net worth exceeds invest net worth.
 */
function findCrossoverMonth(series: NetWorthDataPoint[]): number | null {
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1];
    const curr = series[i];
    if (
      prev.investNetWorth >= prev.overpayNetWorth &&
      curr.overpayNetWorth > curr.investNetWorth
    ) {
      return curr.month;
    }
  }
  return null;
}

/**
 * Determines the recommendation based on simulation results.
 */
function determineRecommendation(
  baseline: ScenarioResult,
  overpay: ScenarioResult,
  investment: InvestmentResult,
  paymentDifference: number,
): { recommendation: RecommendationType; reason: string } {
  // If baseline loan is written off
  if (baseline.writtenOff) {
    // Check if overpaying prevents write-off
    if (overpay.writtenOff) {
      // Still written off even with overpayment - definitely don't overpay
      return {
        recommendation: "dont-overpay",
        reason: `Your loan will be written off regardless. Every pound you overpay is money lost that could be growing in investments.`,
      };
    }
    // Overpaying prevents write-off - compare total outcomes
    const extraPaidByOverpaying = overpay.totalPaid - baseline.totalPaid;
    const investPathBenefit = extraPaidByOverpaying + investment.portfolioValue;

    if (investPathBenefit > 0) {
      return {
        recommendation: "invest-instead",
        reason: `With the invest path, you'd save ${formatCurrency(extraPaidByOverpaying)} (written off instead of paid) and have ${formatCurrency(investment.portfolioValue)} in investments.`,
      };
    }
  }

  // Compare investment returns vs payment savings
  const benefit = paymentDifference - investment.investmentGains;
  const denominator = Math.max(
    Math.abs(paymentDifference),
    investment.investmentGains,
    1,
  );
  const percentageDiff = Math.abs(benefit) / denominator;

  if (percentageDiff < 0.1) {
    return {
      recommendation: "marginal",
      reason: `The difference is small (${formatCurrency(Math.abs(benefit))}). Consider other factors like flexibility and peace of mind.`,
    };
  }

  if (investment.investmentGains > paymentDifference) {
    return {
      recommendation: "invest-instead",
      reason: `Investing would earn ${formatCurrency(investment.investmentGains)} in returns, beating the ${formatCurrency(paymentDifference)} you'd save by overpaying.`,
    };
  }

  return {
    recommendation: "overpay",
    reason: `Overpaying saves ${formatCurrency(paymentDifference)} in interest, more than the ${formatCurrency(investment.investmentGains)} you'd earn investing.`,
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
    investment: {
      portfolioValue: 0,
      totalContributed: 0,
      investmentGains: 0,
    },
    recommendation: "marginal",
    recommendationReason: "Enter an overpayment amount to see analysis.",
    netWorthTimeSeries: [],
    crossoverMonth: null,
    writeOffMonth: null,
    paymentDifference: 0,
    overpaymentContributions: 0,
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
