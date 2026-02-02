import {
  useLoanConfig,
  useCurrentSalary,
  useSalaryGrowthRate,
} from "./useStoreSelectors";
import type { DataPoint, BalanceDataPoint } from "@/types/chart";
import { MIN_SALARY, MAX_SALARY, SALARY_GROWTH_RATES } from "@/constants";
import {
  generateSalaryDataSeries,
  generateBalanceTimeSeries,
} from "@/utils/loan-calculations";

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

/** Hook for total repayment chart data */
export function useTotalRepaymentData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const annualGrowthRate = SALARY_GROWTH_RATES[salaryGrowthRate];

  const data = generateSalaryDataSeries(
    config.loans,
    (r) => r.totalRepayment,
    undefined,
    annualGrowthRate,
  );

  const { annotationSalary, annotationValue } = useAnnotationData(salary, data);

  return { data, annotationSalary, annotationValue };
}

/** Hook for balance over time chart data */
export function useBalanceOverTimeData(): {
  data: BalanceDataPoint[];
  writeOffMonth: number | null;
} {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const salaryGrowthRate = useSalaryGrowthRate();
  const annualGrowthRate = SALARY_GROWTH_RATES[salaryGrowthRate];

  return generateBalanceTimeSeries(
    config.loans,
    salary,
    undefined,
    annualGrowthRate,
  );
}
