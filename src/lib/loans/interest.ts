import { PLAN_CONFIGS } from "./plans";
import type { PlanType } from "./types";

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
 * @param planType - The loan plan type
 * @param annualSalary - Annual salary in GBP
 * @param rpi - Current RPI rate as percentage (e.g., 3.2 for 3.2%)
 * @param boeBaseRate - Bank of England base rate as percentage
 * @param interestOverrides - Optional overrides for Plan 2 interest thresholds
 * @returns Annual interest rate as a percentage
 */
export function getAnnualInterestRate(
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
