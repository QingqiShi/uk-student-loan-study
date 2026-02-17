"use client";

import { ChartBase } from "./charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useBalanceOverTimeData } from "@/hooks/useChartData";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function formatYear(month: number): string {
  const year = Math.round(month / 12).toString();
  return `Year ${year}`;
}

export function BalanceOverTimeChart() {
  const { data } = useBalanceOverTimeData();
  const showPresentValue = useShowPresentValue();

  if (data.length === 0) {
    return (
      <div
        className="flex h-full items-center justify-center"
        role="status"
        aria-label="Loading chart"
      >
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="month"
      xLabel="Time"
      xFormatter={formatYear}
      yLabel={showPresentValue ? "Balance (inflation-adjusted)" : "Balance"}
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel={
        showPresentValue
          ? "Chart showing your inflation-adjusted loan balance decreasing over time. The balance starts at your total loan amount and decreases as you make repayments."
          : "Chart showing your loan balance decreasing over time. The balance starts at your total loan amount and decreases as you make repayments."
      }
      chartConfig={chartConfig}
      series={[{ dataKey: "balance" }]}
    />
  );
}
