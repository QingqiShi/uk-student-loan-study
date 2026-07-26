"use client";

import type { OverpayAnalysisResult } from "@/lib/loans/overpayTypes";

/**
 * The overpay comparison's shared figure vocabulary — the unit treatment, the
 * key/value rows inside a ledger cell, and the ledger's present-value-aware
 * totals.
 */

/**
 * Unit words (yrs, y, m) drop to small sans so only the digits stay mono —
 * the Figures-Are-Mono / Subordinated-Unit rules.
 */
function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-xs font-normal text-muted-foreground">
      {children}
    </span>
  );
}

export function formatYears(months: number) {
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (remainingMonths === 0) {
    return (
      <>
        {years} <Unit>{years === 1 ? "yr" : "yrs"}</Unit>
      </>
    );
  }
  return (
    <>
      {years}
      <Unit>y</Unit> {remainingMonths}
      <Unit>m</Unit>
    </>
  );
}

const DETAIL_VALUE_TONE = {
  default: "font-mono text-foreground tabular-nums",
  muted: "font-mono text-muted-foreground tabular-nums",
  // An outcome word, not a figure — so sans, per the Figures-Are-Mono rule.
  outcome: "font-sans font-medium text-cta",
} as const;

/** One key/value line beneath a ledger cell's headline figure. */
export function DetailRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: keyof typeof DETAIL_VALUE_TONE;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={DETAIL_VALUE_TONE[tone]}>{value}</span>
    </div>
  );
}

/** Height-matched placeholder for a cell's detail rows while figures resolve. */
export function DetailRowsSkeleton({ rows }: { rows: number }) {
  return (
    <div aria-hidden className="flex max-w-64 flex-col gap-1">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-baseline justify-between gap-2">
          <span className="w-20 rounded-sm bg-muted text-sm text-transparent">
            Payoff time
          </span>
          <span className="w-14 rounded-sm bg-muted text-sm text-transparent">
            00y 0m
          </span>
        </div>
      ))}
    </div>
  );
}

interface LedgerTotals {
  /** Baseline total repaid, on whichever basis this analysis was computed. */
  baselineTotalRepaid: number;
  /** Overpay-scenario total repaid, on the same basis. */
  overpayTotalRepaid: number;
  /** Disclosure for the totals above; empty when they are nominal. */
  pvSuffix: string;
}

/**
 * Whether an analysis was computed in present value. Read this, never the
 * store's toggle: `useSimulationWorker` keeps returning the previous result
 * until a new one arrives, so for a full round-trip after every toggle the
 * store and the figures on screen disagree about the basis. Deriving it from
 * the result itself is the only reading that is true of the numbers rendered —
 * in both directions, on the way in and on the way out.
 */
export function isPresentValue(
  analysis: OverpayAnalysisResult | null,
): boolean {
  return analysis?.pvBaseline != null;
}

/**
 * The ledger's two totals and their basis disclosure. Returns null while the
 * worker is still resolving, so callers branch once on loading rather than
 * threading `undefined` through every figure.
 *
 * A plain function, not a hook: the basis comes from the analysis it is handed,
 * so it reads no store state.
 */
export function ledgerTotals(
  analysis: OverpayAnalysisResult | null,
): LedgerTotals | null {
  if (analysis == null) return null;

  const pv = isPresentValue(analysis);
  return {
    baselineTotalRepaid:
      analysis.pvBaseline?.totalPaid ?? analysis.baseline.totalPaid,
    overpayTotalRepaid:
      analysis.pvOverpay?.totalPaid ?? analysis.overpay.totalPaid,
    // CONTEXT.md names this state "present value" and lists "real"/"in real
    // terms" under _Avoid_ for it.
    pvSuffix: pv ? " (present value)" : "",
  };
}
