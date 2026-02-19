"use client";

import { useDeferredValue } from "react";
import { ChartBase } from "./charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter, MIN_SALARY, MAX_SALARY } from "@/constants";
import { useTotalRepaymentData } from "@/hooks/useChartData";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

const chartConfig = {
  value: {
    label: "Total Repayment",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function TotalRepaymentChart() {
  const { data, annotationSalary, annotationValue } = useTotalRepaymentData();
  const showPresentValue = useShowPresentValue();

  // Defer annotation so slider interactions aren't blocked by chart re-renders.
  // The chart data itself doesn't change with salary (it's a full salary sweep),
  // but the annotation position does, and re-rendering the chart is expensive.
  const deferredSalary = useDeferredValue(annotationSalary);
  const deferredValue = useDeferredValue(annotationValue);

  if (data.length === 0) {
    return (
      <div
        className="flex h-full items-center justify-center"
        role="status"
        aria-label="Loading chart"
      >
        <Skeleton className="size-full" />
      </div>
    );
  }

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
      yLabel={
        showPresentValue ? "Total repayment (inflation-adjusted)" : undefined
      }
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel={
        showPresentValue
          ? "Chart showing inflation-adjusted total student loan repayment by annual salary. Lower earners pay less due to loan write-off, while middle earners often pay the most."
          : "Chart showing total student loan repayment amount by annual salary. Lower earners pay less due to loan write-off, while middle earners often pay the most."
      }
      chartConfig={chartConfig}
      series={[{ dataKey: "value" }]}
      interactionMode="none"
      annotations={annotations}
      xDomain={[MIN_SALARY, MAX_SALARY]}
      margin={{ top: 25, right: 25, bottom: 8, left: 25 }}
    />
  );
}
