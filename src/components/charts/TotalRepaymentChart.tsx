"use client";

import { useDeferredValue } from "react";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter, MIN_SALARY, MAX_SALARY } from "@/constants";
import { useTotalRepaymentData } from "@/hooks/useChartData";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

const chartConfig = {
  value: {
    label: "Total Repayment by Salary",
    color: "var(--chart-1)", // principal green — clay --signal marks only the peak
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
            color: "var(--signal)",
          },
        ]
      : [];

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="salary"
      xFormatter={(v) => currencyFormatter.format(v)}
      yLabel={showPresentValue ? "Total repayment (present value)" : undefined}
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel={
        showPresentValue
          ? "UK student loan calculator results showing present-value total repayment by salary. Middle earners pay the most, while lower earners benefit from loan write-off."
          : "UK student loan calculator results showing total repayment by salary. Middle earners pay the most, while lower earners benefit from loan write-off."
      }
      chartConfig={chartConfig}
      series={[{ dataKey: "value" }]}
      interactionMode="none"
      annotations={annotations}
      xDomain={[MIN_SALARY, MAX_SALARY]}
      margin={{
        // Named rather than inherited: the salary tag rides the annotation all
        // the way to £150,000, so this chart still needs the gutter on a phone,
        // where the default one goes away with the ticks. At 16 the tag and the
        // end tick were both sliced — "£150,00".
        right: 48,
        // The x-axis carries no label here, so it needs less room under the ticks.
        bottom: 8,
      }}
    />
  );
}
