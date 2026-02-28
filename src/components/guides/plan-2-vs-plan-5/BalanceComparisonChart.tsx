"use client";

import { useState } from "react";
import type { ChartAnnotationConfig } from "@/components/charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import { simulate } from "@/lib/loans/engine";
import { PLAN_CONFIGS } from "@/lib/loans/plans";

const SALARY_OPTIONS = [30000, 50000, 70000] as const;
type SalaryOption = (typeof SALARY_OPTIONS)[number];

const EXAMPLE_BALANCE = 45_000;

const chartConfig = {
  plan2: {
    label: "Plan 2",
    color: "oklch(0.7 0.15 250)",
  },
  plan5: {
    label: "Plan 5",
    color: "oklch(0.7 0.15 150)",
  },
} satisfies ChartConfig;

const PLAN_2_WRITEOFF_MONTHS = PLAN_CONFIGS.PLAN_2.writeOffYears * 12;
const PLAN_5_WRITEOFF_MONTHS = PLAN_CONFIGS.PLAN_5.writeOffYears * 12;

function buildData(salary: number) {
  const plan2Result = simulate({
    loans: [{ planType: "PLAN_2", balance: EXAMPLE_BALANCE }],
    annualSalary: salary,
  });
  const plan5Result = simulate({
    loans: [{ planType: "PLAN_5", balance: EXAMPLE_BALANCE }],
    annualSalary: salary,
  });

  const maxMonths = PLAN_5_WRITEOFF_MONTHS;
  const points: Array<{ month: number; plan2: number; plan5: number }> = [];

  for (let m = 0; m < maxMonths; m++) {
    const plan2Balance =
      m < plan2Result.snapshots.length && m < PLAN_2_WRITEOFF_MONTHS
        ? (plan2Result.snapshots[m].loans[0]?.closingBalance ?? 0)
        : 0;
    const plan5Balance =
      m < plan5Result.snapshots.length
        ? (plan5Result.snapshots[m].loans[0]?.closingBalance ?? 0)
        : 0;

    points.push({ month: m, plan2: plan2Balance, plan5: plan5Balance });
  }

  return points;
}

const annotations: ChartAnnotationConfig[] = [
  {
    x: PLAN_2_WRITEOFF_MONTHS,
    label: `Plan 2 write-off (${String(PLAN_CONFIGS.PLAN_2.writeOffYears)}yr)`,
    color: "oklch(0.7 0.15 250)",
    labelAnchor: "end",
    labelOffsetY: 5,
  },
  {
    x: PLAN_5_WRITEOFF_MONTHS - 1,
    label: `Plan 5 write-off (${String(PLAN_CONFIGS.PLAN_5.writeOffYears)}yr)`,
    color: "oklch(0.7 0.15 150)",
    labelAnchor: "end",
    labelOffsetY: -10,
  },
];

function formatYear(month: number): string {
  const year = Math.round(month / 12);
  return `${String(year)}yr`;
}

function formatCurrency(value: number): string {
  return `\u00a3${String(Math.round(value / 1000))}k`;
}

function formatSalaryLabel(salary: number): string {
  return `\u00a3${String(salary / 1000)}k`;
}

export function BalanceComparisonChart() {
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
          xDataKey="month"
          xLabel="Years since repayment"
          xFormatter={formatYear}
          yLabel="Balance"
          yFormatter={formatCurrency}
          ariaLabel="Area chart comparing loan balance over time for Plan 2 and Plan 5"
          chartConfig={chartConfig}
          series={[{ dataKey: "plan2" }, { dataKey: "plan5" }]}
          annotations={annotations}
          showLegend
        />
      </div>
    </div>
  );
}
