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
import type { Insight } from "@/utils/insights";
import type {
  InsightSummary,
  InsightPayload,
} from "@/workers/simulation.worker";

interface ResultSummaryResult {
  summary: InsightSummary | null;
  insight: Insight | null;
}

/**
 * Hook that returns key result metrics (total repaid, monthly payment, years to payoff)
 * and the personalized insight. Runs a single INSIGHT simulation in a Web Worker.
 */
export function useResultSummary(): ResultSummaryResult {
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
    discountRate: activeDiscountRate,
  };

  const result = useSimulationWorker(payload);

  let summary = result?.summary ?? null;
  if (summary?.pvTotalPaid !== undefined) {
    summary = { ...summary, totalPaid: summary.pvTotalPaid };
  }

  const insight = result?.insight ?? null;

  return { summary, insight };
}
