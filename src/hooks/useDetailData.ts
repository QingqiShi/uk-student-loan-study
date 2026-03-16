import type {
  DetailSeriesPayload,
  DetailSeriesResult,
  EffectiveRateSalaryPayload,
  EffectiveRateSalaryResult,
} from "@/workers/simulation.worker";
import { useSimulationWorker } from "./useSimulationWorker";
import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
  useThresholdGrowthRate,
  usePlan2ThresholdSchedule,
  useRpiRate,
  useBoeBaseRate,
  useActiveDiscountRate,
} from "./useStoreSelectors";

/** Hook for detail page time-series data (runs in Web Worker) */
export function useDetailSeriesData(): DetailSeriesResult | null {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const plan2ThresholdSchedule = usePlan2ThresholdSchedule();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();
  const activeDiscountRate = useActiveDiscountRate();

  const payload: DetailSeriesPayload = {
    type: "DETAIL_SERIES",
    loans: config.loans,
    annualSalary: salary,
    salaryGrowthRate,
    thresholdGrowthRate,
    plan2ThresholdSchedule,
    rpiRate,
    boeBaseRate,
    discountRate: activeDiscountRate,
  };

  return useSimulationWorker(payload);
}

/** Hook for effective rate by salary data (runs in Web Worker) */
export function useEffectiveRateBySalaryData(): EffectiveRateSalaryResult | null {
  const config = useLoanConfig();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const plan2ThresholdSchedule = usePlan2ThresholdSchedule();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();

  const payload: EffectiveRateSalaryPayload = {
    type: "EFFECTIVE_RATE_SALARY",
    loans: config.loans,
    salaryGrowthRate,
    thresholdGrowthRate,
    plan2ThresholdSchedule,
    rpiRate,
    boeBaseRate,
  };

  return useSimulationWorker(payload);
}
