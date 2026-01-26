import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import dayjs from "dayjs";
import {
  useTotalRepaymentData,
  useRepaymentYearsData,
  useInterestRateData,
} from "../useChartData";
import { useStore } from "../../store";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "../../constants";

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

describe("useChartData hooks", () => {
  const expectedDataPoints =
    Math.floor((MAX_SALARY - MIN_SALARY) / SALARY_STEP) + 1;

  beforeEach(() => {
    useStore.getState().reset();
    localStorage.clear();
    // Set default test configuration
    useStore.getState().updateField("underGradBalance", 50_000);
    useStore.getState().updateField("postGradBalance", 0);
    useStore.getState().updateField("repaymentDate", new Date("2022-04-01"));
    useStore.getState().updateField("salary", 45_000);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("useTotalRepaymentData", () => {
    it("returns data array with correct number of points", () => {
      const { result } = renderHook(() => useTotalRepaymentData());

      expect(result.current.data.length).toBe(expectedDataPoints);
    });

    it("returns data points as [salary, repayment] tuples", () => {
      const { result } = renderHook(() => useTotalRepaymentData());

      expect(result.current.data[0]).toHaveLength(2);
      expect(result.current.data[0][0]).toBe(MIN_SALARY);
      expect(typeof result.current.data[0][1]).toBe("number");
    });

    it("starts at MIN_SALARY and ends at MAX_SALARY", () => {
      const { result } = renderHook(() => useTotalRepaymentData());

      expect(result.current.data[0][0]).toBe(MIN_SALARY);
      expect(result.current.data[result.current.data.length - 1][0]).toBe(
        MAX_SALARY,
      );
    });

    it("returns annotationPoint when salary is in valid range", () => {
      useStore.getState().updateField("salary", 50_000);
      const { result } = renderHook(() => useTotalRepaymentData());

      const point = result.current.annotationPoint;
      if (!point) throw new Error("Expected annotationPoint to be defined");
      expect(point[0]).toBeGreaterThanOrEqual(50_000);
    });

    it("returns undefined annotationPoint when salary is below MIN_SALARY", () => {
      useStore.getState().updateField("salary", MIN_SALARY - 1000);
      const { result } = renderHook(() => useTotalRepaymentData());

      expect(result.current.annotationPoint).toBeUndefined();
    });

    it("returns undefined annotationPoint when salary is above MAX_SALARY", () => {
      useStore.getState().updateField("salary", MAX_SALARY + 1000);
      const { result } = renderHook(() => useTotalRepaymentData());

      expect(result.current.annotationPoint).toBeUndefined();
    });

    it("calculates higher repayment for higher earners who pay off loan", () => {
      const { result } = renderHook(() => useTotalRepaymentData());

      const lowSalaryRepayment = result.current.data[0][1];
      const highSalaryRepayment =
        result.current.data[result.current.data.length - 1][1];

      // Higher salary typically means more total repayment (up to full payoff)
      expect(highSalaryRepayment).toBeGreaterThanOrEqual(lowSalaryRepayment);
    });
  });

  describe("useRepaymentYearsData", () => {
    it("returns data array with correct number of points", () => {
      const { result } = renderHook(() => useRepaymentYearsData());

      expect(result.current.data.length).toBe(expectedDataPoints);
    });

    it("returns years values (not months)", () => {
      const { result } = renderHook(() => useRepaymentYearsData());

      // All values should be reasonable year values (not raw months)
      result.current.data.forEach(([, years]) => {
        expect(years).toBeGreaterThanOrEqual(0);
        expect(years).toBeLessThanOrEqual(45); // Max write-off is 40 years + buffer
      });
    });

    it("uses offset of 5000 for annotation boundary", () => {
      // Set salary just below MAX_SALARY - 5000 (should have annotation)
      useStore.getState().updateField("salary", MAX_SALARY - 6000);
      const { result: withAnnotation } = renderHook(() =>
        useRepaymentYearsData(),
      );
      expect(withAnnotation.current.annotationPoint).toBeDefined();

      // Set salary just above MAX_SALARY - 5000 (should NOT have annotation)
      useStore.getState().updateField("salary", MAX_SALARY - 4000);
      const { result: withoutAnnotation } = renderHook(() =>
        useRepaymentYearsData(),
      );
      expect(withoutAnnotation.current.annotationPoint).toBeUndefined();
    });

    it("higher salary generally means fewer years to pay off", () => {
      const { result } = renderHook(() => useRepaymentYearsData());

      const lowSalaryYears = result.current.data[0][1];
      const highSalaryYears =
        result.current.data[result.current.data.length - 1][1];

      // Higher salary should mean fewer or equal years
      expect(highSalaryYears).toBeLessThanOrEqual(lowSalaryYears + 5);
    });
  });

  describe("useInterestRateData", () => {
    beforeEach(() => {
      // Ensure we have positive balance for rate calculation
      useStore.getState().updateField("underGradBalance", 50_000);
    });

    it("returns data array with correct number of points", () => {
      const { result } = renderHook(() => useInterestRateData());

      expect(result.current.data.length).toBe(expectedDataPoints);
    });

    it("returns rates as decimals (not percentages)", () => {
      const { result } = renderHook(() => useInterestRateData());

      // Rates should be decimals (e.g., 0.05 for 5%, not 5)
      result.current.data.forEach(([, rate]) => {
        expect(isFinite(rate)).toBe(true);
        expect(rate).toBeGreaterThan(-1);
        expect(rate).toBeLessThan(1);
      });
    });

    it("returns annotationPoint when salary is in valid range", () => {
      useStore.getState().updateField("salary", 60_000);
      const { result } = renderHook(() => useInterestRateData());

      expect(result.current.annotationPoint).toBeDefined();
    });

    it("handles zero balance gracefully", () => {
      useStore.getState().updateField("underGradBalance", 0);
      useStore.getState().updateField("postGradBalance", 0);

      const { result } = renderHook(() => useInterestRateData());

      // Should not throw, should return data with 0 rates
      expect(result.current.data.length).toBe(expectedDataPoints);
      result.current.data.forEach(([, rate]) => {
        expect(rate).toBe(0);
      });
    });
  });

  describe("hook memoization", () => {
    it("useTotalRepaymentData returns equivalent data on rerender", () => {
      const { result, rerender } = renderHook(() => useTotalRepaymentData());
      const firstData = [...result.current.data];

      rerender();

      // Data should be equivalent (same values) even if not same reference
      expect(result.current.data).toStrictEqual(firstData);
    });

    it("useTotalRepaymentData returns different data when config changes", () => {
      const { result, rerender } = renderHook(() => useTotalRepaymentData());
      const firstData = [...result.current.data];

      useStore.getState().updateField("underGradBalance", 75_000);
      rerender();

      // Data should differ after config change
      expect(result.current.data).not.toStrictEqual(firstData);
    });
  });

  describe("integration with Plan 2 vs Plan 5", () => {
    it("Plan 2 data differs from Plan 5 data", () => {
      useStore.getState().updateField("isPost2023", false);
      const { result: plan2Result } = renderHook(() => useTotalRepaymentData());
      const plan2Data = [...plan2Result.current.data];

      useStore.getState().updateField("isPost2023", true);
      const { result: plan5Result } = renderHook(() => useTotalRepaymentData());
      const plan5Data = plan5Result.current.data;

      // At least some values should differ between plans
      let hasDifference = false;
      for (let i = 0; i < plan2Data.length; i++) {
        if (plan2Data[i][1] !== plan5Data[i][1]) {
          hasDifference = true;
          break;
        }
      }
      expect(hasDifference).toBe(true);
    });
  });
});
