/**
 * Web Worker for loan simulation calculations.
 *
 * Moves expensive computations off the main thread to improve INP.
 * Handles six types of simulations:
 * - SALARY_SERIES: 126 simulations across salary range
 * - BALANCE_SERIES: 1 simulation for balance over time
 * - OVERPAY_ANALYSIS: 2 simulations for overpay comparison
 * - INSIGHT: 1 simulation for personalized insight text
 * - DETAIL_SERIES: 1 simulation extracting all time-series for detail pages
 * - EFFECTIVE_RATE_SALARY: 126 simulations computing effective rate by salary
 */

import type {
  OverpayInput,
  OverpayAnalysisResult,
} from "@/lib/loans/overpay-types";
import type { Loan } from "@/lib/loans/types";
import type { DataPoint, BalanceDataPoint } from "@/types/chart";
import type { InsightCardsResult } from "@/types/insight-cards";
import { MIN_SALARY, MAX_SALARY, SALARY_STEP } from "@/constants";
import { simulate } from "@/lib/loans/engine";
import { simulateOverpayScenarios } from "@/lib/loans/overpay-simulate";
import { generateInsight, type Insight } from "@/utils/insights";
import {
  generateSalaryDataSeries,
  generateSalaryDataSeriesPV,
  generateBalanceTimeSeries,
  type BalanceTimeSeriesResult,
} from "@/utils/loan-calculations";
import { toPresent, pvTotal } from "@/utils/present-value";

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
  rpiRate: number;
  boeBaseRate: number;
  discountRate?: number;
}

