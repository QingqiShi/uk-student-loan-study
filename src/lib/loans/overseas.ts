import { getAnnualInterestRate } from "./interest";
import {
  OVERSEAS_BANDS_BY_ID,
  OVERSEAS_TERRITORIES,
  OVERSEAS_UK_THRESHOLDS,
  type OverseasBand,
  type OverseasTerritory,
} from "./overseasThresholds";
import { PLAN_CONFIGS } from "./plans";
import type { PlanType } from "./types";

const TERRITORIES_BY_NAME: ReadonlyMap<string, OverseasTerritory> = new Map(
  OVERSEAS_TERRITORIES.map((territory) => [territory.name, territory]),
);

/** Look up a territory by the exact name GOV.UK prints. */
export function getTerritory(name: string): OverseasTerritory | undefined {
  return TERRITORIES_BY_NAME.get(name);
}

/**
 * Look up a territory by the name GOV.UK prints, for a name the caller knows is
 * in the dataset. The guide prerenders, so a renamed GOV.UK row fails the
 * build, not the reader.
 */
export function requireTerritory(name: string): OverseasTerritory {
  const territory = getTerritory(name);
  if (!territory) {
    throw new Error(`Overseas dataset has no territory named "${name}"`);
  }
  return territory;
}

export function getOverseasBand(territory: OverseasTerritory): OverseasBand {
  return OVERSEAS_BANDS_BY_ID[territory.band];
}

/** True where the HMRC rate is 1, so no conversion applies. */
export function usesSterling(territory: OverseasTerritory): boolean {
  return territory.exchangeRateToGBP === 1;
}

/** Convert a local-currency amount to GBP at the HMRC rate SLC uses. */
export function toGBP(
  localAmount: number,
  territory: OverseasTerritory,
): number {
  return localAmount * territory.exchangeRateToGBP;
}

/** Convert a GBP amount to the local currency at the HMRC rate SLC uses. */
export function fromGBP(
  gbpAmount: number,
  territory: OverseasTerritory,
): number {
  return gbpAmount / territory.exchangeRateToGBP;
}

/**
 * SLC's monthly instalment: the repayment rate on income above the threshold,
 * split over 12 months and rounded down to whole pounds.
 */
export function monthlyRepaymentAboveThreshold(
  annualIncomeGBP: number,
  threshold: number,
  repaymentRate: number,
): number {
  const incomeAboveThreshold = Math.max(0, annualIncomeGBP - threshold);
  // Round to pence first so a float such as 899.9999 does not lose a pound.
  const annualPence = Math.round(incomeAboveThreshold * repaymentRate * 100);
  return Math.floor(annualPence / 1200);
}

export interface OverseasRepaymentEstimate {
  plan: PlanType;
  territory: OverseasTerritory;
  band: OverseasBand;
  /** Annual repayment threshold in the territory, GBP. */
  threshold: number;
  /** The UK threshold for the same plan, GBP. */
  ukThreshold: number;
  repaymentRate: number;
  /** Income above the territory's threshold, GBP. */
  incomeAboveThreshold: number;
  /** The repayment rate applied to that excess for a year, GBP, to the penny. */
  annualRepayment: number;
  /** Monthly instalment, rounded down to whole pounds. */
  monthlyRepayment: number;
  /** What the same income would repay each month in the UK. */
  ukMonthlyRepayment: number;
  /** What SLC charges each month if details are not kept up to date. */
  fixedMonthlyRepayment: number;
  /** Plan 2 only: percentage points above RPI from the territory's interest thresholds. */
  plan2InterestAboveRpi: number | undefined;
}

export function estimateOverseasRepayment({
  plan,
  territory,
  annualIncomeGBP,
}: {
  plan: PlanType;
  territory: OverseasTerritory;
  annualIncomeGBP: number;
}): OverseasRepaymentEstimate {
  const band = getOverseasBand(territory);
  const { repaymentRate } = PLAN_CONFIGS[plan];
  const threshold = band.thresholds[plan];
  const ukThreshold = OVERSEAS_UK_THRESHOLDS[plan];
  const incomeAboveThreshold = Math.max(0, annualIncomeGBP - threshold);

  // An RPI of 0 makes the sliding scale return only the points above RPI.
  const plan2InterestAboveRpi =
    plan === "PLAN_2"
      ? getAnnualInterestRate("PLAN_2", annualIncomeGBP, 0, 0, {
          interestLowerThreshold: threshold,
          interestUpperThreshold: band.plan2UpperThreshold,
        })
      : undefined;

  return {
    plan,
    territory,
    band,
    threshold,
    ukThreshold,
    repaymentRate,
    incomeAboveThreshold,
    annualRepayment:
      Math.round(incomeAboveThreshold * repaymentRate * 100) / 100,
    monthlyRepayment: monthlyRepaymentAboveThreshold(
      annualIncomeGBP,
      threshold,
      repaymentRate,
    ),
    ukMonthlyRepayment: monthlyRepaymentAboveThreshold(
      annualIncomeGBP,
      ukThreshold,
      repaymentRate,
    ),
    fixedMonthlyRepayment: band.fixedMonthly[plan],
    plan2InterestAboveRpi,
  };
}
