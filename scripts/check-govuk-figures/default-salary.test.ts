import { describe, expect, it } from "vitest";

import { MAX_SALARY, MIN_SALARY, SALARY_STEP } from "../../src/constants";

import { computeDefaultSalary } from "./default-salary";
import type { ScrapedGovUkData } from "./types";

/** A scrape of the GOV.UK and market figures, with no network access. */
function scrapedFixture(
  overrides: Partial<ScrapedGovUkData> = {},
): ScrapedGovUkData {
  return {
    thresholds: [
      { plan: "PLAN_1", monthlyThreshold: 2241, yearlyThreshold: 26900 },
      { plan: "PLAN_2", monthlyThreshold: 2448, yearlyThreshold: 29385 },
      { plan: "PLAN_4", monthlyThreshold: 2816, yearlyThreshold: 33795 },
      { plan: "PLAN_5", monthlyThreshold: 2083, yearlyThreshold: 25000 },
      { plan: "POSTGRADUATE", monthlyThreshold: 1750, yearlyThreshold: 21000 },
    ],
    repaymentRates: [
      { plans: ["PLAN_1", "PLAN_2", "PLAN_4", "PLAN_5"], rate: 9 },
      { plans: ["POSTGRADUATE"], rate: 6 },
    ],
    interestRates: [
      { plans: ["PLAN_5"], rate: 4.1, description: "4.1% (RPI) on Plan 5" },
    ],
    plan2InterestScale: { lowerThreshold: 29385, upperThreshold: 52885 },
    interestCap: 6,
    writeOffs: [
      { plan: "PLAN_1", years: 25 },
      { plan: "PLAN_2", years: 30 },
      { plan: "PLAN_4", years: 30 },
      { plan: "PLAN_5", years: 40 },
      { plan: "POSTGRADUATE", years: 30 },
    ],
    boeBaseRate: 3.75,
    cpi: 2.9,
    scrapedAt: "2026-01-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("computeDefaultSalary", () => {
  it("returns an income on the chart's salary grid", () => {
    const salary = computeDefaultSalary(scrapedFixture());

    expect(salary).toBeGreaterThanOrEqual(MIN_SALARY);
    expect(salary).toBeLessThanOrEqual(MAX_SALARY);
    expect((salary - MIN_SALARY) % SALARY_STEP).toBe(0);
  });

  it("moves the peak down when RPI falls", () => {
    const current = computeDefaultSalary(scrapedFixture());
    const noInflation = computeDefaultSalary(
      scrapedFixture({
        interestRates: [
          { plans: ["PLAN_5"], rate: 0, description: "0% (RPI) on Plan 5" },
        ],
      }),
    );

    expect(noInflation).toBeLessThan(current);
  });
});
