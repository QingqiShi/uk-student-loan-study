import { describe, expect, it } from "vitest";
import {
  estimateOverseasRepayment,
  fromGBP,
  getOverseasBand,
  getTerritory,
  monthlyRepaymentAboveThreshold,
  requireTerritory,
  toGBP,
  usesSterling,
} from "./overseas";
import {
  OVERSEAS_BANDS,
  OVERSEAS_TERRITORIES,
  OVERSEAS_UK_THRESHOLDS,
  type OverseasBandId,
} from "./overseasThresholds";

const territory = requireTerritory;

describe("overseas dataset", () => {
  it("maps every one of the 248 GOV.UK territories to a band", () => {
    expect(OVERSEAS_TERRITORIES).toHaveLength(248);
    const bandIds = new Set(OVERSEAS_BANDS.map((band) => band.id));
    for (const t of OVERSEAS_TERRITORIES) {
      expect(bandIds.has(t.band)).toBe(true);
      expect(t.exchangeRateToGBP).toBeGreaterThan(0);
    }
  });

  it("uses every band letter", () => {
    const letters: OverseasBandId[] = ["A", "B", "C", "D", "E", "F", "G"];
    expect(OVERSEAS_BANDS.map((band) => band.id)).toEqual(letters);
    const used = new Set(OVERSEAS_TERRITORIES.map((t) => t.band));
    for (const letter of letters) {
      expect(used.has(letter)).toBe(true);
    }
  });

  it("has unique territory names sorted A–Z", () => {
    const names = OVERSEAS_TERRITORIES.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    const sorted = [...names].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );
    expect(names).toEqual(sorted);
  });

  it("band E is the UK band: multiplier 1 and the SLC-published UK figures", () => {
    const bandE = OVERSEAS_BANDS.find((band) => band.id === "E");
    expect(bandE?.multiplier).toBe(1);
    expect(bandE?.thresholds).toEqual({
      PLAN_1: 26_900,
      PLAN_2: 29_385,
      PLAN_4: 33_795,
      PLAN_5: 25_000,
      POSTGRADUATE: 21_000,
    });
    expect(OVERSEAS_UK_THRESHOLDS).toBe(bandE?.thresholds);
    expect(territory("United Kingdom").band).toBe("E");
  });

  it("corrects the GOV.UK data defects", () => {
    expect(
      getOverseasBand(territory("Korea, Democratic People’s Republic of"))
        .fixedMonthly.PLAN_5,
    ).toBe(176.8);
    expect(territory("Bulgaria").currency).toBe("Euro");
    expect(territory("Bulgaria").exchangeRateToGBP).toBe(
      territory("Spain").exchangeRateToGBP,
    );
  });
});

describe("Plan 2 thresholds and fixed monthly repayments for the named countries", () => {
  it.each([
    ["Spain", 23_510, 327.2],
    ["United Arab Emirates", 23_510, 327.2],
    ["Australia", 29_385, 409],
    ["Canada", 29_385, 409],
    ["New Zealand", 29_385, 409],
    ["United States of America", 35_260, 490.8],
  ])("%s: £%i threshold, £%s fixed monthly", (name, threshold, fixed) => {
    const estimate = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: territory(name),
      annualIncomeGBP: 40_000,
    });
    expect(estimate.threshold).toBe(threshold);
    expect(estimate.fixedMonthlyRepayment).toBe(fixed);
    expect(estimate.ukThreshold).toBe(29_385);
  });

  it("reports the band multiplier against the UK", () => {
    expect(
      estimateOverseasRepayment({
        plan: "PLAN_2",
        territory: territory("Spain"),
        annualIncomeGBP: 40_000,
      }).band.multiplier,
    ).toBe(0.8);
    expect(
      estimateOverseasRepayment({
        plan: "PLAN_2",
        territory: territory("United States of America"),
        annualIncomeGBP: 40_000,
      }).band.multiplier,
    ).toBe(1.2);
    expect(
      estimateOverseasRepayment({
        plan: "PLAN_2",
        territory: territory("Australia"),
        annualIncomeGBP: 40_000,
      }).band.multiplier,
    ).toBe(1);
  });
});

