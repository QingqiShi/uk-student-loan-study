'use client';

import { useRepaymentYearsData } from '@/hooks/useChartData';
import { currencyFormatter, yearsFormatter } from '@/constants';
import { ChartBase } from './ChartBase';

export function RepaymentYearsChart() {
  const { data, annotationPoint } = useRepaymentYearsData();

  return (
    <ChartBase
      data={data}
      annotateDataPoint={annotationPoint}
      xAxisLabel="Salary"
      yAxisLabel="Time to Pay Off (Years)"
      xFormatter={currencyFormatter.format}
      yFormatter={yearsFormatter}
    />
  );
}

export default RepaymentYearsChart;
