import {
  useLoanConfig,
  useCurrentSalary,
  useOverpayConfig,
} from "./useStoreSelectors";
import type { OverpayAnalysisResult } from "@/lib/loans";
import { simulateOverpayScenarios } from "@/lib/loans";

/**
 * Hook that performs overpay analysis calculations.
 *
 * Compares three scenarios:
 * 1. Baseline: Normal loan repayments with no overpayment
 * 2. Overpay: Add monthly overpayment to loan
 * 3. Invest: Keep baseline payments, invest the overpayment amount instead
 *
 * @returns Analysis result with recommendation, net worth time series, and comparison data
 */
export function useOverpayAnalysis(): OverpayAnalysisResult {
  const { loans, repaymentStartDate } = useLoanConfig();
  const salary = useCurrentSalary();
  const { monthlyOverpayment, salaryGrowthRate, alternativeSavingsRate } =
    useOverpayConfig();

  return simulateOverpayScenarios({
    loans,
    startingSalary: salary,
    repaymentStartDate,
    monthlyOverpayment,
    salaryGrowthRate,
    alternativeSavingsRate,
  });
}
