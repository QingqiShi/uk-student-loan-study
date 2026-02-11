"use client";

import { useDeferredValue } from "react";
import { ChartBase } from "./charts/ChartBase";
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

  // Defer annotation so slider interactions aren't blocked by chart re-renders.
  // The chart data itself doesn't change with salary (it's a full salary sweep),
  // but the annotation position does, and re-rendering the chart is expensive.
  const deferredSalary = useDeferredValue(annotationSalary);
  const deferredValue = useDeferredValue(annotationValue);

  const annotations =
    deferredSalary !== undefined && deferredValue !== undefined
      ? [
          {
            x: deferredSalary,
            y: deferredValue,
            label: currencyFormatter.format(deferredValue),
            color: "var(--chart-3)",
          },
        ]
      : [];

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="salary"
      xFormatter={(v) => currencyFormatter.format(v)}
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Chart showing total student loan repayment amount by annual salary. Lower earners pay less due to loan write-off, while middle earners often pay the most."
      chartConfig={chartConfig}
      series={[{ dataKey: "value" }]}
      showTooltip={false}
      annotations={annotations}
      xDomain={[MIN_SALARY, MAX_SALARY]}
      margin={{ top: 25, right: 25, bottom: 8, left: 25 }}
    />
  );
}
