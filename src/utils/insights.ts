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

// Peak zone: paying more than this multiple of principal (e.g. 1.7 = 70% extra)
const PEAK_ZONE_REPAYMENT_MULTIPLIER = 1.7;

interface InsightConfig {
  loans: Loan[];
  underGradBalance: number;
  postGradBalance: number;
  salaryGrowthRate?: number;
  thresholdGrowthRate?: number;
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
 *
 * Categorizes the user into one of three zones:
 * - Peak zone: total repayment exceeds 1.7x the principal
 * - Low earner: loan gets written off before paying too much
 * - High earner: pays off quickly without excessive interest
 */
export function generateInsight(
  salary: number,
  config: InsightConfig,
): Insight | null {
  const {
    loans,
    underGradBalance,
    postGradBalance,
    salaryGrowthRate = 0,
    thresholdGrowthRate = 0,
  } = config;

  // No insight if no loan balance
  if (underGradBalance <= 0 && postGradBalance <= 0) {
    return null;
  }

  // Use monthsElapsed: 0 to show full repayment timeline
  const result = simulate({
    loans,
    annualSalary: salary,
    monthsElapsed: 0,
    salaryGrowthRate,
    thresholdGrowthRate,
  });

  const writeOffYears = getWriteOffYears(loans);
  const principal = underGradBalance + postGradBalance;
  const overpayment = calculateOverpayment(result, principal);
  const overpaymentRatio = principal > 0 ? overpayment / principal : 0;

  // Peak repayment zone: paying 70%+ more than what you borrowed
  if (
    principal > 0 &&
    result.summary.totalPaid > PEAK_ZONE_REPAYMENT_MULTIPLIER * principal
  ) {
    const gbp = new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    });
    const formattedTotalPaid = gbp.format(result.summary.totalPaid);
    const formattedPrincipal = gbp.format(principal);

    return {
      type: "middle-earner",
      title: "You're in the peak repayment zone",
      description: `You'll repay ${formattedTotalPaid} in total on a ${formattedPrincipal} loan. At this salary, interest builds faster than your repayments reduce the balance.`,
      cta: {
        text: "See if overpaying could help",
        href: "/overpay",
      },
    };
  }

  // Low earner: loan will be written off with remaining balance
  if (willBeWrittenOff(result)) {
    const remaining = result.summary.perLoan.reduce(
      (sum, r) => sum + r.remainingBalance,
      0,
    );

    if (remaining > 0) {
      const paidPercent =
        principal > 0 ? (result.summary.totalPaid / principal) * 100 : 0;
      const description =
        overpaymentRatio > 0
          ? `You'll pay ${(overpaymentRatio * 100).toFixed(0)}% more than you borrowed, but it's written off after ${String(writeOffYears)} years — reasonable given inflation. Treat repayments as a graduate tax, not a debt.`
          : `You'll only repay ${paidPercent.toFixed(0)}% of what you borrowed before the rest is written off after ${String(writeOffYears)} years. Treat repayments as a graduate tax, not a debt.`;

      return {
        type: "low-earner",
        title: "Your loan will be written off",
        description,
      };
    }
  }

  // High earner: pays off before write-off with reasonable interest
  const yearsToPayoff = (result.summary.monthsToPayoff / 12).toFixed(1);
  const interestPercent = (overpaymentRatio * 100).toFixed(0);

  return {
    type: "high-earner",
    title: "You'll pay off quickly",
    description: `You'll clear your loan in about ${yearsToPayoff} years, paying ${interestPercent}% more than you borrowed.`,
    cta: {
      text: "See if overpaying saves you money",
      href: "/overpay",
    },
  };
}
