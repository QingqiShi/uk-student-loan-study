"use client";

import { ChartBase } from "../charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import type { OverpayAnalysisResult } from "@/lib/loans/overpay-types";
import { currencyFormatter } from "@/constants";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

const chartConfig = {
  baselineBalance: {
    label: "Without overpaying",
    color: "oklch(0.7 0.15 50)", // Orange
  },
  overpayBalance: {
    label: "With overpaying",
    color: "var(--chart-1)", // Theme color
  },
} satisfies ChartConfig;

interface OverpayComparisonChartProps {
  analysis: OverpayAnalysisResult;
}

export function OverpayComparisonChart({
  analysis,
}: OverpayComparisonChartProps) {
  const { balanceTimeSeries } = analysis;
  const showPresentValue = useShowPresentValue();

  // Sample data to reduce chart complexity (every 12 months)
  const sampledData = balanceTimeSeries.filter(
    (_, index) => index % 12 === 0 || index === balanceTimeSeries.length - 1,
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

  return (
    <ChartBase
      type="line"
      data={sampledData}
      xDataKey="month"
      xLabel="Time"
      xFormatter={formatYear}
      yLabel={showPresentValue ? "Balance (inflation-adjusted)" : "Balance"}
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel={
        showPresentValue
          ? "Student loan overpayment calculator chart comparing inflation-adjusted balance with and without overpaying over time"
          : "Student loan overpayment calculator chart comparing balance with and without overpaying over time"
      }
      chartConfig={chartConfig}
      series={[{ dataKey: "baselineBalance" }, { dataKey: "overpayBalance" }]}
      showLegend
      xDomain={[0, maxMonth]}
    />
  );
}

export default OverpayComparisonChart;
