"use client";

import { ChartBase } from "./charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import {
  currencyFormatter,
  yearsFormatter,
  MIN_SALARY,
  MAX_SALARY,
} from "@/constants";
import { useRepaymentYearsData } from "@/hooks/useChartData";

const chartConfig = {
  value: {
    label: "Years",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function RepaymentYearsChart() {
  const { data, annotationSalary, annotationValue } = useRepaymentYearsData();

  const annotations =
    annotationSalary !== undefined && annotationValue !== undefined
      ? [
          {
            x: annotationSalary,
            y: annotationValue,
            label: yearsFormatter(annotationValue),
            color: "var(--chart-3)",
          },
        ]
      : [];

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="salary"
      xLabel="Salary"
      xFormatter={(v) => currencyFormatter.format(v)}
      yLabel="Time to Pay Off (Years)"
      yFormatter={yearsFormatter}
      ariaLabel="Chart showing years to pay off student loan by annual salary. Higher earners pay off faster, lower earners reach write-off at 30 years."
      chartConfig={chartConfig}
      series={[{ dataKey: "value" }]}
      annotations={annotations}
      xDomain={[MIN_SALARY, MAX_SALARY]}
    />
  );
}

export default RepaymentYearsChart;
