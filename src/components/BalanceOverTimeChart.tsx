"use client";

import { ChartBase } from "./charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { currencyFormatter } from "@/constants";
import { useBalanceOverTimeData } from "@/hooks/useChartData";

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

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Enter loan details to see your balance over time
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
      yLabel="Balance"
      yFormatter={(v) => currencyFormatter.format(v)}
      ariaLabel="Chart showing your loan balance decreasing over time. The balance starts at your total loan amount and decreases as you make repayments."
      chartConfig={chartConfig}
      series={[{ dataKey: "balance" }]}
    />
  );
}
