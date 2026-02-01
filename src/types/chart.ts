/**
 * Data point for salary-based charts.
 */
export interface DataPoint {
  salary: number;
  value: number;
}

/**
 * Data point for balance over time chart.
 */
export interface BalanceDataPoint {
  month: number;
  balance: number;
}
