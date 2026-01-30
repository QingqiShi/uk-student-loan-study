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
