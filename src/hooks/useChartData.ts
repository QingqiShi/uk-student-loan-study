import { useMemo } from "react";
import { useLoanConfig, useCurrentSalary } from "./useStoreSelectors";
import {
  generateSalaryDataSeries,
  calculateAnnualizedRate,
} from "@/utils/loan-calculations";
import type { DataPoint } from "@/types";
import { MIN_SALARY, MAX_SALARY } from "@/constants";

/**
 * Finds the annotation point for the current salary in a data series.
 * Returns the first data point where salary >= current salary.
 */
function useAnnotationPoint(
  data: DataPoint[],
  salary: number,
  maxSalaryOffset = 0,
): DataPoint | undefined {
  return useMemo(() => {
    if (salary > MIN_SALARY && salary < MAX_SALARY - maxSalaryOffset) {
      return data.find((d) => d[0] >= salary);
    }
    return undefined;
  }, [data, salary, maxSalaryOffset]);
}

/** Hook for total repayment chart data */
export function useTotalRepaymentData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();

  const data = useMemo(
    () => generateSalaryDataSeries(config, (r) => r.totalRepayment),
    [config],
  );

  const annotationPoint = useAnnotationPoint(data, salary);

  return { data, annotationPoint, salary };
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
  const annotationPoint = useAnnotationPoint(data, salary, 5000);

  return { data, annotationPoint, salary };
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

  const annotationPoint = useAnnotationPoint(data, salary);

  return { data, annotationPoint, salary };
}
