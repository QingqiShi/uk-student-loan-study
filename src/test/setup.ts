import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";
import type {
  WorkerMessage,
  WorkerResultType,
} from "@/workers/simulation.worker";
import { simulateOverpayScenarios } from "@/lib/loans/overpay-simulate";
import { generateInsight } from "@/utils/insights";
import {
  generateSalaryDataSeries,
  generateBalanceTimeSeries,
} from "@/utils/loan-calculations";

expect.extend(matchers);

/**
 * Mock Worker class for testing.
 * Processes simulation messages synchronously and calls the same
 * underlying functions that the real worker uses.
 */
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;

  postMessage(message: WorkerMessage) {
    const { id, payload } = message;
    let result: WorkerResultType;

    switch (payload.type) {
      case "SALARY_SERIES": {
        const data = generateSalaryDataSeries(
          payload.loans,
          (r) => r.totalRepayment,
          undefined,
          payload.salaryGrowthRate,
          payload.thresholdGrowthRate,
        );
        result = { type: "SALARY_SERIES", data };
        break;
      }
      case "BALANCE_SERIES": {
        const { data, writeOffMonth } = generateBalanceTimeSeries(
          payload.loans,
          payload.annualSalary,
          undefined,
          payload.salaryGrowthRate,
          payload.thresholdGrowthRate,
        );
        result = { type: "BALANCE_SERIES", data, writeOffMonth };
        break;
      }
      case "OVERPAY_ANALYSIS": {
        const analysisResult = simulateOverpayScenarios({
          ...payload.input,
          repaymentStartDate: new Date(payload.input.repaymentStartDate),
        });
        result = { type: "OVERPAY_ANALYSIS", result: analysisResult };
        break;
      }
      case "INSIGHT": {
        const insight = generateInsight(payload.salary, {
          loans: payload.loans,
          underGradBalance: payload.underGradBalance,
          postGradBalance: payload.postGradBalance,
          salaryGrowthRate: payload.salaryGrowthRate,
          thresholdGrowthRate: payload.thresholdGrowthRate,
        });
        result = { type: "INSIGHT", insight };
        break;
      }
    }

    // Use Promise.resolve().then() for micro-task scheduling
    // This defers the callback until after the current synchronous code,
    // making it work correctly with React's effect lifecycle
    void Promise.resolve().then(() => {
      if (this.onmessage) {
        this.onmessage({ data: { id, result } } as MessageEvent);
      }
    });
  }

  terminate() {
    // No-op for mock
  }
}

// Mock the Worker global
vi.stubGlobal("Worker", MockWorker);
