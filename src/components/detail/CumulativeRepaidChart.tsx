"use client";

import type { ChartConfig } from "@/components/ui/chart";
import type { DetailSeriesResult } from "@/workers/simulation.worker";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { formatYearFromMonth } from "@/lib/format";

const chartConfig = {
  cumulative: {
    label: "Cumulative Repaid",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface CumulativeRepaidChartProps {
  data: DetailSeriesResult["cumulativeRepaid"];
  writeOffMonth: number | null;
}

export function CumulativeRepaidChart({
  data,
  writeOffMonth,
}: CumulativeRepaidChartProps) {
  if (data.length === 0) {
    return (
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading cumulative repayment chart"
      />
    );
  }

  const annotations =
    writeOffMonth !== null
      ? [
          {
            x: writeOffMonth,
            label: "Written off",
            color: "var(--muted-foreground)",
            strokeDasharray: "4 4",
          },
        ]
      : [];

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="month"
      xLabel="Time"
      xFormatter={formatYearFromMonth}
      yLabel="Cumulative repaid"
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Cumulative student loan repayments over time"
      chartConfig={chartConfig}
      series={[{ dataKey: "cumulative" }]}
      annotations={annotations}
    />
  );
}
