import dayjs from "dayjs";
import { getAnnualInterestRate } from "./interest";
import { PLAN_CONFIGS, CURRENT_RATES } from "./plans";
import type {
  OverpayInput,
  OverpayAnalysisResult,
  ScenarioResult,
  InvestmentResult,
  NetWorthDataPoint,
  RecommendationType,
} from "./overpay-types";
import type { Loan, PlanType } from "./types";
import { SALARY_GROWTH_RATES } from "@/constants";

/**
 * Simulates overpayment scenarios to help users decide whether to overpay or invest.
 *
 * Runs three simulations:
 * 1. Baseline: Normal repayments with no overpayment
 * 2. Overpay: Normal repayments + monthly overpayment
 * 3. Invest: Normal repayments, invest the overpayment amount instead
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

  // Get combined loan parameters (use the longest write-off period)
  const { totalBalance, maxWriteOffMonths, primaryPlanType } =
    getCombinedLoanParams(loans, repaymentStartDate);

  if (totalBalance === 0 || monthlyOverpayment === 0) {
    return createEmptyResult();
  }

  // Simulate baseline (no overpayment)
  const baselineSimulation = simulateWithGrowingSalary({
    startingBalance: totalBalance,
    startingSalary,
    annualGrowthRate,
    monthlyOverpayment: 0,
    maxMonths: maxWriteOffMonths,
    planType: primaryPlanType,
    rpi,
    boe,
  });

  // Simulate with overpayment
  const overpaySimulation = simulateWithGrowingSalary({
    startingBalance: totalBalance,
    startingSalary,
    annualGrowthRate,
    monthlyOverpayment,
    maxMonths: maxWriteOffMonths,
    planType: primaryPlanType,
    rpi,
    boe,
  });

  // Simulate investment alternative
  const investmentResult = simulateInvestment(
    monthlyOverpayment,
    alternativeSavingsRate,
    baselineSimulation.monthsToPayoff,
  );

  // Generate net worth time series for chart
  const netWorthTimeSeries = generateNetWorthSeries({
    startingBalance: totalBalance,
    startingSalary,
    annualGrowthRate,
    monthlyOverpayment,
    alternativeSavingsRate,
    maxMonths: Math.max(
      baselineSimulation.monthsToPayoff,
      overpaySimulation.monthsToPayoff,
    ),
    planType: primaryPlanType,
    rpi,
    boe,
  });

  // Calculate derived values
  // paymentDifference: positive = overpaying saves money, negative = overpaying costs more
  // (negative can occur when overpaying clears a debt that would've been written off)
  const paymentDifference =
    baselineSimulation.totalPaid - overpaySimulation.totalPaid;
  const overpaymentContributions =
    overpaySimulation.monthsToPayoff * monthlyOverpayment;

  // Determine crossover point (if any)
  const crossoverMonth = findCrossoverMonth(netWorthTimeSeries);

  // Write-off month for baseline
  const writeOffMonth = baselineSimulation.writtenOff
    ? baselineSimulation.monthsToPayoff
    : null;

  // Determine recommendation
  const { recommendation, reason } = determineRecommendation(
    baselineSimulation,
    overpaySimulation,
    investmentResult,
    paymentDifference,
  );

  return {
    baseline: baselineSimulation,
    overpay: overpaySimulation,
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

interface SimulationParams {
  startingBalance: number;
  startingSalary: number;
  annualGrowthRate: number;
  monthlyOverpayment: number;
  maxMonths: number;
  planType: PlanType;
  rpi: number;
  boe: number;
}

/**
 * Simulates loan repayment with salary growth over time.
 */
