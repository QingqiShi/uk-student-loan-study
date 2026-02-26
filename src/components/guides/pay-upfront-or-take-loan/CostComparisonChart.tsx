"use client";

import dynamic from "next/dynamic";
import type { ChartConfig } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { simulate } from "@/lib/loans/engine";
import { TUITION_FEE_CAP } from "@/lib/loans/plans";

const ChartBase = dynamic(
  () => import("@/components/charts/ChartBase").then((m) => m.ChartBase),
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

const TUITION_COST = TUITION_FEE_CAP * 3;

const chartConfig = {
  loanCost: {
    label: "Loan (flat salary)",
    color: "var(--chart-1)",
  },
  loanCostWithGrowth: {
    label: "Loan (4% annual growth)",
    color: "var(--chart-3)",
  },
  upfrontCost: {
    label: "Upfront cost",
    color: "oklch(0.7 0.15 50)",
  },
} satisfies ChartConfig;

function buildChartData() {
  const points: Array<{
    salary: number;
    loanCost: number;
    loanCostWithGrowth: number;
    upfrontCost: number;
  }> = [];

  for (let salary = 25000; salary <= 100000; salary += 1000) {
    const flatResult = simulate({
      loans: [{ planType: "PLAN_5", balance: TUITION_COST }],
      annualSalary: salary,
    });
    const growthResult = simulate({
      loans: [{ planType: "PLAN_5", balance: TUITION_COST }],
      annualSalary: salary,
      salaryGrowthRate: 0.04,
    });
    points.push({
      salary,
      loanCost: Math.round(flatResult.summary.totalPaid),
      loanCostWithGrowth: Math.round(growthResult.summary.totalPaid),
      upfrontCost: TUITION_COST,
    });
  }

  return points;
}

const data = buildChartData();

const xFormatter = (value: number) => `£${String(value / 1000)}k`;
const yFormatter = (value: number) => `£${String(Math.round(value / 1000))}k`;

export function CostComparisonChart() {
  return (
    <ChartBase
      type="line"
      data={data}
      xDataKey="salary"
      xLabel="Starting annual salary"
      xFormatter={xFormatter}
      yLabel="Total cost"
      yFormatter={yFormatter}
      ariaLabel="Line chart comparing total cost of taking a student loan at flat and growing salaries versus paying tuition upfront"
      chartConfig={chartConfig}
      series={[
        { dataKey: "loanCost" },
        { dataKey: "loanCostWithGrowth" },
        { dataKey: "upfrontCost" },
      ]}
      showLegend
    />
  );
}
