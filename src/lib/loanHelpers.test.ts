import { describe, expect, it } from "vitest";
import type { Loan } from "@/lib/loans/types";
import {
  toggleLoanPlan,
  setLoanBalance,
  getSelectedPlanTypes,
} from "./loanHelpers";

describe("toggleLoanPlan", () => {
  it("adds a plan with 0 balance when absent", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 30000 }];
    const result = toggleLoanPlan(loans, "POSTGRADUATE");
    expect(result).toEqual([
      { planType: "PLAN_2", balance: 30000 },
      { planType: "POSTGRADUATE", balance: 0 },
    ]);
  });

  it("removes a plan when present", () => {
    const loans: Loan[] = [
      { planType: "PLAN_2", balance: 30000 },
      { planType: "POSTGRADUATE", balance: 10000 },
    ];
    const result = toggleLoanPlan(loans, "POSTGRADUATE");
    expect(result).toEqual([{ planType: "PLAN_2", balance: 30000 }]);
  });

  it("removes regardless of balance", () => {
    const loans: Loan[] = [{ planType: "PLAN_1", balance: 0 }];
    const result = toggleLoanPlan(loans, "PLAN_1");
    expect(result).toEqual([]);
  });

  it("does not mutate the original array", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 30000 }];
    const result = toggleLoanPlan(loans, "PLAN_5");
    expect(loans).toHaveLength(1);
    expect(result).toHaveLength(2);
  });
});

describe("setLoanBalance", () => {
  it("updates balance for existing plan", () => {
    const loans: Loan[] = [
      { planType: "PLAN_2", balance: 0 },
      { planType: "POSTGRADUATE", balance: 0 },
    ];
    const result = setLoanBalance(loans, "PLAN_2", 45000);
    expect(result).toEqual([
      { planType: "PLAN_2", balance: 45000 },
      { planType: "POSTGRADUATE", balance: 0 },
    ]);
  });

  it("is a no-op for plans not in the array", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 30000 }];
    const result = setLoanBalance(loans, "PLAN_1", 10000);
    expect(result).toEqual([{ planType: "PLAN_2", balance: 30000 }]);
  });

  it("does not mutate the original array", () => {
    const loans: Loan[] = [{ planType: "PLAN_2", balance: 30000 }];
    setLoanBalance(loans, "PLAN_2", 50000);
    expect(loans[0].balance).toBe(30000);
  });
});

describe("getSelectedPlanTypes", () => {
  it("returns set of plan types", () => {
    const loans: Loan[] = [
      { planType: "PLAN_2", balance: 30000 },
      { planType: "POSTGRADUATE", balance: 10000 },
    ];
    const result = getSelectedPlanTypes(loans);
    expect(result).toEqual(new Set(["PLAN_2", "POSTGRADUATE"]));
  });

  it("returns empty set for empty loans", () => {
    const result = getSelectedPlanTypes([]);
    expect(result).toEqual(new Set());
  });
});
