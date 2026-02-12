import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useResultSummary } from "./useResultSummary";
import { MIN_SALARY } from "../constants";
import { LoanProvider } from "../context/LoanContext";
import type { LoanState } from "@/types/store";

// Default test configuration
const defaultTestConfig: Partial<LoanState> = {
  loans: [{ planType: "PLAN_2", balance: 50_000 }],
  salary: 45_000,
};

function createWrapper(overrides?: Partial<LoanState>) {
  const mergedConfig = { ...defaultTestConfig, ...overrides };
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LoanProvider initialStateOverride={mergedConfig}>
        {children}
      </LoanProvider>
    );
  };
}

describe("useResultSummary", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2024-01-15"));
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null initially before worker responds", () => {
    const { result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBeNull();
  });

  it("returns summary with totalPaid, monthlyRepayment, and monthsToPayoff", async () => {
    const { result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper(),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(result.current).not.toBeNull();
    });

    expect(result.current).toHaveProperty("totalPaid");
    expect(result.current).toHaveProperty("monthlyRepayment");
    expect(result.current).toHaveProperty("monthsToPayoff");
  });

  it("returns positive totalPaid for active loans", async () => {
    const { result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper(),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(result.current).not.toBeNull();
      expect(result.current?.totalPaid).toBeGreaterThan(0);
    });
  });

  it("returns positive monthlyRepayment when salary exceeds threshold", async () => {
    const { result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({ salary: 45_000 }),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(result.current).not.toBeNull();
      expect(result.current?.monthlyRepayment).toBeGreaterThan(0);
    });
  });

  it("returns positive monthsToPayoff for active loans", async () => {
    const { result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper(),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(result.current).not.toBeNull();
      expect(result.current?.monthsToPayoff).toBeGreaterThan(0);
    });
  });

  it("returns null summary when no loans have balance", async () => {
    const { result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({ loans: [] }),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      // Worker should respond, but summary should be null since no balances
      expect(result.current).toBeNull();
    });
  });

  it("returns higher monthlyRepayment for higher salary", async () => {
    const { result: lowSalaryResult } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({ salary: 35_000 }),
    });

    const { result: highSalaryResult } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({ salary: 80_000 }),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(lowSalaryResult.current).not.toBeNull();
      expect(highSalaryResult.current).not.toBeNull();
    });

    expect(highSalaryResult.current?.monthlyRepayment).toBeGreaterThan(
      lowSalaryResult.current?.monthlyRepayment,
    );
  });

  it("returns zero monthlyRepayment for salary below threshold", async () => {
    const { result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({ salary: MIN_SALARY }),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(result.current).not.toBeNull();
      expect(result.current?.monthlyRepayment).toBe(0);
    });
  });

  it("includes postgrad loan in summary when present", async () => {
    const { result: undergradOnly } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({
        loans: [{ planType: "PLAN_2", balance: 50_000 }],
        salary: 45_000,
      }),
    });

    const { result: withPostgrad } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({
        loans: [
          { planType: "PLAN_2", balance: 50_000 },
          { planType: "POSTGRADUATE", balance: 25_000 },
        ],
        salary: 45_000,
      }),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(undergradOnly.current).not.toBeNull();
      expect(withPostgrad.current).not.toBeNull();
    });

    // Adding a postgrad loan should increase total repayment
    expect(withPostgrad.current?.totalPaid).toBeGreaterThan(
      undergradOnly.current?.totalPaid,
    );
  });

  it("returns different results for different plan types", async () => {
    const { result: plan2Result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({
        loans: [{ planType: "PLAN_2", balance: 50_000 }],
        salary: 45_000,
      }),
    });

    const { result: plan5Result } = renderHook(() => useResultSummary(), {
      wrapper: createWrapper({
        loans: [{ planType: "PLAN_5", balance: 50_000 }],
        salary: 45_000,
      }),
    });

    await vi.runAllTimersAsync();

    await waitFor(() => {
      expect(plan2Result.current).not.toBeNull();
      expect(plan5Result.current).not.toBeNull();
    });

    // Plan 2 and Plan 5 have different thresholds/rates, so results should differ
    const resultsIdentical =
      plan2Result.current?.totalPaid === plan5Result.current?.totalPaid &&
      plan2Result.current?.monthlyRepayment ===
        plan5Result.current?.monthlyRepayment &&
      plan2Result.current?.monthsToPayoff ===
        plan5Result.current?.monthsToPayoff;

    expect(resultsIdentical).toBe(false);
  });
});
