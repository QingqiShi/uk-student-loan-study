"use client";

import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import type { ChartConfig } from "@/components/ui/chart";
import { currencyFormatter } from "@/constants";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";
import type { OverpayAnalysisResult } from "@/lib/loans/overpayTypes";

const chartConfig = {
  baselineBalance: {
    label: "Without overpaying",
    color: "var(--chart-overpay-baseline)",
  },
  overpayBalance: {
    label: "With overpaying",
    color: "var(--chart-1)", // better outcome — principal green (data token, not chrome brand)
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

  const caption = `Fig. 1 — Balance with vs without overpaying${
    showPresentValue ? " · real terms" : ""
  }`;

  if (sampledData.length === 0) {
    return (
      <ChartFrame
        className="flex h-full flex-col"
        caption={caption}
        bodyClassName="flex min-h-0 flex-1 items-center justify-center text-muted-foreground"
      >
        <span>Enter an overpayment amount to see the comparison</span>
      </ChartFrame>
    );
  }

  const formatYear = (month: number) =>
    `Year ${String(Math.floor(month / 12))}`;

  const maxMonth = sampledData[sampledData.length - 1]?.month ?? 0;
  const peakBalance = sampledData.reduce(
    (max, point) => Math.max(max, point.baselineBalance),
    0,
  );

  return (
    <ChartFrame
      className="flex h-full flex-col"
      caption={caption}
      figure={`Peak ${currencyFormatter.format(peakBalance)}`}
      figureTone="cost"
      bodyClassName="min-h-0 flex-1"
      legend={[
        { label: "Without overpaying", color: "var(--chart-overpay-baseline)" },
        { label: "With overpaying", color: "var(--chart-1)" },
      ]}
    >
      <ChartBase
        type="line"
        data={sampledData}
        xDataKey="month"
        xLabel="Time"
        xFormatter={formatYear}
        yLabel={showPresentValue ? "Balance (present value)" : "Balance"}
        yFormatter={(v) => currencyFormatter.format(v)}
        ariaLabel={
          showPresentValue
            ? "Student loan overpayment calculator chart comparing present-value balance with and without overpaying over time"
            : "Student loan overpayment calculator chart comparing balance with and without overpaying over time"
        }
        chartConfig={chartConfig}
        series={[{ dataKey: "baselineBalance" }, { dataKey: "overpayBalance" }]}
        xDomain={[0, maxMonth]}
      />
    </ChartFrame>
  );
}
