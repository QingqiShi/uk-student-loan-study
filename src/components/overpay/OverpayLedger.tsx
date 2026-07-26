"use client";

import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { currencyFormatter } from "@/constants";
import type { OverpayAnalysisResult } from "@/lib/loans/overpayTypes";
import type { ScenarioResult } from "@/lib/loans/overpayTypes";
import { cn } from "@/lib/utils";
import {
  DetailRow,
  DetailRowsSkeleton,
  formatYears,
  ledgerTotals,
} from "./figures";

interface OverpayLedgerProps {
  /** Null while the simulation worker resolves — cells render their skeletons. */
  analysis: OverpayAnalysisResult | null;
}

/**
 * The scenario key — the chart's own line, reused as the bullet on the column
 * it belongs to.
 */
function ScenarioKey({
  line,
  children,
}: {
  line: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={cn("h-0.5 w-3.5 shrink-0 rounded-full", line)}
      />
      {children}
    </span>
  );
}

/**
 * A scenario's two detail rows. Both arms always render exactly two — payoff
 * time and the outcome — so `DetailRowsSkeleton rows={2}` is a true height
 * match and the ledger doesn't shrink when the worker's result lands.
 */
function ScenarioDetail({
  scenario,
  isWin,
}: {
  scenario: ScenarioResult;
  /** Spruce the payoff only when this arm clears a loan the other never does. */
  isWin: boolean;
}) {
  // An empty analysis (no balance configured yet) reports zeros with
  // `writtenOff` false. Nothing was repaid, so claiming "Paid off" — which
  // CONTEXT.md defines as fully clearing the loan by paying it down — would be
  // a success message for a loan the user has not entered.
  const ran = scenario.totalPaid > 0 || scenario.monthsToPayoff > 0;

  return (
    <div className="max-w-64 space-y-1">
      {/* `monthsToPayoff` is the month the arm stops paying, which is a payoff
          date only when the loan was actually cleared — on a written-off arm it
          is the end of the term. Labelling that "Payoff time" would blur the two
          outcomes CONTEXT.md is explicit are opposites. */}
      <DetailRow
        label={scenario.writtenOff ? "Repaying for" : "Payoff time"}
        value={formatYears(scenario.monthsToPayoff)}
      />
      {scenario.writtenOff ? (
        <DetailRow
          label="Written off"
          value={currencyFormatter.format(scenario.amountWrittenOff)}
          tone="muted"
        />
      ) : (
        <DetailRow
          label="Status"
          value={ran ? "Paid off" : "—"}
          tone={ran && isWin ? "outcome" : "muted"}
        />
      )}
    </div>
  );
}

/**
 * The two futures, facing each other — ONE bordered panel split by a hairline
 * seam into the baseline scenario and the overpay scenario, carrying the same
 * keys on both sides so the eye compares straight across.
 *
 * It takes the chart's two line colours on its column keys, so sitting directly
 * beneath the chart it also serves as the legend: the same comparison, resolved
 * from a curve into figures. The difference between the two columns is not
 * repeated here — that is the verdict's job.
 */
export function OverpayLedger({ analysis }: OverpayLedgerProps) {
  const totals = ledgerTotals(analysis);
  const loading = analysis == null;
  const pvSuffix = totals?.pvSuffix ?? "";

  return (
    <MetricReadout columns={2} aria-live="polite">
      <MetricCell
        label={
          <ScenarioKey line="bg-chart-overpay-baseline">
            Without overpaying{pvSuffix}
          </ScenarioKey>
        }
        value={
          totals &&
          `${currencyFormatter.format(totals.baselineTotalRepaid)} repaid`
        }
        loading={loading}
        skeleton={<DetailRowsSkeleton rows={2} />}
      >
        {analysis && (
          <ScenarioDetail scenario={analysis.baseline} isWin={false} />
        )}
      </MetricCell>

      <MetricCell
        label={
          <ScenarioKey line="bg-chart-1">With overpaying{pvSuffix}</ScenarioKey>
        }
        value={
          totals &&
          `${currencyFormatter.format(totals.overpayTotalRepaid)} repaid`
        }
        loading={loading}
        skeleton={<DetailRowsSkeleton rows={2} />}
      >
        {analysis && (
          <ScenarioDetail
            scenario={analysis.overpay}
            isWin={analysis.baseline.writtenOff}
          />
        )}
      </MetricCell>
    </MetricReadout>
  );
}
