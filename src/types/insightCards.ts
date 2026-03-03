export interface SparklinePoint {
  month: number;
  value: number;
}

export interface InsightCardData {
  data: SparklinePoint[];
  stat: string;
  label: string;
}

export interface InterestCardData {
  stat: string;
  /** "Interest Paid (adj.)" for write-off scenarios, "Interest Paid" otherwise */
  label: string;
  /** totalInterestPaid / totalSettled (0–1) */
  interestRatio: number;
  /** totalPrincipalPaid / totalSettled (0–1) */
  principalRatio: number;
  /** writtenOffBalance / totalSettled (0 for paid-in-full) */
  writtenOffRatio: number;
}

export interface EffectiveRateCardData {
  stat: string;
  label: string;
  /** Effective annualized cost of the loan (0.035 = 3.5%) */
  effectiveRate: number;
  /** Bank of England base rate for comparison (0.045 = 4.5%) */
  boeRate: number;
}

export interface InsightCardsResult {
  balance: InsightCardData;
  interest: InterestCardData;
  effectiveRate: EffectiveRateCardData;
  cumulative: InsightCardData;
  /** Downsampled total-repayment-by-salary sparkline for the calculator card */
  totalRepayment: InsightCardData;
}
