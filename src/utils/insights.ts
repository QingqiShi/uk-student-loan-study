import type { SimulationResult, LoanConfig } from "@/types";
import { simulateLoanRepayment } from "./loan-calculations";
import { PLAN2_WRITE_OFF, PLAN5_WRITE_OFF } from "@/constants";

export type InsightType = "low-earner" | "middle-earner" | "high-earner";

export interface Insight {
  type: InsightType;
  title: string;
  description: string;
}

// Threshold for "peak repayment zone" - overpaying more than this % of principal
const PEAK_ZONE_OVERPAYMENT_THRESHOLD = 0.5; // 50%

/**
 * Determines if the loan will be written off based on simulation result
 */
function willBeWrittenOff(
  result: SimulationResult,
  config: LoanConfig,
): boolean {
  const writeOffYears = config.isPost2023 ? PLAN5_WRITE_OFF : PLAN2_WRITE_OFF;
  const writeOffMonths = writeOffYears * 12;
  return result.monthsToPayoff >= writeOffMonths;
}

/**
 * Calculates amount overpaid compared to original loan balance
 */
function calculateOverpayment(
  result: SimulationResult,
  config: LoanConfig,
): number {
  const principal = config.underGradBalance + config.postGradBalance;
  return result.totalRepayment - principal;
}

/**
 * Generates a personalized insight based on salary and loan configuration
 */
export function generateInsight(
  salary: number,
  config: LoanConfig,
): Insight | null {
  // No insight if no loan balance
  if (config.underGradBalance <= 0 && config.postGradBalance <= 0) {
    return null;
  }

  const result = simulateLoanRepayment(salary, config);
  const writeOffYears = config.isPost2023 ? PLAN5_WRITE_OFF : PLAN2_WRITE_OFF;
  const principal = config.underGradBalance + config.postGradBalance;
  const overpayment = calculateOverpayment(result, config);
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
  if (willBeWrittenOff(result, config)) {
    const remaining = result.underGradRemaining + result.postGradRemaining;

    if (remaining > 0) {
      const formattedRemaining = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
        maximumFractionDigits: 0,
      }).format(remaining);

      return {
        type: "low-earner",
        title: "Your loan will be written off",
        description: `At your current salary, you'll pay for ${writeOffYears} years and have ${formattedRemaining} written off. This is often the best outcome for lower earners.`,
      };
    }
  }

  // High earner: pays off before write-off with reasonable interest
  const yearsToPayoff = (result.monthsToPayoff / 12).toFixed(1);
  const interestPercent = (overpaymentRatio * 100).toFixed(0);

  return {
    type: "high-earner",
    title: "You'll pay off quickly",
    description: `You'll clear your loan in about ${yearsToPayoff} years, paying ${interestPercent}% extra in interest. Early repayment likely isn't worth it—consider investing instead.`,
  };
}
