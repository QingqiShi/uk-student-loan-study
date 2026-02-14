import { useSimulationWorker } from "./useSimulationWorker";
import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
  useRpiRate,
  useBoeBaseRate,
} from "./useStoreSelectors";
import type { Insight } from "@/utils/insights";
import type { InsightPayload } from "@/workers/simulation.worker";

/**
 * Hook that computes a personalized insight based on current salary and loan config.
 * Runs the simulation in a Web Worker to keep the main thread responsive.
 */
export function usePersonalizedInsight(): Insight | null {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();

  const payload: InsightPayload = {
    type: "INSIGHT",
    salary,
    loans: config.loans,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
  };

  const result = useSimulationWorker(payload);

  return result?.insight ?? null;
}
