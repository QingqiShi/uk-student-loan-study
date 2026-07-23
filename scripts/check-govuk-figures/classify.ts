import type { Mismatch, ScrapedPlanThreshold } from "./types";

/**
 * Guarded auto-merge gate for the daily GOV.UK figure check.
 *
 * A passing build proves the code compiles, not that a scraped figure is
 * correct — the tests never assert specific threshold or rate values. So the
 * automation only auto-merges a change made up entirely of *routine* figures
 * (repayment thresholds and the market rates that move often) whose new value is
 * plausible and whose move is small. Anything else falls back to a human-
 * reviewed PR: a structural field (repayment rate, write-off period, the Plan 2
 * sliding-scale interest thresholds), an out-of-bounds value, a large jump, a
 * non-positive rate, or a repayment threshold whose monthly and annual figures
 * disagree. This catches a mis-scrape — e.g. an annual repayment threshold of
 * £26,760 read as £2,676 — before it can reach production.
 */

interface FieldBound {
  /** Plausible absolute range for the scraped value. */
  min: number;
  max: number;
  /** Reject a move larger than this many percentage points (market rates). */
  maxAbsDelta?: number;
  /** Reject a move larger than this fraction of the current value (thresholds). */
  maxRelDelta?: number;
  /** Reject a non-positive value outright — for rates, 0 signals a parse failure. */
  rejectNonPositive?: boolean;
  /** Reject any decrease — repayment thresholds only ever rise or freeze. */
  increaseOnly?: boolean;
}

// Only these routine fields are eligible for auto-merge. Every other field —
// repayment rate, write-off period, the Plan 2 interest thresholds — is
// structural and legislative: a change there is rare and always deserves human
// review, so it is deliberately absent from this map (an unknown field reviews).
const AUTO_MERGE_BOUNDS: Record<string, FieldBound> = {
  // Monthly repayment thresholds (the annual value / 12). Annual thresholds sit
  // around £15k–£40k, so monthly ~£1,250–£3,333; annual upratings move a few
  // percent, so a >15% jump is treated as suspicious. Thresholds only ever rise
  // or freeze, so any decrease is anomalous and reviewed.
  "PLAN_1.monthlyThreshold": {
    min: 1250,
    max: 3333,
    maxRelDelta: 0.15,
    increaseOnly: true,
  },
  "PLAN_2.monthlyThreshold": {
    min: 1250,
    max: 3333,
    maxRelDelta: 0.15,
    increaseOnly: true,
  },
  "PLAN_4.monthlyThreshold": {
    min: 1250,
    max: 3333,
    maxRelDelta: 0.15,
    increaseOnly: true,
  },
  "PLAN_5.monthlyThreshold": {
    min: 1250,
    max: 3333,
    maxRelDelta: 0.15,
    increaseOnly: true,
  },
  "POSTGRADUATE.monthlyThreshold": {
    min: 1250,
    max: 3333,
    maxRelDelta: 0.15,
    increaseOnly: true,
  },
  // Market rates, as percentages. Plausible 0–20%; a single daily check rarely
  // sees a move beyond 2 points, and a bigger swing should be looked at. A zero
  // is almost always a placeholder from a failed parse, so it is rejected.
  "CURRENT_RATES.rpi": {
    min: 0,
    max: 20,
    maxAbsDelta: 2,
    rejectNonPositive: true,
  },
  "CURRENT_RATES.cpi": {
    min: 0,
    max: 20,
    maxAbsDelta: 2,
    rejectNonPositive: true,
  },
  "CURRENT_RATES.boeBaseRate": {
    min: 0,
    max: 20,
    maxAbsDelta: 2,
    rejectNonPositive: true,
  },
};

/** Reason this mismatch cannot auto-merge, or `null` when it is safe. */
function unsafeReason(m: Mismatch): string | null {
  const bound = AUTO_MERGE_BOUNDS[m.field];
  if (!bound) {
    return "structural field — always reviewed";
  }
  if (bound.rejectNonPositive && m.scraped <= 0) {
    return `non-positive value ${String(m.scraped)} — likely a parse failure`;
  }
  if (m.scraped < bound.min || m.scraped > bound.max) {
    return `value ${String(m.scraped)} outside the plausible range ${String(bound.min)}–${String(bound.max)}`;
  }
  if (bound.increaseOnly && m.scraped < m.current) {
    return `decreased from ${String(m.current)} to ${String(m.scraped)} — repayment thresholds only rise or freeze`;
  }
  if (bound.maxAbsDelta !== undefined) {
    const delta = Math.abs(m.scraped - m.current);
    if (delta > bound.maxAbsDelta) {
      return `moved ${delta.toFixed(2)} points (max ${String(bound.maxAbsDelta)})`;
    }
  }
  if (bound.maxRelDelta !== undefined) {
    if (m.current === 0) {
      return "current value is zero — cannot bound the move";
    }
    const rel = Math.abs(m.scraped - m.current) / m.current;
    if (rel > bound.maxRelDelta) {
      return `moved ${(rel * 100).toFixed(1)}% (max ${String(bound.maxRelDelta * 100)}%)`;
    }
  }
  return null;
}

/**
 * Every scraped threshold row must be internally consistent, whether or not its
 * monthly value changed — a bad annual figure still flows into the generated
 * files (llms.txt, comments). GOV.UK floors the monthly from the annual, so
 * `annual - monthly * 12` is a remainder in [0, 11]; anything outside that (a
 * negative remainder means monthly*12 exceeds the annual, which flooring can
 * never produce) means one of the two was mis-scraped.
 */
function thresholdRowIssues(thresholds: ScrapedPlanThreshold[]): string[] {
  const issues: string[] = [];
  for (const row of thresholds) {
    const remainder = row.yearlyThreshold - row.monthlyThreshold * 12;
    if (remainder < 0 || remainder >= 12) {
      issues.push(
        `${row.plan}.monthlyThreshold: monthly £${String(row.monthlyThreshold)} is inconsistent with annual £${String(row.yearlyThreshold)}`,
      );
    }
  }
  return issues;
}

export interface Classification {
  decision: "auto" | "review";
  /** Reasons that forced review; empty when the decision is "auto". */
  reviewReasons: string[];
}

/**
 * Classify a change for the guarded auto-merge. The decision is `auto` only
 * when *every* mismatch is a routine, in-bounds, small move **and** every
 * scraped threshold row is internally consistent; a single disqualifying field
 * or row sends the whole batch to `review`. `thresholds` are all scraped rows,
 * checked independently so a bad annual on an unchanged monthly can't ride
 * along with an otherwise-safe rate move.
 */
export function classifyChange(
  mismatches: Mismatch[],
  thresholds: ScrapedPlanThreshold[],
): Classification {
  const reviewReasons: string[] = [];
  for (const m of mismatches) {
    const reason = unsafeReason(m);
    if (reason) {
      reviewReasons.push(`${m.field}: ${reason}`);
    }
  }
  reviewReasons.push(...thresholdRowIssues(thresholds));
  return {
    decision: reviewReasons.length === 0 ? "auto" : "review",
    reviewReasons,
  };
}
