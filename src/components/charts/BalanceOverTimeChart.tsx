"use client";

import { ChartBase } from "./ChartBase";
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
        aria-label="Loading student loan repayment chart showing how long to pay off your loan"
      >
        <Skeleton className="size-full" />
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
          ? "Student loan repayment chart showing how long to pay off your loan. Inflation-adjusted balance decreases over time as you make repayments."
          : "Student loan repayment chart showing how long to pay off your loan. Balance decreases over time as you make repayments."
      }
      chartConfig={chartConfig}
      series={[{ dataKey: "balance" }]}
    />
  );
}
