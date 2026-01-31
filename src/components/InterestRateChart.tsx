"use client";

import { ChartBase } from "./charts/ChartBase";
import type { ChartConfig } from "@/components/ui/chart";
import {
  currencyFormatter,
  percentageFormatter,
  MIN_SALARY,
  MAX_SALARY,
} from "@/constants";
import { useInterestRateData } from "@/hooks/useChartData";

const chartConfig = {
  value: {
    label: "Interest Rate",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function InterestRateChart() {
  const { data, annotationSalary, annotationValue } = useInterestRateData();

  const annotations =
    annotationSalary !== undefined && annotationValue !== undefined
      ? [
          {
            x: annotationSalary,
            y: annotationValue,
            label: percentageFormatter(annotationValue),
            color: "var(--chart-3)",
          },
        ]
      : [];

  return (
    <ChartBase
      type="area"
      data={data}
      xDataKey="salary"
      xLabel="Salary"
      xFormatter={(v) => currencyFormatter.format(v)}
      yLabel="Annualized Interest Rate"
      yFormatter={percentageFormatter}
      ariaLabel="Chart showing effective annualized interest rate by annual salary. Useful for comparing loan repayment vs other investments."
      chartConfig={chartConfig}
      series={[{ dataKey: "value" }]}
      annotations={annotations}
      xDomain={[MIN_SALARY, MAX_SALARY]}
    />
  );
}

export default InterestRateChart;
