"use client";

import { ChartBase, type ChartAnnotationConfig } from "../charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import type { OverpayAnalysisResult } from "@/lib/loans/overpay-types";
import { currencyFormatter } from "@/constants";

const chartConfig = {
  baselineNetWorth: {
    label: "Do nothing",
    color: "oklch(0.7 0.15 50)", // Orange
  },
  overpayNetWorth: {
    label: "Overpay",
    color: "var(--chart-1)", // Theme color
  },
  investNetWorth: {
    label: "Invest",
    color: "oklch(0.6 0.15 250)", // Blue
  },
} satisfies ChartConfig;

interface OverpayComparisonChartProps {
  analysis: OverpayAnalysisResult;
}

export function OverpayComparisonChart({
  analysis,
}: OverpayComparisonChartProps) {
  const { netWorthTimeSeries, writeOffMonth, crossoverMonth } = analysis;

  // Sample data to reduce chart complexity (every 12 months)
  const sampledData = netWorthTimeSeries.filter(
    (_, index) => index % 12 === 0 || index === netWorthTimeSeries.length - 1,
  );

  if (sampledData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Enter an overpayment amount to see the comparison
      </div>
    );
  }

  const formatYear = (month: number) =>
    `Year ${String(Math.floor(month / 12))}`;

  const maxMonth = sampledData[sampledData.length - 1]?.month ?? 0;

  const annotations: ChartAnnotationConfig[] = [];
  if (writeOffMonth) {
    annotations.push({
      x: writeOffMonth,
      label: "Write-off",
      labelPosition: "insideTopRight",
    });
  }
  if (crossoverMonth) {
    annotations.push({
      x: crossoverMonth,
      label: "Crossover",
      color: "var(--chart-4)",
      labelPosition: "insideTopLeft",
      strokeDasharray: "3 3",
    });
  }

  return (
    <ChartBase
      type="line"
      data={sampledData}
      xDataKey="month"
      xLabel="Time"
      xFormatter={formatYear}
      yLabel="Net Worth"
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Net worth comparison chart showing overpay vs invest scenarios over time"
      chartConfig={chartConfig}
      series={[
        { dataKey: "baselineNetWorth" },
        { dataKey: "overpayNetWorth" },
        { dataKey: "investNetWorth" },
      ]}
      annotations={annotations}
      showLegend
      xDomain={[0, maxMonth]}
    />
  );
}

export default OverpayComparisonChart;
