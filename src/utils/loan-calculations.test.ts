import { describe, it, expect, beforeEach } from "vitest";
import {
  generateSalaryDataSeries,
  generateSalaryDataSeriesPV,
  generateBalanceTimeSeries,
} from "./loan-calculations";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "../constants";
import type { Loan } from "@/lib/loans/types";

describe("generateSalaryDataSeries", () => {
  let loans: Loan[];

  beforeEach(() => {
    loans = [{ planType: "PLAN_2", balance: 50000 }];
  });

  it("generates correct number of data points", () => {
    const data = generateSalaryDataSeries(loans, (r) => r.totalRepayment);
    const expectedPoints =
      Math.floor((MAX_SALARY - MIN_SALARY) / SALARY_STEP) + 1;

    expect(data.length).toBe(expectedPoints);
  });

  it("starts at MIN_SALARY and ends at MAX_SALARY", () => {
    const data = generateSalaryDataSeries(loans, (r) => r.totalRepayment);

    expect(data[0].salary).toBe(MIN_SALARY);
    expect(data[data.length - 1].salary).toBe(MAX_SALARY);
  });

  it("increments by SALARY_STEP", () => {
    const data = generateSalaryDataSeries(loans, (r) => r.totalRepayment);

    for (let i = 1; i < data.length; i++) {
      expect(data[i].salary - data[i - 1].salary).toBe(SALARY_STEP);
    }
  });

  describe("mapper functions", () => {
    it("maps totalRepayment correctly", () => {
      const data = generateSalaryDataSeries(loans, (r) => r.totalRepayment);

      // All values should be non-negative
      data.forEach(({ value }) => {
        expect(value).toBeGreaterThanOrEqual(0);
      });
    });

    it("maps totalMonths for repayment years chart", () => {
      const data = generateSalaryDataSeries(loans, (r) => r.totalMonths / 12);

      // All values should be years (reasonable range)
      data.forEach(({ value: years }) => {
        expect(years).toBeGreaterThanOrEqual(0);
        expect(years).toBeLessThanOrEqual(45); // Max 40 years + buffer
      });
    });

    it("can compute custom metrics from loanResults", () => {
      const loansWithPostgrad: Loan[] = [
        { planType: "PLAN_2", balance: 50000 },
        { planType: "POSTGRADUATE", balance: 25000 },
      ];

      const data = generateSalaryDataSeries(
        loansWithPostgrad,
        (r) => r.loanResults.length,
      );

      // Should have 2 loan results for each salary point
      data.forEach(({ value }) => {
        expect(value).toBe(2);
      });
    });
  });

  it("works with different plan types", () => {
    const plan5Loans: Loan[] = [{ planType: "PLAN_5", balance: 60000 }];
    const data = generateSalaryDataSeries(plan5Loans, (r) => r.totalRepayment);

    expect(data.length).toBeGreaterThan(0);
    data.forEach(({ value }) => {
      expect(typeof value).toBe("number");
    });
  });

  it("handles empty loans array", () => {
    const data = generateSalaryDataSeries([], (r) => r.totalRepayment);

    // Should still generate data points, all with zero values
    expect(data.length).toBeGreaterThan(0);
    data.forEach(({ value }) => {
      expect(value).toBe(0);
    });
  });
});

describe("integration: chart data generation", () => {
  let loans: Loan[];

  beforeEach(() => {
    loans = [
      { planType: "PLAN_2", balance: 50000 },
      { planType: "POSTGRADUATE", balance: 10000 },
    ];
  });

  it("generates TotalRepaymentChart data", () => {
    const data = generateSalaryDataSeries(loans, (r) => r.totalRepayment);

    // Total repayment should generally increase then plateau
    expect(data[0].value).toBeLessThanOrEqual(
      data[data.length - 1].value * 1.5,
    );
  });

  it("generates RepaymentYearsChart data", () => {
    const data = generateSalaryDataSeries(loans, (r) => r.totalMonths / 12);

    // Higher salary should mean fewer years (generally)
    const firstYears = data[0].value;
    const lastYears = data[data.length - 1].value;
    expect(lastYears).toBeLessThanOrEqual(firstYears + 5); // Some tolerance
  });
});

