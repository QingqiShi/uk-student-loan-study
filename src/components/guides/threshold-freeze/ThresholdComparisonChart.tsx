"use client";

import type { ChartSeriesConfig } from "@/components/charts/ChartBase";
import { LazyChartBase as ChartBase } from "@/components/charts/LazyChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import { CURRENT_RATES } from "@/lib/loans/plans";

// Hardcoded because the chart models specific tax years and must not shift
// when the live config updates.
const BASE_THRESHOLD = 28_470; // Plan 2 threshold in 2025/26
const NEW_THRESHOLD = 29_385;
const RPI = CURRENT_RATES.rpi / 100; // e.g. 0.032

const TAX_YEARS = [
  "2025/26",
  "2026/27",
  "2027/28",
  "2028/29",
  "2029/30",
  "2030/31",
];

interface DataPoint {
  yearIndex: number;
  inflationLinked: number;
  oldPolicy: number;
  newPolicy: number;
}

function buildChartData(): DataPoint[] {
  const data: DataPoint[] = [];

  let inflationLinked = BASE_THRESHOLD;
  let oldPolicy = BASE_THRESHOLD;
  let newPolicy = BASE_THRESHOLD;

  for (let i = 0; i < TAX_YEARS.length; i++) {
    if (i === 0) {
      // 2025/26 — current year, all start at base
      inflationLinked = BASE_THRESHOLD;
      oldPolicy = BASE_THRESHOLD;
      newPolicy = BASE_THRESHOLD;
    } else if (i === 1) {
      // 2026/27 — April 2026
      inflationLinked = Math.round(inflationLinked * (1 + RPI));
      oldPolicy = BASE_THRESHOLD; // old policy: still frozen at £28,470
      newPolicy = NEW_THRESHOLD; // new policy: rises to £29,385
    } else if (i >= 2 && i <= 4) {
      // 2027/28 through 2029/30
      inflationLinked = Math.round(inflationLinked * (1 + RPI));
      oldPolicy = Math.round(oldPolicy * (1 + RPI)); // old policy: resumes RPI from 2027/28
      newPolicy = NEW_THRESHOLD; // new policy: frozen at £29,385
    } else {
      // 2030/31 — all resume RPI
      inflationLinked = Math.round(inflationLinked * (1 + RPI));
      oldPolicy = Math.round(oldPolicy * (1 + RPI));
      newPolicy = Math.round(newPolicy * (1 + RPI));
    }

    data.push({
      yearIndex: i,
      inflationLinked,
      oldPolicy,
      newPolicy,
    });
  }

  return data;
}

const chartConfig: ChartConfig = {
  inflationLinked: {
    label: "Inflation-linked",
    color: "var(--chart-1)",
  },
  oldPolicy: {
    label: "Old policy",
    color: "var(--chart-2)",
  },
  newPolicy: {
    label: "New policy",
    color: "var(--chart-3)",
  },
};

const series: ChartSeriesConfig[] = [
  { dataKey: "inflationLinked" },
  { dataKey: "oldPolicy" },
  { dataKey: "newPolicy" },
];

function formatTaxYear(value: number): string {
  return TAX_YEARS[value] ?? "";
}

function formatThreshold(value: number): string {
  return `£${String(Math.round(value / 1000))}k`;
}

export function ThresholdComparisonChart() {
  const data = buildChartData();

  return (
    <div className="h-75 sm:h-90">
      <ChartBase
        type="line"
        data={data}
        xDataKey="yearIndex"
        xLabel="Tax Year"
        xFormatter={formatTaxYear}
        yLabel="Annual Threshold"
        yFormatter={formatThreshold}
        yDomain={[27_000, "auto"]}
        ariaLabel="Line chart comparing Plan 2 repayment threshold under three scenarios: inflation-linked, old policy, and new policy"
        chartConfig={chartConfig}
        series={series}
        showLegend
      />
    </div>
  );
}
