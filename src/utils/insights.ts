import type { Loan, SimulationTimeSeries } from "@/lib/loans/types";
import { simulate } from "@/lib/loans/engine";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

export type InsightType = "low-earner" | "middle-earner" | "high-earner";

export interface InsightCta {
  text: string;
  href: string;
}

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
  cta?: InsightCta;
}

// Threshold for "peak repayment zone" - overpaying more than this % of principal
const PEAK_ZONE_OVERPAYMENT_THRESHOLD = 0.5; // 50%

interface InsightConfig {
  loans: Loan[];
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
function willBeWrittenOff(result: SimulationTimeSeries): boolean {
  return result.summary.perLoan.some((loan) => loan.writtenOff);
}

/**
 * Calculates amount overpaid compared to original loan balance.
 */
function calculateOverpayment(
  result: SimulationTimeSeries,
  principal: number,
): number {
  return result.summary.totalPaid - principal;
}

/**
 * Generates a personalized insight based on salary and loan configuration.
 */
export function generateInsight(
  salary: number,
  config: InsightConfig,
): Insight | null {
  const { loans, underGradBalance, postGradBalance } = config;

  // No insight if no loan balance
  if (underGradBalance <= 0 && postGradBalance <= 0) {
    return null;
  }

  // Use monthsElapsed: 0 to show full repayment timeline
  const result = simulate({
    loans,
    annualSalary: salary,
    monthsElapsed: 0,
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
      description: `At this salary, you'll pay ${formattedOverpayment} (${percentOver}%) more than you borrowed.`,
      cta: {
        text: "See if overpaying could help",
        href: "/overpay",
      },
    };
  }

  // Low earner: loan will be written off
  if (willBeWrittenOff(result)) {
    const remaining = result.summary.perLoan.reduce(
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
  const yearsToPayoff = (result.summary.monthsToPayoff / 12).toFixed(1);
  const interestPercent = (overpaymentRatio * 100).toFixed(0);

  return {
    type: "high-earner",
    title: "You'll pay off quickly",
    description: `You'll clear your loan in about ${yearsToPayoff} years, paying ${interestPercent}% extra in interest.`,
    cta: {
      text: "Should you overpay instead of investing?",
      href: "/overpay",
    },
  };
}
