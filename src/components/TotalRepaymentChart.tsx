"use client";

import { ChartBase } from "./charts";
import type { ChartConfig } from "@/components/ui/chart";
import { currencyFormatter, MIN_SALARY, MAX_SALARY } from "@/constants";
import { useTotalRepaymentData } from "@/hooks/useChartData";

const chartConfig = {
  value: {
    label: "Total Repayment",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function TotalRepaymentChart() {
  const { data, annotationSalary, annotationValue } = useTotalRepaymentData();

  const annotations =
    annotationSalary !== undefined && annotationValue !== undefined
      ? [
          {
            x: annotationSalary,
            y: annotationValue,
            label: currencyFormatter.format(annotationValue),
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
      yLabel="Total Repayment"
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Chart showing total student loan repayment amount by annual salary. Lower earners pay less due to loan write-off, while middle earners often pay the most."
      chartConfig={chartConfig}
      series={[{ dataKey: "value" }]}
      annotations={annotations}
      xDomain={[MIN_SALARY, MAX_SALARY]}
    />
  );
}

export default TotalRepaymentChart;
