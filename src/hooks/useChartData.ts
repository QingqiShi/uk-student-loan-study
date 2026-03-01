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
import type { DataPoint, BalanceDataPoint } from "@/types/chart";
import type {
  SalarySeriesPayload,
  BalanceSeriesPayload,
} from "@/workers/simulation.worker";
import { MIN_SALARY, MAX_SALARY } from "@/constants";
import { findClosestBySalary } from "@/lib/utils";

interface AnnotationData {
  annotationSalary: number | undefined;
  annotationValue: number | undefined;
}

/**
 * Returns the annotation salary and corresponding value if within the valid range.
 */
function useAnnotationData(
  salary: number,
  data: DataPoint[],
  maxSalaryOffset = 0,
): AnnotationData {
  if (
    data.length > 0 &&
    salary >= MIN_SALARY &&
    salary <= MAX_SALARY - maxSalaryOffset
  ) {
    const closestPoint = findClosestBySalary(data, salary);

    return {
      annotationSalary: salary,
      annotationValue: closestPoint.value,
    };
  }
  return { annotationSalary: undefined, annotationValue: undefined };
}

/** Salary-independent: only recomputes when loan config/rates change */
function useSalarySeriesData(): DataPoint[] {
  const config = useLoanConfig();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();
  const activeDiscountRate = useActiveDiscountRate();

  const payload: SalarySeriesPayload = {
    type: "SALARY_SERIES",
    loans: config.loans,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
    discountRate: activeDiscountRate,
  };

  return useSimulationWorker(payload)?.data ?? [];
}

/** Hook for total repayment chart data (runs in Web Worker) */
export function useTotalRepaymentData() {
  const data = useSalarySeriesData();
  const salary = useCurrentSalary();

  const { annotationSalary, annotationValue } = useAnnotationData(salary, data);

  return { data, annotationSalary, annotationValue };
}

/** Hook for balance over time chart data (runs in Web Worker) */
export function useBalanceOverTimeData(): {
  data: BalanceDataPoint[];
  writeOffMonth: number | null;
} {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const thresholdGrowthRate = useThresholdGrowthRate();
  const rpiRate = useRpiRate();
  const boeBaseRate = useBoeBaseRate();
  const activeDiscountRate = useActiveDiscountRate();

  const payload: BalanceSeriesPayload = {
    type: "BALANCE_SERIES",
    loans: config.loans,
    annualSalary: salary,
    salaryGrowthRate,
    thresholdGrowthRate,
    rpiRate,
    boeBaseRate,
    discountRate: activeDiscountRate,
  };

  const result = useSimulationWorker(payload);

  // Use empty data while waiting for worker result
  return {
    data: result?.data ?? [],
    writeOffMonth: result?.writeOffMonth ?? null,
  };
}
