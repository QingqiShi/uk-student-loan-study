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
  if (
    data.length > 0 &&
    salary > MIN_SALARY &&
    salary < MAX_SALARY - maxSalaryOffset
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

  const data = generateSalaryDataSeries(
    config.loans,
    config.repaymentStartDate,
    (r) => r.totalRepayment,
  );

  const { annotationSalary, annotationValue } = useAnnotationData(salary, data);

  return { data, annotationSalary, annotationValue };
}

/** Hook for repayment years chart data */
export function useRepaymentYearsData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();

  const data = generateSalaryDataSeries(
    config.loans,
    config.repaymentStartDate,
    (r) => r.totalMonths / 12,
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

  const data = generateSalaryDataSeries(
    config.loans,
    config.repaymentStartDate,
    (r) => calculateAnnualizedRate(r, totalPrincipal),
  );

  const { annotationSalary, annotationValue } = useAnnotationData(salary, data);

  return { data, annotationSalary, annotationValue };
}
