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
  underGradBalance: number;
  postGradBalance: number;
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

export type WorkerResultType =
  | { type: "SALARY_SERIES"; data: DataPoint[] }
  | {
      type: "BALANCE_SERIES";
      data: BalanceDataPoint[];
      writeOffMonth: number | null;
    }
  | { type: "OVERPAY_ANALYSIS"; result: OverpayAnalysisResult }
  | { type: "INSIGHT"; insight: Insight | null };

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

function handleInsight(payload: InsightPayload): Insight | null {
  return generateInsight(payload.salary, {
    loans: payload.loans,
    underGradBalance: payload.underGradBalance,
    postGradBalance: payload.postGradBalance,
    salaryGrowthRate: payload.salaryGrowthRate,
    thresholdGrowthRate: payload.thresholdGrowthRate,
  });
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
      const insight = handleInsight(payload);
      result = { type: "INSIGHT", insight };
      break;
    }
  }

  self.postMessage({ id, result } satisfies WorkerResponse);
};
