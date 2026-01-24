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
    />
  );
}

export default TotalRepaymentChart;
