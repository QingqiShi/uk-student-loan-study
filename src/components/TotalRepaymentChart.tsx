'use client';

import { useTotalRepaymentData } from '@/hooks/useChartData';
import { currencyFormatter } from '@/constants';
import { ChartBase } from './ChartBase';

export function TotalRepaymentChart() {
  const { data, annotationPoint } = useTotalRepaymentData();

  return (
    <ChartBase
      data={data}
      annotateDataPoint={annotationPoint}
      xAxisLabel="Salary"
      yAxisLabel="Total Repayment"
      xFormatter={currencyFormatter.format}
      yFormatter={currencyFormatter.format}
      ariaLabel="Chart showing total student loan repayment amount by annual salary. Lower earners pay less due to loan write-off, while middle earners often pay the most."
    />
  );
}

export default TotalRepaymentChart;