export interface EffectiveRateSalaryPayload {
  type: "EFFECTIVE_RATE_SALARY";
  loans: Loan[];
  salaryGrowthRate: number;
  thresholdGrowthRate: number;
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
  | { id: number; payload: WorkerPayload }
  | { id: number; cancel: true };

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
  interestBreakdown: Array<{
    month: number;
    cumulativeInterest: number;
    cumulativePrincipal: number;
  }>;
  stats: {
    totalPaid: number;
    totalInterest: number;
    initialBalance: number;
    monthsToPayoff: number;
    writtenOff: boolean;
    writeOffMonth: number | null;
    effectiveRate: number;
    boeRate: number;
    interestRatio: number;
    monthlyRepayment: number;
    peakBalance: number;
    peakBalanceMonth: number;
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
// Message Handlers
// ============================================================================

function handleSalarySeries(payload: SalarySeriesPayload): DataPoint[] {
  if (payload.discountRate !== undefined && payload.discountRate > 0) {
    return generateSalaryDataSeriesPV(
      payload.loans,
      payload.discountRate,
      payload.rpiRate,
      payload.salaryGrowthRate,
      payload.thresholdGrowthRate,
      payload.boeBaseRate,
    );
  }
  return generateSalaryDataSeries(
    payload.loans,
    (r) => r.totalRepayment,
    payload.rpiRate,
    payload.salaryGrowthRate,
    payload.thresholdGrowthRate,
    payload.boeBaseRate,
  );
}

function handleBalanceSeries(
  payload: BalanceSeriesPayload,
): BalanceTimeSeriesResult {
  const result = generateBalanceTimeSeries(
    payload.loans,
    payload.annualSalary,
    payload.rpiRate,
    payload.salaryGrowthRate,
    payload.thresholdGrowthRate,
    payload.boeBaseRate,
  );

  const { discountRate } = payload;
  if (discountRate && discountRate > 0) {
    return {
      ...result,
      data: result.data.map((point) => ({
        ...point,
        balance: toPresent(point.balance, discountRate, point.month),
      })),
    };
  }

  return result;
}

function handleOverpayAnalysis(
  payload: OverpayAnalysisPayload,
): OverpayAnalysisResult {
  // Convert ISO string back to Date
  const input: OverpayInput = {
    ...payload.input,
    repaymentStartDate: new Date(payload.input.repaymentStartDate),
  };
  return simulateOverpayScenarios(input, payload.discountRate);
}

function handleInsight(payload: InsightPayload): {
  insight: Insight | null;
  summary: InsightSummary | null;
  cards: InsightCardsResult;
} {
  const totalBalance = payload.loans.reduce((s, l) => s + l.balance, 0);

  const insight = generateInsight(payload.salary, {
    loans: payload.loans,
    salaryGrowthRate: payload.salaryGrowthRate,
    thresholdGrowthRate: payload.thresholdGrowthRate,
    rpiRate: payload.rpiRate,
    boeBaseRate: payload.boeBaseRate,
    discountRate: payload.discountRate,
  });

  const emptyCards: InsightCardsResult = {
    balance: { data: [], stat: "\u2014", label: "Duration" },
    interest: { stat: "\u2014", label: "Total Interest", interestRatio: 0 },
    effectiveRate: {
      stat: "\u2014",
      label: "Effective Rate",
      effectiveRate: 0,
      boeRate: payload.boeBaseRate / 100,
    },
    cumulative: { data: [], stat: "\u2014", label: "Total Cost" },
  };

  if (totalBalance <= 0) {
    return { insight, summary: null, cards: emptyCards };
  }

  const result = simulate({
    loans: payload.loans,
    annualSalary: payload.salary,
    monthsElapsed: 0,
    salaryGrowthRate: payload.salaryGrowthRate,
    thresholdGrowthRate: payload.thresholdGrowthRate,
    rpiRate: payload.rpiRate,
    boeBaseRate: payload.boeBaseRate,
  });

  const { snapshots, summary: simSummary } = result;

  // --- Insight summary ---
  const summary: InsightSummary = {
    totalPaid: simSummary.totalPaid,
    monthlyRepayment: snapshots.length > 0 ? snapshots[0].totalRepayment : 0,
    monthsToPayoff: simSummary.monthsToPayoff,
  };

  const hasPV = payload.discountRate !== undefined && payload.discountRate > 0;
  const dr = payload.discountRate ?? 0;

  if (hasPV) {
    summary.pvTotalPaid = pvTotal(
      snapshots.map((s) => ({
        month: s.month,
        amount: s.totalRepayment,
      })),
      dr,
    );
  }

  // --- Insight cards ---
  const balanceData: { month: number; value: number }[] = [];
  const cumulativeData: { month: number; value: number }[] = [];
  let cumulativePaid = 0;
  let pvCumulativePaid = 0;

  for (const snap of snapshots) {
    const monthBalance = snap.loans.reduce((s, l) => s + l.closingBalance, 0);
    cumulativePaid += snap.totalRepayment;
    if (hasPV) {
      pvCumulativePaid += toPresent(snap.totalRepayment, dr, snap.month);
    }

    if (
      snap.month === 0 ||
      snap.month % 12 === 0 ||
      snap.month === snapshots.length - 1
    ) {
      const bal = hasPV
        ? toPresent(monthBalance, dr, snap.month)
        : monthBalance;
      balanceData.push({ month: snap.month, value: bal });
      cumulativeData.push({
        month: snap.month,
        value: hasPV ? pvCumulativePaid : cumulativePaid,
      });
    }
  }

  const months = simSummary.monthsToPayoff;
  const years = Math.round(months / 12);
  const balanceStat = months < 12 ? "<1 year" : `${String(years)} years`;

  const totalPaid = hasPV
    ? pvTotal(
        snapshots.map((s) => ({ month: s.month, amount: s.totalRepayment })),
        dr,
      )
    : simSummary.totalPaid;
  const costOfBorrowing = Math.max(0, totalPaid - totalBalance);
  const interestRatio = totalPaid > 0 ? costOfBorrowing / totalPaid : 0;

  const annualRate = computeEffectiveAnnualRate(totalBalance, snapshots);
  const ratePct = annualRate * 100;
  const rateStat = ratePct < 0.05 ? "0%" : `${ratePct.toFixed(1)}%`;

  const cumulativeStat = `${formatCompactCurrency(totalPaid)} total`;

  const cards: InsightCardsResult = {
    balance: { data: balanceData, stat: balanceStat, label: "Duration" },
    interest: {
      stat: formatCompactCurrency(costOfBorrowing),
      label: "Total Interest",
      interestRatio,
    },
    effectiveRate: {
      stat: rateStat,
      label: "Effective Rate",
      effectiveRate: annualRate,
      boeRate: payload.boeBaseRate / 100,
    },
    cumulative: {
      data: cumulativeData,
      stat: cumulativeStat,
      label: "Total Cost",
    },
  };

  return { insight, summary, cards };
}

function formatCompactCurrency(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000) {
    const millions = value / 1_000_000;
    return `£${millions % 1 === 0 ? String(millions) : millions.toFixed(1)}m`;
  }
  if (abs >= 10_000) {
    const thousands = value / 1_000;
    return `£${thousands % 1 === 0 ? String(thousands) : thousands.toFixed(1)}k`;
  }
  if (abs >= 1_000) {
    const thousands = value / 1_000;
    return `£${thousands.toFixed(1)}k`;
  }
  return `£${String(Math.round(value))}`;
}

function handleDetailSeries(payload: DetailSeriesPayload): DetailSeriesResult {
  const totalBalance = payload.loans.reduce((s, l) => s + l.balance, 0);

  if (totalBalance <= 0) {
    return {
      type: "DETAIL_SERIES",
      cumulativeRepaid: [],
      balanceSeries: [],
      interestBreakdown: [],
      stats: {
        totalPaid: 0,
        totalInterest: 0,
        initialBalance: 0,
        monthsToPayoff: 0,
        writtenOff: false,
        writeOffMonth: null,
        effectiveRate: 0,
        boeRate: payload.boeBaseRate / 100,
        interestRatio: 0,
        monthlyRepayment: 0,
        peakBalance: 0,
        peakBalanceMonth: 0,
      },
    };
  }

  const result = simulate({
    loans: payload.loans,
    annualSalary: payload.annualSalary,
    monthsElapsed: 0,
    salaryGrowthRate: payload.salaryGrowthRate,
    thresholdGrowthRate: payload.thresholdGrowthRate,
    rpiRate: payload.rpiRate,
    boeBaseRate: payload.boeBaseRate,
  });

  const { snapshots, summary } = result;
  const hasPV = payload.discountRate !== undefined && payload.discountRate > 0;
  const dr = payload.discountRate ?? 0;

  const cumulativeRepaid: DetailSeriesResult["cumulativeRepaid"] = [];
  const balanceSeries: DetailSeriesResult["balanceSeries"] = [];
  const interestBreakdown: DetailSeriesResult["interestBreakdown"] = [];

  let cumPaid = 0;
  let pvCumPaid = 0;
  let cumInterestPortion = 0;
  let pvCumInterestPortion = 0;
  let peakBalance = totalBalance;
  let peakBalanceMonth = 0;

  // Add initial point
  const initBal = hasPV ? toPresent(totalBalance, dr, 0) : totalBalance;
  balanceSeries.push({ month: 0, balance: initBal });
  cumulativeRepaid.push({ month: 0, cumulative: 0 });
  interestBreakdown.push({
    month: 0,
    cumulativeInterest: 0,
    cumulativePrincipal: 0,
  });

  for (const snap of snapshots) {
    const monthBalance = snap.loans.reduce((s, l) => s + l.closingBalance, 0);
    const monthInterest = snap.loans.reduce((s, l) => s + l.interestApplied, 0);
    const interestPortion = Math.min(snap.totalRepayment, monthInterest);

    cumPaid += snap.totalRepayment;
    cumInterestPortion += interestPortion;

    if (hasPV) {
      pvCumPaid += toPresent(snap.totalRepayment, dr, snap.month);
      pvCumInterestPortion += toPresent(interestPortion, dr, snap.month);
    }

    if (monthBalance > peakBalance) {
      peakBalance = monthBalance;
      peakBalanceMonth = snap.month;
    }

    // Sample every 3 months + last snapshot
    if (snap.month % 3 === 0 || snap.month === snapshots.length - 1) {
      const bal = hasPV
        ? toPresent(monthBalance, dr, snap.month)
        : monthBalance;
      const paid = hasPV ? pvCumPaid : cumPaid;
      const interest = hasPV ? pvCumInterestPortion : cumInterestPortion;

      balanceSeries.push({ month: snap.month, balance: bal });
      cumulativeRepaid.push({ month: snap.month, cumulative: paid });
      interestBreakdown.push({
        month: snap.month,
        cumulativeInterest: interest,
        cumulativePrincipal: paid - interest,
      });
    }
  }

  const writtenOff = summary.perLoan.some((l) => l.writtenOff);
  const totalPaid = hasPV
    ? pvTotal(
        snapshots.map((s) => ({ month: s.month, amount: s.totalRepayment })),
        dr,
      )
    : summary.totalPaid;
  const costOfBorrowing = Math.max(0, totalPaid - totalBalance);
  const interestRatio = totalPaid > 0 ? costOfBorrowing / totalPaid : 0;
  const effectiveRate = computeEffectiveAnnualRate(totalBalance, snapshots);
  const peakBal = hasPV
    ? toPresent(peakBalance, dr, peakBalanceMonth)
    : peakBalance;

  return {
    type: "DETAIL_SERIES",
    cumulativeRepaid,
    balanceSeries,
    interestBreakdown,
    stats: {
      totalPaid,
      totalInterest: costOfBorrowing,
      initialBalance: totalBalance,
      monthsToPayoff: summary.monthsToPayoff,
      writtenOff,
      writeOffMonth: writtenOff ? summary.monthsToPayoff : null,
      effectiveRate,
      boeRate: payload.boeBaseRate / 100,
      interestRatio,
      monthlyRepayment: snapshots.length > 0 ? snapshots[0].totalRepayment : 0,
      peakBalance: peakBal,
      peakBalanceMonth,
    },
  };
}

function handleEffectiveRateSalary(
  payload: EffectiveRateSalaryPayload,
): EffectiveRateSalaryResult {
  const data: EffectiveRateSalaryResult["data"] = [];
  const totalBalance = payload.loans.reduce((s, l) => s + l.balance, 0);

  for (let salary = MIN_SALARY; salary <= MAX_SALARY; salary += SALARY_STEP) {
    const timeSeries = simulate({
      loans: payload.loans,
      annualSalary: salary,
      monthsElapsed: 0,
      rpiRate: payload.rpiRate,
      salaryGrowthRate: payload.salaryGrowthRate,
      thresholdGrowthRate: payload.thresholdGrowthRate,
      boeBaseRate: payload.boeBaseRate,
    });

    const rate = computeEffectiveAnnualRate(totalBalance, timeSeries.snapshots);
    data.push({ salary, effectiveRate: rate });
  }

  return {
    type: "EFFECTIVE_RATE_SALARY",
    data,
    boeRate: payload.boeBaseRate / 100,
  };
}

/**
 * Compute the effective annual interest rate (IRR) of the loan.
 * Finds the rate r where PV(all payments, r) = original balance.
 * Uses Newton's method on: f(r) = Σ(payment_i / (1+r)^(t_i)) - balance
 */
function computeEffectiveAnnualRate(
  balance: number,
  snapshots: Array<{ month: number; totalRepayment: number }>,
): number {
  if (balance <= 0 || snapshots.length === 0) return 0;

  const totalPaid = snapshots.reduce((s, snap) => s + snap.totalRepayment, 0);
  if (totalPaid <= balance) return 0; // Effective rate ≤ 0 (write-off covers the cost)

  let r = 0.05;

  for (let iter = 0; iter < 100; iter++) {
    let pv = 0;
    let dpv = 0;

    for (const snap of snapshots) {
      if (snap.totalRepayment === 0) continue;
      const t = snap.month / 12;
      const disc = Math.pow(1 + r, -t);
      pv += snap.totalRepayment * disc;
      dpv += (snap.totalRepayment * -t * disc) / (1 + r);
    }

    const f = pv - balance;
    if (Math.abs(f) < 0.01) break;
    if (dpv === 0) break;

    r -= f / dpv;
    if (r <= 0) r = 0.001;
    if (r > 2) r = 0.5;
  }

  return Math.max(0, r);
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
      const { insight, summary, cards } = handleInsight(payload);
      result = { type: "INSIGHT", insight, summary, cards };
      break;
    }
    case "DETAIL_SERIES": {
      result = handleDetailSeries(payload);
      break;
    }
    case "EFFECTIVE_RATE_SALARY": {
      result = handleEffectiveRateSalary(payload);
      break;
    }
  }

  self.postMessage({ id, result } satisfies WorkerResponse);
};
