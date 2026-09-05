import { describe, expect, it } from "vitest";

import { classifyChange } from "./classify";
import type { Mismatch, ScrapedPlanThreshold } from "./types";

/** A scraped threshold row that is internally consistent (annual = monthly*12). */
function row(plan: string, monthly: number): ScrapedPlanThreshold {
  return { plan, monthlyThreshold: monthly, yearlyThreshold: monthly * 12 };
}

describe("classifyChange", () => {
  it("auto-merges a small, in-bounds market-rate move", () => {
    expect(
      classifyChange(
        [{ field: "CURRENT_RATES.boeBaseRate", current: 4.75, scraped: 4.5 }],
        [],
      ),
    ).toEqual({ decision: "auto", reviewReasons: [] });
  });

  it("auto-merges when every field in the batch is a routine market rate", () => {
    const mismatches: Mismatch[] = [
      { field: "CURRENT_RATES.rpi", current: 3.2, scraped: 4.1 },
      { field: "CURRENT_RATES.cpi", current: 2.8, scraped: 3.0 },
    ];
    expect(classifyChange(mismatches, [row("PLAN_2", 2350)]).decision).toBe(
      "auto",
    );
  });

  it("auto-merges an interest-cap move within bounds", () => {
    expect(
      classifyChange(
        [{ field: "CURRENT_RATES.interestCap", current: 6, scraped: 7 }],
        [],
      ),
    ).toEqual({ decision: "auto", reviewReasons: [] });
  });

  it("reviews an interest-cap move beyond 2 points", () => {
    const result = classifyChange(
      [{ field: "CURRENT_RATES.interestCap", current: 6, scraped: 9 }],
      [],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("CURRENT_RATES.interestCap");
    expect(result.reviewReasons[0]).toContain("moved 3.00 points");
  });

  it("auto-merges a small move in the derived default salary", () => {
    expect(
      classifyChange(
        [{ field: "DEFAULT_SALARY", current: 45_000, scraped: 48_000 }],
        [],
      ),
    ).toEqual({ decision: "auto", reviewReasons: [] });
  });

  it("reviews a large move in the derived default salary", () => {
    const result = classifyChange(
      [{ field: "DEFAULT_SALARY", current: 45_000, scraped: 60_000 }],
      [],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("DEFAULT_SALARY");
    expect(result.reviewReasons[0]).toContain("moved 33.3%");
  });

  it("reviews a routine repayment-threshold uprating so the overseas dataset is refreshed", () => {
    // ~4% annual uprating, in bounds and internally consistent — but every
    // overseas band multiplies the UK threshold, and that dataset is hand-copied.
    const result = classifyChange(
      [{ field: "PLAN_5.monthlyThreshold", current: 2083, scraped: 2166 }],
      [row("PLAN_5", 2166)],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons).toEqual([
      "PLAN_5.monthlyThreshold: a UK repayment threshold moved: refresh src/lib/loans/overseasThresholds.ts from the 6 April GOV.UK overseas tables (Plan 1/2/4/5/Postgraduate)",
    ]);
  });

  it("names the overseas refresh for every plan's threshold", () => {
    for (const plan of [
      "PLAN_1",
      "PLAN_2",
      "PLAN_4",
      "PLAN_5",
      "POSTGRADUATE",
    ]) {
      const result = classifyChange(
        [{ field: `${plan}.monthlyThreshold`, current: 2200, scraped: 2300 }],
        [row(plan, 2300)],
      );
      expect(result.decision).toBe("review");
      expect(
        result.reviewReasons.some((r) => r.includes("overseasThresholds")),
      ).toBe(true);
    }
  });

  it("leaves a market-rate move clear of the overseas refresh reason", () => {
    const result = classifyChange(
      [{ field: "CURRENT_RATES.rpi", current: 3.2, scraped: 4.1 }],
      [],
    );
    expect(result.reviewReasons).toEqual([]);
  });

  it("reviews a structural field (repayment rate) even if plausible", () => {
    const result = classifyChange(
      [{ field: "PLAN_2.repaymentRate", current: 0.09, scraped: 0.1 }],
      [],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("PLAN_2.repaymentRate");
    expect(result.reviewReasons[0]).toContain("structural");
  });

  it("reviews the write-off period and the interest thresholds", () => {
    expect(
      classifyChange(
        [{ field: "PLAN_5.writeOffYears", current: 40, scraped: 30 }],
        [],
      ).decision,
    ).toBe("review");
    expect(
      classifyChange(
        [
          {
            field: "PLAN_2.interestLowerThreshold",
            current: 28470,
            scraped: 29000,
          },
        ],
        [],
      ).decision,
    ).toBe("review");
  });

  it("reviews a mis-scraped threshold that dropped a digit", () => {
    // Annual £26,760 (monthly 2230) mis-read as annual £2,676 (monthly 223):
    // both out of range and a >90% move.
    const result = classifyChange(
      [{ field: "PLAN_1.monthlyThreshold", current: 2230, scraped: 223 }],
      [row("PLAN_1", 223)],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("plausible range");
  });

  it("reviews an implausibly large market rate (parse glitch)", () => {
    // 4.75% read as 47.5% — out of range and a huge move.
    expect(
      classifyChange(
        [{ field: "CURRENT_RATES.boeBaseRate", current: 4.75, scraped: 47.5 }],
        [],
      ).decision,
    ).toBe("review");
  });

  it("reviews a market rate that collapses to zero (parse failure)", () => {
    const result = classifyChange(
      [{ field: "CURRENT_RATES.cpi", current: 2.6, scraped: 0 }],
      [],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("non-positive");
  });

  it("reviews a rate move just past the two-point ceiling", () => {
    // 3.2% mis-read as 0.3% is a 2.9-point drop — over the 2-point ceiling.
    const result = classifyChange(
      [{ field: "CURRENT_RATES.rpi", current: 3.2, scraped: 0.3 }],
      [],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("points");
  });

  it("reviews a repayment threshold that decreases", () => {
    // Repayment thresholds only rise or freeze, so any decrease is anomalous
    // even when it is small and internally consistent.
    const result = classifyChange(
      [{ field: "PLAN_2.monthlyThreshold", current: 2274, scraped: 2200 }],
      [row("PLAN_2", 2200)],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("decreased");
  });

  it("reviews a changed threshold whose monthly and annual figures disagree", () => {
    // Monthly slid to a plausible-but-wrong 2448 while the annual row (26900)
    // still implies ~2241 — a monthly-only mis-scrape the bounds alone miss.
    const result = classifyChange(
      [{ field: "PLAN_1.monthlyThreshold", current: 2241, scraped: 2448 }],
      [{ plan: "PLAN_1", monthlyThreshold: 2448, yearlyThreshold: 26900 }],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons.some((r) => r.includes("inconsistent"))).toBe(
      true,
    );
  });

  it("reviews an inconsistent threshold row even when its monthly value is unchanged", () => {
    // Only CPI changed (routine), but a scraped row carries a bad annual figure
    // with an unchanged monthly — the all-rows scan must still force review.
    const result = classifyChange(
      [{ field: "CURRENT_RATES.cpi", current: 2.8, scraped: 3.0 }],
      [
        { plan: "PLAN_1", monthlyThreshold: 2241, yearlyThreshold: 30000 },
        row("PLAN_2", 2350),
      ],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons.some((r) => r.includes("PLAN_1"))).toBe(true);
  });

  it("accepts floored threshold rows at both remainder boundaries", () => {
    // GOV.UK floors the monthly, so annual - monthly*12 is 0..11 inclusive.
    expect(
      classifyChange(
        [],
        [{ plan: "PLAN_5", monthlyThreshold: 2000, yearlyThreshold: 24000 }],
      ).decision,
    ).toBe("auto"); // remainder 0
    expect(
      classifyChange(
        [],
        [{ plan: "PLAN_5", monthlyThreshold: 2000, yearlyThreshold: 24011 }],
      ).decision,
    ).toBe("auto"); // remainder 11
  });

  it("reviews a rounded-up monthly threshold (impossible under flooring)", () => {
    // monthly*12 exceeds the annual → negative remainder → a mis-scrape.
    const result = classifyChange(
      [],
      [{ plan: "PLAN_5", monthlyThreshold: 2001, yearlyThreshold: 24000 }],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("inconsistent");
  });

  it("reviews a threshold row whose remainder is 12 or more", () => {
    expect(
      classifyChange(
        [],
        [{ plan: "PLAN_5", monthlyThreshold: 2000, yearlyThreshold: 24012 }],
      ).decision,
    ).toBe("review"); // remainder 12
  });

  it("reviews the whole batch when any single field disqualifies", () => {
    const mismatches: Mismatch[] = [
      { field: "CURRENT_RATES.cpi", current: 2.8, scraped: 3.0 }, // safe
      { field: "PLAN_2.writeOffYears", current: 30, scraped: 25 }, // structural
    ];
    const result = classifyChange(mismatches, []);
    expect(result.decision).toBe("review");
    expect(result.reviewReasons).toHaveLength(1);
  });

  it("reviews an in-bounds threshold move that is too large to be routine", () => {
    // £2,200 → £2,600 monthly is ~18%, in bounds but past the 15% uprating
    // ceiling — so the relative-delta check (not the range check) sends it back.
    const result = classifyChange(
      [{ field: "PLAN_4.monthlyThreshold", current: 2200, scraped: 2600 }],
      [row("PLAN_4", 2600)],
    );
    expect(result.decision).toBe("review");
    expect(result.reviewReasons[0]).toContain("%");
  });

  it("allows a rate move exactly at the two-point delta boundary", () => {
    // A 2.0-point move is the ceiling (rejects only when it exceeds it).
    expect(
      classifyChange(
        [{ field: "CURRENT_RATES.boeBaseRate", current: 5, scraped: 3 }],
        [],
      ).decision,
    ).toBe("auto");
  });
});
