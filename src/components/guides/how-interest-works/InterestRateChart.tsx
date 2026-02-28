"use client";

import type { ChartSeriesConfig } from "@/components/charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { getAnnualInterestRate } from "@/lib/loans/interest";
import { CURRENT_RATES } from "@/lib/loans/plans";

const SALARY_MIN = 20_000;
const SALARY_MAX = 80_000;
const SALARY_STEP = 1_000;

function buildChartData() {
  const data: Array<{
    salary: number;
    plan2: number;
    plan5: number;
  }> = [];

  for (let salary = SALARY_MIN; salary <= SALARY_MAX; salary += SALARY_STEP) {
    data.push({
      salary,
      plan2: getAnnualInterestRate(
        "PLAN_2",
        salary,
        CURRENT_RATES.rpi,
        CURRENT_RATES.boeBaseRate,
      ),
      plan5: getAnnualInterestRate(
        "PLAN_5",
        salary,
        CURRENT_RATES.rpi,
        CURRENT_RATES.boeBaseRate,
      ),
    });
  }

  return data;
}

const chartConfig: ChartConfig = {
  plan2: {
    label: "Plan 2",
    color: "var(--chart-1)",
  },
  plan5: {
    label: "Plan 5",
    color: "var(--chart-2)",
  },
};

const series: ChartSeriesConfig[] = [
  { dataKey: "plan2" },
  { dataKey: "plan5" },
];

function formatSalary(value: number): string {
  return `\u00A3${String(Math.round(value / 1000))}k`;
}

function formatRate(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function InterestRateChart() {
  const data = buildChartData();

  return (
    <div className="h-75 sm:h-90">
      <ChartBase
        type="line"
        data={data}
        xDataKey="salary"
        xLabel="Annual Salary"
        xFormatter={formatSalary}
        yLabel="Interest Rate"
        yFormatter={formatRate}
        ariaLabel="Line chart comparing annual interest rates by salary for Plan 2 and Plan 5"
        chartConfig={chartConfig}
        series={series}
        showLegend
      />
    </div>
  );
}
