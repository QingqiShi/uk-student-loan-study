"use client";

import type { ChartConfig } from "@/components/ui/chart";
import type { DetailSeriesResult } from "@/workers/simulation.worker";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { formatYearFromMonth } from "@/lib/format";

const chartConfig = {
  cumulativeInterest: {
    label: "Interest",
    color: "var(--chart-3)",
  },
  cumulativePrincipal: {
    label: "Principal",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

interface InterestBreakdownChartProps {
  data: DetailSeriesResult["interestBreakdown"];
}

export function InterestBreakdownChart({ data }: InterestBreakdownChartProps) {
  if (data.length === 0) {
    return (
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading interest breakdown chart"
      />
    );
  }

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="month"
      xLabel="Time"
      xFormatter={formatYearFromMonth}
      yLabel="Cumulative payments"
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Stacked area chart showing cumulative interest and principal portions of student loan repayments"
      chartConfig={chartConfig}
      series={[
        { dataKey: "cumulativeInterest", stackId: "breakdown" },
        { dataKey: "cumulativePrincipal", stackId: "breakdown" },
      ]}
      showLegend
    />
  );
}
