import { useSimulationWorker } from "./useSimulationWorker";
import {
  useLoanConfig,
  useCurrentSalary,
  useOverpayConfig,
} from "./useStoreSelectors";
import type { OverpayAnalysisResult } from "@/lib/loans/overpay-types";
import type { OverpayAnalysisPayload } from "@/workers/simulation.worker";

/**
 * Hook that performs overpay analysis calculations (runs in Web Worker).
 *
 * Compares two scenarios:
 * 1. Baseline: Normal loan repayments with no overpayment
 * 2. Overpay: Add monthly overpayment to loan
 *
 * @param repaymentStartDate - Date when loan repayment started (local state from OverpayPage)
 * @returns Analysis result with recommendation, balance time series, and comparison data, or null while loading
 */
export function useOverpayAnalysis(
  repaymentStartDate: Date,
): OverpayAnalysisResult | null {
  const { loans } = useLoanConfig();
  const salary = useCurrentSalary();
  const {
    monthlyOverpayment,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
    lumpSumPayment,
  } = useOverpayConfig();

  // Convert Date to ISO string for worker transfer
  const payload: OverpayAnalysisPayload = {
    type: "OVERPAY_ANALYSIS",
    input: {
      loans,
      startingSalary: salary,
      repaymentStartDate: repaymentStartDate.toISOString(),
      monthlyOverpayment,
      salaryGrowthRate,
      thresholdGrowthRate,
      rpiRate,
      boeBaseRate,
      lumpSumPayment,
    },
  };

  const result = useSimulationWorker(payload);

  return result?.result ?? null;
}
