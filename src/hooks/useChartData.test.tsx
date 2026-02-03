import { renderHook } from "@testing-library/react";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useTotalRepaymentData, useBalanceOverTimeData } from "./useChartData";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "../constants";
import { loanReducer, initialState } from "../context/loanReducer";
import type { LoanState } from "@/types/store";

// Mock the context module to provide a test-friendly provider
vi.mock("../context/LoanContext", () => {
  const LoanContext = createContext<{
    state: LoanState;
    updateField: <K extends keyof LoanState>(
      key: K,
      value: LoanState[K],
    ) => void;
    reset: () => void;
  } | null>(null);

  return {
    LoanProvider: ({
      children,
      initialStateOverride,
    }: {
      children: ReactNode;
      initialStateOverride?: Partial<LoanState>;
    }) => {
      const mergedInitial = { ...initialState, ...initialStateOverride };
      const [state, dispatch] = useReducer(loanReducer, mergedInitial);

      const contextValue = useMemo(
        () => ({
          state,
          updateField: <K extends keyof LoanState>(
            key: K,
            value: LoanState[K],
          ) => {
            dispatch({ type: "UPDATE_FIELD", key, value });
          },
          reset: () => {
            dispatch({ type: "RESET" });
          },
        }),
        [state],
      );

      return (
        <LoanContext.Provider value={contextValue}>
          {children}
        </LoanContext.Provider>
      );
    },
    useLoanContext: () => {
      const context = useContext(LoanContext);
      if (context === null) {
        throw new Error("useLoanContext must be used within a LoanProvider");
      }
      return context;
    },
  };
});

// Import mocked provider after mock setup
const { LoanProvider } = await import("../context/LoanContext");

// Default test configuration
const defaultTestConfig: Partial<LoanState> = {
  underGradBalance: 50_000,
  postGradBalance: 0,
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

describe("useChartData hooks", () => {
  const expectedDataPoints =
    Math.floor((MAX_SALARY - MIN_SALARY) / SALARY_STEP) + 1;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-15"));
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("useTotalRepaymentData", () => {
    it("returns data array with correct number of points", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data.length).toBe(expectedDataPoints);
    });

    it("returns data points as objects with salary and value", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data[0]).toHaveProperty("salary");
      expect(result.current.data[0]).toHaveProperty("value");
      expect(result.current.data[0].salary).toBe(MIN_SALARY);
      expect(typeof result.current.data[0].value).toBe("number");
    });

    it("starts at MIN_SALARY and ends at MAX_SALARY", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data[0].salary).toBe(MIN_SALARY);
      expect(result.current.data[result.current.data.length - 1].salary).toBe(
        MAX_SALARY,
      );
    });

    it("returns annotationSalary when salary is in valid range", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: 50_000 }),
      });

      expect(result.current.annotationSalary).toBe(50_000);
    });

    it("returns undefined annotationSalary when salary is below MIN_SALARY", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MIN_SALARY - 1000 }),
      });

      expect(result.current.annotationSalary).toBeUndefined();
    });

    it("returns undefined annotationSalary when salary is above MAX_SALARY", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MAX_SALARY + 1000 }),
      });

      expect(result.current.annotationSalary).toBeUndefined();
    });

    it("returns annotationSalary at exactly MIN_SALARY boundary", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MIN_SALARY }),
      });

      expect(result.current.annotationSalary).toBe(MIN_SALARY);
      expect(result.current.annotationValue).toBeDefined();
    });

    it("returns annotationSalary at exactly MAX_SALARY boundary", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MAX_SALARY }),
      });

      expect(result.current.annotationSalary).toBe(MAX_SALARY);
      expect(result.current.annotationValue).toBeDefined();
    });

    it("calculates higher repayment for higher earners who pay off loan", () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      const lowSalaryRepayment = result.current.data[0].value;
      const highSalaryRepayment =
        result.current.data[result.current.data.length - 1].value;

      // Higher salary typically means more total repayment (up to full payoff)
      expect(highSalaryRepayment).toBeGreaterThanOrEqual(lowSalaryRepayment);
    });
  });

  describe("useBalanceOverTimeData", () => {
    it("returns data array with balance points over time", () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data.length).toBeGreaterThan(0);
    });

    it("returns data points with month and balance properties", () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data[0]).toHaveProperty("month");
      expect(result.current.data[0]).toHaveProperty("balance");
    });

    it("starts at month 0 with initial loan balance", () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({ underGradBalance: 50_000 }),
      });

      expect(result.current.data[0].month).toBe(0);
      expect(result.current.data[0].balance).toBe(50_000);
    });

    it("balance decreases over time", () => {
      // Use a high salary where repayments clearly exceed interest
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({ underGradBalance: 50_000, salary: 100_000 }),
      });

      const initialBalance = result.current.data[0].balance;
      const finalBalance =
        result.current.data[result.current.data.length - 1].balance;

      expect(finalBalance).toBeLessThan(initialBalance);
    });

    it("returns empty data when no loans", () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({ underGradBalance: 0, postGradBalance: 0 }),
      });

      expect(result.current.data.length).toBe(0);
      expect(result.current.writeOffMonth).toBeNull();
    });

    it("returns writeOffMonth for low earners who reach write-off", () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({
          underGradBalance: 50_000,
          salary: MIN_SALARY,
        }),
      });

      // Low earners should hit write-off (360 months for Plan 2)
      expect(result.current.writeOffMonth).not.toBeNull();
    });
  });

  describe("hook memoization", () => {
    it("useTotalRepaymentData returns equivalent data on rerender", () => {
      const { result, rerender } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });
      const firstData = [...result.current.data];

      rerender();

      // Data should be equivalent (same values) even if not same reference
      expect(result.current.data).toStrictEqual(firstData);
    });

    it("useTotalRepaymentData returns different data when config changes", () => {
      // Test that different initial configs produce different data
      const { result: result1 } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ underGradBalance: 50_000 }),
      });
      const firstData = [...result1.current.data];

      const { result: result2 } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ underGradBalance: 75_000 }),
      });

      // Data should differ with different config
      expect(result2.current.data).not.toStrictEqual(firstData);
    });
  });

  describe("integration with Plan 2 vs Plan 5", () => {
    it("Plan 2 data differs from Plan 5 data", () => {
      const { result: plan2Result } = renderHook(
        () => useTotalRepaymentData(),
        {
          wrapper: createWrapper({ underGradPlanType: "PLAN_2" }),
        },
      );
      const plan2Data = [...plan2Result.current.data];

      const { result: plan5Result } = renderHook(
        () => useTotalRepaymentData(),
        {
          wrapper: createWrapper({ underGradPlanType: "PLAN_5" }),
        },
      );
      const plan5Data = plan5Result.current.data;

      // At least some values should differ between plans
      let hasDifference = false;
      for (let i = 0; i < plan2Data.length; i++) {
        if (plan2Data[i].value !== plan5Data[i].value) {
          hasDifference = true;
          break;
        }
      }
      expect(hasDifference).toBe(true);
    });
  });
});
