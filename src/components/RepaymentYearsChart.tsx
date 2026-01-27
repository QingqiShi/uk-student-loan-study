"use client";

import { useRepaymentYearsData } from "@/hooks/useChartData";
import { currencyFormatter, yearsFormatter } from "@/constants";
import { ChartBase } from "./ChartBase";

export function RepaymentYearsChart() {
  const { data, annotationSalary } = useRepaymentYearsData();

  return (
    <ChartBase
      data={data}
      annotationSalary={annotationSalary}
      xAxisLabel="Salary"
      yAxisLabel="Time to Pay Off (Years)"
      xFormatter={currencyFormatter.format}
      yFormatter={yearsFormatter}
      ariaLabel="Chart showing years to pay off student loan by annual salary. Higher earners pay off faster, lower earners reach write-off at 30 years."
    />
  );
}

export default RepaymentYearsChart;
