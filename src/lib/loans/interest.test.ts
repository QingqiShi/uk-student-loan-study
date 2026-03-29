import { describe, it, expect } from "vitest";
import { getAnnualInterestRate } from "./interest";
import { PLAN_CONFIGS } from "./plans";

describe("getAnnualInterestRate", () => {
  describe("PLAN_1 - min(RPI, BoE+1%)", () => {
    it("returns RPI when RPI < BoE+1%", () => {
      const rpi = 3.0;
      const boe = 4.0; // BoE+1 = 5.0
      expect(getAnnualInterestRate("PLAN_1", 50000, rpi, boe)).toBe(rpi);
    });

    it("returns BoE+1% when BoE+1% < RPI", () => {
      const rpi = 6.0;
      const boe = 4.0; // BoE+1 = 5.0
      expect(getAnnualInterestRate("PLAN_1", 50000, rpi, boe)).toBe(boe + 1);
    });

    it("returns either when RPI = BoE+1%", () => {
      const rpi = 5.0;
      const boe = 4.0; // BoE+1 = 5.0
      expect(getAnnualInterestRate("PLAN_1", 50000, rpi, boe)).toBe(5.0);
    });

    it("is independent of salary", () => {
      const rpi = 3.0;
      const boe = 4.0;
      const lowSalary = getAnnualInterestRate("PLAN_1", 20000, rpi, boe);
      const highSalary = getAnnualInterestRate("PLAN_1", 100000, rpi, boe);
      expect(lowSalary).toBe(highSalary);
    });
  });

  describe("PLAN_4 - min(RPI, BoE+1%)", () => {
    it("returns RPI when RPI < BoE+1%", () => {
      const rpi = 2.5;
      const boe = 3.0; // BoE+1 = 4.0
      expect(getAnnualInterestRate("PLAN_4", 50000, rpi, boe)).toBe(rpi);
    });

    it("returns BoE+1% when BoE+1% < RPI", () => {
      const rpi = 8.0;
      const boe = 5.0; // BoE+1 = 6.0
      expect(getAnnualInterestRate("PLAN_4", 50000, rpi, boe)).toBe(boe + 1);
    });

    it("is independent of salary", () => {
      const rpi = 3.0;
      const boe = 4.0;
      const lowSalary = getAnnualInterestRate("PLAN_4", 20000, rpi, boe);
      const highSalary = getAnnualInterestRate("PLAN_4", 100000, rpi, boe);
      expect(lowSalary).toBe(highSalary);
    });
  });

  describe("PLAN_2 - sliding scale", () => {
    const rpi = 3.0;
    const boe = 4.0;
    const { interestLowerThreshold, interestUpperThreshold } =
      PLAN_CONFIGS.PLAN_2;

    it("returns RPI at lower threshold", () => {
      expect(
        getAnnualInterestRate("PLAN_2", interestLowerThreshold, rpi, boe),
      ).toBe(rpi);
    });

    it("returns RPI below lower threshold", () => {
      expect(
        getAnnualInterestRate(
          "PLAN_2",
          interestLowerThreshold - 5000,
          rpi,
          boe,
        ),
      ).toBe(rpi);
    });

    it("returns RPI+3% at upper threshold", () => {
      expect(
        getAnnualInterestRate("PLAN_2", interestUpperThreshold, rpi, boe),
      ).toBe(rpi + 3);
    });

    it("returns RPI+3% above upper threshold", () => {
      expect(
        getAnnualInterestRate(
          "PLAN_2",
          interestUpperThreshold + 10000,
          rpi,
          boe,
        ),
      ).toBe(rpi + 3);
    });

    it("returns midpoint at midpoint salary", () => {
      const midSalary = (interestLowerThreshold + interestUpperThreshold) / 2;
      const expectedRate = rpi + 1.5; // RPI + (0.5 * 3)
      expect(getAnnualInterestRate("PLAN_2", midSalary, rpi, boe)).toBeCloseTo(
        expectedRate,
        5,
      );
    });

    it("interpolates correctly at 25% of range", () => {
      const salary =
        interestLowerThreshold +
        (interestUpperThreshold - interestLowerThreshold) * 0.25;
      const expectedRate = rpi + 0.75; // RPI + (0.25 * 3)
      expect(getAnnualInterestRate("PLAN_2", salary, rpi, boe)).toBeCloseTo(
        expectedRate,
        5,
      );
    });

    it("interpolates correctly at 75% of range", () => {
      const salary =
        interestLowerThreshold +
        (interestUpperThreshold - interestLowerThreshold) * 0.75;
      const expectedRate = rpi + 2.25; // RPI + (0.75 * 3)
      expect(getAnnualInterestRate("PLAN_2", salary, rpi, boe)).toBeCloseTo(
        expectedRate,
        5,
      );
    });

    it("works with different RPI values", () => {
      const highRpi = 8.0;
      expect(
        getAnnualInterestRate("PLAN_2", interestLowerThreshold, highRpi, boe),
      ).toBe(highRpi);
      expect(
        getAnnualInterestRate("PLAN_2", interestUpperThreshold, highRpi, boe),
      ).toBe(highRpi + 3);
    });
  });

  describe("PLAN_5 - RPI only", () => {
    it("returns RPI exactly", () => {
      const rpi = 4.5;
      expect(getAnnualInterestRate("PLAN_5", 50000, rpi, 3.0)).toBe(rpi);
    });

    it("is independent of salary", () => {
      const rpi = 4.5;
      const boe = 3.0;
      const lowSalary = getAnnualInterestRate("PLAN_5", 20000, rpi, boe);
      const highSalary = getAnnualInterestRate("PLAN_5", 150000, rpi, boe);
      expect(lowSalary).toBe(highSalary);
      expect(lowSalary).toBe(rpi);
    });

    it("is independent of BoE rate", () => {
      const rpi = 4.5;
      const lowBoe = getAnnualInterestRate("PLAN_5", 50000, rpi, 1.0);
      const highBoe = getAnnualInterestRate("PLAN_5", 50000, rpi, 10.0);
      expect(lowBoe).toBe(highBoe);
      expect(lowBoe).toBe(rpi);
    });
  });

  describe("POSTGRADUATE - RPI+3%", () => {
    it("returns RPI + 3%", () => {
      const rpi = 3.5;
      expect(getAnnualInterestRate("POSTGRADUATE", 50000, rpi, 4.0)).toBe(
        rpi + 3,
      );
    });

    it("is independent of salary", () => {
      const rpi = 3.5;
      const boe = 4.0;
      const lowSalary = getAnnualInterestRate("POSTGRADUATE", 20000, rpi, boe);
      const highSalary = getAnnualInterestRate(
        "POSTGRADUATE",
        150000,
        rpi,
        boe,
      );
      expect(lowSalary).toBe(highSalary);
      expect(lowSalary).toBe(rpi + 3);
    });

    it("is independent of BoE rate", () => {
      const rpi = 3.5;
      const lowBoe = getAnnualInterestRate("POSTGRADUATE", 50000, rpi, 1.0);
      const highBoe = getAnnualInterestRate("POSTGRADUATE", 50000, rpi, 10.0);
      expect(lowBoe).toBe(highBoe);
      expect(lowBoe).toBe(rpi + 3);
    });
  });

  describe("PLAN_2 with InterestThresholdOverrides", () => {
    const rpi = 3.0;
    const boe = 4.0;

    it("uses overridden lower threshold for RPI-only boundary", () => {
      // Custom lower threshold at £35,000; salary at £34,000 → below lower → RPI only
      const overrides = {
        interestLowerThreshold: 35000,
        interestUpperThreshold: 55000,
      };
      expect(getAnnualInterestRate("PLAN_2", 34000, rpi, boe, overrides)).toBe(
        rpi,
      );
    });

    it("uses overridden upper threshold for RPI+3% boundary", () => {
      // Custom upper threshold at £55,000; salary at £56,000 → above upper → RPI+3%
      const overrides = {
        interestLowerThreshold: 35000,
        interestUpperThreshold: 55000,
      };
      expect(getAnnualInterestRate("PLAN_2", 56000, rpi, boe, overrides)).toBe(
        rpi + 3,
      );
    });

    it("interpolates correctly within overridden range", () => {
      const overrides = {
        interestLowerThreshold: 30000,
        interestUpperThreshold: 50000,
      };
      // Midpoint of 30k–50k is 40k → RPI + 1.5%
      expect(
        getAnnualInterestRate("PLAN_2", 40000, rpi, boe, overrides),
      ).toBeCloseTo(rpi + 1.5, 5);
    });

    it("returns RPI at the overridden lower threshold exactly", () => {
      const overrides = {
        interestLowerThreshold: 32000,
        interestUpperThreshold: 60000,
      };
      expect(getAnnualInterestRate("PLAN_2", 32000, rpi, boe, overrides)).toBe(
        rpi,
      );
    });

    it("returns RPI+3% at the overridden upper threshold exactly", () => {
      const overrides = {
        interestLowerThreshold: 32000,
        interestUpperThreshold: 60000,
      };
      expect(getAnnualInterestRate("PLAN_2", 60000, rpi, boe, overrides)).toBe(
        rpi + 3,
      );
    });

    it("only affects PLAN_2, not other plans", () => {
      const overrides = {
        interestLowerThreshold: 50000,
        interestUpperThreshold: 80000,
      };
      // Plan 1 should ignore overrides
      expect(getAnnualInterestRate("PLAN_1", 50000, rpi, boe, overrides)).toBe(
        rpi,
      );
      // Plan 5 should ignore overrides
      expect(getAnnualInterestRate("PLAN_5", 50000, rpi, boe, overrides)).toBe(
        rpi,
      );
      // Postgraduate should ignore overrides
      expect(
        getAnnualInterestRate("POSTGRADUATE", 50000, rpi, boe, overrides),
      ).toBe(rpi + 3);
    });

    it("allows partial override of lower threshold only", () => {
      const overrides = { interestLowerThreshold: 35000 };
      // Salary at £34,000 is below overridden lower → RPI only
      expect(getAnnualInterestRate("PLAN_2", 34000, rpi, boe, overrides)).toBe(
        rpi,
      );
      // Salary above default upper threshold → RPI+3%
      expect(
        getAnnualInterestRate(
          "PLAN_2",
          PLAN_CONFIGS.PLAN_2.interestUpperThreshold + 1000,
          rpi,
          boe,
          overrides,
        ),
      ).toBe(rpi + 3);
    });

    it("allows partial override of upper threshold only", () => {
      const overrides = { interestUpperThreshold: 60000 };
      // Salary below default lower threshold → RPI only
      expect(
        getAnnualInterestRate(
          "PLAN_2",
          PLAN_CONFIGS.PLAN_2.interestLowerThreshold - 1000,
          rpi,
          boe,
          overrides,
        ),
      ).toBe(rpi);
      // Salary above overridden upper → RPI+3%
      expect(getAnnualInterestRate("PLAN_2", 61000, rpi, boe, overrides)).toBe(
        rpi + 3,
      );
    });

    it("interpolates at 25% within wider overridden range", () => {
      const overrides = {
        interestLowerThreshold: 20000,
        interestUpperThreshold: 60000,
      };
      // 25% of 20k–60k = 30k → RPI + 0.75%
      const salary = 20000 + (60000 - 20000) * 0.25;
      expect(
        getAnnualInterestRate("PLAN_2", salary, rpi, boe, overrides),
      ).toBeCloseTo(rpi + 0.75, 5);
    });
  });

  describe("edge cases", () => {
    it("handles zero RPI", () => {
      expect(getAnnualInterestRate("PLAN_5", 50000, 0, 4.0)).toBe(0);
      expect(getAnnualInterestRate("POSTGRADUATE", 50000, 0, 4.0)).toBe(3);
    });

    it("handles zero BoE rate", () => {
      expect(getAnnualInterestRate("PLAN_1", 50000, 3.0, 0)).toBe(1); // min(3.0, 0+1)
    });

    it("handles negative salary (theoretical)", () => {
      // Should not crash, treat as below lower threshold for PLAN_2
      const rate = getAnnualInterestRate("PLAN_2", -1000, 3.0, 4.0);
      expect(rate).toBe(3.0); // RPI
    });
  });
});
