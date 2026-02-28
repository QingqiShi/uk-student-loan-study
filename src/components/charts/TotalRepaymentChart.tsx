"use client";

import { useDeferredValue } from "react";
import type { ChartConfig } from "@/components/ui/chart";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter, MIN_SALARY, MAX_SALARY } from "@/constants";
import { useTotalRepaymentData } from "@/hooks/useChartData";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

const chartConfig = {
  value: {
    label: "Total Repayment by Salary",
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
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading UK student loan calculator results showing total repayment by salary"
      />
    );
  }

  const annotations =
    deferredSalary !== undefined && deferredValue !== undefined
      ? [
          {
            x: deferredSalary,
            y: deferredValue,
            label: currencyFormatter.format(deferredValue),
            bottomLabel: currencyFormatter.format(deferredSalary),
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
          ? "UK student loan calculator results showing inflation-adjusted total repayment by salary. Middle earners pay the most, while lower earners benefit from loan write-off."
          : "UK student loan calculator results showing total repayment by salary. Middle earners pay the most, while lower earners benefit from loan write-off."
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
