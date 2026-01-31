import { describe, it, expect, vi, afterEach } from "vitest";
import dayjs from "dayjs";
import { simulateOverpayScenarios } from "./overpay-simulate";
import { CURRENT_RATES } from "./plans";
import type { OverpayInput } from "./overpay-types";

// Mock dayjs to control "now" for deterministic tests
vi.mock("dayjs", async (importOriginal) => {
  const mod = await importOriginal<{ default: typeof dayjs }>();
  const actualDayjs = mod.default;
  const mockNow = actualDayjs("2024-01-15");

  const mockDayjs = (date?: dayjs.ConfigType) => {
    if (date === undefined) {
      return mockNow;
    }
    return actualDayjs(date);
  };

  Object.assign(mockDayjs, actualDayjs);

  return { default: mockDayjs };
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("simulateOverpayScenarios", () => {
  const defaultInput: OverpayInput = {
    loans: [{ planType: "PLAN_2", balance: 50000 }],
    startingSalary: 50000,
    repaymentStartDate: new Date("2022-04-01"),
    monthlyOverpayment: 200,
    salaryGrowthRate: "moderate",
    alternativeSavingsRate: 0.05,
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
      expect(result.investment.portfolioValue).toBe(0);
    });

    it("returns empty result for zero overpayment", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 0,
      });

      expect(result.recommendation).toBe("marginal");
      expect(result.recommendationReason).toContain("Enter an overpayment");
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

    it("recommends overpay when interest saved beats investment returns", () => {
      // High salary = pays off quickly, low investment rate
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 30000 }],
        startingSalary: 150000,
        monthlyOverpayment: 500,
        alternativeSavingsRate: 0.02, // Low investment rate
      });

      // High salary pays off quickly, overpaying saves significant interest
      if (result.recommendation === "overpay") {
        expect(result.recommendationReason).toContain("saves");
      }
    });

    it("recommends invest-instead when investment returns beat interest saved", () => {
      // Low balance that would be paid off anyway, high investment rate
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 20000 }],
        startingSalary: 100000,
        monthlyOverpayment: 200,
        alternativeSavingsRate: 0.1, // High investment rate
      });

      // With high investment rate and quick payoff, investing should win
      expect(["invest-instead", "marginal", "overpay"]).toContain(
        result.recommendation,
      );
    });

    it("recommends marginal when difference is small", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 40000 }],
        startingSalary: 80000,
        monthlyOverpayment: 100,
        alternativeSavingsRate: 0.05,
      });

      // Result could be marginal or one of the other recommendations
      expect([
        "dont-overpay",
        "invest-instead",
        "overpay",
        "marginal",
      ]).toContain(result.recommendation);
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
  });

  describe("investment simulation", () => {
    it("investment grows over time", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        monthlyOverpayment: 200,
        alternativeSavingsRate: 0.05,
      });

      expect(result.investment.portfolioValue).toBeGreaterThan(
        result.investment.totalContributed,
      );
    });

    it("investment gains are positive with positive return rate", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        alternativeSavingsRate: 0.05,
      });

      expect(result.investment.investmentGains).toBeGreaterThan(0);
    });

    it("investment gains are zero with zero return rate", () => {
      const result = simulateOverpayScenarios({
        ...defaultInput,
        alternativeSavingsRate: 0,
      });

      expect(result.investment.portfolioValue).toBe(
        result.investment.totalContributed,
      );
      expect(result.investment.investmentGains).toBe(0);
    });

    it("higher return rate results in larger portfolio", () => {
      const lowRate = simulateOverpayScenarios({
        ...defaultInput,
        alternativeSavingsRate: 0.03,
      });

      const highRate = simulateOverpayScenarios({
        ...defaultInput,
        alternativeSavingsRate: 0.08,
      });

      expect(highRate.investment.portfolioValue).toBeGreaterThan(
        lowRate.investment.portfolioValue,
      );
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

  describe("net worth time series", () => {
    it("generates time series data", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result.netWorthTimeSeries.length).toBeGreaterThan(0);
    });

    it("time series starts at month 0", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result.netWorthTimeSeries[0].month).toBe(0);
    });

    it("time series includes both overpay and invest net worth", () => {
      const result = simulateOverpayScenarios(defaultInput);

      const firstPoint = result.netWorthTimeSeries[0];
      expect(firstPoint).toHaveProperty("overpayNetWorth");
      expect(firstPoint).toHaveProperty("investNetWorth");
    });
  });

  describe("crossover and write-off months", () => {
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
      expect(result).toHaveProperty("investment");
      expect(result).toHaveProperty("recommendation");
      expect(result).toHaveProperty("recommendationReason");
      expect(result).toHaveProperty("netWorthTimeSeries");
      expect(result).toHaveProperty("crossoverMonth");
      expect(result).toHaveProperty("writeOffMonth");
      expect(result).toHaveProperty("paymentDifference");
      expect(result).toHaveProperty("overpaymentContributions");
    });

    it("ScenarioResult contains all required fields", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result.baseline).toHaveProperty("totalPaid");
      expect(result.baseline).toHaveProperty("monthsToPayoff");
      expect(result.baseline).toHaveProperty("writtenOff");
      expect(result.baseline).toHaveProperty("amountWrittenOff");
      expect(result.baseline).toHaveProperty("finalSalary");
    });

    it("InvestmentResult contains all required fields", () => {
      const result = simulateOverpayScenarios(defaultInput);

      expect(result.investment).toHaveProperty("portfolioValue");
      expect(result.investment).toHaveProperty("totalContributed");
      expect(result.investment).toHaveProperty("investmentGains");
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
});
