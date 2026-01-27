"use client";

import { useInterestRateData } from "@/hooks/useChartData";
import { currencyFormatter, percentageFormatter } from "@/constants";
import { ChartBase } from "./ChartBase";

export function InterestRateChart() {
  const { data, annotationSalary } = useInterestRateData();

  return (
    <ChartBase
      data={data}
      annotationSalary={annotationSalary}
      xAxisLabel="Salary"
      yAxisLabel="Annualized Interest Rate"
      xFormatter={currencyFormatter.format}
      yFormatter={percentageFormatter}
      ariaLabel="Chart showing effective annualized interest rate by annual salary. Useful for comparing loan repayment vs other investments."
    />
  );
}

export default InterestRateChart;
