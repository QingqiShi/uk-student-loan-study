"use client";

import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { simulate } from "@/lib/loans/engine";

const EXAMPLE_BALANCE = 45_000;

const chartConfig = {
  plan2: {
    label: "Plan 2",
    color: "oklch(0.7 0.15 250)", // Blue
  },
  plan5: {
    label: "Plan 5",
    color: "oklch(0.7 0.15 150)", // Green
  },
} satisfies ChartConfig;

function buildData() {
  const points: Array<{ salary: number; plan2: number; plan5: number }> = [];

  for (let salary = 25000; salary <= 100000; salary += 1000) {
    const plan2Result = simulate({
      loans: [{ planType: "PLAN_2", balance: EXAMPLE_BALANCE }],
      annualSalary: salary,
    });
    const plan5Result = simulate({
      loans: [{ planType: "PLAN_5", balance: EXAMPLE_BALANCE }],
      annualSalary: salary,
    });
    points.push({
      salary,
      plan2: plan2Result.summary.totalPaid,
      plan5: plan5Result.summary.totalPaid,
    });
  }

  return points;
}

const data = buildData();

function formatSalaryCurrency(value: number): string {
  return `\u00a3${String(Math.round(value / 1000))}k`;
}

export function TotalRepaymentBySalaryChart() {
  return (
    <ChartBase
      type="line"
      data={data}
      xDataKey="salary"
      xLabel="Starting salary"
      xFormatter={formatSalaryCurrency}
      yLabel="Total repaid"
      yFormatter={formatSalaryCurrency}
      ariaLabel="Line chart comparing total repayment amount by salary for Plan 2 and Plan 5"
      chartConfig={chartConfig}
      series={[{ dataKey: "plan2" }, { dataKey: "plan5" }]}
      showLegend
    />
  );
}
