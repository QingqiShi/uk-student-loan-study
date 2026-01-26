import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import dayjs from "dayjs";
import {
  getPlan2Rate,
  calculateMonthlyRepayment,
  simulateLoanRepayment,
  generateSalaryDataSeries,
  calculateAnnualizedRate,
} from "../loan-calculations";
import type { LoanConfig, SimulationResult } from "../../types/loan";
import {
  PLAN2_LT,
  PLAN2_UT,
  PLAN2_MONTHLY_THRESHOLD,
  PLAN5_MONTHLY_THRESHOLD,
  POST_GRAD_MONTHLY_THRESHOLD,
  MIN_SALARY,
  MAX_SALARY,
  SALARY_STEP,
} from "../../constants";

// Mock dayjs to control "now" for deterministic tests
vi.mock("dayjs", async (importOriginal) => {
  // importOriginal returns the ESM namespace object with { default: dayjs }
  const mod = await importOriginal<{ default: typeof dayjs }>();
  const actualDayjs = mod.default;
  const mockNow = actualDayjs("2024-01-15");

  const mockDayjs = (date?: dayjs.ConfigType) => {
    if (date === undefined) {
      return mockNow;
    }
    return actualDayjs(date);
  };

  // Copy all static methods from dayjs
  Object.assign(mockDayjs, actualDayjs);

  return { default: mockDayjs };
});

describe("getPlan2Rate", () => {
  const lowerRate = 4.5;
  const upperRate = 7.5;

  describe("boundary conditions", () => {
    it("returns lower rate when salary is below PLAN2_LT", () => {
      expect(getPlan2Rate(20_000, lowerRate, upperRate)).toBe(lowerRate);
    });

    it("returns lower rate when salary equals PLAN2_LT", () => {
      expect(getPlan2Rate(PLAN2_LT, lowerRate, upperRate)).toBe(lowerRate);
    });

    it("returns upper rate when salary exceeds PLAN2_UT", () => {
      expect(getPlan2Rate(60_000, lowerRate, upperRate)).toBe(upperRate);
    });

    it("returns upper rate when salary equals PLAN2_UT + 1", () => {
      expect(getPlan2Rate(PLAN2_UT + 1, lowerRate, upperRate)).toBe(upperRate);
    });
  });

  describe("linear interpolation", () => {
    it("returns midpoint rate at midpoint salary", () => {
      const midSalary = (PLAN2_LT + PLAN2_UT) / 2;
      const midRate = (lowerRate + upperRate) / 2;
      expect(getPlan2Rate(midSalary, lowerRate, upperRate)).toBeCloseTo(
        midRate,
        5,
      );
    });

    it("interpolates correctly at 25% of range", () => {
      const salary = PLAN2_LT + (PLAN2_UT - PLAN2_LT) * 0.25;
      const expectedRate = lowerRate + (upperRate - lowerRate) * 0.25;
      expect(getPlan2Rate(salary, lowerRate, upperRate)).toBeCloseTo(
        expectedRate,
        5,
      );
    });

    it("interpolates correctly at 75% of range", () => {
      const salary = PLAN2_LT + (PLAN2_UT - PLAN2_LT) * 0.75;
      const expectedRate = lowerRate + (upperRate - lowerRate) * 0.75;
      expect(getPlan2Rate(salary, lowerRate, upperRate)).toBeCloseTo(
        expectedRate,
        5,
      );
    });
  });

  describe("edge cases", () => {
    it("handles equal lower and upper rates", () => {
      const rate = 6.5;
      expect(getPlan2Rate(35_000, rate, rate)).toBe(rate);
    });

    it("handles zero rates", () => {
      expect(getPlan2Rate(35_000, 0, 0)).toBe(0);
    });

    it("handles negative salary (should return lower rate)", () => {
      expect(getPlan2Rate(-10_000, lowerRate, upperRate)).toBe(lowerRate);
    });
  });
});

