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
    // Find the data point closest to the annotation salary
    const closestPoint = data.reduce((closest, point) => {
      if (Math.abs(point.salary - salary) < Math.abs(closest.salary - salary)) {
        return point;
      }
      return closest;
    }, data[0]);

    return {
      annotationSalary: salary,
      annotationValue: closestPoint.value,
    };
  }
  return { annotationSalary: undefined, annotationValue: undefined };
}

/** Hook for total repayment chart data (runs in Web Worker) */
export function useTotalRepaymentData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
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
    ...(activeDiscountRate !== undefined
      ? { discountRate: activeDiscountRate }
      : {}),
  };

  const result = useSimulationWorker(payload);

  // Use empty array while waiting for worker result
  const data = result?.data ?? [];

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
    ...(activeDiscountRate !== undefined
      ? { discountRate: activeDiscountRate }
      : {}),
  };

  const result = useSimulationWorker(payload);

  // Use empty data while waiting for worker result
  return {
    data: result?.data ?? [],
    writeOffMonth: result?.writeOffMonth ?? null,
  };
}
