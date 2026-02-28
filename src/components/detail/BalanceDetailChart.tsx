"use client";

import type { ChartConfig } from "@/components/ui/chart";
import type { DetailSeriesResult } from "@/workers/simulation.worker";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { formatYearFromMonth } from "@/lib/format";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface BalanceDetailChartProps {
  data: DetailSeriesResult["balanceSeries"];
  peakBalanceMonth: number;
  peakBalance: number;
  writeOffMonth: number | null;
}

export function BalanceDetailChart({
  data,
  peakBalanceMonth,
  peakBalance,
  writeOffMonth,
}: BalanceDetailChartProps) {
  if (data.length === 0) {
    return (
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading balance chart"
      />
    );
  }

  const annotations = [];

  if (peakBalanceMonth > 0) {
    annotations.push({
      x: peakBalanceMonth,
      y: peakBalance,
      label: `Peak ${currencyFormatter.format(peakBalance)}`,
      color: "var(--chart-2)",
      labelAnchor: "end" as const,
      labelOffsetY: -8,
    });
  }

  if (writeOffMonth !== null) {
    annotations.push({
      x: writeOffMonth,
      label: "Written off",
      bottomLabel: "Write-off",
      color: "var(--status-warning-foreground)",
    });
  }

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="month"
      xLabel="Time"
      xFormatter={formatYearFromMonth}
      yLabel="Balance"
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Student loan balance trajectory over time"
      chartConfig={chartConfig}
      series={[{ dataKey: "balance" }]}
      annotations={annotations}
    />
  );
}
