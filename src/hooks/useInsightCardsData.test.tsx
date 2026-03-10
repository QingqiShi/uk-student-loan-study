import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";
import { PersonalizedResultsProvider } from "@/context/PersonalizedResultsContext";
import type { LoanState } from "@/types/store";
import { LoanProvider } from "../context/LoanContext";

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

describe("usePersonalizedResults (cards)", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2024-01-15"));
    localStorage.clear();
  });

  afterEach(() => {
    vi.setSystemTime(vi.getRealSystemTime());
  });

  it("returns null before worker responds", () => {
    const { result } = renderHook(() => usePersonalizedResults(), {
      wrapper: createWrapper(),
    });

    expect(result.current.cards).toBeNull();
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
