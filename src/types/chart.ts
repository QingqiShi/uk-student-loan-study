/**
 * Data point for salary-based charts.
 */
export interface DataPoint {
  salary: number;
  value: number;
}

/**
 * Props for the ChartBase component.
 */
export interface ChartBaseProps {
  /** Array of data points with salary and value */
  data: DataPoint[];
  /** Label for the X axis */
  xAxisLabel: string;
  /** Label for the Y axis */
  yAxisLabel: string;
  /** Formatter function for X axis values */
  xFormatter: (x: number) => string;
  /** Formatter function for Y axis values */
  yFormatter: (y: number) => string;
  /** Salary value to highlight with a vertical annotation line */
  annotationSalary?: number;
  /** Y-axis value at the annotation salary for dot marker positioning */
  annotationValue?: number;
  /** Accessibility label for screen readers */
  ariaLabel?: string;
}
