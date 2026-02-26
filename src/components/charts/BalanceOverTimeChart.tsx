"use client";

import dynamic from "next/dynamic";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { useBalanceOverTimeData } from "@/hooks/useChartData";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

const ChartBase = dynamic(
  () => import("./ChartBase").then((m) => m.ChartBase),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading chart"
      />
    ),
  },
);

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
      <Skeleton
        className="size-full"
        role="status"
        aria-label="Loading student loan repayment chart showing how long to pay off your loan"
      />
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
