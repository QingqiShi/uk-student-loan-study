import { describe, it, expect } from "vitest";
import {
  PLAN_CONFIGS,
  CURRENT_RATES,
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
  TUITION_FEE_CAP,
  LAST_UPDATED,
} from "./plans";

const PLAN_KEYS = Object.keys(PLAN_CONFIGS) as Array<keyof typeof PLAN_CONFIGS>;

const UG_PLAN_KEYS = PLAN_KEYS.filter((k) => k !== "POSTGRADUATE");

describe("PLAN_CONFIGS", () => {
  describe("required fields", () => {
    it.each(PLAN_KEYS)("%s has positive monthlyThreshold", (planType) => {
      expect(PLAN_CONFIGS[planType].monthlyThreshold).toBeGreaterThan(0);
    });

    it.each(PLAN_KEYS)("%s has repaymentRate between 0 and 1", (planType) => {
      const rate = PLAN_CONFIGS[planType].repaymentRate;
      expect(rate).toBeGreaterThan(0);
      expect(rate).toBeLessThanOrEqual(1);
    });

    it.each(PLAN_KEYS)("%s has positive writeOffYears", (planType) => {
      expect(PLAN_CONFIGS[planType].writeOffYears).toBeGreaterThan(0);
    });
  });

  it("has all expected plan keys", () => {
    expect(PLAN_KEYS).toEqual(
      expect.arrayContaining([
        "PLAN_1",
        "PLAN_2",
        "PLAN_4",
        "PLAN_5",
        "POSTGRADUATE",
      ]),
    );
  });

  it("PLAN_2 has interest scale thresholds with upper > lower", () => {
    const { interestLowerThreshold, interestUpperThreshold } =
      PLAN_CONFIGS.PLAN_2;
    expect(interestLowerThreshold).toBeGreaterThan(0);
    expect(interestUpperThreshold).toBeGreaterThan(interestLowerThreshold);
  });

  describe("ordering invariants", () => {
    it("PLAN_4 has highest undergraduate threshold (Scotland)", () => {
      const thresholds = UG_PLAN_KEYS.map(
        (k) => PLAN_CONFIGS[k].monthlyThreshold,
      );
      expect(Math.max(...thresholds)).toBe(
        PLAN_CONFIGS.PLAN_4.monthlyThreshold,
      );
    });

    it("POSTGRADUATE has lowest threshold overall", () => {
      const thresholds = PLAN_KEYS.map((k) => PLAN_CONFIGS[k].monthlyThreshold);
      expect(Math.min(...thresholds)).toBe(
        PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold,
      );
    });

    it("PLAN_5 has longest write-off period", () => {
      const writeOffs = PLAN_KEYS.map((k) => PLAN_CONFIGS[k].writeOffYears);
      expect(Math.max(...writeOffs)).toBe(PLAN_CONFIGS.PLAN_5.writeOffYears);
    });
  });
});

describe("CURRENT_RATES", () => {
  it("has RPI within sane range", () => {
    expect(CURRENT_RATES.rpi).toBeGreaterThan(0);
    expect(CURRENT_RATES.rpi).toBeLessThan(20);
  });

  it("has BoE base rate within sane range", () => {
    expect(CURRENT_RATES.boeBaseRate).toBeGreaterThanOrEqual(0);
    expect(CURRENT_RATES.boeBaseRate).toBeLessThan(20);
  });
});

describe("PLAN_DISPLAY_INFO", () => {
  const displayKeys = Object.keys(PLAN_DISPLAY_INFO) as Array<
    keyof typeof PLAN_DISPLAY_INFO
  >;

  it("covers all undergraduate plans", () => {
    expect(displayKeys).toEqual(
      expect.arrayContaining(["PLAN_1", "PLAN_2", "PLAN_4", "PLAN_5"]),
    );
  });

  it.each(displayKeys)(
    "%s derives yearlyThreshold from monthlyThreshold * 12",
    (key) => {
      expect(PLAN_DISPLAY_INFO[key].yearlyThreshold).toBe(
        PLAN_CONFIGS[key].monthlyThreshold * 12,
      );
    },
  );

  it.each(displayKeys)("%s derives writeOffYears from PLAN_CONFIGS", (key) => {
    expect(PLAN_DISPLAY_INFO[key].writeOffYears).toBe(
      PLAN_CONFIGS[key].writeOffYears,
    );
  });

  it.each(displayKeys)("%s derives repaymentRate from PLAN_CONFIGS", (key) => {
    expect(PLAN_DISPLAY_INFO[key].repaymentRate).toBe(
      PLAN_CONFIGS[key].repaymentRate,
    );
  });
});

describe("POSTGRADUATE_DISPLAY_INFO", () => {
  it("derives yearlyThreshold from monthlyThreshold * 12", () => {
    expect(POSTGRADUATE_DISPLAY_INFO.yearlyThreshold).toBe(
      PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold * 12,
    );
  });

  it("derives writeOffYears from PLAN_CONFIGS", () => {
    expect(POSTGRADUATE_DISPLAY_INFO.writeOffYears).toBe(
      PLAN_CONFIGS.POSTGRADUATE.writeOffYears,
    );
  });

  it("derives repaymentRate from PLAN_CONFIGS", () => {
    expect(POSTGRADUATE_DISPLAY_INFO.repaymentRate).toBe(
      PLAN_CONFIGS.POSTGRADUATE.repaymentRate,
    );
  });
});

describe("TUITION_FEE_CAP", () => {
  it("is a positive number", () => {
    expect(TUITION_FEE_CAP).toBeGreaterThan(0);
  });
});

describe("LAST_UPDATED", () => {
  it("is a valid ISO date string", () => {
    expect(new Date(LAST_UPDATED).toISOString()).toBe(LAST_UPDATED);
  });
});
