import { describe, it, expect, beforeEach } from "vitest";
import type { Loan } from "@/lib/loans/types";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "../constants";
import {
  findPeakSalary,
  generateSalaryDataSeries,
  generateSalaryDataSeriesPV,
  generateBalanceTimeSeries,
} from "./loanCalculations";

describe("generateSalaryDataSeries", () => {
  let loans: Loan[];

  beforeEach(() => {
    loans = [{ planType: "PLAN_2", balance: 50000 }];
  });

  it("generates correct number of data points", () => {
    const data = generateSalaryDataSeries(loans);
    const expectedPoints =
      Math.floor((MAX_SALARY - MIN_SALARY) / SALARY_STEP) + 1;

    expect(data.length).toBe(expectedPoints);
  });

  it("starts at MIN_SALARY and ends at MAX_SALARY", () => {
    const data = generateSalaryDataSeries(loans);

    expect(data[0].salary).toBe(MIN_SALARY);
    expect(data[data.length - 1].salary).toBe(MAX_SALARY);
  });

  it("increments by SALARY_STEP", () => {
    const data = generateSalaryDataSeries(loans);

    for (let i = 1; i < data.length; i++) {
      expect(data[i].salary - data[i - 1].salary).toBe(SALARY_STEP);
    }
  });

  it("returns non-negative total repayment values", () => {
    const data = generateSalaryDataSeries(loans);

    data.forEach(({ value }) => {
      expect(value).toBeGreaterThanOrEqual(0);
    });
  });

  it("works with different plan types", () => {
    const plan5Loans: Loan[] = [{ planType: "PLAN_5", balance: 60000 }];
    const data = generateSalaryDataSeries(plan5Loans);

    expect(data.length).toBeGreaterThan(0);
    data.forEach(({ value }) => {
      expect(typeof value).toBe("number");
    });
  });

  it("handles empty loans array", () => {
    const data = generateSalaryDataSeries([]);

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
    const data = generateSalaryDataSeries(loans);

    // Total repayment should generally increase then plateau
    expect(data[0].value).toBeLessThanOrEqual(
      data[data.length - 1].value * 1.5,
    );
  });
});

describe("generateSalaryDataSeries: rpiRate and boeBaseRate", () => {
  it("different RPI rates produce different total repayment", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 50000 }];

    const dataLowRpi = generateSalaryDataSeries(loans, 0);
    const dataHighRpi = generateSalaryDataSeries(loans, 5);

    // Compare at a mid-range salary point
    const midIndex = Math.floor(dataLowRpi.length / 2);
    expect(dataLowRpi[midIndex].value).not.toBe(dataHighRpi[midIndex].value);
  });

  it("different BoE base rates produce different results for Plan 1", () => {
    const loans: Loan[] = [{ planType: "PLAN_1", balance: 30000 }];

    const dataLowBoe = generateSalaryDataSeries(loans, undefined, 0, 0, 2);
    const dataHighBoe = generateSalaryDataSeries(loans, undefined, 0, 0, 5);

    const midIndex = Math.floor(dataLowBoe.length / 2);
    expect(dataLowBoe[midIndex].value).not.toBe(dataHighBoe[midIndex].value);
  });

  it("default values work without explicit rpiRate or boeBaseRate", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 50000 }];

    const data = generateSalaryDataSeries(loans);

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
    const nominalData = generateSalaryDataSeries(loans);
    const pvData = generateSalaryDataSeriesPV(loans, 0.05);

    for (let i = 0; i < nominalData.length; i++) {
      expect(pvData[i].value).toBeLessThanOrEqual(nominalData[i].value);
    }
  });

  it("discountRate 0 produces same values as nominal totalRepayment", () => {
    const nominalData = generateSalaryDataSeries(loans);
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

describe("findPeakSalary", () => {
  it("returns the salary of the highest point", () => {
    const peak = findPeakSalary([
      { salary: 25_000, value: 10_000 },
      { salary: 45_000, value: 90_000 },
      { salary: 65_000, value: 40_000 },
    ]);

    expect(peak).toBe(45_000);
  });

  it("returns the lowest salary when two points tie for the peak", () => {
    const peak = findPeakSalary([
      { salary: 25_000, value: 10_000 },
      { salary: 45_000, value: 90_000 },
      { salary: 46_000, value: 90_000 },
    ]);

    expect(peak).toBe(45_000);
  });

  it("finds a peak at either end of the series", () => {
    expect(
      findPeakSalary([
        { salary: 25_000, value: 90_000 },
        { salary: 45_000, value: 10_000 },
      ]),
    ).toBe(25_000);
    expect(
      findPeakSalary([
        { salary: 25_000, value: 10_000 },
        { salary: 45_000, value: 90_000 },
      ]),
    ).toBe(45_000);
  });

  it("throws for an empty series", () => {
    expect(() => findPeakSalary([])).toThrow(
      "Cannot find a peak salary in an empty series",
    );
  });

  it("finds the peak of a real salary series", () => {
    const data = generateSalaryDataSeries([
      { planType: "PLAN_2", balance: 45_000 },
    ]);
    const peak = findPeakSalary(data);
    const peakPoint = data.find((p) => p.salary === peak);

    expect(peakPoint).toBeDefined();
    expect(Math.max(...data.map((p) => p.value))).toBe(peakPoint?.value);
  });
});
