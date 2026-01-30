"use client";

import { ChartBase } from "./ChartBase";
import { currencyFormatter, percentageFormatter } from "@/constants";
import { useInterestRateData } from "@/hooks/useChartData";

export function InterestRateChart() {
  const { data, annotationSalary, annotationValue } = useInterestRateData();

  return (
    <ChartBase
      data={data}
      annotationSalary={annotationSalary}
      annotationValue={annotationValue}
      xAxisLabel="Salary"
      yAxisLabel="Annualized Interest Rate"
      xFormatter={(v) => currencyFormatter.format(v)}
      yFormatter={percentageFormatter}
      ariaLabel="Chart showing effective annualized interest rate by annual salary. Useful for comparing loan repayment vs other investments."
    />
  );
}

export default InterestRateChart;
