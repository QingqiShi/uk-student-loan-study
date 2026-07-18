"use client";

import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { formatYearFromMonth } from "@/lib/format";
import type { DetailSeriesResult } from "@/workers/simulation.worker";

const chartConfig = {
  balance: {
    label: "Balance",
    // Spruce trajectory (chart-1). Brick (--signal) is spent only on the peak
    // marker below, keeping cost colour within the One-Signal budget — the
    // brick --chart-2 flooded the whole panel.
    color: "var(--chart-1)",
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
      color: "var(--signal)",
      labelAnchor: "end" as const,
      labelOffsetY: -8,
    });
  }

  if (writeOffMonth !== null) {
    annotations.push({
      x: writeOffMonth,
      label: "Written off",
      bottomLabel: "Write-off",
      color: "var(--muted-foreground)",
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
