import { describe, it, expect, beforeEach } from "vitest";
import { generateSalaryDataSeries } from "./loan-calculations";
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
