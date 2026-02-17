import * as matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import { afterEach, expect, vi } from "vitest";
import type {
  WorkerMessage,
  WorkerResultType,
} from "@/workers/simulation.worker";
import { simulate } from "@/lib/loans/engine";
import { simulateOverpayScenarios } from "@/lib/loans/overpay-simulate";
import { generateInsight } from "@/utils/insights";
import {
  generateSalaryDataSeries,
  generateSalaryDataSeriesPV,
  generateBalanceTimeSeries,
} from "@/utils/loan-calculations";
import { toPresent, pvTotal } from "@/utils/present-value";

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

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
        const data =
          payload.discountRate !== undefined && payload.discountRate > 0
            ? generateSalaryDataSeriesPV(
                payload.loans,
                payload.discountRate,
                undefined,
                payload.salaryGrowthRate,
                payload.thresholdGrowthRate,
              )
            : generateSalaryDataSeries(
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
        const balanceResult = generateBalanceTimeSeries(
          payload.loans,
          payload.annualSalary,
          undefined,
          payload.salaryGrowthRate,
          payload.thresholdGrowthRate,
        );
        const balanceData =
          payload.discountRate !== undefined && payload.discountRate > 0
            ? balanceResult.data.map((point) => ({
                ...point,
                balance: toPresent(
                  point.balance,
                  payload.discountRate as number,
                  point.month,
                ),
              }))
            : balanceResult.data;
        result = {
          type: "BALANCE_SERIES",
          data: balanceData,
          writeOffMonth: balanceResult.writeOffMonth,
        };
        break;
      }
      case "OVERPAY_ANALYSIS": {
        const analysisResult = simulateOverpayScenarios(
          {
            ...payload.input,
            repaymentStartDate: new Date(payload.input.repaymentStartDate),
          },
          payload.discountRate,
        );
        result = { type: "OVERPAY_ANALYSIS", result: analysisResult };
        break;
      }
      case "INSIGHT": {
        const totalBalance = payload.loans.reduce(
          (s: number, l: { balance: number }) => s + l.balance,
          0,
        );
        const insight = generateInsight(payload.salary, {
          loans: payload.loans,
          salaryGrowthRate: payload.salaryGrowthRate,
          thresholdGrowthRate: payload.thresholdGrowthRate,
        });
        let summary: {
          totalPaid: number;
          monthlyRepayment: number;
          monthsToPayoff: number;
          pvTotalPaid?: number;
        } | null = null;
        if (totalBalance > 0) {
          const simResult = simulate({
            loans: payload.loans,
            annualSalary: payload.salary,
            monthsElapsed: 0,
            salaryGrowthRate: payload.salaryGrowthRate,
            thresholdGrowthRate: payload.thresholdGrowthRate,
          });
          summary = {
            totalPaid: simResult.summary.totalPaid,
            monthlyRepayment:
              simResult.snapshots.length > 0
                ? simResult.snapshots[0].totalRepayment
                : 0,
            monthsToPayoff: simResult.summary.monthsToPayoff,
          };
          if (payload.discountRate !== undefined && payload.discountRate > 0) {
            summary.pvTotalPaid = pvTotal(
              simResult.snapshots.map((s) => ({
                month: s.month,
                amount: s.totalRepayment,
              })),
              payload.discountRate,
            );
          }
        }
        result = { type: "INSIGHT", insight, summary };
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
