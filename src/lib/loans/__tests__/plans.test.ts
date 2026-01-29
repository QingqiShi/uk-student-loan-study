import { describe, it, expect } from "vitest";
import { PLAN_CONFIGS, CURRENT_RATES } from "../plans";

describe("PLAN_CONFIGS", () => {
  describe("required fields", () => {
    const planTypes = Object.keys(PLAN_CONFIGS) as Array<
      keyof typeof PLAN_CONFIGS
    >;

    it.each(planTypes)("%s has monthlyThreshold", (planType) => {
      expect(PLAN_CONFIGS[planType].monthlyThreshold).toBeGreaterThan(0);
    });

    it.each(planTypes)("%s has repaymentRate", (planType) => {
      const rate = PLAN_CONFIGS[planType].repaymentRate;
      expect(rate).toBeGreaterThan(0);
      expect(rate).toBeLessThanOrEqual(1);
    });

    it.each(planTypes)("%s has writeOffYears", (planType) => {
      expect(PLAN_CONFIGS[planType].writeOffYears).toBeGreaterThan(0);
    });
  });

  describe("PLAN_1", () => {
    const plan = PLAN_CONFIGS.PLAN_1;

    it("has correct monthly threshold (£26,065/12)", () => {
      expect(plan.monthlyThreshold).toBe(2172);
    });

    it("has 9% repayment rate", () => {
      expect(plan.repaymentRate).toBe(0.09);
    });

    it("has 25-year write-off", () => {
      expect(plan.writeOffYears).toBe(25);
    });
  });

  describe("PLAN_2", () => {
    const plan = PLAN_CONFIGS.PLAN_2;

    it("has correct monthly threshold (£28,470/12)", () => {
      expect(plan.monthlyThreshold).toBe(2372);
    });

    it("has 9% repayment rate", () => {
      expect(plan.repaymentRate).toBe(0.09);
    });

    it("has 30-year write-off", () => {
      expect(plan.writeOffYears).toBe(30);
    });

    it("has interest thresholds for sliding scale", () => {
      expect(plan.interestLowerThreshold).toBe(28470);
      expect(plan.interestUpperThreshold).toBe(51245);
      expect(plan.interestUpperThreshold).toBeGreaterThan(
        plan.interestLowerThreshold,
      );
    });
  });

  describe("PLAN_4", () => {
    const plan = PLAN_CONFIGS.PLAN_4;

    it("has correct monthly threshold (£32,745/12)", () => {
      expect(plan.monthlyThreshold).toBe(2728);
    });

    it("has 9% repayment rate", () => {
      expect(plan.repaymentRate).toBe(0.09);
    });

    it("has 30-year write-off", () => {
      expect(plan.writeOffYears).toBe(30);
    });
  });

  describe("PLAN_5", () => {
    const plan = PLAN_CONFIGS.PLAN_5;

    it("has correct monthly threshold (£25,000/12)", () => {
      expect(plan.monthlyThreshold).toBe(2083);
    });

    it("has 9% repayment rate", () => {
      expect(plan.repaymentRate).toBe(0.09);
    });

    it("has 40-year write-off", () => {
      expect(plan.writeOffYears).toBe(40);
    });
  });

  describe("POSTGRADUATE", () => {
    const plan = PLAN_CONFIGS.POSTGRADUATE;

    it("has correct monthly threshold (£21,000/12)", () => {
      expect(plan.monthlyThreshold).toBe(1750);
    });

    it("has 6% repayment rate", () => {
      expect(plan.repaymentRate).toBe(0.06);
    });

    it("has 30-year write-off", () => {
      expect(plan.writeOffYears).toBe(30);
    });
  });

  describe("all plans have correct ordering", () => {
    it("PLAN_4 has highest threshold (Scotland)", () => {
      const thresholds = [
        PLAN_CONFIGS.PLAN_1.monthlyThreshold,
        PLAN_CONFIGS.PLAN_2.monthlyThreshold,
        PLAN_CONFIGS.PLAN_4.monthlyThreshold,
        PLAN_CONFIGS.PLAN_5.monthlyThreshold,
      ];
      expect(Math.max(...thresholds)).toBe(
        PLAN_CONFIGS.PLAN_4.monthlyThreshold,
      );
    });

    it("POSTGRADUATE has lowest threshold", () => {
      const thresholds = [
        PLAN_CONFIGS.PLAN_1.monthlyThreshold,
        PLAN_CONFIGS.PLAN_2.monthlyThreshold,
        PLAN_CONFIGS.PLAN_4.monthlyThreshold,
        PLAN_CONFIGS.PLAN_5.monthlyThreshold,
        PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold,
      ];
      expect(Math.min(...thresholds)).toBe(
        PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold,
      );
    });

    it("PLAN_5 has longest write-off period", () => {
      const writeOffs = [
        PLAN_CONFIGS.PLAN_1.writeOffYears,
        PLAN_CONFIGS.PLAN_2.writeOffYears,
        PLAN_CONFIGS.PLAN_4.writeOffYears,
        PLAN_CONFIGS.PLAN_5.writeOffYears,
        PLAN_CONFIGS.POSTGRADUATE.writeOffYears,
      ];
      expect(Math.max(...writeOffs)).toBe(PLAN_CONFIGS.PLAN_5.writeOffYears);
    });
  });
});

describe("CURRENT_RATES", () => {
  it("has RPI rate", () => {
    expect(CURRENT_RATES.rpi).toBeGreaterThan(0);
    expect(CURRENT_RATES.rpi).toBeLessThan(20); // Sanity check
  });

  it("has BoE base rate", () => {
    expect(CURRENT_RATES.boeBaseRate).toBeGreaterThanOrEqual(0);
    expect(CURRENT_RATES.boeBaseRate).toBeLessThan(20); // Sanity check
  });
});
