/**
 * Data point for salary-based charts.
 * First element is salary, second is the computed metric.
 */
export type DataPoint = [number, number];

/**
 * Props for the ChartBase component.
 */
export interface ChartBaseProps {
  /** Array of [salary, value] data points */
  data: DataPoint[];
  /** Label for the X axis */
  xAxisLabel: string;
  /** Label for the Y axis */
  yAxisLabel: string;
  /** Formatter function for X axis values */
  xFormatter: (x: number) => string;
  /** Formatter function for Y axis values */
  yFormatter: (y: number) => string;
  /** Optional data point to highlight with an annotation */
  annotateDataPoint?: DataPoint;
  /** Accessibility label for screen readers */
  ariaLabel?: string;
}