function simulateWithGrowingSalary(params: SimulationParams): ScenarioResult {
  const {
    startingBalance,
    startingSalary,
    annualGrowthRate,
    monthlyOverpayment,
    maxMonths,
    planType,
    rpi,
    boe,
  } = params;

  const config = PLAN_CONFIGS[planType];
  const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1 / 12) - 1;

  let balance = startingBalance;
  let currentSalary = startingSalary;
  let totalPaid = 0;
  let months = 0;

  while (months < maxMonths && balance > 0) {
    // Calculate monthly repayment based on current salary
    const monthlySalary = currentSalary / 12;
    const baseRepayment = Math.max(
      0,
      (monthlySalary - config.monthlyThreshold) * config.repaymentRate,
    );
    const totalMonthlyPayment = baseRepayment + monthlyOverpayment;

    // Apply interest
    const annualInterest = getAnnualInterestRate(
      planType,
      currentSalary,
      rpi,
      boe,
    );
    const monthlyInterest = annualInterest / 100 / 12;
    balance *= 1 + monthlyInterest;

    // Apply payment
    const payment = Math.min(totalMonthlyPayment, balance);
    balance -= payment;
    totalPaid += payment;

    // Grow salary monthly
    currentSalary *= 1 + monthlyGrowthRate;
    months++;
  }

  const writtenOff = balance > 0;
  const amountWrittenOff = Math.max(0, balance);

  return {
    totalPaid,
    monthsToPayoff: months,
    writtenOff,
    amountWrittenOff,
    finalSalary: currentSalary,
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

interface NetWorthParams extends SimulationParams {
  alternativeSavingsRate: number;
}

/**
 * Generates month-by-month net worth comparison for charting.
 */
function generateNetWorthSeries(params: NetWorthParams): NetWorthDataPoint[] {
  const {
    startingBalance,
    startingSalary,
    annualGrowthRate,
    monthlyOverpayment,
    alternativeSavingsRate,
    maxMonths,
    planType,
    rpi,
    boe,
  } = params;

  const config = PLAN_CONFIGS[planType];
  const monthlyGrowthRate = Math.pow(1 + annualGrowthRate, 1 / 12) - 1;
  const monthlyReturnRate = Math.pow(1 + alternativeSavingsRate, 1 / 12) - 1;

  const series: NetWorthDataPoint[] = [];

  // Track overpay scenario
  let overpayBalance = startingBalance;

  // Track invest scenario
  let investBalance = startingBalance;
  let portfolioValue = 0;

  let currentSalary = startingSalary;

  for (let month = 0; month <= maxMonths; month++) {
    // Calculate net worth at this point in time
    // Net worth = assets - liabilities
    // Baseline path: just the remaining debt (no overpayment, no portfolio)
    // Overpay path: no portfolio, just reduced/eliminated debt
    // Invest path: portfolio value minus remaining debt
    const baselineNetWorth = -Math.max(0, investBalance);
    const overpayNetWorth = -Math.max(0, overpayBalance);
    const investNetWorth = portfolioValue - Math.max(0, investBalance);

    series.push({
      month,
      year: Math.floor(month / 12),
      baselineNetWorth,
      overpayNetWorth,
      investNetWorth,
    });

    if (month === maxMonths) break;

    // Calculate payments for this month
    const monthlySalary = currentSalary / 12;
    const baseRepayment = Math.max(
      0,
      (monthlySalary - config.monthlyThreshold) * config.repaymentRate,
    );

    // Overpay scenario
    if (overpayBalance > 0) {
      const annualInterest = getAnnualInterestRate(
        planType,
        currentSalary,
        rpi,
        boe,
      );
      const monthlyInterest = annualInterest / 100 / 12;
      overpayBalance *= 1 + monthlyInterest;
      const payment = Math.min(
        baseRepayment + monthlyOverpayment,
        overpayBalance,
      );
      overpayBalance -= payment;
    }

    // Invest scenario
    if (investBalance > 0) {
      const annualInterest = getAnnualInterestRate(
        planType,
        currentSalary,
        rpi,
        boe,
      );
      const monthlyInterest = annualInterest / 100 / 12;
      investBalance *= 1 + monthlyInterest;
      const payment = Math.min(baseRepayment, investBalance);
      investBalance -= payment;
    }

    // Invest the overpayment amount
    portfolioValue += monthlyOverpayment;
    portfolioValue *= 1 + monthlyReturnRate;

    // Grow salary
    currentSalary *= 1 + monthlyGrowthRate;
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
    // Invest path benefit: save money (don't pay extra) + have portfolio
    // Overpay path benefit: peace of mind from clearing debt
    const extraPaidByOverpaying = overpay.totalPaid - baseline.totalPaid;
    const investPathBenefit = extraPaidByOverpaying + investment.portfolioValue;

    // Investing is almost always better here because you get both:
    // 1. The write-off benefit (don't pay the extra amount)
    // 2. The portfolio growth
    if (investPathBenefit > 0) {
      return {
        recommendation: "invest-instead",
        reason: `With the invest path, you'd save ${formatCurrency(extraPaidByOverpaying)} (written off instead of paid) and have ${formatCurrency(investment.portfolioValue)} in investments.`,
      };
    }
  }

  // Compare investment returns vs payment savings
  // paymentDifference > 0 means overpaying saves money
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
 * Gets combined loan parameters for simulation.
 *
 * SIMPLIFICATION: For users with multiple loan types (e.g., undergrad + postgrad),
 * this simulation treats them as a single combined loan using the primary plan's
 * interest rate and threshold. This is an approximation - in reality, each loan
 * type has different repayment thresholds and rates. The approximation is reasonable
 * because:
 * - Most users have a single dominant loan type
 * - The error is small relative to the investment/overpay comparison
 * - Accurate multi-plan simulation would require significantly more complexity
 */
function getCombinedLoanParams(
  loans: Loan[],
  repaymentStartDate: Date,
): {
  totalBalance: number;
  maxWriteOffMonths: number;
  primaryPlanType: PlanType;
} {
  const validLoans = loans.filter((l) => l.balance > 0);

  if (validLoans.length === 0) {
    return {
      totalBalance: 0,
      maxWriteOffMonths: 0,
      primaryPlanType: "PLAN_2",
    };
  }

  const totalBalance = validLoans.reduce((sum, l) => sum + l.balance, 0);

  // Find the loan with the highest balance to determine primary plan
  const primaryLoan = validLoans.reduce((max, l) =>
    l.balance > max.balance ? l : max,
  );

  // Use the longest write-off period among all loans
  const maxWriteOffYears = Math.max(
    ...validLoans.map((l) => PLAN_CONFIGS[l.planType].writeOffYears),
  );

  const writeOffDate = dayjs(repaymentStartDate).add(maxWriteOffYears, "years");
  const maxWriteOffMonths = Math.max(0, writeOffDate.diff(dayjs(), "months"));

  return {
    totalBalance,
    maxWriteOffMonths,
    primaryPlanType: primaryLoan.planType,
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
