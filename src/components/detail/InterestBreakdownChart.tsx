"use client";

import type { ChartConfig } from "@/components/ui/chart";
import type { DetailSeriesResult } from "@/workers/simulation.worker";
import { LazyChartBase } from "@/components/charts/LazyChartBase";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";

const chartConfig = {
  interestPaid: {
    label: "Interest paid",
    color: "var(--chart-3)",
  },
  interestUnpaid: {
    label: "Interest unpaid",
    color: "var(--destructive)",
  },
  principalPortion: {
    label: "Principal",
    color: "oklch(0.55 0 0)",
  },
} satisfies ChartConfig;

interface AnnualInterestChartProps {
  data: DetailSeriesResult["annualBreakdown"];
}

export function AnnualInterestChart({ data }: AnnualInterestChartProps) {
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
    <LazyChartBase
      type="bar"
      data={data}
      xDataKey="year"
      xFormatter={(v) => `Year ${String(v)}`}
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Stacked bar chart showing annual interest accrual and principal payments"
      chartConfig={chartConfig}
      series={[
        { dataKey: "interestPaid", stackId: "annual" },
        { dataKey: "interestUnpaid", stackId: "annual" },
        { dataKey: "principalPortion", stackId: "annual" },
      ]}
      showLegend
    />
  );
}
