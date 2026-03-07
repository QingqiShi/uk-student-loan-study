"use client";

import { useState } from "react";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { simulate } from "@/lib/loans/engine";
import { CURRENT_RATES } from "@/lib/loans/plans";
import { toPresent } from "@/utils/presentValue";

const SALARY_OPTIONS = [30000, 50000, 70000] as const;
type SalaryOption = (typeof SALARY_OPTIONS)[number];

const EXAMPLE_BALANCE = 45_000;
const CPI_RATE = 0.02;
const RPI_RATE = CURRENT_RATES.rpi / 100;

const chartConfig = {
  nominal: {
    label: "Nominal",
    color: "oklch(0.7 0.15 250)",
  },
  cpiAdjusted: {
    label: "CPI-adjusted",
    color: "oklch(0.7 0.15 150)",
  },
  rpiAdjusted: {
    label: "RPI-adjusted",
    color: "oklch(0.7 0.15 50)",
  },
} satisfies ChartConfig;

interface DataPoint {
  year: number;
  nominal: number;
  cpiAdjusted: number;
  rpiAdjusted: number;
}

function buildData(salary: number): DataPoint[] {
  const result = simulate({
    loans: [{ planType: "PLAN_5", balance: EXAMPLE_BALANCE }],
    annualSalary: salary,
  });

  const points: DataPoint[] = [];

  for (let m = 0; m < result.snapshots.length; m += 12) {
    const snapshot = result.snapshots[m];
    const balance = snapshot.loans[0]?.closingBalance ?? 0;
    if (balance <= 0) break;

    points.push({
      year: m / 12,
      nominal: balance,
      cpiAdjusted: toPresent(balance, CPI_RATE, m),
      rpiAdjusted: toPresent(balance, RPI_RATE, m),
    });
  }

  return points;
}

function formatYear(year: number): string {
  return `${String(year)}yr`;
}

function formatCurrency(value: number): string {
  return `\u00a3${String(Math.round(value / 1000))}k`;
}

function formatSalaryLabel(salary: number): string {
  return `\u00a3${String(salary / 1000)}k`;
}

export function InflationComparisonChart() {
  const [salary, setSalary] = useState<SalaryOption>(50000);
  const data = buildData(salary);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">
          Salary:
        </span>
        <div className="flex gap-1">
          {SALARY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                setSalary(option);
              }}
              className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                salary === option
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {formatSalaryLabel(option)}
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
          ariaLabel="Area chart comparing nominal, CPI-adjusted, and RPI-adjusted loan balance over time for a Plan 5 loan"
          chartConfig={chartConfig}
          series={[
            { dataKey: "nominal" },
            { dataKey: "cpiAdjusted" },
            { dataKey: "rpiAdjusted" },
          ]}
          showLegend
        />
      </div>
    </div>
  );
}
