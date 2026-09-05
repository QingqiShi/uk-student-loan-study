import { CURRENT_RATES, PLAN_CONFIGS } from "./plans";
import type { PlanType } from "./types";

/**
 * Interest cap value that leaves the computed rate untouched, for a comparison
 * of the capped rate against the rate a borrower would pay without the cap.
 */
export const NO_INTEREST_CAP = Number.POSITIVE_INFINITY;

/**
 * Optional overrides for Plan 2 interest threshold bands,
 * used when simulating threshold growth over time.
 */
export interface InterestThresholdOverrides {
  interestLowerThreshold?: number;
  interestUpperThreshold?: number;
}

/**
 * Calculates the annual interest rate for a given plan type and salary.
 *
 * Interest rate rules by plan:
 * - Plan 1: Lesser of RPI or BoE base rate + 1%
 * - Plan 2: Sliding scale from RPI (at lower threshold) to RPI + 3% (at upper threshold)
 * - Plan 4: Lesser of RPI or BoE base rate + 1%
 * - Plan 5: RPI only
 * - Postgraduate: RPI + 3%
 *
 * Every plan's rate is then held to the interest cap, the GOV.UK ceiling on the
 * headline rate. It binds on the upper part of the Plan 2 sliding scale and on
 * Postgraduate; Plan 1, Plan 4 and Plan 5 sit below it at the current figures.
 *
 * @param planType - The loan plan type
 * @param annualSalary - Annual salary in GBP
 * @param rpi - Current RPI rate as percentage (e.g., 3.2 for 3.2%)
 * @param boeBaseRate - Bank of England base rate as percentage
 * @param interestOverrides - Optional overrides for Plan 2 interest thresholds
 * @param interestCap - Ceiling on the rate as a percentage; pass
 *   {@link NO_INTEREST_CAP} for the uncapped rate
 * @returns Annual interest rate as a percentage
 */
export function getAnnualInterestRate(
  planType: PlanType,
  annualSalary: number,
  rpi: number,
  boeBaseRate: number,
  interestOverrides?: InterestThresholdOverrides,
  interestCap: number = CURRENT_RATES.interestCap,
): number {
  const uncappedRate = getUncappedRate(
    planType,
    annualSalary,
    rpi,
    boeBaseRate,
    interestOverrides,
  );
  return Math.min(uncappedRate, interestCap);
}

function getUncappedRate(
  planType: PlanType,
  annualSalary: number,
  rpi: number,
  boeBaseRate: number,
  interestOverrides?: InterestThresholdOverrides,
): number {
  switch (planType) {
    case "PLAN_1":
    case "PLAN_4":
      return Math.min(rpi, boeBaseRate + 1);
    case "PLAN_2":
      return getSlidingScaleRate(annualSalary, rpi, interestOverrides);
    case "PLAN_5":
      return rpi;
    case "POSTGRADUATE":
      return rpi + 3;
  }
}

/**
 * Calculates the Plan 2 sliding scale interest rate.
 *
 * Below lower threshold: RPI
 * Above upper threshold: RPI + 3%
 * Between: Linear interpolation
 *
 * @param salary - Annual salary in GBP
 * @param rpi - Current RPI rate as percentage
 * @returns Interest rate as a percentage
 */
function getSlidingScaleRate(
  salary: number,
  rpi: number,
  overrides?: InterestThresholdOverrides,
): number {
  const lower =
    overrides?.interestLowerThreshold ??
    PLAN_CONFIGS.PLAN_2.interestLowerThreshold;
  const upper =
    overrides?.interestUpperThreshold ??
    PLAN_CONFIGS.PLAN_2.interestUpperThreshold;

  if (salary <= lower) {
    return rpi;
  }
  if (salary >= upper) {
    return rpi + 3;
  }

  const ratio = (salary - lower) / (upper - lower);
  return rpi + ratio * 3;
}

/**
 * Calculates a plan's highest possible annual interest rate at given rates,
 * for display as the printed ceiling. Reads the capped model rather than
 * assuming RPI + 3%, so the figure always matches what borrowers are charged.
 *
 * @param planType - The loan plan type
 * @param rpi - Current RPI rate as percentage
 * @param boeBaseRate - Bank of England base rate as percentage
 * @param interestCap - Ceiling on the rate as a percentage; pass
 *   {@link NO_INTEREST_CAP} for the uncapped ceiling
 * @returns The plan's highest annual interest rate as a percentage
 */
export function getMaxAnnualInterestRate(
  planType: PlanType,
  rpi: number = CURRENT_RATES.rpi,
  boeBaseRate: number = CURRENT_RATES.boeBaseRate,
  interestCap: number = CURRENT_RATES.interestCap,
): number {
  const maxSalary =
    planType === "PLAN_2" ? PLAN_CONFIGS.PLAN_2.interestUpperThreshold : 0;
  return getAnnualInterestRate(
    planType,
    maxSalary,
    rpi,
    boeBaseRate,
    undefined,
    interestCap,
  );
}
