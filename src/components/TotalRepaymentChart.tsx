"use client";

import { ChartBase } from "./ChartBase";
import { currencyFormatter } from "@/constants";
import { useTotalRepaymentData } from "@/hooks/useChartData";

export function TotalRepaymentChart() {
  const { data, annotationSalary, annotationValue } = useTotalRepaymentData();

  return (
    <ChartBase
      data={data}
      annotationSalary={annotationSalary}
      annotationValue={annotationValue}
      xAxisLabel="Salary"
      yAxisLabel="Total Repayment"
      xFormatter={(v) => currencyFormatter.format(v)}
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Chart showing total student loan repayment amount by annual salary. Lower earners pay less due to loan write-off, while middle earners often pay the most."
    />
  );
}

export default TotalRepaymentChart;
