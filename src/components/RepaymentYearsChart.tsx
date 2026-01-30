"use client";

import { ChartBase } from "./ChartBase";
import { currencyFormatter, yearsFormatter } from "@/constants";
import { useRepaymentYearsData } from "@/hooks/useChartData";

export function RepaymentYearsChart() {
  const { data, annotationSalary, annotationValue } = useRepaymentYearsData();

  return (
    <ChartBase
      data={data}
      annotationSalary={annotationSalary}
      annotationValue={annotationValue}
      xAxisLabel="Salary"
      yAxisLabel="Time to Pay Off (Years)"
      xFormatter={(v) => currencyFormatter.format(v)}
      yFormatter={yearsFormatter}
      ariaLabel="Chart showing years to pay off student loan by annual salary. Higher earners pay off faster, lower earners reach write-off at 30 years."
    />
  );
}

export default RepaymentYearsChart;
