import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { MIN_SALARY } from "@/constants";
import type { LoanState } from "@/types/store";
import { LoanProvider } from "./LoanContext";
import {
  PersonalizedResultsProvider,
  usePersonalizedResults,
} from "./PersonalizedResultsContext";

const defaultTestConfig: Partial<LoanState> = {
  loans: [{ planType: "PLAN_2", balance: 50_000 }],
  salary: 45_000,
};

function createWrapper(overrides?: Partial<LoanState>) {
  const mergedConfig = { ...defaultTestConfig, ...overrides };
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LoanProvider initialStateOverride={mergedConfig}>
        <PersonalizedResultsProvider>{children}</PersonalizedResultsProvider>
      </LoanProvider>
    );
  };
}

describe("usePersonalizedResults (summary + insight)", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2024-01-15"));
    localStorage.clear();
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it("returns null initially before worker responds", () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    expect(result.current.summary).toBeNull();
  });

  it("returns summary with totalPaid, monthlyRepayment, and monthsToPayoff", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.summary).not.toBeNull();
    });

    expect(result.current.summary).toHaveProperty("totalPaid");
    expect(result.current.summary).toHaveProperty("monthlyRepayment");
    expect(result.current.summary).toHaveProperty("monthsToPayoff");
  });

  it("returns positive totalPaid for active loans", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.summary).not.toBeNull();
      expect(result.current.summary?.totalPaid).toBeGreaterThan(0);
    });
  });

  it("returns positive monthlyRepayment when salary exceeds threshold", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({ salary: 45_000 }),
    });

    await waitFor(() => {
      expect(result.current.summary).not.toBeNull();
      expect(result.current.summary?.monthlyRepayment).toBeGreaterThan(0);
    });
  });

  it("returns positive monthsToPayoff for active loans", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.summary).not.toBeNull();
      expect(result.current.summary?.monthsToPayoff).toBeGreaterThan(0);
    });
  });

  it("returns null summary when no loans have balance", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({ loans: [] }),
    });

    await waitFor(() => {
      // Worker should respond, but summary should be null since no balances
      expect(result.current.summary).toBeNull();
    });
  });

  it("returns higher monthlyRepayment for higher salary", async () => {
    const { result: lowSalaryResult } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({ salary: 35_000 }),
      },
    );

    const { result: highSalaryResult } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({ salary: 80_000 }),
      },
    );

    await waitFor(() => {
      expect(lowSalaryResult.current.summary).not.toBeNull();
      expect(highSalaryResult.current.summary).not.toBeNull();
    });

    if (
      highSalaryResult.current.summary !== null &&
      lowSalaryResult.current.summary !== null
    ) {
      expect(highSalaryResult.current.summary.monthlyRepayment).toBeGreaterThan(
        lowSalaryResult.current.summary.monthlyRepayment,
      );
    }
  });

  it("returns zero monthlyRepayment for salary below threshold", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({ salary: MIN_SALARY }),
    });

    await waitFor(() => {
      expect(result.current.summary).not.toBeNull();
      expect(result.current.summary?.monthlyRepayment).toBe(0);
    });
  });

  it("includes postgrad loan in summary when present", async () => {
    const { result: undergradOnly } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({
          loans: [{ planType: "PLAN_2", balance: 50_000 }],
          salary: 45_000,
        }),
      },
    );

    const { result: withPostgrad } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({
          loans: [
            { planType: "PLAN_2", balance: 50_000 },
            { planType: "POSTGRADUATE", balance: 25_000 },
          ],
          salary: 45_000,
        }),
      },
    );

    await waitFor(() => {
      expect(undergradOnly.current.summary).not.toBeNull();
      expect(withPostgrad.current.summary).not.toBeNull();
    });

    // Adding a postgrad loan should increase total repayment
    if (
      withPostgrad.current.summary !== null &&
      undergradOnly.current.summary !== null
    ) {
      expect(withPostgrad.current.summary.totalPaid).toBeGreaterThan(
        undergradOnly.current.summary.totalPaid,
      );
    }
  });

  it("returns lower totalPaid with present value enabled", async () => {
    const { result: nominalResult } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({
          showPresentValue: false,
          discountRate: 0.05,
        }),
      },
    );

    const { result: pvResult } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({
        showPresentValue: true,
        discountRate: 0.05,
      }),
    });

    await waitFor(() => {
      expect(nominalResult.current.summary).not.toBeNull();
      expect(pvResult.current.summary).not.toBeNull();
      expect(pvResult.current.summary?.totalPaid).toBeLessThan(
        nominalResult.current.summary?.totalPaid ?? Infinity,
      );
    });
  });

  it("monthlyRepayment and monthsToPayoff are the same in PV mode", async () => {
    const { result: nominalResult } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({
          showPresentValue: false,
          discountRate: 0.05,
        }),
      },
    );

    const { result: pvResult } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({
        showPresentValue: true,
        discountRate: 0.05,
      }),
    });

    await waitFor(() => {
      expect(nominalResult.current.summary).not.toBeNull();
      expect(pvResult.current.summary).not.toBeNull();
      expect(pvResult.current.summary?.monthlyRepayment).toBe(
        nominalResult.current.summary?.monthlyRepayment,
      );
      expect(pvResult.current.summary?.monthsToPayoff).toBe(
        nominalResult.current.summary?.monthsToPayoff,
      );
    });
  });

  it("insight description changes when showPresentValue is true", async () => {
    const { result: nominalResult } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({
          showPresentValue: false,
          discountRate: 0.05,
        }),
      },
    );

    const { result: pvResult } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({
        showPresentValue: true,
        discountRate: 0.05,
      }),
    });

    await waitFor(() => {
      expect(nominalResult.current.insight).not.toBeNull();
      expect(pvResult.current.insight).not.toBeNull();
      expect(pvResult.current.insight?.description).not.toBe(
        nominalResult.current.insight?.description,
      );
    });
  });

  it("returns different results for different plan types", async () => {
    const { result: plan2Result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({
        loans: [{ planType: "PLAN_2", balance: 50_000 }],
        salary: 45_000,
      }),
    });

    const { result: plan5Result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({
        loans: [{ planType: "PLAN_5", balance: 50_000 }],
        salary: 45_000,
      }),
    });

    await waitFor(() => {
      expect(plan2Result.current.summary).not.toBeNull();
      expect(plan5Result.current.summary).not.toBeNull();
    });

    // Plan 2 and Plan 5 have different thresholds/rates, so results should differ
    const resultsIdentical =
      plan2Result.current.summary?.totalPaid ===
        plan5Result.current.summary?.totalPaid &&
      plan2Result.current.summary?.monthlyRepayment ===
        plan5Result.current.summary?.monthlyRepayment &&
      plan2Result.current.summary?.monthsToPayoff ===
        plan5Result.current.summary?.monthsToPayoff;

    expect(resultsIdentical).toBe(false);
  });
});

