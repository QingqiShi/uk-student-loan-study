import {
  useLoanConfig,
  useCurrentSalary,
  useOverpayConfig,
} from "./useStoreSelectors";
import type { OverpayAnalysisResult } from "@/lib/loans/overpay-types";
import { simulateOverpayScenarios } from "@/lib/loans/overpay-simulate";

/**
 * Hook that performs overpay analysis calculations.
 *
 * Compares two scenarios:
 * 1. Baseline: Normal loan repayments with no overpayment
 * 2. Overpay: Add monthly overpayment to loan
 *
 * @param repaymentStartDate - Date when loan repayment started (local state from OverpayPage)
 * @returns Analysis result with recommendation, balance time series, and comparison data
 */
export function useOverpayAnalysis(
  repaymentStartDate: Date,
): OverpayAnalysisResult {
  const { loans } = useLoanConfig();
  const salary = useCurrentSalary();
  const {
    monthlyOverpayment,
    salaryGrowthRate,
    thresholdGrowthRate,
    lumpSumPayment,
  } = useOverpayConfig();

  return simulateOverpayScenarios({
    loans,
    startingSalary: salary,
    repaymentStartDate,
    monthlyOverpayment,
    salaryGrowthRate,
    thresholdGrowthRate,
    lumpSumPayment,
  });
}
