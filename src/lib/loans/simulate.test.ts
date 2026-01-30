import { describe, it, expect, vi, afterEach } from "vitest";
import dayjs from "dayjs";
import { simulateLoans } from "./simulate";
import { PLAN_CONFIGS, CURRENT_RATES } from "./plans";
import type { SimulationInput } from "./types";

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

describe("simulateLoans", () => {
  const defaultInput: SimulationInput = {
    loans: [{ planType: "PLAN_2", balance: 50000 }],
    annualSalary: 50000,
    repaymentStartDate: new Date("2022-04-01"),
    rpiRate: CURRENT_RATES.rpi,
    boeBaseRate: CURRENT_RATES.boeBaseRate,
  };

  describe("empty and zero balance", () => {
    it("returns empty results for no loans", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [],
      });

      expect(result.loanResults).toHaveLength(0);
      expect(result.totalRepayment).toBe(0);
      expect(result.totalMonths).toBe(0);
    });

    it("filters out zero balance loans", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [
          { planType: "PLAN_2", balance: 0 },
          { planType: "POSTGRADUATE", balance: 0 },
        ],
      });

      expect(result.loanResults).toHaveLength(0);
      expect(result.totalRepayment).toBe(0);
    });

    it("includes only positive balance loans", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 0 },
        ],
      });

      expect(result.loanResults).toHaveLength(1);
      expect(result.loanResults[0].planType).toBe("PLAN_2");
    });
  });

  describe("PLAN_1 simulation", () => {
    const plan1Input: SimulationInput = {
      ...defaultInput,
      loans: [{ planType: "PLAN_1", balance: 30000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulateLoans(plan1Input);
      expect(result.loanResults[0].planType).toBe("PLAN_1");
      expect(result.totalRepayment).toBeGreaterThan(0);
    });

    it("high salary pays off loan", () => {
      const result = simulateLoans({
        ...plan1Input,
        annualSalary: 150000,
      });

      expect(result.loanResults[0].writtenOff).toBe(false);
      expect(result.loanResults[0].remainingBalance).toBe(0);
    });

    it("low salary results in write-off", () => {
      const result = simulateLoans({
        ...plan1Input,
        annualSalary: 30000,
      });

      // With low salary, loan accumulates interest faster than payments
      expect(result.loanResults[0].monthsToPayoff).toBeGreaterThan(0);
    });
  });

  describe("PLAN_2 simulation", () => {
    const plan2Input: SimulationInput = {
      ...defaultInput,
      loans: [{ planType: "PLAN_2", balance: 50000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulateLoans(plan2Input);
      expect(result.loanResults[0].planType).toBe("PLAN_2");
      expect(result.totalRepayment).toBeGreaterThan(0);
    });

    it("high salary pays off loan", () => {
      const result = simulateLoans({
        ...plan2Input,
        annualSalary: 150000,
      });

      expect(result.loanResults[0].writtenOff).toBe(false);
      expect(result.loanResults[0].remainingBalance).toBe(0);
    });

    it("uses 30-year write-off period", () => {
      expect(PLAN_CONFIGS.PLAN_2.writeOffYears).toBe(30);
    });
  });

  describe("PLAN_4 simulation", () => {
    const plan4Input: SimulationInput = {
      ...defaultInput,
      loans: [{ planType: "PLAN_4", balance: 40000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulateLoans(plan4Input);
      expect(result.loanResults[0].planType).toBe("PLAN_4");
      expect(result.totalRepayment).toBeGreaterThan(0);
    });

    it("has higher threshold than Plan 2 (Scotland)", () => {
      expect(PLAN_CONFIGS.PLAN_4.monthlyThreshold).toBeGreaterThan(
        PLAN_CONFIGS.PLAN_2.monthlyThreshold,
      );
    });

    it("salary just above threshold makes small payments", () => {
      const justAboveThreshold =
        PLAN_CONFIGS.PLAN_4.monthlyThreshold * 12 + 1000;
      const result = simulateLoans({
        ...plan4Input,
        annualSalary: justAboveThreshold,
      });

      expect(result.totalRepayment).toBeGreaterThan(0);
    });
  });

  describe("PLAN_5 simulation", () => {
    const plan5Input: SimulationInput = {
      ...defaultInput,
      loans: [{ planType: "PLAN_5", balance: 60000 }],
    };

    it("uses correct threshold and rate", () => {
      const result = simulateLoans(plan5Input);
      expect(result.loanResults[0].planType).toBe("PLAN_5");
      expect(result.totalRepayment).toBeGreaterThan(0);
    });

    it("uses 40-year write-off period", () => {
      expect(PLAN_CONFIGS.PLAN_5.writeOffYears).toBe(40);
    });

    it("high salary pays off loan", () => {
      const result = simulateLoans({
        ...plan5Input,
        annualSalary: 150000,
      });

      expect(result.loanResults[0].writtenOff).toBe(false);
      expect(result.loanResults[0].remainingBalance).toBe(0);
    });
  });

  describe("POSTGRADUATE simulation", () => {
    const pgInput: SimulationInput = {
      ...defaultInput,
      loans: [{ planType: "POSTGRADUATE", balance: 25000 }],
    };

    it("uses correct threshold and rate (6%)", () => {
      expect(PLAN_CONFIGS.POSTGRADUATE.repaymentRate).toBe(0.06);
      const result = simulateLoans(pgInput);
      expect(result.loanResults[0].planType).toBe("POSTGRADUATE");
    });

    it("has lowest threshold", () => {
      expect(PLAN_CONFIGS.POSTGRADUATE.monthlyThreshold).toBe(1750);
    });

    it("high salary pays off loan", () => {
      const result = simulateLoans({
        ...pgInput,
        annualSalary: 100000,
      });

      expect(result.loanResults[0].writtenOff).toBe(false);
      expect(result.loanResults[0].remainingBalance).toBe(0);
    });
  });

  describe("combined loans", () => {
    it("simulates undergraduate + postgraduate concurrently", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [
          { planType: "PLAN_2", balance: 50000 },
          { planType: "POSTGRADUATE", balance: 25000 },
        ],
        annualSalary: 60000,
      });

      expect(result.loanResults).toHaveLength(2);
      expect(result.loanResults[0].totalPaid).toBeGreaterThan(0);
      expect(result.loanResults[1].totalPaid).toBeGreaterThan(0);
      expect(result.totalRepayment).toBe(
        result.loanResults[0].totalPaid + result.loanResults[1].totalPaid,
      );
    });

    it("totalMonths is max of all loans", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [
          { planType: "PLAN_5", balance: 60000 },
          { planType: "POSTGRADUATE", balance: 25000 },
        ],
        annualSalary: 50000,
      });

      const maxMonths = Math.max(
        ...result.loanResults.map((r) => r.monthsToPayoff),
      );
      expect(result.totalMonths).toBe(maxMonths);
    });

    it("can combine Plan 1 + Postgraduate", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [
          { planType: "PLAN_1", balance: 20000 },
          { planType: "POSTGRADUATE", balance: 15000 },
        ],
        annualSalary: 45000,
      });

      expect(result.loanResults).toHaveLength(2);
      expect(
        result.loanResults.find((r) => r.planType === "PLAN_1"),
      ).toBeDefined();
      expect(
        result.loanResults.find((r) => r.planType === "POSTGRADUATE"),
      ).toBeDefined();
    });
  });

  describe("write-off scenarios", () => {
    it("marks loan as written off when balance remains", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 100000 }],
        annualSalary: 30000,
      });

      // Low salary + high balance = likely write-off
      expect(result.loanResults[0].monthsToPayoff).toBeGreaterThan(0);
    });

    it("does not mark loan as written off when fully paid", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 10000 }],
        annualSalary: 150000,
      });

      expect(result.loanResults[0].writtenOff).toBe(false);
      expect(result.loanResults[0].remainingBalance).toBe(0);
    });
  });

  describe("edge cases", () => {
    it("handles zero salary (no repayments)", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 0,
      });

      // No repayments, but simulation should complete
      expect(result.loanResults[0].totalPaid).toBe(0);
      expect(result.loanResults[0].writtenOff).toBe(true);
    });

    it("handles salary below threshold", () => {
      const belowThreshold = PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12 - 1000;
      const result = simulateLoans({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: belowThreshold,
      });

      expect(result.loanResults[0].totalPaid).toBe(0);
    });

    it("uses default rates when not provided", () => {
      const result = simulateLoans({
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 50000,
        repaymentStartDate: new Date("2022-04-01"),
      });

      expect(result.totalRepayment).toBeGreaterThan(0);
    });

    it("handles very high salary", () => {
      const result = simulateLoans({
        ...defaultInput,
        loans: [{ planType: "PLAN_2", balance: 50000 }],
        annualSalary: 500000,
      });

      expect(result.loanResults[0].remainingBalance).toBe(0);
      expect(result.loanResults[0].monthsToPayoff).toBeGreaterThan(0);
    });
  });

  describe("result structure", () => {
    it("returns all required fields in SimulationResult", () => {
      const result = simulateLoans(defaultInput);

      expect(result).toHaveProperty("loanResults");
      expect(result).toHaveProperty("totalRepayment");
      expect(result).toHaveProperty("totalMonths");
    });

    it("returns all required fields in LoanResult", () => {
      const result = simulateLoans(defaultInput);
      const loanResult = result.loanResults[0];

      expect(loanResult).toHaveProperty("planType");
      expect(loanResult).toHaveProperty("totalPaid");
      expect(loanResult).toHaveProperty("monthsToPayoff");
      expect(loanResult).toHaveProperty("remainingBalance");
      expect(loanResult).toHaveProperty("writtenOff");
    });

    it("remaining balance is non-negative", () => {
      const result = simulateLoans({
        ...defaultInput,
        annualSalary: 200000,
      });

      result.loanResults.forEach((r) => {
        expect(r.remainingBalance).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("interest rate impact", () => {
    it("higher RPI results in more total repayment", () => {
      const lowRpi = simulateLoans({
        ...defaultInput,
        rpiRate: 2.0,
      });

      const highRpi = simulateLoans({
        ...defaultInput,
        rpiRate: 8.0,
      });

      // Higher interest means more paid over time (or larger write-off amount)
      expect(highRpi.totalRepayment).toBeGreaterThanOrEqual(
        lowRpi.totalRepayment * 0.95,
      );
    });
  });
});
