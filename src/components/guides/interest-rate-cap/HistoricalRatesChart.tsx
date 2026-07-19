"use client";

import type { ChartSeriesConfig } from "@/components/charts/ChartBase";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { HISTORICAL_RATES, INTEREST_CAP } from "./historical-rates";

const chartData = HISTORICAL_RATES.map((d) => ({
  ...d,
  above: Math.max(0, d.maxRate - INTEREST_CAP),
  below: Math.min(d.maxRate, INTEREST_CAP),
}));

const chartConfig = {
  below: {
    label: "Below cap",
    color: "var(--chart-2)",
  },
  above: {
    label: "Above 6% cap",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const series: ChartSeriesConfig[] = [
  { dataKey: "below", stackId: "rate" },
  { dataKey: "above", stackId: "rate" },
];

function formatYear(value: number): string {
  const entry = chartData.find((d) => d.year === value);
  return entry?.label ?? String(value);
}

function formatRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function HistoricalRatesChart() {
  return (
    <div className="h-75 sm:h-90">
      <ChartBase
        type="bar"
        data={chartData}
        xDataKey="year"
        xFormatter={formatYear}
        yFormatter={formatRate}
        yDomain={[0, 9]}
        ariaLabel="Bar chart showing maximum Plan 2 interest rate per academic year from 2012 to 2025, with bars coloured to show portions above and below the 6% cap"
        chartConfig={chartConfig}
        series={series}
        horizontalAnnotations={[
          {
            y: INTEREST_CAP,
            label: "6% cap",
            color: "var(--chart-1)",
            strokeDasharray: "6 4",
          },
        ]}
        showLegend
      />
    </div>
  );
}
