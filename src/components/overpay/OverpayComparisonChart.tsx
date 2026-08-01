"use client";

import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import type { OverpayAnalysisResult } from "@/lib/loans/overpayTypes";
import { isPresentValue } from "./figures";

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
  /** Null while the worker is still resolving — the frame holds its place. */
  analysis: OverpayAnalysisResult | null;
}

export function OverpayComparisonChart({
  analysis,
}: OverpayComparisonChartProps) {
  // Read off the analysis, not the store: the worker keeps returning the
  // previous result for a full round-trip after each toggle, so the store's
  // basis and the curve actually drawn disagree during that window. The ledger
  // directly beneath uses the same source, so the two panels always agree.
  const showPresentValue = isPresentValue(analysis);

  const caption = `Fig. 1 — Balance with vs without overpaying${
    showPresentValue ? " · present value" : ""
  }`;

  if (!analysis) {
    return (
      <ChartFrame
        fill
        caption={caption}
        // A placeholder in the figure slot, not an empty one: the caption fills
        // the header's first flex line on a phone, so a figure arriving later
        // wraps onto a second line and steals height from the chart body.
        // Reserving the slot now keeps the curve from jumping on load.
        figure={<Skeleton className="inline-block h-3.5 w-24 align-middle" />}
        figureTone="cost"
        bodyClassName="flex"
      >
        {/* No min-height: the fold's slot is only ~224px tall on a phone, and a
            floor taller than the body is silently clipped by the panel. */}
        <Skeleton className="size-full" />
      </ChartFrame>
    );
  }

  const { balanceTimeSeries } = analysis;

  // Sample data to reduce chart complexity (every 12 months)
  const sampledData = balanceTimeSeries.filter(
    (_, index) => index % 12 === 0 || index === balanceTimeSeries.length - 1,
  );

  if (sampledData.length === 0) {
    return (
      <ChartFrame
        fill
        caption={caption}
        bodyClassName="flex items-center justify-center text-muted-foreground"
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

  // No legend prop: the ledger sits directly beneath this panel carrying the
  // same two names against the same two line colours, so it keys the chart.
  return (
    <ChartFrame
      fill
      caption={caption}
      figure={`Peak ${currencyFormatter.format(peakBalance)}`}
      figureTone="cost"
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
