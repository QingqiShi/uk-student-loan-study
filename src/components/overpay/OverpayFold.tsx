"use client";

import { FOLD_PAD, SHELL_GUTTER } from "@/lib/layout";
import type { OverpayAnalysisResult } from "@/lib/loans/overpayTypes";
import { OverpayComparisonChart } from "./OverpayComparisonChart";
import { OverpayControls } from "./OverpayControls";
import { OverpayLedger } from "./OverpayLedger";
import { OverpayNameplate } from "./OverpayNameplate";
import { OverpayPremise } from "./OverpayPremise";
import { OverpayVerdict } from "./OverpayVerdict";

const DISCLAIMER =
  "This is an estimate, not financial advice. Consider speaking to a financial adviser.";

interface OverpayFoldProps {
  /** Null while the simulation worker resolves; every zone holds its place. */
  analysis: OverpayAnalysisResult | null;
}

/**
 * The overpay instrument.
 *
 * This page is not an argument, it is a decision: two futures for the same
 * loan, and one lever set that picks between them. So the fold is two stacks
 * rather than the homepage's head/chart/readout ladder — a rail carrying the
 * answer and the levers that produce it, and beside it the evidence: the curve,
 * and the same comparison resolved into figures directly beneath it.
 *
 * Each column flows on its own height, so the rail never has to reach the
 * chart's and no zone is left holding a void.
 *
 * The rail's two halves swap order at `wide`. Stacked, the rail is read one
 * item after another, and a verdict that arrives before the loan and the
 * overpayment it was computed from is a claim with no premise — so the source
 * order is premise → console → verdict. On a wide screen both are visible at
 * once, so the answer can lead and `order` lifts it above the console.
 */
export function OverpayFold({ analysis }: OverpayFoldProps) {
  return (
    <section
      className={`${SHELL_GUTTER} ${FOLD_PAD}`}
      aria-label="Overpayment comparison"
    >
      <OverpayNameplate />

      {/* The split waits for `wide`: below it the rail would be too narrow to
          hold the console at a sensible height, and it would tower over a short
          evidence column. Stacked, the chart gets the full bleed instead. */}
      <div className="mt-[clamp(1.2rem,2.6vw,2.4rem)] grid items-start gap-x-[clamp(2rem,3vw,4rem)] gap-y-[clamp(1.8rem,2.8vw,2.6rem)] wide:grid-cols-[minmax(24rem,0.85fr)_minmax(0,1.15fr)] work:grid-cols-[minmax(24rem,0.62fr)_minmax(0,1.38fr)] ultra:grid-cols-[minmax(28rem,0.52fr)_minmax(0,1.48fr)]">
        {/* Source order IS the meaningful sequence — scenario, then verdict —
            so a screen reader, a reader mode or a text-only render never meets
            the answer before the figures it was computed from. `order` is only
            ever used to lift the verdict from `wide` up, where the rail shows
            both at once and the answer can lead. Nothing focusable lives in the
            verdict, so tab order is unaffected either way. */}
        <div className="flex min-w-0 flex-col gap-[clamp(1.2rem,2.2vw,2rem)]">
          {/* The scenario: whose loan, and what overpayment. A hairline closes
              it off from the verdict — above the answer on a phone, below it on
              a wide screen, the way an instrument face separates its controls
              from its display. */}
          <div className="border-b border-border pb-[clamp(1.2rem,2.2vw,2rem)] wide:order-2 wide:border-t wide:border-b-0 wide:pt-[clamp(1.2rem,2.2vw,2rem)] wide:pb-0">
            <OverpayPremise />
            <div className="mt-[clamp(0.9rem,1.6vw,1.3rem)]">
              <OverpayControls />
            </div>
          </div>

          <OverpayVerdict analysis={analysis} className="wide:order-1" />

          <p className="max-w-[52ch] font-sans text-meta leading-[1.6] text-muted-foreground wide:order-3">
            {DISCLAIMER}
          </p>
        </div>

        <div className="flex min-w-0 flex-col gap-[clamp(1rem,1.6vw,1.4rem)]">
          {/* Fixed heights rather than the chart's own aspect ratio: the panel
              has to pair with the ledger below it, not grow with the column. */}
          <div className="h-56 sm:h-80 roomy:h-[clamp(21rem,26vw,32rem)]">
            <OverpayComparisonChart analysis={analysis} />
          </div>

          <OverpayLedger analysis={analysis} />
        </div>
      </div>
    </section>
  );
}
