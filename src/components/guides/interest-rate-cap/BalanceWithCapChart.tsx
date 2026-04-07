"use client";

import { useState } from "react";
import type { ChartSeriesConfig } from "@/components/charts/ChartBase";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { getAnnualInterestRate } from "@/lib/loans/interest";
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";
import { INTEREST_CAP } from "./historical-rates";

const RPI_OPTIONS = [
  {
    value: CURRENT_RATES.rpi,
    label: `${String(CURRENT_RATES.rpi)}% (current)`,
  },
  { value: 5, label: "5%" },
  { value: 7, label: "7%" },
  { value: 9, label: "9%" },
] as const;

type RpiOption = (typeof RPI_OPTIONS)[number]["value"];

const STARTING_BALANCE = 45_000;
const STARTING_SALARY = 35_000;
const SALARY_GROWTH = 0.03;

const chartConfig = {
  uncapped: {
    label: "Without cap",
    color: "var(--chart-5)",
  },
  capped: {
    label: "With 6% cap",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const series: ChartSeriesConfig[] = [
  { dataKey: "uncapped" },
  { dataKey: "capped" },
];

function simulateBalance(rpi: number, capRate: number | null) {
  const boe = CURRENT_RATES.boeBaseRate;
  const monthlyThreshold = PLAN_CONFIGS.PLAN_2.monthlyThreshold;
  const repaymentRate = PLAN_CONFIGS.PLAN_2.repaymentRate;
  const writeOffMonths = PLAN_CONFIGS.PLAN_2.writeOffYears * 12;

  let balance = STARTING_BALANCE;
  let salary = STARTING_SALARY;
  const points: number[] = [balance];

  for (let month = 1; month <= writeOffMonths; month++) {
    if (month > 0 && month % 12 === 0) {
      salary *= 1 + SALARY_GROWTH;
    }

    let annualRate = getAnnualInterestRate("PLAN_2", salary, rpi, boe);
    if (capRate !== null) {
      annualRate = Math.min(annualRate, capRate);
    }

    const monthlyInterest = balance * (annualRate / 100 / 12);
    balance += monthlyInterest;

    const monthlyRepayment = Math.max(
      0,
      (salary / 12 - monthlyThreshold) * repaymentRate,
    );
    balance = Math.max(0, balance - monthlyRepayment);

    if (balance <= 0) break;

    if (month % 12 === 0) {
      points.push(balance);
    }
  }

  return points;
}

function buildData(rpi: RpiOption) {
  const uncappedBalances = simulateBalance(rpi, null);
  const cappedBalances = simulateBalance(rpi, INTEREST_CAP);

  const maxYears = Math.max(uncappedBalances.length, cappedBalances.length);
  const data: Array<{ year: number; uncapped: number; capped: number }> = [];

  for (let y = 0; y < maxYears; y++) {
    data.push({
      year: y,
      uncapped: uncappedBalances[y] ?? 0,
      capped: cappedBalances[y] ?? 0,
    });
  }

  return data;
}

function formatYear(value: number): string {
  return `${String(Math.round(value))}yr`;
}

function formatCurrency(value: number): string {
  return `\u00A3${String(Math.round(value / 1000))}k`;
}

export function BalanceWithCapChart() {
  const [rpi, setRpi] = useState<RpiOption>(CURRENT_RATES.rpi);
  const data = buildData(rpi);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span
          id="rpi-label"
          className="text-sm font-medium text-muted-foreground"
        >
          RPI:
        </span>
        <div className="flex gap-1" role="group" aria-labelledby="rpi-label">
          {RPI_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setRpi(option.value);
              }}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                rpi === option.value
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <ChartBase
          type="area"
          data={data}
          xDataKey="year"
          xLabel="Years since repayment"
          xFormatter={formatYear}
          yLabel="Balance"
          yFormatter={formatCurrency}
          ariaLabel="Area chart comparing loan balance over time with and without the 6% interest rate cap"
          chartConfig={chartConfig}
          series={series}
          showLegend
        />
      </div>
    </div>
  );
}