describe("generateSalaryDataSeries: rpiRate and boeBaseRate", () => {
  it("different RPI rates produce different total repayment", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 50000 }];

    const dataLowRpi = generateSalaryDataSeries(
      loans,
      (r) => r.totalRepayment,
      0,
    );
    const dataHighRpi = generateSalaryDataSeries(
      loans,
      (r) => r.totalRepayment,
      5,
    );

    // Compare at a mid-range salary point
    const midIndex = Math.floor(dataLowRpi.length / 2);
    expect(dataLowRpi[midIndex].value).not.toBe(dataHighRpi[midIndex].value);
  });

  it("different BOE base rates produce different results for Plan 1", () => {
    const loans: Loan[] = [{ planType: "PLAN_1", balance: 30000 }];

    const dataLowBoe = generateSalaryDataSeries(
      loans,
      (r) => r.totalRepayment,
      undefined,
      0,
      0,
      2,
    );
    const dataHighBoe = generateSalaryDataSeries(
      loans,
      (r) => r.totalRepayment,
      undefined,
      0,
      0,
      5,
    );

    const midIndex = Math.floor(dataLowBoe.length / 2);
    expect(dataLowBoe[midIndex].value).not.toBe(dataHighBoe[midIndex].value);
  });

  it("default values work without explicit rpiRate or boeBaseRate", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 50000 }];

    const data = generateSalaryDataSeries(loans, (r) => r.totalRepayment);

    expect(data.length).toBeGreaterThan(0);
    data.forEach(({ value }) => {
      expect(typeof value).toBe("number");
    });
  });
});

describe("generateSalaryDataSeriesPV", () => {
  const loans: Loan[] = [{ planType: "PLAN_2", balance: 50000 }];

  it("returns correct number of data points", () => {
    const data = generateSalaryDataSeriesPV(loans, 0.05);
    const expectedPoints =
      Math.floor((MAX_SALARY - MIN_SALARY) / SALARY_STEP) + 1;

    expect(data.length).toBe(expectedPoints);
  });

  it("all PV values are less than or equal to nominal values", () => {
    const nominalData = generateSalaryDataSeries(
      loans,
      (r) => r.totalRepayment,
    );
    const pvData = generateSalaryDataSeriesPV(loans, 0.05);

    for (let i = 0; i < nominalData.length; i++) {
      expect(pvData[i].value).toBeLessThanOrEqual(nominalData[i].value);
    }
  });

  it("discountRate 0 produces same values as nominal totalRepayment", () => {
    const nominalData = generateSalaryDataSeries(
      loans,
      (r) => r.totalRepayment,
    );
    const pvData = generateSalaryDataSeriesPV(loans, 0);

    for (let i = 0; i < nominalData.length; i++) {
      expect(pvData[i].value).toBeCloseTo(nominalData[i].value, 2);
    }
  });

  it("higher discount rate produces lower values", () => {
    const lowRate = generateSalaryDataSeriesPV(loans, 0.02);
    const highRate = generateSalaryDataSeriesPV(loans, 0.1);

    // Compare at a mid-range salary point where repayment > 0
    const midIndex = Math.floor(lowRate.length / 2);
    expect(highRate[midIndex].value).toBeLessThan(lowRate[midIndex].value);
  });
});

describe("generateBalanceTimeSeries", () => {
  it("returns data points for a valid loan", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 50000 }];

    const { data } = generateBalanceTimeSeries(loans, 45000);

    expect(data.length).toBeGreaterThan(0);
    expect(data[0].month).toBe(0);
    expect(data[0].balance).toBe(50000);
  });

  it("returns empty data for empty loans", () => {
    const { data, writeOffMonth } = generateBalanceTimeSeries([], 45000);

    expect(data).toHaveLength(0);
    expect(writeOffMonth).toBeNull();
  });

  it("different RPI rates produce different balance trajectories", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 50000 }];

    const resultLowRpi = generateBalanceTimeSeries(loans, 45000, 0);
    const resultHighRpi = generateBalanceTimeSeries(loans, 45000, 5);

    // Both should have data
    expect(resultLowRpi.data.length).toBeGreaterThan(1);
    expect(resultHighRpi.data.length).toBeGreaterThan(1);

    // Compare balance at second data point (first yearly snapshot)
    expect(resultLowRpi.data[1].balance).not.toBe(
      resultHighRpi.data[1].balance,
    );
  });
});
