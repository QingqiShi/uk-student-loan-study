import { renderHook, waitFor } from "@testing-library/react";
import { createContext, use, useReducer, type ReactNode } from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { useTotalRepaymentData, useBalanceOverTimeData } from "./useChartData";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "../constants";
import { loanReducer, initialState } from "../context/loanReducer";
import type { LoanState } from "@/types/store";

// Mock the context module with 3 split contexts matching production LoanProvider
vi.mock("../context/LoanContext", () => {
  const ActionsContext = createContext<{
    updateField: <K extends keyof LoanState>(
      key: K,
      value: LoanState[K],
    ) => void;
    applyPreset: (preset: unknown) => void;
  } | null>(null);

  const FrequentContext = createContext<{
    salary: number;
    monthlyOverpayment: number;
    lumpSumPayment: number;
  } | null>(null);

  const ConfigContext = createContext<{
    underGradPlanType: LoanState["underGradPlanType"];
    underGradBalance: number;
    postGradBalance: number;
    salaryGrowthRate: LoanState["salaryGrowthRate"];
    thresholdGrowthRate: LoanState["thresholdGrowthRate"];
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

      const actions = {
        updateField: <K extends keyof LoanState>(
          key: K,
          value: LoanState[K],
        ) => {
          dispatch({ type: "UPDATE_FIELD", key, value });
        },
        applyPreset: () => {},
      };

      const frequent = {
        salary: state.salary,
        monthlyOverpayment: state.monthlyOverpayment,
        lumpSumPayment: state.lumpSumPayment,
      };

      const config = {
        underGradPlanType: state.underGradPlanType,
        underGradBalance: state.underGradBalance,
        postGradBalance: state.postGradBalance,
        salaryGrowthRate: state.salaryGrowthRate,
        thresholdGrowthRate: state.thresholdGrowthRate,
      };

      return (
        <ActionsContext value={actions}>
          <ConfigContext value={config}>
            <FrequentContext value={frequent}>{children}</FrequentContext>
          </ConfigContext>
        </ActionsContext>
      );
    },
    useLoanActions: () => {
      const context = use(ActionsContext);
      if (context === null) {
        throw new Error("useLoanActions must be used within a LoanProvider");
      }
      return context;
    },
    useLoanFrequentState: () => {
      const context = use(FrequentContext);
      if (context === null) {
        throw new Error(
          "useLoanFrequentState must be used within a LoanProvider",
        );
      }
      return context;
    },
    useLoanConfigState: () => {
      const context = use(ConfigContext);
      if (context === null) {
        throw new Error(
          "useLoanConfigState must be used within a LoanProvider",
        );
      }
      return context;
    },
    useLoanContext: () => {
      const actions = use(ActionsContext);
      const frequent = use(FrequentContext);
      const config = use(ConfigContext);
      if (!actions || !frequent || !config) {
        throw new Error("useLoanContext must be used within a LoanProvider");
      }
      return {
        state: { ...config, ...frequent },
        ...actions,
      };
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
    // Use shouldAdvanceTime to allow waitFor polling to work with fake timers
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2024-01-15"));
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("useTotalRepaymentData", () => {
    it("returns data array with correct number of points", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      // Wait for worker to respond
      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.data.length).toBe(expectedDataPoints);
      });
    });

    it("returns data points as objects with salary and value", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.data[0]).toHaveProperty("salary");
        expect(result.current.data[0]).toHaveProperty("value");
        expect(result.current.data[0].salary).toBe(MIN_SALARY);
        expect(typeof result.current.data[0].value).toBe("number");
      });
    });

    it("starts at MIN_SALARY and ends at MAX_SALARY", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.data[0].salary).toBe(MIN_SALARY);
        expect(result.current.data[result.current.data.length - 1].salary).toBe(
          MAX_SALARY,
        );
      });
    });

    it("returns annotationSalary when salary is in valid range", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: 50_000 }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.annotationSalary).toBe(50_000);
      });
    });

    it("returns undefined annotationSalary when salary is below MIN_SALARY", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MIN_SALARY - 1000 }),
      });

      await vi.runAllTimersAsync();

      // Even after data loads, annotation should be undefined for out-of-range salary
      expect(result.current.annotationSalary).toBeUndefined();
    });

    it("returns undefined annotationSalary when salary is above MAX_SALARY", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MAX_SALARY + 1000 }),
      });

      await vi.runAllTimersAsync();

      // Even after data loads, annotation should be undefined for out-of-range salary
      expect(result.current.annotationSalary).toBeUndefined();
    });

    it("returns annotationSalary at exactly MIN_SALARY boundary", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MIN_SALARY }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.annotationSalary).toBe(MIN_SALARY);
        expect(result.current.annotationValue).toBeDefined();
      });
    });

    it("returns annotationSalary at exactly MAX_SALARY boundary", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ salary: MAX_SALARY }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.annotationSalary).toBe(MAX_SALARY);
        expect(result.current.annotationValue).toBeDefined();
      });
    });

    it("calculates higher repayment for higher earners who pay off loan", async () => {
      const { result } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        const lowSalaryRepayment = result.current.data[0].value;
        const highSalaryRepayment =
          result.current.data[result.current.data.length - 1].value;

        // Higher salary typically means more total repayment (up to full payoff)
        expect(highSalaryRepayment).toBeGreaterThanOrEqual(lowSalaryRepayment);
      });
    });
  });

  describe("useBalanceOverTimeData", () => {
    it("returns data array with balance points over time", async () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper(),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.data.length).toBeGreaterThan(0);
      });
    });

    it("returns data points with month and balance properties", async () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper(),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.data[0]).toHaveProperty("month");
        expect(result.current.data[0]).toHaveProperty("balance");
      });
    });

    it("starts at month 0 with initial loan balance", async () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({ underGradBalance: 50_000 }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.data[0].month).toBe(0);
        expect(result.current.data[0].balance).toBe(50_000);
      });
    });

    it("balance decreases over time", async () => {
      // Use a high salary where repayments clearly exceed interest
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({ underGradBalance: 50_000, salary: 100_000 }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        const initialBalance = result.current.data[0].balance;
        const finalBalance =
          result.current.data[result.current.data.length - 1].balance;

        expect(finalBalance).toBeLessThan(initialBalance);
      });
    });

    it("returns empty data when no loans", async () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({ underGradBalance: 0, postGradBalance: 0 }),
      });

      await vi.runAllTimersAsync();

      // Empty loans should return empty data immediately (no worker call needed)
      expect(result.current.data.length).toBe(0);
      expect(result.current.writeOffMonth).toBeNull();
    });

    it("returns writeOffMonth for low earners who reach write-off", async () => {
      const { result } = renderHook(() => useBalanceOverTimeData(), {
        wrapper: createWrapper({
          underGradBalance: 50_000,
          salary: MIN_SALARY,
        }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        // Low earners should hit write-off (360 months for Plan 2)
        expect(result.current.writeOffMonth).not.toBeNull();
      });
    });
  });

  describe("hook memoization", () => {
    it("useTotalRepaymentData returns equivalent data on rerender", async () => {
      const { result, rerender } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper(),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result.current.data.length).toBe(expectedDataPoints);
      });

      const firstData = [...result.current.data];

      rerender();

      // Data should be equivalent (same values) even if not same reference
      expect(result.current.data).toStrictEqual(firstData);
    });

    it("useTotalRepaymentData returns different data when config changes", async () => {
      // Test that different initial configs produce different data
      const { result: result1 } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ underGradBalance: 50_000 }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result1.current.data.length).toBe(expectedDataPoints);
      });

      const firstData = [...result1.current.data];

      const { result: result2 } = renderHook(() => useTotalRepaymentData(), {
        wrapper: createWrapper({ underGradBalance: 75_000 }),
      });

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(result2.current.data.length).toBe(expectedDataPoints);
      });

      // Data should differ with different config
      expect(result2.current.data).not.toStrictEqual(firstData);
    });
  });

  describe("integration with Plan 2 vs Plan 5", () => {
    it("Plan 2 data differs from Plan 5 data", async () => {
      const { result: plan2Result } = renderHook(
        () => useTotalRepaymentData(),
        {
          wrapper: createWrapper({ underGradPlanType: "PLAN_2" }),
        },
      );

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(plan2Result.current.data.length).toBe(expectedDataPoints);
      });

      const plan2Data = [...plan2Result.current.data];

      const { result: plan5Result } = renderHook(
        () => useTotalRepaymentData(),
        {
          wrapper: createWrapper({ underGradPlanType: "PLAN_5" }),
        },
      );

      await vi.runAllTimersAsync();

      await waitFor(() => {
        expect(plan5Result.current.data.length).toBe(expectedDataPoints);
      });

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
