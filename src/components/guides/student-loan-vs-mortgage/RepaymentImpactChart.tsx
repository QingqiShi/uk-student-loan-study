"use client";

import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

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
  const salaries: number[] = [];
  for (let s = 25000; s <= 80000; s += 1000) {
    salaries.push(s);
  }

  return salaries.map((salary) => {
    const monthlyIncome = salary / 12;
    const plan2Repayment = Math.max(
      0,
      (monthlyIncome - PLAN_CONFIGS.PLAN_2.monthlyThreshold) *
        PLAN_CONFIGS.PLAN_2.repaymentRate,
    );
    const plan5Repayment = Math.max(
      0,
      (monthlyIncome - PLAN_CONFIGS.PLAN_5.monthlyThreshold) *
        PLAN_CONFIGS.PLAN_5.repaymentRate,
    );
    return {
      salary,
      plan2: Math.round(plan2Repayment * 100) / 100,
      plan5: Math.round(plan5Repayment * 100) / 100,
    };
  });
}

const data = buildChartData();

const xFormatter = (value: number) => `£${String(value / 1000)}k`;
const yFormatter = (value: number) => `£${String(Math.round(value))}/mo`;

export function RepaymentImpactChart() {
  return (
    <ChartBase
      type="line"
      data={data}
      xDataKey="salary"
      xLabel="Annual salary"
      xFormatter={xFormatter}
      yLabel="Monthly repayment"
      yFormatter={yFormatter}
      ariaLabel="Line chart showing monthly student loan repayment by salary for Plan 2 and Plan 5"
      chartConfig={chartConfig}
      series={[{ dataKey: "plan2" }, { dataKey: "plan5" }]}
      showLegend
    />
  );
}
