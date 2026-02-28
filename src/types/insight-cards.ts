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
  label: string;
  /** Cost of borrowing (interest portion) as a fraction of total paid (0–1) */
  interestRatio: number;
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
}
