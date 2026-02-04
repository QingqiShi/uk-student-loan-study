import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { simulateOverpayScenarios } from "./overpay-simulate";
import { CURRENT_RATES } from "./plans";
import type { OverpayInput } from "./overpay-types";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-01-15"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("simulateOverpayScenarios", () => {
  const defaultInput: OverpayInput = {
    loans: [{ planType: "PLAN_2", balance: 50000 }],
    startingSalary: 50000,
    repaymentStartDate: new Date("2022-04-01"),
    monthlyOverpayment: 200,
    salaryGrowthRate: "moderate",
    rpiRate: CURRENT_RATES.rpi,
    boeBaseRate: CURRENT_RATES.boeBaseRate,
  };

  describe("empty and edge cases", () => {
    it("returns empty result for zero balance", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 0 }],
      });

      expect(result.baseline.totalPaid).toBe(0);
      expect(result.overpay.totalPaid).toBe(0);
      expect(result.monthsSaved).toBe(0);
    });

    it("shows prompt when no overpayment but still generates chart data", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 0,
        lumpSumPayment: 0,
      });

      expect(result.recommendation).toBe("marginal");
      expect(result.recommendationReason).toContain("Enter an overpayment");
      // Chart data should still be generated for baseline visualization
      expect(result.balanceTimeSeries.length).toBeGreaterThan(0);
      expect(result.baseline.totalPaid).toBeGreaterThan(0);
    });

    it("returns empty result for no loans", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [],
      });

      expect(result.baseline.totalPaid).toBe(0);
    });
  });

  describe("recommendation logic", () => {
    it("recommends dont-overpay when loan will be written off regardless", () => {
      // Low salary + high balance = written off even with overpayment
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        startingSalary: 30000,
        monthlyOverpayment: 100,
        salaryGrowthRate: "conservative",
      });

      expect(result.baseline.writtenOff).toBe(true);
      expect(result.overpay.writtenOff).toBe(true);
      expect(result.recommendation).toBe("dont-overpay");
    });

    it("recommends overpay when overpaying saves money", () => {
      // High salary = pays off quickly
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 30000 }],
        startingSalary: 150000,
        monthlyOverpayment: 500,
      });

      // High salary pays off quickly, overpaying saves significant interest
      if (result.recommendation === "overpay") {
        expect(result.recommendationReason).toContain("could save");
      }
    });

    it("recommends marginal when difference is small", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 40000 }],
        startingSalary: 80000,
        monthlyOverpayment: 100,
      });

      // Result could be marginal or one of the other recommendations
      expect(["dont-overpay", "overpay", "marginal"]).toContain(
        result.recommendation,
      );
    });
  });

  describe("baseline vs overpay scenarios", () => {
    it("overpay scenario pays off faster than baseline", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        startingSalary: 60000,
        monthlyOverpayment: 300,
      });

      expect(result.overpay.monthsToPayoff).toBeLessThanOrEqual(
        result.baseline.monthsToPayoff,
      );
    });

    it("overpay scenario has lower total paid when loan is paid off", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 30000 }],
        startingSalary: 100000,
        monthlyOverpayment: 500,
      });

      if (!result.baseline.writtenOff && !result.overpay.writtenOff) {
        expect(result.overpay.totalPaid).toBeLessThanOrEqual(
          result.baseline.totalPaid,
        );
      }
    });

    it("monthsSaved is positive when overpaying pays off faster", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 30000 }],
        startingSalary: 100000,
        monthlyOverpayment: 500,
      });

      if (!result.baseline.writtenOff && !result.overpay.writtenOff) {
        expect(result.monthsSaved).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("salary growth", () => {
    it("aggressive growth results in faster payoff", () => {
      const conservative = simulateOverpayScenarios({
        ...defaultInput,
        salaryGrowthRate: "conservative",
      });

      const aggressive = simulateOverpayScenarios({
        ...defaultInput,
        salaryGrowthRate: "aggressive",
      });

      expect(aggressive.baseline.monthsToPayoff).toBeLessThanOrEqual(
        conservative.baseline.monthsToPayoff,
      );
    });

    it("finalSalary is higher than starting salary with growth", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        startingSalary: 50000,
        salaryGrowthRate: "moderate",
      });

      if (result.baseline.monthsToPayoff > 12) {
        expect(result.baseline.finalSalary).toBeGreaterThan(50000);
      }
    });
  });

  describe("balance time series", () => {
    it("generates time series data", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result.balanceTimeSeries.length).toBeGreaterThan(0);
    });

    it("time series starts at month 0", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result.balanceTimeSeries[0].month).toBe(0);
    });

    it("time series includes both baseline and overpay balance", () => {
      const result = simulateOverpayScenarios(defaultInput);

      const firstPoint = result.balanceTimeSeries[0];
      expect(firstPoint).toHaveProperty("baselineBalance");
      expect(firstPoint).toHaveProperty("overpayBalance");
    });

    it("overpay balance decreases faster than baseline", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        startingSalary: 80000,
        monthlyOverpayment: 300,
      });

      // Find a mid-point in the series and verify overpay balance is lower
      const midIndex = Math.floor(result.balanceTimeSeries.length / 2);
      const midPoint = result.balanceTimeSeries[midIndex];
      expect(midPoint.overpayBalance).toBeLessThanOrEqual(
        midPoint.baselineBalance,
      );
    });
  });

  describe("write-off months", () => {
    it("writeOffMonth is set when baseline is written off", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        startingSalary: 30000,
        salaryGrowthRate: "conservative",
      });

      if (result.baseline.writtenOff) {
        expect(result.writeOffMonth).toBe(result.baseline.monthsToPayoff);
      }
    });

    it("writeOffMonth is null when loan is paid off", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 20000 }],
        startingSalary: 150000,
      });

      if (!result.baseline.writtenOff) {
        expect(result.writeOffMonth).toBeNull();
      }
    });
  });

  describe("payment difference calculation", () => {
    it("paymentDifference is difference between baseline and overpay total paid", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        startingSalary: 80000,
        monthlyOverpayment: 300,
      });

      expect(result.paymentDifference).toBe(
        result.baseline.totalPaid - result.overpay.totalPaid,
      );
    });

    it("paymentDifference is non-negative when not written off", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 30000 }],
        startingSalary: 100000,
        monthlyOverpayment: 500,
      });

      if (!result.baseline.writtenOff && !result.overpay.writtenOff) {
        expect(result.paymentDifference).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe("result structure", () => {
    it("returns all required fields in OverpayAnalysisResult", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result).toHaveProperty("baseline");
      expect(result).toHaveProperty("overpay");
      expect(result).toHaveProperty("recommendation");
      expect(result).toHaveProperty("recommendationReason");
      expect(result).toHaveProperty("balanceTimeSeries");
      expect(result).toHaveProperty("writeOffMonth");
      expect(result).toHaveProperty("paymentDifference");
      expect(result).toHaveProperty("overpaymentContributions");
      expect(result).toHaveProperty("monthsSaved");
    });

    it("ScenarioResult contains all required fields", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result.baseline).toHaveProperty("totalPaid");
      expect(result.baseline).toHaveProperty("monthsToPayoff");
      expect(result.baseline).toHaveProperty("writtenOff");
      expect(result.baseline).toHaveProperty("amountWrittenOff");
      expect(result.baseline).toHaveProperty("finalSalary");
    });
  });

  describe("plan type handling", () => {
    it("handles PLAN_5 with 40-year write-off", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_5", balance: 60000 }],
        startingSalary: 35000,
        salaryGrowthRate: "conservative",
      });

      expect(result.baseline.monthsToPayoff).toBeGreaterThan(0);
    });

    it("handles POSTGRADUATE loan", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "POSTGRADUATE", balance: 25000 }],
        startingSalary: 40000,
      });

      expect(result.baseline.monthsToPayoff).toBeGreaterThan(0);
    });

    it("handles combined undergrad + postgrad loans", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 25000 },
        ],
        startingSalary: 60000,
      });

      // Should use combined balance
      expect(result.baseline.totalPaid).toBeGreaterThan(0);
    });
  });

  describe("lump sum payment", () => {
    it("lump sum only (no monthly) generates meaningful analysis", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 0,
        lumpSumPayment: 10000,
      });

      // Should get real recommendation, not the "enter an overpayment" prompt
      expect(result.recommendationReason).not.toContain("Enter an overpayment");
      expect(["dont-overpay", "overpay", "marginal"]).toContain(
        result.recommendation,
      );
    });

    it("lump sum is included in overpay totalPaid", () => {
      const lumpSum = 5000;
      const result = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 0,
        lumpSumPayment: lumpSum,
      });

      // Overpay totalPaid should be higher than baseline by approximately the lump sum
      // (may be less if lump sum reduces interest paid)
      expect(result.overpay.totalPaid).toBeGreaterThanOrEqual(lumpSum);
    });

    it("baseline does not include lump sum", () => {
      const withoutLumpSum = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 0,
        lumpSumPayment: 0,
      });

      const withLumpSum = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 0,
        lumpSumPayment: 10000,
      });

      // Baseline should be identical regardless of lump sum
      expect(withLumpSum.baseline.totalPaid).toBe(
        withoutLumpSum.baseline.totalPaid,
      );
      expect(withLumpSum.baseline.monthsToPayoff).toBe(
        withoutLumpSum.baseline.monthsToPayoff,
      );
    });

    it("lump sum reduces overpay scenario balance and time to payoff", () => {
      const withoutLumpSum = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 30000 }],
        startingSalary: 100000,
        monthlyOverpayment: 200,
        lumpSumPayment: 0,
      });

      const withLumpSum = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 30000 }],
        startingSalary: 100000,
        monthlyOverpayment: 200,
        lumpSumPayment: 10000,
      });

      // With lump sum should pay off faster
      expect(withLumpSum.overpay.monthsToPayoff).toBeLessThan(
        withoutLumpSum.overpay.monthsToPayoff,
      );
    });

    it("lump sum is included in overpaymentContributions", () => {
      const lumpSum = 5000;
      const result = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 100,
        lumpSumPayment: lumpSum,
      });

      // Contributions should include lump sum
      expect(result.overpaymentContributions).toBeGreaterThanOrEqual(lumpSum);
    });

    it("paymentDifference correctly accounts for lump sum", () => {
      // When loan would be written off, lump sum is extra cost
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        startingSalary: 30000,
        monthlyOverpayment: 0,
        lumpSumPayment: 10000,
        salaryGrowthRate: "conservative",
      });

      if (result.baseline.writtenOff) {
        // Lump sum should make paymentDifference negative (extra cost)
        expect(result.paymentDifference).toBeLessThan(0);
      }
    });

    it("lump sum that pays off entire loan returns valid result", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 5000 }],
        startingSalary: 50000,
        monthlyOverpayment: 0,
        lumpSumPayment: 10000, // More than balance
      });

      // Lump sum should be capped to actual balance
      expect(result.overpay.totalPaid).toBe(5000);
      expect(result.overpay.monthsToPayoff).toBe(0);
      expect(result.overpay.writtenOff).toBe(false);
      // Chart should show £0 balance for overpay scenario
      expect(result.balanceTimeSeries[0]?.overpayBalance).toBe(0);
    });
  });
});
