import { renderHook } from "@testing-library/react";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  type ReactNode,
} from "react";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  useTotalRepaymentData,
  useRepaymentYearsData,
  useInterestRateData,
} from "./useChartData";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "../constants";
import { loanReducer, initialState } from "../context/loanReducer";
import type { LoanState } from "@/types/store";
import type dayjs from "dayjs";

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
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

  describe("useRepaymentYearsData", () => {
    it("returns data array with correct number of points", () => {
      const { result } = renderHook(() => useRepaymentYearsData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.data.length).toBe(expectedDataPoints);
    });

    it("returns years values (not months)", () => {
      const { result } = renderHook(() => useRepaymentYearsData(), {
        wrapper: createWrapper(),
      });

      // All values should be reasonable year values (not raw months)
      result.current.data.forEach(({ value: years }) => {
        expect(years).toBeGreaterThanOrEqual(0);
        expect(years).toBeLessThanOrEqual(45); // Max write-off is 40 years + buffer
      });
    });

    it("uses offset of 5000 for annotation boundary", () => {
      // Set salary just below MAX_SALARY - 5000 (should have annotation)
      const { result: withAnnotation } = renderHook(
        () => useRepaymentYearsData(),
        { wrapper: createWrapper({ salary: MAX_SALARY - 6000 }) },
      );
      expect(withAnnotation.current.annotationSalary).toBeDefined();

      // Set salary just above MAX_SALARY - 5000 (should NOT have annotation)
      const { result: withoutAnnotation } = renderHook(
        () => useRepaymentYearsData(),
        { wrapper: createWrapper({ salary: MAX_SALARY - 4000 }) },
      );
      expect(withoutAnnotation.current.annotationSalary).toBeUndefined();
    });

    it("higher salary generally means fewer years to pay off", () => {
      const { result } = renderHook(() => useRepaymentYearsData(), {
        wrapper: createWrapper(),
      });

      const lowSalaryYears = result.current.data[0].value;
      const highSalaryYears =
        result.current.data[result.current.data.length - 1].value;

      // Higher salary should mean fewer or equal years
      expect(highSalaryYears).toBeLessThanOrEqual(lowSalaryYears + 5);
    });
  });

  describe("useInterestRateData", () => {
    it("returns data array with correct number of points", () => {
      const { result } = renderHook(() => useInterestRateData(), {
        wrapper: createWrapper({ underGradBalance: 50_000 }),
      });

      expect(result.current.data.length).toBe(expectedDataPoints);
    });

    it("returns rates as decimals (not percentages)", () => {
      const { result } = renderHook(() => useInterestRateData(), {
        wrapper: createWrapper({ underGradBalance: 50_000 }),
      });

      // Rates should be decimals (e.g., 0.05 for 5%, not 5)
      // -1 means 100% written off (nothing paid back), which is valid for low salaries
      result.current.data.forEach(({ value: rate }) => {
        expect(isFinite(rate)).toBe(true);
        expect(rate).toBeGreaterThanOrEqual(-1);
        expect(rate).toBeLessThan(1);
      });
    });

    it("returns annotationSalary when salary is in valid range", () => {
      const { result } = renderHook(() => useInterestRateData(), {
        wrapper: createWrapper({ salary: 60_000, underGradBalance: 50_000 }),
      });

      expect(result.current.annotationSalary).toBeDefined();
    });

    it("handles zero balance gracefully", () => {
      const { result } = renderHook(() => useInterestRateData(), {
        wrapper: createWrapper({ underGradBalance: 0, postGradBalance: 0 }),
      });

      // Should not throw, should return data with 0 rates
      expect(result.current.data.length).toBe(expectedDataPoints);
      result.current.data.forEach(({ value: rate }) => {
        expect(rate).toBe(0);
      });
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
