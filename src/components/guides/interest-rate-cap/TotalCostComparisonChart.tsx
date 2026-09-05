"use client";

import type { ChartSeriesConfig } from "@/components/charts/ChartBase";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { formatPercent } from "@/lib/format";
import { getAnnualInterestRate, NO_INTEREST_CAP } from "@/lib/loans/interest";
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";

const STARTING_BALANCE = 45_000;
const SALARY_GROWTH = 0.03;
const HIGH_RPI = 7;
const capPct = formatPercent(CURRENT_RATES.interestCap);

const chartConfig = {
  uncapped: {
    label: "Without cap (7% RPI)",
    color: "var(--chart-2)", // costlier path — the cost clay
  },
  capped: {
    label: `With ${capPct} cap`,
    color: "var(--chart-1)", // better outcome — principal green
  },
} satisfies ChartConfig;

const series: ChartSeriesConfig[] = [
  { dataKey: "uncapped" },
  { dataKey: "capped" },
];

function simulateTotalPaid(startingSalary: number, capRate: number): number {
  const boe = CURRENT_RATES.boeBaseRate;
  const monthlyThreshold = PLAN_CONFIGS.PLAN_2.monthlyThreshold;
  const repaymentRate = PLAN_CONFIGS.PLAN_2.repaymentRate;
  const writeOffMonths = PLAN_CONFIGS.PLAN_2.writeOffYears * 12;

  let balance = STARTING_BALANCE;
  let salary = startingSalary;
  let totalPaid = 0;

  for (let month = 1; month <= writeOffMonths; month++) {
    if (month > 0 && month % 12 === 0) {
      salary *= 1 + SALARY_GROWTH;
    }

    const annualRate = getAnnualInterestRate(
      "PLAN_2",
      salary,
      HIGH_RPI,
      boe,
      undefined,
      capRate,
    );

    const monthlyInterest = balance * (annualRate / 100 / 12);
    balance += monthlyInterest;

    const monthlyRepayment = Math.min(
      Math.max(0, (salary / 12 - monthlyThreshold) * repaymentRate),
      balance,
    );
    balance -= monthlyRepayment;
    totalPaid += monthlyRepayment;

    if (balance <= 0) break;
  }

  return totalPaid;
}

function buildData() {
  const points: Array<{ salary: number; uncapped: number; capped: number }> =
    [];

  for (let salary = 25000; salary <= 80000; salary += 1000) {
    points.push({
      salary,
      uncapped: simulateTotalPaid(salary, NO_INTEREST_CAP),
      capped: simulateTotalPaid(salary, CURRENT_RATES.interestCap),
    });
  }

  return points;
}

const data = buildData();

function formatSalary(value: number): string {
  return `\u00A3${String(Math.round(value / 1000))}k`;
}

function formatCurrency(value: number): string {
  return `\u00A3${String(Math.round(value / 1000))}k`;
}

export function TotalCostComparisonChart() {
  return (
    <div className="h-75 sm:h-90">
      <ChartBase
        type="line"
        data={data}
        xDataKey="salary"
        xLabel="Starting salary"
        xFormatter={formatSalary}
        yLabel="Total repaid"
        yFormatter={formatCurrency}
        ariaLabel={`Line chart comparing total repayment by salary with and without the ${capPct} interest rate cap, assuming 7% RPI`}
        chartConfig={chartConfig}
        series={series}
        showLegend
      />
    </div>
  );
}
