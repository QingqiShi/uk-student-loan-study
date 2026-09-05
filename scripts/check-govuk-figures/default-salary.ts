import { initialState } from "../../src/context/loanReducer";
import { computePlan2FreezeSchedule } from "../../src/lib/loans/plan2Freeze";
import { DEFAULT_PRESET } from "../../src/lib/presets";
import {
  findPeakSalary,
  generateSalaryDataSeries,
} from "../../src/utils/loanCalculations";

import { findRpi } from "./types";
import type { ScrapedGovUkData } from "./types";

/**
 * Computes the income at which total repaid peaks for the default preset, under
 * the home page's default assumptions. The home page marker starts at this
 * income, so it sits on the peak of the curve that the page draws.
 *
 * The rates come from the scrape, but the repayment thresholds come from
 * src/lib/loans/plans.ts as it is on disk. Thus a threshold change moves the
 * default salary one run later, when the new thresholds are in that file. The
 * drift check finds the difference on the next run.
 */
export function computeDefaultSalary(scraped: ScrapedGovUkData): number {
  const series = generateSalaryDataSeries(
    DEFAULT_PRESET.loans,
    findRpi(scraped),
    initialState.salaryGrowthRate,
    initialState.thresholdGrowthRate,
    scraped.boeBaseRate,
    initialState.applyPlan2Freeze ? computePlan2FreezeSchedule() : undefined,
    scraped.interestCap,
  );

  return findPeakSalary(series);
}
