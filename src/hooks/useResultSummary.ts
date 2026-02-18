import { useSimulationWorker } from "./useSimulationWorker";
import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
  useRpiRate,
  useBoeBaseRate,
  useActiveDiscountRate,
} from "./useStoreSelectors";
import type {
  InsightSummary,
  InsightPayload,
} from "@/workers/simulation.worker";

/**
 * Hook that returns key result metrics (total repaid, monthly payment, years to payoff).
 * Runs the simulation in a Web Worker to keep the main thread responsive.
 */
export function useResultSummary(): InsightSummary | null {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();
  const activeDiscountRate = useActiveDiscountRate();

  const payload: InsightPayload = {
    type: "INSIGHT",
    salary,
    loans: config.loans,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
    ...(activeDiscountRate !== undefined
      ? { discountRate: activeDiscountRate }
      : {}),
  };

  const result = useSimulationWorker(payload);

  const summary = result?.summary ?? null;
  if (summary?.pvTotalPaid !== undefined) {
    return { ...summary, totalPaid: summary.pvTotalPaid };
  }
  return summary;
}
