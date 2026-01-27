import { useMemo } from "react";
import { useLoanConfig, useCurrentSalary } from "./useStoreSelectors";
import {
  generateSalaryDataSeries,
  calculateAnnualizedRate,
} from "@/utils/loan-calculations";
import { MIN_SALARY, MAX_SALARY } from "@/constants";
import type { DataPoint } from "@/types";

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
  return useMemo(() => {
    if (
      data.length > 0 &&
      salary > MIN_SALARY &&
      salary < MAX_SALARY - maxSalaryOffset
    ) {
      // Find the data point closest to the annotation salary
      const closestPoint = data.reduce((closest, point) => {
        if (
          Math.abs(point.salary - salary) < Math.abs(closest.salary - salary)
        ) {
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
  }, [salary, data, maxSalaryOffset]);
}

/** Hook for total repayment chart data */
export function useTotalRepaymentData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();

  const data = useMemo(
    () => generateSalaryDataSeries(config, (r) => r.totalRepayment),
    [config],
  );

  const { annotationSalary, annotationValue } = useAnnotationData(salary, data);

  return { data, annotationSalary, annotationValue };
}

/** Hook for repayment years chart data */
export function useRepaymentYearsData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();

  const data = useMemo(
    () => generateSalaryDataSeries(config, (r) => r.monthsToPayoff / 12),
    [config],
  );

  // RepaymentYearsChart uses a 5000 offset to avoid annotation at chart edge
  const { annotationSalary, annotationValue } = useAnnotationData(
    salary,
    data,
    5000,
  );

  return { data, annotationSalary, annotationValue };
}

/** Hook for interest rate chart data */
export function useInterestRateData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();
  const { underGradBalance, postGradBalance } = config;
  const totalPrincipal = underGradBalance + postGradBalance;

  const data = useMemo(
    () =>
      generateSalaryDataSeries(config, (r) =>
        calculateAnnualizedRate(r, totalPrincipal),
      ),
    [config, totalPrincipal],
  );

  const { annotationSalary, annotationValue } = useAnnotationData(salary, data);

  return { data, annotationSalary, annotationValue };
}
