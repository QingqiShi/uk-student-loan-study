import {
  simulateLoans,
  PLAN_CONFIGS,
  type Loan,
  type SimulationResult,
} from "@/lib/loans";

export type InsightType = "low-earner" | "middle-earner" | "high-earner";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
}

// Threshold for "peak repayment zone" - overpaying more than this % of principal
const PEAK_ZONE_OVERPAYMENT_THRESHOLD = 0.5; // 50%

interface InsightConfig {
  loans: Loan[];
  repaymentStartDate: Date;
  underGradBalance: number;
  postGradBalance: number;
}

/**
 * Gets the write-off years for a loan configuration.
 * Uses the undergraduate loan's write-off period, or postgraduate if no undergrad.
 */
function getWriteOffYears(loans: Loan[]): number {
  const undergradLoan = loans.find((l) => l.planType !== "POSTGRADUATE");
  if (undergradLoan) {
    return PLAN_CONFIGS[undergradLoan.planType].writeOffYears;
  }
  return PLAN_CONFIGS.POSTGRADUATE.writeOffYears;
}

/**
 * Determines if the loan will be written off based on simulation result.
 */
function willBeWrittenOff(result: SimulationResult, loans: Loan[]): boolean {
  const writeOffYears = getWriteOffYears(loans);
  const writeOffMonths = writeOffYears * 12;
  return result.totalMonths >= writeOffMonths;
}

/**
 * Calculates amount overpaid compared to original loan balance.
 */
function calculateOverpayment(
  result: SimulationResult,
  principal: number,
): number {
  return result.totalRepayment - principal;
}

/**
 * Generates a personalized insight based on salary and loan configuration.
 */
export function generateInsight(
  salary: number,
  config: InsightConfig,
): Insight | null {
  const { loans, repaymentStartDate, underGradBalance, postGradBalance } =
    config;

  // No insight if no loan balance
  if (underGradBalance <= 0 && postGradBalance <= 0) {
    return null;
  }

  const result = simulateLoans({
    loans,
    annualSalary: salary,
    repaymentStartDate,
  });

  const writeOffYears = getWriteOffYears(loans);
  const principal = underGradBalance + postGradBalance;
  const overpayment = calculateOverpayment(result, principal);
  const overpaymentRatio = principal > 0 ? overpayment / principal : 0;

  // Peak repayment zone: paying significantly more than borrowed (>50% extra)
  if (overpaymentRatio > PEAK_ZONE_OVERPAYMENT_THRESHOLD) {
    const formattedOverpayment = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(overpayment);

    const percentOver = (overpaymentRatio * 100).toFixed(0);

    return {
      type: "middle-earner",
      title: "You're in the peak repayment zone",
      description: `At this salary, you'll pay ${formattedOverpayment} (${percentOver}%) more than you borrowed. Consider strategies to either boost income quickly or make targeted overpayments.`,
    };
  }

  // Low earner: loan will be written off
  if (willBeWrittenOff(result, loans)) {
    const remaining = result.loanResults.reduce(
      (sum, r) => sum + r.remainingBalance,
      0,
    );

    if (remaining > 0) {
      const formattedRemaining = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }).format(remaining);

      return {
        type: "low-earner",
        title: "Your loan will be written off",
        description: `At your current salary, you'll pay for ${String(writeOffYears)} years and have ${formattedRemaining} written off. This is often the best outcome for lower earners.`,
      };
    }
  }

  // High earner: pays off before write-off with reasonable interest
  const yearsToPayoff = (result.totalMonths / 12).toFixed(1);
  const interestPercent = (overpaymentRatio * 100).toFixed(0);

  return {
    type: "high-earner",
    title: "You'll pay off quickly",
    description: `You'll clear your loan in about ${yearsToPayoff} years, paying ${interestPercent}% extra in interest. Early repayment likely isn't worth it—consider investing instead.`,
  };
}
