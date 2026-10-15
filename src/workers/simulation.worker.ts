/**
 * Web Worker for loan simulation calculations.
 *
 * Moves expensive computations off the main thread to improve INP.
 * Handles six types of simulations:
 * - SALARY_SERIES: 126 simulations across salary range
 * - BALANCE_SERIES: 1 simulation for balance over time
 * - OVERPAY_ANALYSIS: 2 simulations for overpay comparison
 * - INSIGHT: 1 simulation for personalised insight text
 * - DETAIL_SERIES: 1 simulation extracting all time-series for detail pages
 * - EFFECTIVE_RATE_SALARY: 126 simulations computing effective rate by salary
 */

import type {
  OverpayInput,
  OverpayAnalysisResult,
} from "@/lib/loans/overpayTypes";
import type { Loan } from "@/lib/loans/types";
import type { DataPoint, BalanceDataPoint } from "@/types/chart";
import type { InsightCardsResult } from "@/types/insightCards";
import type { Insight } from "@/utils/insights";
import { runSimulation } from "@/workers/runSimulation";

// ============================================================================
// Message Types
// ============================================================================

export type WorkerMessageType =
  | "SALARY_SERIES"
  | "BALANCE_SERIES"
  | "OVERPAY_ANALYSIS"
  | "INSIGHT"
  | "DETAIL_SERIES"
  | "EFFECTIVE_RATE_SALARY";

export interface SalarySeriesPayload {
  type: "SALARY_SERIES";
  loans: Loan[];
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
  plan2ThresholdSchedule?: number[];
  rpiRate: number;
  boeBaseRate: number;
  discountRate?: number;
}

export interface BalanceSeriesPayload {
  type: "BALANCE_SERIES";
  loans: Loan[];
  annualSalary: number;
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
  plan2ThresholdSchedule?: number[];
  rpiRate: number;
  boeBaseRate: number;
  discountRate?: number;
}

export interface OverpayAnalysisPayload {
  type: "OVERPAY_ANALYSIS";
  input: Omit<OverpayInput, "repaymentStartDate"> & {
    repaymentStartDate: string; // ISO string - Date can't be transferred
  };
  discountRate?: number;
}

export interface InsightPayload {
  type: "INSIGHT";
  salary: number;
  loans: Loan[];
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
  plan2ThresholdSchedule?: number[];
  rpiRate: number;
  boeBaseRate: number;
  discountRate?: number;
}

export interface DetailSeriesPayload {
  type: "DETAIL_SERIES";
  loans: Loan[];
  annualSalary: number;
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
  plan2ThresholdSchedule?: number[];
  rpiRate: number;
  boeBaseRate: number;
  discountRate?: number;
}

export interface EffectiveRateSalaryPayload {
  type: "EFFECTIVE_RATE_SALARY";
  loans: Loan[];
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
  plan2ThresholdSchedule?: number[];
  rpiRate: number;
  boeBaseRate: number;
}

export type WorkerPayload =
  | SalarySeriesPayload
  | BalanceSeriesPayload
  | OverpayAnalysisPayload
  | InsightPayload
  | DetailSeriesPayload
  | EffectiveRateSalaryPayload;

export type WorkerMessage =
  { id: number; payload: WorkerPayload } | { id: number; cancel: true };

export interface InsightSummary {
  totalPaid: number;
  monthlyRepayment: number;
  monthsToPayoff: number;
  pvTotalPaid?: number;
}

export interface DetailSeriesResult {
  type: "DETAIL_SERIES";
  cumulativeRepaid: Array<{ month: number; cumulative: number }>;
  balanceSeries: Array<{ month: number; balance: number }>;
  annualBreakdown: Array<{
    year: number;
    interestPaid: number;
    interestUnpaid: number;
    principalPortion: number;
  }>;
  stats: {
    totalPaid: number;
    totalInterestPaid: number;
    attributedInterestPaid: number;
    totalPrincipalPaid: number;
    initialBalance: number;
    monthsToPayoff: number;
    writtenOff: boolean;
    writeOffMonth: number | null;
    interestRatio: number;
    monthlyRepayment: number;
    peakBalance: number;
    peakBalanceMonth: number;
    totalWrittenOff: number;
  };
}

export interface EffectiveRateSalaryResult {
  type: "EFFECTIVE_RATE_SALARY";
  data: Array<{ salary: number; effectiveRate: number }>;
  boeRate: number;
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
      cards: InsightCardsResult;
    }
  | DetailSeriesResult
  | EffectiveRateSalaryResult;

export interface WorkerResponse {
  id: number;
  result: WorkerResultType;
}

// ============================================================================
// Worker Entry Point
// ============================================================================

const cancelledIds = new Set<number>();

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const msg = event.data;

  // Handle cancellation: mark ID and skip processing
  if ("cancel" in msg) {
    cancelledIds.add(msg.id);
    return;
  }

  const { id, payload } = msg;

  // Skip if this request was cancelled while queued
  if (cancelledIds.has(id)) {
    cancelledIds.delete(id);
    return;
  }

  // Prune stale cancelled IDs: any ID below the current one was either
  // already processed or will never arrive, so keeping it leaks memory.
  if (cancelledIds.size > 0) {
    for (const staleId of cancelledIds) {
      if (staleId < id) {
        cancelledIds.delete(staleId);
      }
    }
  }

  const result = runSimulation(payload);

  self.postMessage({ id, result } satisfies WorkerResponse);
};
