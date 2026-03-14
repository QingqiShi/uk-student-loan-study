"use client";

import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

const MULTIPLIER = 4.5;

const chartConfig = {
  plan2: {
    label: "Plan 2",
    color: "var(--chart-1)",
  },
  plan5: {
    label: "Plan 5",
    color: "oklch(0.7 0.15 50)",
  },
} satisfies ChartConfig;

function buildChartData() {
  const data: Array<{ salary: number; plan2: number; plan5: number }> = [];

  for (let salary = 25000; salary <= 80000; salary += 1000) {
    const monthlyIncome = salary / 12;

    const plan2Monthly = Math.max(
      0,
      (monthlyIncome - PLAN_CONFIGS.PLAN_2.monthlyThreshold) *
        PLAN_CONFIGS.PLAN_2.repaymentRate,
    );
    const plan5Monthly = Math.max(
      0,
      (monthlyIncome - PLAN_CONFIGS.PLAN_5.monthlyThreshold) *
        PLAN_CONFIGS.PLAN_5.repaymentRate,
    );

    data.push({
      salary,
      plan2: Math.round(plan2Monthly * 12 * MULTIPLIER),
      plan5: Math.round(plan5Monthly * 12 * MULTIPLIER),
    });
  }

  return data;
}

const data = buildChartData();

const xFormatter = (value: number) => `£${String(value / 1000)}k`;
const yFormatter = (value: number) => `£${String(Math.round(value / 1000))}k`;

export function BorrowingReductionChart() {
  return (
    <ChartBase
      type="line"
      data={data}
      xDataKey="salary"
      xLabel="Annual salary"
      xFormatter={xFormatter}
      yLabel="Mortgage reduction"
      yFormatter={yFormatter}
      ariaLabel="Line chart showing estimated mortgage borrowing reduction caused by student loan repayments for Plan 2 and Plan 5"
      chartConfig={chartConfig}
      series={[{ dataKey: "plan2" }, { dataKey: "plan5" }]}
      showLegend
    />
  );
}
