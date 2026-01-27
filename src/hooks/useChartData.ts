import { useMemo } from "react";
import { useLoanConfig, useCurrentSalary } from "./useStoreSelectors";
import {
  generateSalaryDataSeries,
  calculateAnnualizedRate,
} from "@/utils/loan-calculations";
import { MIN_SALARY, MAX_SALARY } from "@/constants";

/**
 * Returns the annotation salary if it's within the valid range.
 */
function useAnnotationSalary(
  salary: number,
  maxSalaryOffset = 0,
): number | undefined {
  return useMemo(() => {
    if (salary > MIN_SALARY && salary < MAX_SALARY - maxSalaryOffset) {
      return salary;
    }
    return undefined;
  }, [salary, maxSalaryOffset]);
}

/** Hook for total repayment chart data */
export function useTotalRepaymentData() {
  const config = useLoanConfig();
  const salary = useCurrentSalary();

  const data = useMemo(
    () => generateSalaryDataSeries(config, (r) => r.totalRepayment),
    [config],
  );

  const annotationSalary = useAnnotationSalary(salary);

  return { data, annotationSalary };
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
  const annotationSalary = useAnnotationSalary(salary, 5000);

  return { data, annotationSalary };
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

  const annotationSalary = useAnnotationSalary(salary);

  return { data, annotationSalary };
}
