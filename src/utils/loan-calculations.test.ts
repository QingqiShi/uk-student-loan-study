import { describe, it, expect, beforeEach } from "vitest";
import {
  generateSalaryDataSeries,
  calculateAnnualizedRate,
} from "./loan-calculations";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "../constants";
import type { Loan, SimulationResult } from "@/lib/loans/types";

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

describe("calculateAnnualizedRate", () => {
  it("returns 0 when principal is 0", () => {
    const result: SimulationResult = {
      loanResults: [],
      totalRepayment: 0,
      totalMonths: 0,
    };

    expect(calculateAnnualizedRate(result, 0)).toBe(0);
  });

  it("returns 0 when months is 0", () => {
    const result: SimulationResult = {
      loanResults: [],
      totalRepayment: 0,
      totalMonths: 0,
    };

    expect(calculateAnnualizedRate(result, 50_000)).toBe(0);
  });

  it("calculates positive rate when paid more than borrowed", () => {
    const result: SimulationResult = {
      loanResults: [
        {
          planType: "PLAN_2",
          totalPaid: 70_000,
          monthsToPayoff: 120,
          remainingBalance: 0,
          writtenOff: false,
        },
      ],
      totalRepayment: 70_000,
      totalMonths: 120, // 10 years
    };

    const rate = calculateAnnualizedRate(result, 50_000);
    expect(rate).toBeGreaterThan(0);
  });

  it("calculates negative rate when paid less than borrowed (write-off)", () => {
    const result: SimulationResult = {
      loanResults: [
        {
          planType: "PLAN_2",
          totalPaid: 30_000,
          monthsToPayoff: 360,
          remainingBalance: 30_000,
          writtenOff: true,
        },
      ],
      totalRepayment: 30_000,
      totalMonths: 360, // 30 years
    };

    const rate = calculateAnnualizedRate(result, 50_000);
    expect(rate).toBeLessThan(0);
  });

  it("handles combined undergraduate and postgraduate payments", () => {
    const result: SimulationResult = {
      loanResults: [
        {
          planType: "PLAN_2",
          totalPaid: 60_000,
          monthsToPayoff: 180,
          remainingBalance: 0,
          writtenOff: false,
        },
        {
          planType: "POSTGRADUATE",
          totalPaid: 40_000,
          monthsToPayoff: 150,
          remainingBalance: 0,
          writtenOff: false,
        },
      ],
      totalRepayment: 100_000,
      totalMonths: 180, // 15 years
    };

    const rate = calculateAnnualizedRate(result, 75_000);
    expect(rate).toBeGreaterThan(0);
    expect(rate).toBeLessThan(1); // Reasonable upper bound
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

  it("generates InterestRateChart data", () => {
    const totalPrincipal = 60000;
    const data = generateSalaryDataSeries(loans, (r) =>
      calculateAnnualizedRate(r, totalPrincipal),
    );

    // All rates should be reasonable numbers
    data.forEach(({ value: rate }) => {
      expect(isFinite(rate)).toBe(true);
      expect(rate).toBeGreaterThan(-1);
      expect(rate).toBeLessThan(1);
    });
  });
});