describe("usePersonalizedResults (cards)", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2024-01-15"));
    localStorage.clear();
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it("returns all 4 card datasets with stat and label", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.cards).not.toBeNull();
    });

    const cards = result.current.cards;
    expect(cards).not.toBeNull();
    if (cards === null) return;

    // Balance + cumulative have sparkline data
    expect(cards.balance.data.length).toBeGreaterThan(0);
    expect(cards.balance.stat).not.toBe("\u2014");
    expect(cards.cumulative.data.length).toBeGreaterThan(0);
    expect(cards.cumulative.stat).not.toBe("\u2014");

    // Interest has proportion data
    expect(cards.interest.interestRatio).toBeGreaterThan(0);
    expect(cards.interest.interestRatio).toBeLessThanOrEqual(1);
    expect(cards.interest.stat).not.toBe("\u2014");

    // Effective rate has rate data
    expect(cards.effectiveRate.stat).not.toBe("\u2014");
    expect(cards.effectiveRate.effectiveRate).toBeGreaterThan(0);
    expect(cards.effectiveRate.boeRate).toBeGreaterThan(0);
  });

  it("balance sparkline starts at initial balance and decreases", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.cards).not.toBeNull();
    });

    const balanceData = result.current.cards?.balance.data ?? [];
    expect(balanceData.length).toBeGreaterThan(1);
    expect(balanceData[0].value).toBeGreaterThan(
      balanceData[balanceData.length - 1].value,
    );
  });

  it("cumulative sparkline is monotonically increasing", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.cards).not.toBeNull();
    });

    const cumData = result.current.cards?.cumulative.data ?? [];
    expect(cumData.length).toBeGreaterThan(1);
    for (let i = 1; i < cumData.length; i++) {
      expect(cumData[i].value).toBeGreaterThanOrEqual(cumData[i - 1].value);
    }
  });

  it("PV mode returns lower cumulative totals", async () => {
    const { result: nominalResult } = renderHook(
      () => usePersonalizedResults(),
      {
        wrapper: createWrapper({
          showPresentValue: false,
          discountRate: 0.05,
        }),
      },
    );

    const { result: pvResult } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({
        showPresentValue: true,
        discountRate: 0.05,
      }),
    });

    await waitFor(() => {
      expect(nominalResult.current.cards).not.toBeNull();
      expect(pvResult.current.cards).not.toBeNull();
    });

    const nominalTotal =
      nominalResult.current.cards?.cumulative.data.at(-1)?.value ?? 0;
    const pvTotal = pvResult.current.cards?.cumulative.data.at(-1)?.value ?? 0;
    expect(pvTotal).toBeLessThan(nominalTotal);
  });

  it("empty loans returns dash stats", async () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper({ loans: [] }),
    });

    await waitFor(() => {
      expect(result.current.cards).not.toBeNull();
    });

    const cards = result.current.cards;
    expect(cards).not.toBeNull();
    if (cards === null) return;

    expect(cards.balance.data).toHaveLength(0);
    expect(cards.balance.stat).toBe("\u2014");
    expect(cards.cumulative.data).toHaveLength(0);
    expect(cards.cumulative.stat).toBe("\u2014");
    expect(cards.interest.stat).toBe("\u2014");
    expect(cards.interest.interestRatio).toBe(0);
    expect(cards.effectiveRate.stat).toBe("\u2014");
    expect(cards.effectiveRate.effectiveRate).toBe(0);
  });
});