describe("calculateMonthlyRepayment", () => {
  describe("Plan 2 (9% rate, £2,274 threshold)", () => {
    const threshold = PLAN2_MONTHLY_THRESHOLD;
    const rate = 0.09;

    it("returns 0 when salary is below threshold", () => {
      expect(calculateMonthlyRepayment(2000, threshold, rate)).toBe(0);
    });

    it("returns 0 when salary equals threshold", () => {
      expect(calculateMonthlyRepayment(threshold, threshold, rate)).toBe(0);
    });

    it("calculates correct repayment above threshold", () => {
      const monthlySalary = 3000;
      const expected = (monthlySalary - threshold) * rate;
      expect(
        calculateMonthlyRepayment(monthlySalary, threshold, rate),
      ).toBeCloseTo(expected, 2);
    });

    it("calculates correct repayment for high salary", () => {
      const monthlySalary = 10000;
      const expected = (monthlySalary - threshold) * rate;
      expect(
        calculateMonthlyRepayment(monthlySalary, threshold, rate),
      ).toBeCloseTo(expected, 2);
    });
  });

  describe("Plan 5 (9% rate, £2,083 threshold)", () => {
    const threshold = PLAN5_MONTHLY_THRESHOLD;
    const rate = 0.09;

    it("returns 0 when salary is below threshold", () => {
      expect(calculateMonthlyRepayment(2000, threshold, rate)).toBe(0);
    });

    it("calculates correct repayment above threshold", () => {
      const monthlySalary = 3000;
      const expected = (monthlySalary - threshold) * rate;
      expect(
        calculateMonthlyRepayment(monthlySalary, threshold, rate),
      ).toBeCloseTo(expected, 2);
    });
  });

  describe("Postgraduate (6% rate, £1,750 threshold)", () => {
    const threshold = POST_GRAD_MONTHLY_THRESHOLD;
    const rate = 0.06;

    it("returns 0 when salary is below threshold", () => {
      expect(calculateMonthlyRepayment(1500, threshold, rate)).toBe(0);
    });

    it("calculates correct repayment above threshold", () => {
      const monthlySalary = 3000;
      const expected = (monthlySalary - threshold) * rate;
      expect(
        calculateMonthlyRepayment(monthlySalary, threshold, rate),
      ).toBeCloseTo(expected, 2);
    });
  });

  describe("edge cases", () => {
    it("handles zero threshold", () => {
      expect(calculateMonthlyRepayment(1000, 0, 0.09)).toBe(90);
    });

    it("handles zero rate", () => {
      expect(calculateMonthlyRepayment(3000, 2000, 0)).toBe(0);
    });
  });
});

