'use client';

import { useInterestRateData } from '@/hooks/useChartData';
import { currencyFormatter, percentageFormatter } from '@/constants';
import { ChartBase } from './ChartBase';

export function InterestRateChart() {
  const { data, annotationPoint } = useInterestRateData();

  return (
    <ChartBase
      data={data}
      annotateDataPoint={annotationPoint}
      xAxisLabel="Salary"
      yAxisLabel="Annualized Interest Rate"
      xFormatter={currencyFormatter.format}
      yFormatter={percentageFormatter}
    />
  );
}

export default InterestRateChart;
