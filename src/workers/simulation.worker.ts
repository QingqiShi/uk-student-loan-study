/**
 * Web Worker for loan simulation calculations.
 *
 * Moves expensive computations off the main thread to improve INP.
 * Handles four types of simulations:
 * - SALARY_SERIES: 126 simulations across salary range
 * - BALANCE_SERIES: 1 simulation for balance over time
 * - OVERPAY_ANALYSIS: 2 simulations for overpay comparison
 * - INSIGHT: 1 simulation for personalized insight text
 */

import type {
  OverpayInput,
  OverpayAnalysisResult,
} from "@/lib/loans/overpay-types";
import type { Loan } from "@/lib/loans/types";
import type { DataPoint, BalanceDataPoint } from "@/types/chart";
import { simulate } from "@/lib/loans/engine";
import { simulateOverpayScenarios } from "@/lib/loans/overpay-simulate";
import { generateInsight, type Insight } from "@/utils/insights";
import {
  generateSalaryDataSeries,
  generateBalanceTimeSeries,
  type BalanceTimeSeriesResult,
} from "@/utils/loan-calculations";

// ============================================================================
// Message Types
// ============================================================================

export type WorkerMessageType =
  | "SALARY_SERIES"
  | "BALANCE_SERIES"
  | "OVERPAY_ANALYSIS"
  | "INSIGHT";

export interface SalarySeriesPayload {
  type: "SALARY_SERIES";
  loans: Loan[];
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
}

export interface BalanceSeriesPayload {
  type: "BALANCE_SERIES";
  loans: Loan[];
  annualSalary: number;
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
}

export interface OverpayAnalysisPayload {
  type: "OVERPAY_ANALYSIS";
  input: Omit<OverpayInput, "repaymentStartDate"> & {
    repaymentStartDate: string; // ISO string - Date can't be transferred
  };
}

export interface InsightPayload {
  type: "INSIGHT";
  salary: number;
  loans: Loan[];
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
}

export type WorkerPayload =
  | SalarySeriesPayload
  | BalanceSeriesPayload
  | OverpayAnalysisPayload
  | InsightPayload;

export interface WorkerMessage {
  id: number;
  payload: WorkerPayload;
}

export interface InsightSummary {
  totalPaid: number;
  monthlyRepayment: number;
  monthsToPayoff: number;
}

export type WorkerResultType =
  | { type: "SALARY_SERIES"; data: DataPoint[] }
  | {
      type: "BALANCE_SERIES";
      data: BalanceDataPoint[];
      writeOffMonth: number | null;
    }
  | { type: "OVERPAY_ANALYSIS"; result: OverpayAnalysisResult }
  | {
      type: "INSIGHT";
      insight: Insight | null;
      summary: InsightSummary | null;
    };

export interface WorkerResponse {
  id: number;
  result: WorkerResultType;
}

// ============================================================================
// Message Handlers
// ============================================================================

function handleSalarySeries(payload: SalarySeriesPayload): DataPoint[] {
  return generateSalaryDataSeries(
    payload.loans,
    (r) => r.totalRepayment,
    undefined,
    payload.salaryGrowthRate,
    payload.thresholdGrowthRate,
  );
}

function handleBalanceSeries(
  payload: BalanceSeriesPayload,
): BalanceTimeSeriesResult {
  return generateBalanceTimeSeries(
    payload.loans,
    payload.annualSalary,
    undefined,
    payload.salaryGrowthRate,
    payload.thresholdGrowthRate,
  );
}

function handleOverpayAnalysis(
  payload: OverpayAnalysisPayload,
): OverpayAnalysisResult {
  // Convert ISO string back to Date
  const input: OverpayInput = {
    ...payload.input,
    repaymentStartDate: new Date(payload.input.repaymentStartDate),
  };
  return simulateOverpayScenarios(input);
}

function handleInsight(payload: InsightPayload): {
  insight: Insight | null;
  summary: InsightSummary | null;
} {
  const totalBalance = payload.loans.reduce((s, l) => s + l.balance, 0);

  const insight = generateInsight(payload.salary, {
    loans: payload.loans,
    salaryGrowthRate: payload.salaryGrowthRate,
    thresholdGrowthRate: payload.thresholdGrowthRate,
  });

  if (totalBalance <= 0) {
    return { insight, summary: null };
  }

  const result = simulate({
    loans: payload.loans,
    annualSalary: payload.salary,
    monthsElapsed: 0,
    salaryGrowthRate: payload.salaryGrowthRate,
    thresholdGrowthRate: payload.thresholdGrowthRate,
  });

  const summary: InsightSummary = {
    totalPaid: result.summary.totalPaid,
    monthlyRepayment:
      result.snapshots.length > 0 ? result.snapshots[0].totalRepayment : 0,
    monthsToPayoff: result.summary.monthsToPayoff,
  };

  return { insight, summary };
}

// ============================================================================
// Worker Entry Point
// ============================================================================

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { id, payload } = event.data;

  let result: WorkerResultType;

  switch (payload.type) {
    case "SALARY_SERIES": {
      const data = handleSalarySeries(payload);
      result = { type: "SALARY_SERIES", data };
      break;
    }
    case "BALANCE_SERIES": {
      const { data, writeOffMonth } = handleBalanceSeries(payload);
      result = { type: "BALANCE_SERIES", data, writeOffMonth };
      break;
    }
    case "OVERPAY_ANALYSIS": {
      const analysisResult = handleOverpayAnalysis(payload);
      result = { type: "OVERPAY_ANALYSIS", result: analysisResult };
      break;
    }
    case "INSIGHT": {
      const { insight, summary } = handleInsight(payload);
      result = { type: "INSIGHT", insight, summary };
      break;
    }
  }

  self.postMessage({ id, result } satisfies WorkerResponse);
};