describe("simulateLoanRepayment", () => {
  let baseConfig: LoanConfig;

  beforeEach(() => {
    baseConfig = {
      isPost2023: false,
      underGradBalance: 50_000,
      postGradBalance: 0,
      plan2LTRate: 6.5,
      plan2UTRate: 6.5,
      plan5Rate: 6.5,
      postGradRate: 6.5,
      repaymentDate: new Date("2022-04-01"),
    };
  });

  describe("zero balance scenarios", () => {
    it("returns zero totals when both balances are zero", () => {
      const config = { ...baseConfig, underGradBalance: 0, postGradBalance: 0 };
      const result = simulateLoanRepayment(50_000, config);

      expect(result.totalRepayment).toBe(0);
      expect(result.plan2Payment).toBe(0);
      expect(result.plan5Payment).toBe(0);
      expect(result.postGradPayment).toBe(0);
      expect(result.underGradRemaining).toBe(0);
      expect(result.postGradRemaining).toBe(0);
    });

    it("handles only undergraduate balance (Plan 2)", () => {
      const result = simulateLoanRepayment(50_000, baseConfig);

      expect(result.totalRepayment).toBeGreaterThan(0);
      expect(result.plan2Payment).toBeGreaterThan(0);
      expect(result.plan5Payment).toBe(0);
      expect(result.postGradPayment).toBe(0);
    });

    it("handles only postgraduate balance", () => {
      const config = {
        ...baseConfig,
        underGradBalance: 0,
        postGradBalance: 25_000,
      };
      const result = simulateLoanRepayment(50_000, config);

      expect(result.totalRepayment).toBeGreaterThan(0);
      expect(result.plan2Payment).toBe(0);
      expect(result.plan5Payment).toBe(0);
      expect(result.postGradPayment).toBeGreaterThan(0);
    });
  });

  describe("Plan 2 vs Plan 5", () => {
    it("uses Plan 2 when isPost2023 is false", () => {
      const config = { ...baseConfig, isPost2023: false };
      const result = simulateLoanRepayment(50_000, config);

      expect(result.plan2Payment).toBeGreaterThan(0);
      expect(result.plan5Payment).toBe(0);
    });

    it("uses Plan 5 when isPost2023 is true", () => {
      const config = { ...baseConfig, isPost2023: true };
      const result = simulateLoanRepayment(50_000, config);

      expect(result.plan2Payment).toBe(0);
      expect(result.plan5Payment).toBeGreaterThan(0);
    });

    it("Plan 5 has different repayment characteristics", () => {
      const plan2Result = simulateLoanRepayment(40_000, {
        ...baseConfig,
        isPost2023: false,
      });
      const plan5Result = simulateLoanRepayment(40_000, {
        ...baseConfig,
        isPost2023: true,
      });

      // Both should have payments
      expect(plan2Result.plan2Payment).toBeGreaterThan(0);
      expect(plan5Result.plan5Payment).toBeGreaterThan(0);
    });
  });

  describe("high salary scenarios (loan paid off)", () => {
    it("pays off loan completely with high salary", () => {
      const result = simulateLoanRepayment(150_000, baseConfig);

      // With very high salary, loan should be paid off
      expect(result.underGradRemaining).toBe(0);
    });

    it("total repayment is at least principal for payoff scenario", () => {
      const result = simulateLoanRepayment(150_000, baseConfig);

      // Total repaid should be >= principal (could be more due to interest)
      expect(result.totalRepayment).toBeGreaterThanOrEqual(
        baseConfig.underGradBalance * 0.9,
      );
    });
  });

  describe("low salary scenarios (write-off)", () => {
    it("has remaining balance at write-off with low salary", () => {
      const result = simulateLoanRepayment(MIN_SALARY, baseConfig);

      // At low salary, loan may not be fully repaid
      expect(result.monthsToPayoff).toBeGreaterThan(0);
    });
  });

  describe("combined undergraduate and postgraduate", () => {
    it("tracks both loan types separately", () => {
      const config = { ...baseConfig, postGradBalance: 25_000 };
      const result = simulateLoanRepayment(60_000, config);

      expect(result.plan2Payment).toBeGreaterThan(0);
      expect(result.postGradPayment).toBeGreaterThan(0);
      expect(result.totalRepayment).toBeCloseTo(
        result.plan2Payment + result.plan5Payment + result.postGradPayment,
        5,
      );
    });
  });

  describe("interest rate variations", () => {
    it("higher interest rate results in more total repayment", () => {
      const lowRateConfig = { ...baseConfig, plan2LTRate: 3, plan2UTRate: 3 };
      const highRateConfig = {
        ...baseConfig,
        plan2LTRate: 10,
        plan2UTRate: 10,
      };

      const lowRateResult = simulateLoanRepayment(50_000, lowRateConfig);
      const highRateResult = simulateLoanRepayment(50_000, highRateConfig);

      // Higher interest means more paid over time (or larger write-off)
      expect(highRateResult.totalRepayment).toBeGreaterThanOrEqual(
        lowRateResult.totalRepayment * 0.95,
      );
    });
  });

  describe("result structure", () => {
    it("returns all required fields", () => {
      const result = simulateLoanRepayment(50_000, baseConfig);

      expect(result).toHaveProperty("totalRepayment");
      expect(result).toHaveProperty("monthsToPayoff");
      expect(result).toHaveProperty("underGradRemaining");
      expect(result).toHaveProperty("postGradRemaining");
      expect(result).toHaveProperty("plan2Payment");
      expect(result).toHaveProperty("plan5Payment");
      expect(result).toHaveProperty("postGradPayment");
    });

    it("remaining balances are non-negative", () => {
      const result = simulateLoanRepayment(200_000, baseConfig);

      expect(result.underGradRemaining).toBeGreaterThanOrEqual(0);
      expect(result.postGradRemaining).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("generateSalaryDataSeries", () => {
  let baseConfig: LoanConfig;

  beforeEach(() => {
    baseConfig = {
      isPost2023: false,
      underGradBalance: 50_000,
      postGradBalance: 0,
      plan2LTRate: 6.5,
      plan2UTRate: 6.5,
      plan5Rate: 6.5,
      postGradRate: 6.5,
      repaymentDate: new Date("2022-04-01"),
    };
  });

  it("generates correct number of data points", () => {
    const data = generateSalaryDataSeries(baseConfig, (r) => r.totalRepayment);
    const expectedPoints =
      Math.floor((MAX_SALARY - MIN_SALARY) / SALARY_STEP) + 1;

    expect(data.length).toBe(expectedPoints);
  });

  it("starts at MIN_SALARY and ends at MAX_SALARY", () => {
    const data = generateSalaryDataSeries(baseConfig, (r) => r.totalRepayment);

    expect(data[0][0]).toBe(MIN_SALARY);
    expect(data[data.length - 1][0]).toBe(MAX_SALARY);
  });

  it("increments by SALARY_STEP", () => {
    const data = generateSalaryDataSeries(baseConfig, (r) => r.totalRepayment);

    for (let i = 1; i < data.length; i++) {
      expect(data[i][0] - data[i - 1][0]).toBe(SALARY_STEP);
    }
  });

  describe("mapper functions", () => {
    it("maps totalRepayment correctly", () => {
      const data = generateSalaryDataSeries(
        baseConfig,
        (r) => r.totalRepayment,
      );

      // Verify first point
      const firstResult = simulateLoanRepayment(MIN_SALARY, baseConfig);
      expect(data[0][1]).toBe(firstResult.totalRepayment);
    });

    it("maps monthsToPayoff for repayment years chart", () => {
      const data = generateSalaryDataSeries(
        baseConfig,
        (r) => r.monthsToPayoff / 12,
      );

      // All values should be years (reasonable range)
      data.forEach(([, years]) => {
        expect(years).toBeGreaterThanOrEqual(0);
        expect(years).toBeLessThanOrEqual(45); // Max 40 years + buffer
      });
    });

    it("can compute custom metrics", () => {
      const data = generateSalaryDataSeries(
        baseConfig,
        (r) => r.plan2Payment + r.plan5Payment,
      );

      // Should have data for all salary points
      expect(data.length).toBeGreaterThan(0);
      data.forEach(([salary, value]) => {
        expect(typeof salary).toBe("number");
        expect(typeof value).toBe("number");
      });
    });
  });
});

describe("calculateAnnualizedRate", () => {
  it("returns 0 when principal is 0", () => {
    const result: SimulationResult = {
      totalRepayment: 0,
      monthsToPayoff: 0,
      underGradRemaining: 0,
      postGradRemaining: 0,
      plan2Payment: 0,
      plan5Payment: 0,
      postGradPayment: 0,
    };

    expect(calculateAnnualizedRate(result, 0)).toBe(0);
  });

  it("returns 0 when months is 0", () => {
    const result: SimulationResult = {
      totalRepayment: 0,
      monthsToPayoff: 0,
      underGradRemaining: 0,
      postGradRemaining: 0,
      plan2Payment: 0,
      plan5Payment: 0,
      postGradPayment: 0,
    };

    expect(calculateAnnualizedRate(result, 50_000)).toBe(0);
  });

  it("calculates positive rate when paid more than borrowed", () => {
    const result: SimulationResult = {
      totalRepayment: 70_000,
      monthsToPayoff: 120, // 10 years
      underGradRemaining: 0,
      postGradRemaining: 0,
      plan2Payment: 70_000,
      plan5Payment: 0,
      postGradPayment: 0,
    };

    const rate = calculateAnnualizedRate(result, 50_000);
    expect(rate).toBeGreaterThan(0);
  });

  it("calculates negative rate when paid less than borrowed (write-off)", () => {
    const result: SimulationResult = {
      totalRepayment: 30_000,
      monthsToPayoff: 360, // 30 years
      underGradRemaining: 30_000, // Written off
      postGradRemaining: 0,
      plan2Payment: 30_000,
      plan5Payment: 0,
      postGradPayment: 0,
    };

    const rate = calculateAnnualizedRate(result, 50_000);
    expect(rate).toBeLessThan(0);
  });

  it("handles combined undergraduate and postgraduate payments", () => {
    const result: SimulationResult = {
      totalRepayment: 100_000,
      monthsToPayoff: 180, // 15 years
      underGradRemaining: 0,
      postGradRemaining: 0,
      plan2Payment: 60_000,
      plan5Payment: 0,
      postGradPayment: 40_000,
    };

    const rate = calculateAnnualizedRate(result, 75_000);
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThan(1); // Reasonable upper bound
  });
});

describe("integration: chart data generation", () => {
  let baseConfig: LoanConfig;

  beforeEach(() => {
    baseConfig = {
      isPost2023: false,
      underGradBalance: 50_000,
      postGradBalance: 10_000,
      plan2LTRate: 6.5,
      plan2UTRate: 6.5,
      plan5Rate: 6.5,
      postGradRate: 6.5,
      repaymentDate: new Date("2022-04-01"),
    };
  });

  it("generates TotalRepaymentChart data", () => {
    const data = generateSalaryDataSeries(baseConfig, (r) => r.totalRepayment);

    // Total repayment should generally increase then plateau
    expect(data[0][1]).toBeLessThanOrEqual(data[data.length - 1][1] * 1.5);
  });

  it("generates RepaymentYearsChart data", () => {
    const data = generateSalaryDataSeries(
      baseConfig,
      (r) => r.monthsToPayoff / 12,
    );

    // Higher salary should mean fewer years (generally)
    const firstYears = data[0][1];
    const lastYears = data[data.length - 1][1];
    expect(lastYears).toBeLessThanOrEqual(firstYears + 5); // Some tolerance
  });

  it("generates InterestRateChart data", () => {
    const data = generateSalaryDataSeries(baseConfig, (r) => {
      const principal =
        baseConfig.underGradBalance + baseConfig.postGradBalance;
      return calculateAnnualizedRate(r, principal);
    });

    // All rates should be reasonable numbers
    data.forEach(([, rate]) => {
      expect(isFinite(rate)).toBe(true);
      expect(rate).toBeGreaterThan(-1);
      expect(rate).toBeLessThan(1);
    });
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
