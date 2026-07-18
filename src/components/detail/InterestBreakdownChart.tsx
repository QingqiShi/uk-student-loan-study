"use client";

import { LazyChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import type { DetailSeriesResult } from "@/workers/simulation.worker";

const chartConfig = {
  interestPaid: {
    label: "Interest paid",
    color: "var(--signal)",
  },
  interestUnpaid: {
    label: "Interest unpaid",
    color: "var(--signal)",
  },
  principalPortion: {
    label: "Principal",
    color: "var(--primary)",
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

  // Thin the x-axis labels: a category bar axis renders a tick per year, so
  // labelling all ~30 years overprints into an unreadable smear. Show a label
  // only at ~6 evenly-spaced milestones (always incl. first + last) to match
  // the cadence the line charts already use.
  //
  // recharts calls the axis tickFormatter as (value, index); ChartBase's bar
  // tooltip calls it as xFormatter(year) with no index. We key off that: blank
  // only the non-milestone AXIS ticks, and always return the full "Year N" for
  // the tooltip (index === undefined) so hovering still names the year.
  const lastIndex = data.length - 1;
  const step = Math.max(1, Math.ceil(data.length / 6));

  return (
    <LazyChartBase
      type="bar"
      data={data}
      xDataKey="year"
      xFormatter={(v: number, index?: number) => {
        // No index → tooltip title: always name the year.
        if (index === undefined) return `Year ${String(v)}`;
        const isMilestone = index % step === 0 || index === lastIndex;
        return isMilestone ? `Year ${String(v)}` : "";
      }}
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Stacked bar chart showing annual interest accrual and principal payments"
      chartConfig={chartConfig}
      series={[
        { dataKey: "interestPaid", stackId: "annual" },
        { dataKey: "interestUnpaid", stackId: "annual" },
        { dataKey: "principalPortion", stackId: "annual" },
      ]}
    />
  );
}
