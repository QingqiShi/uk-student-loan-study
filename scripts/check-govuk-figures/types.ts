export interface ScrapedPlanThreshold {
  plan: string;
  yearlyThreshold: number;
  monthlyThreshold: number;
}

export interface ScrapedRepaymentRate {
  plans: string[];
  rate: number;
}

export interface ScrapedInterestRate {
  plans: string[];
  rate: number;
  description: string;
}

export interface ScrapedPlan2InterestScale {
  lowerThreshold: number;
  upperThreshold: number;
}

export interface ScrapedWriteOff {
  plan: string;
  years: number;
}

export interface ScrapedGovUkData {
  thresholds: ScrapedPlanThreshold[];
  repaymentRates: ScrapedRepaymentRate[];
  interestRates: ScrapedInterestRate[];
  plan2InterestScale: ScrapedPlan2InterestScale;
  writeOffs: ScrapedWriteOff[];
  boeBaseRate: number;
  scrapedAt: string;
}

export interface Mismatch {
  field: string;
  current: number;
  scraped: number;
}

export interface CheckResult {
  status: "ok" | "mismatch" | "scrape-error";
  mismatches?: Mismatch[];
  error?: string;
  checkedAt: string;
}

export function findRepaymentRate(
  scraped: ScrapedGovUkData,
  plan: string,
): number {
  const entry = scraped.repaymentRates.find((r) => r.plans.includes(plan));
  if (!entry) throw new Error(`No repayment rate found for ${plan}`);
  return entry.rate / 100;
}

export function findWriteOffYears(
  scraped: ScrapedGovUkData,
  plan: string,
): number {
  const entry = scraped.writeOffs.find((w) => w.plan === plan);
  if (!entry) throw new Error(`No write-off period found for ${plan}`);
  return entry.years;
}

/** Find the RPI rate from scraped interest rates (Plan 5 uses RPI only). */
export function findRpi(scraped: ScrapedGovUkData): number {
  for (const entry of scraped.interestRates) {
    if (entry.description.toLowerCase().includes("rpi")) {
      return entry.rate;
    }
  }
  // Fallback: Plan 5 rate equals RPI (Plan 5 charges RPI only, no additional %)
  for (const entry of scraped.interestRates) {
    if (entry.plans.includes("PLAN_5")) {
      return entry.rate;
    }
  }
  throw new Error("Could not find RPI rate in scraped interest rates");
}
