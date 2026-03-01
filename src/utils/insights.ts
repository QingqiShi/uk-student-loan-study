import type { Loan, SimulationTimeSeries } from "@/lib/loans/types";
import { simulate } from "@/lib/loans/engine";
import { PLAN_CONFIGS } from "@/lib/loans/plans";
import { pvTotal } from "@/utils/presentValue";

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
  salaryGrowthRate?: number;
  thresholdGrowthRate?: number;
  rpiRate?: number;
  boeBaseRate?: number;
  discountRate?: number;
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
    salaryGrowthRate = 0,
    thresholdGrowthRate = 0,
    rpiRate,
    boeBaseRate,
    discountRate,
  } = config;

  const principal = loans.reduce((s, l) => s + l.balance, 0);

  // No insight if no loan balance
  if (principal <= 0) {
    return null;
  }

  // Use monthsElapsed: 0 to show full repayment timeline
  const result = simulate({
    loans,
    annualSalary: salary,
    monthsElapsed: 0,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
  });

  // Nominal values used for zone classification (thresholds calibrated to nominal)
  const nominalTotalPaid = result.summary.totalPaid;

  // Display values: PV-adjusted when discount rate is active, nominal otherwise
  const displayTotalPaid =
    discountRate && discountRate > 0
      ? pvTotal(
          result.snapshots.map((s) => ({
            month: s.month,
            amount: s.totalRepayment,
          })),
          discountRate,
        )
      : nominalTotalPaid;
  const displayOverpayment = displayTotalPaid - principal;
  const displayOverpaymentRatio =
    principal > 0 ? displayOverpayment / principal : 0;

  const gbp = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  });

  const writeOffYears = getWriteOffYears(loans);

  // Peak repayment zone: paying 70%+ more than what you borrowed (nominal classification)
  if (
    principal > 0 &&
    nominalTotalPaid > PEAK_ZONE_REPAYMENT_MULTIPLIER * principal
  ) {
    const formattedTotalPaid = gbp.format(displayTotalPaid);
    const formattedPrincipal = gbp.format(principal);

    return {
      type: "middle-earner",
      title: "You're in the peak repayment zone",
      description: `You'll repay ${formattedTotalPaid} in total on a ${formattedPrincipal} loan. At this salary, interest builds faster than your repayments reduce the balance.`,
      cta: {
        text: "Calculate your overpayment savings",
        href: "/overpay",
      },
    };
  }

  // Low earner: loan will be written off with remaining balance (nominal classification)
  if (willBeWrittenOff(result)) {
    const remaining = result.summary.perLoan.reduce(
      (sum, r) => sum + r.remainingBalance,
      0,
    );

    if (remaining > 0) {
      const displayPaidPercent =
        principal > 0 ? (displayTotalPaid / principal) * 100 : 0;
      const description =
        displayOverpaymentRatio > 0
          ? `You'll pay ${(displayOverpaymentRatio * 100).toFixed(0)}% more than you borrowed, but it's written off after ${String(writeOffYears)} years — reasonable given inflation. Treat repayments as a graduate tax, not a debt.`
          : `You'll only repay ${displayPaidPercent.toFixed(0)}% of what you borrowed before the rest is written off after ${String(writeOffYears)} years. Treat repayments as a graduate tax, not a debt.`;

      return {
        type: "low-earner",
        title: "Your loan will be written off",
        description,
        cta: {
          text: "See why overpaying could leave you worse off",
          href: "/overpay",
        },
      };
    }
  }

  // High earner: pays off before write-off with reasonable interest (nominal classification)
  const yearsToPayoff = (result.summary.monthsToPayoff / 12).toFixed(1);

  let interestDescription: string;
  if (displayOverpaymentRatio < 0) {
    interestDescription = `paying ${Math.abs(displayOverpaymentRatio * 100).toFixed(0)}% less in today's money`;
  } else {
    interestDescription = `paying ${(displayOverpaymentRatio * 100).toFixed(0)}% more than you borrowed`;
  }

  return {
    type: "high-earner",
    title: "You'll pay off quickly",
    description: `You'll clear your loan in about ${yearsToPayoff} years, ${interestDescription}.`,
    cta: {
      text: "See how overpaying saves you time",
      href: "/overpay",
    },
  };
}