describe("other plans", () => {
  it("Plan 5 Spain threshold is £20,000", () => {
    const estimate = estimateOverseasRepayment({
      plan: "PLAN_5",
      territory: territory("Spain"),
      annualIncomeGBP: 30_000,
    });
    expect(estimate.threshold).toBe(20_000);
    expect(estimate.ukThreshold).toBe(25_000);
    expect(estimate.repaymentRate).toBe(0.09);
    expect(estimate.plan2InterestAboveRpi).toBeUndefined();
  });

  it("Postgraduate Spain threshold is £16,800 at 6%", () => {
    const estimate = estimateOverseasRepayment({
      plan: "POSTGRADUATE",
      territory: territory("Spain"),
      annualIncomeGBP: 30_000,
    });
    expect(estimate.threshold).toBe(16_800);
    expect(estimate.repaymentRate).toBe(0.06);
    // 6% of £13,200 = £792 a year → £66 a month
    expect(estimate.annualRepayment).toBe(792);
    expect(estimate.monthlyRepayment).toBe(66);
  });
});

describe("monthly repayment rounding", () => {
  it("rounds the monthly instalment down to whole pounds", () => {
    // GOV.UK's own 2026/27 worked example: €33,000 in Spain → £34 a month.
    const spain = territory("Spain");
    const income = toGBP(33_000, spain);
    expect(income).toBeCloseTo(28_164.21, 2);
    const estimate = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: spain,
      annualIncomeGBP: income,
    });
    expect(estimate.annualRepayment).toBeCloseTo(418.88, 2);
    expect(estimate.monthlyRepayment).toBe(34);
  });

  it("does not lose a pound to float noise at an exact multiple", () => {
    // £1,200 a year is exactly £100 a month.
    expect(monthlyRepaymentAboveThreshold(29_385 + 13_334, 29_385, 0.09)).toBe(
      100,
    );
  });

  it("gives £0 below the threshold", () => {
    const estimate = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: territory("Spain"),
      annualIncomeGBP: 20_000,
    });
    expect(estimate.incomeAboveThreshold).toBe(0);
    expect(estimate.annualRepayment).toBe(0);
    expect(estimate.monthlyRepayment).toBe(0);
  });

  it("compares against the UK at the same income", () => {
    const estimate = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: territory("Spain"),
      annualIncomeGBP: 40_000,
    });
    // Spain: 9% of £16,490 = £1,484.10 → £123; UK: 9% of £10,615 = £955.35 → £79
    expect(estimate.monthlyRepayment).toBe(123);
    expect(estimate.ukMonthlyRepayment).toBe(79);
  });
});

describe("Plan 2 interest abroad", () => {
  it("uses the territory's lower and upper interest thresholds", () => {
    const spain = territory("Spain");
    const band = getOverseasBand(spain);
    expect(band.plan2UpperThreshold).toBe(42_310);

    const atLower = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: spain,
      annualIncomeGBP: 23_510,
    });
    expect(atLower.plan2InterestAboveRpi).toBe(0);

    const atUpper = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: spain,
      annualIncomeGBP: 42_310,
    });
    expect(atUpper.plan2InterestAboveRpi).toBe(3);

    const midway = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: spain,
      annualIncomeGBP: (23_510 + 42_310) / 2,
    });
    expect(midway.plan2InterestAboveRpi).toBeCloseTo(1.5, 5);
  });

  it("differs from the UK scale at the same income", () => {
    const income = 40_000;
    const spain = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: territory("Spain"),
      annualIncomeGBP: income,
    });
    const uk = estimateOverseasRepayment({
      plan: "PLAN_2",
      territory: territory("United Kingdom"),
      annualIncomeGBP: income,
    });
    expect(spain.plan2InterestAboveRpi).toBeGreaterThan(
      uk.plan2InterestAboveRpi ?? Number.NaN,
    );
  });
});

describe("currency conversion", () => {
  it("round-trips through the HMRC rate", () => {
    const australia = territory("Australia");
    expect(toGBP(10_000, australia)).toBeCloseTo(4_895.72, 2);
    expect(fromGBP(toGBP(60_000, australia), australia)).toBeCloseTo(60_000, 6);
  });

  it("recognises sterling territories", () => {
    expect(usesSterling(territory("Channel Islands"))).toBe(true);
    expect(usesSterling(territory("Gibraltar"))).toBe(true);
    expect(usesSterling(territory("Spain"))).toBe(false);
  });

  it("returns undefined for an unknown territory", () => {
    expect(getTerritory("Atlantis")).toBeUndefined();
    expect(() => requireTerritory("Atlantis")).toThrow("Atlantis");
  });
});
