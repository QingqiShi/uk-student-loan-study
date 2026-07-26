"use client";

import {
  Alert02Icon,
  Cancel01Icon,
  InformationCircleIcon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Figure } from "@/components/typography/Figure";
import { Skeleton } from "@/components/ui/skeleton";
import { currencyFormatter } from "@/constants";
import { ENGRAVED_LABEL } from "@/lib/layout";
import type {
  OverpayAnalysisResult,
  RecommendationType,
} from "@/lib/loans/overpayTypes";
import { cn } from "@/lib/utils";
import { formatYears, isPresentValue } from "./figures";

/**
 * The verdict sits flat on the paper: size and colour carry it, not a tinted
 * box. Ink means the comparison came out level, spruce means overpaying wins,
 * clay means it costs you — the One-Signal Rule doing the work the old card's
 * background used to do.
 */
const verdictConfig: Record<
  RecommendationType,
  { title: string; accent: string; icon: typeof Alert02Icon }
> = {
  "dont-overpay": {
    title: "Overpaying costs more",
    accent: "text-signal",
    icon: Cancel01Icon,
  },
  overpay: {
    title: "Overpaying saves money",
    accent: "text-cta",
    icon: Tick02Icon,
  },
  marginal: {
    title: "Marginal difference",
    accent: "text-foreground",
    icon: Alert02Icon,
  },
  idle: {
    title: "Ready to compare",
    accent: "text-foreground",
    icon: InformationCircleIcon,
  },
};

/**
 * Representative worst cases, rendered invisibly into the same grid cell as the
 * live verdict so it reserves its tallest realistic height at every width.
 * Without this, dragging the slider across a recommendation boundary swings the
 * reason by two lines and shoves whatever sits after the verdict — the levers at
 * `wide`, the chart and ledger when stacked. The reasons mirror the longest
 * templates in determineRecommendation; keep them in sync if that copy changes.
 */
const sizerVariants = [
  {
    key: "marginal",
    reason:
      "A lump sum of £10,000 and £250/month overpayment would only cost an extra £999. Other factors like flexibility and peace of mind may be worth considering.",
  },
  {
    key: "written-off",
    reason:
      "Without overpaying, £123,456 would be written off. A lump sum of £10,000 and £250/month overpayment would increase total repayments by £12,345.",
  },
];

/** Below this the two scenarios are level, and a signed figure would be noise. */
const LEVEL_TOLERANCE_GBP = 1;

/**
 * The deciding figure — always the *nominal* difference, the same basis
 * `determineRecommendation` used to pick the title above it. A present-value
 * difference here would routinely carry the opposite sign to the title, so the
 * block would assert both conclusions at once; the ledger is where the
 * discounted totals live, explicitly labelled.
 */
function VerdictHeadline({
  difference,
  monthsSaved,
  baselineWrittenOff,
  recommendation,
  discloseNominal,
}: {
  /** Nominal `paymentDifference`: positive when overpaying repays less. */
  difference: number;
  monthsSaved: number;
  /** When the baseline is written off there is no payoff date to beat. */
  baselineWrittenOff: boolean;
  recommendation: RecommendationType;
  /** True when the ledger beside this is showing present value instead. */
  discloseNominal: boolean;
}) {
  // `marginal` means the engine judged the gap too small to act on (under
  // £1,000 and under 10%). Setting that gap at `fig-hero` in the clay cost
  // signal would shout the opposite of the title and the reason either side of
  // it — the sentence already carries the number.
  if (recommendation === "marginal") return null;

  // Exact equality would let a sub-pound delta through and render the page's
  // largest figure as "£0 less repaid" under a title claiming a direction.
  if (Math.abs(difference) < LEVEL_TOLERANCE_GBP) return null;

  const costsMore = difference < 0;

  return (
    <p className="mt-3 flex flex-wrap items-baseline gap-x-[0.7rem] gap-y-[0.15rem]">
      <span
        className={cn(
          "font-mono text-fig-hero font-semibold tracking-tight tabular-nums",
          costsMore ? "text-signal" : "text-cta",
        )}
      >
        <Figure value={currencyFormatter.format(Math.abs(difference))} />
      </span>
      <span className="font-sans text-meta text-muted-foreground">
        {costsMore ? "more repaid" : "less repaid"}
        {/* Named only when it could be mistaken for the ledger's basis: this
            figure is always nominal, because the recommendation above it is,
            and unlabelled it would not reconcile with two totals marked
            "(present value)". "nominal" is CONTEXT.md's term for that state. */}
        {discloseNominal && " · nominal"}
        {/* Only when the baseline genuinely pays the loan off. If it is written
            off instead, its "payoff" month is the write-off date, and calling
            that beaten by N years would blur write-off into paid off — the two
            outcomes CONTEXT.md is explicit are opposites. */}
        {monthsSaved > 0 && !baselineWrittenOff && (
          <>
            {" · paid off "}
            <span className="font-mono text-foreground tabular-nums">
              {formatYears(monthsSaved)}
            </span>
            {" sooner"}
          </>
        )}
      </span>
    </p>
  );
}

interface VerdictBodyProps {
  icon: typeof Alert02Icon;
  accent: string;
  title: string;
  reason: string;
  headline: React.ReactNode;
}

function VerdictBody({
  icon,
  accent,
  title,
  reason,
  headline,
}: VerdictBodyProps) {
  return (
    <>
      {/* Engraved key: the one instrument label in the fold, so it reads as the
          name of this readout rather than as an eyebrow over a heading. */}
      <p className={cn("flex items-center gap-2", ENGRAVED_LABEL)}>
        <HugeiconsIcon
          icon={icon}
          className={cn("size-4 shrink-0", accent)}
          strokeWidth={2}
        />
        Verdict
      </p>
      {/* Set above the h1 deliberately: the page's name is a signpost, the
          verdict is the answer, and it is the thing the levers change. */}
      <p
        className={cn(
          "mt-2 text-page font-bold tracking-heading text-balance",
          accent,
        )}
      >
        {title}
      </p>
      {headline}
      <p className="mt-3 max-w-[46ch] text-body leading-[1.55] text-pretty text-muted-foreground">
        {reason}
      </p>
    </>
  );
}

function VerdictSizers() {
  return (
    <>
      {sizerVariants.map(({ key, reason }) => (
        <div
          key={key}
          aria-hidden
          // At every width. Stacked, the console above the verdict is safe
          // either way, but the chart and ledger *below* it are the figures the
          // reader drags the slider to watch — and the reason text swings by
          // two lines as the recommendation changes, which would shove them.
          className="invisible col-start-1 row-start-1"
        >
          <VerdictBody
            icon={verdictConfig.overpay.icon}
            accent={verdictConfig.overpay.accent}
            title={verdictConfig.overpay.title}
            reason={reason}
            headline={
              <VerdictHeadline
                difference={123456}
                monthsSaved={50}
                baselineWrittenOff={false}
                recommendation="overpay"
                discloseNominal
              />
            }
          />
        </div>
      ))}
    </>
  );
}

/**
 * Sized to a typical loaded verdict — a two-line title, the figure and a
 * three-line reason — so the swap from skeleton to result lands close to where
 * the sizers already hold the block.
 */
function VerdictSkeleton() {
  return (
    <div
      aria-hidden
      className="col-start-1 row-start-1 flex flex-col gap-[0.6rem] self-start"
    >
      <Skeleton className="h-3.5 w-16" />
      <Skeleton className="h-9 w-full max-w-72" />
      <Skeleton className="h-9 w-48" />
      <Skeleton className="mt-1 h-4 w-full max-w-[46ch]" />
      <Skeleton className="h-4 w-full max-w-[46ch]" />
      <Skeleton className="h-4 w-full max-w-80" />
    </div>
  );
}

/**
 * The answer, and the page's primary display. `self-start` lets the verdict hug
 * its own copy while the invisible sizers hold the tallest realistic height, so
 * the slack lands as paper under the verdict rather than shifting whatever
 * follows it.
 */
export function OverpayVerdict({
  analysis,
  className,
}: {
  /** Null while the simulation worker resolves — the block holds its place. */
  analysis: OverpayAnalysisResult | null;
  className?: string;
}) {
  const config = analysis
    ? verdictConfig[analysis.recommendation]
    : verdictConfig.idle;

  return (
    <div className={cn("grid", className)}>
      {analysis ? (
        <div
          role="status"
          aria-live="polite"
          className="col-start-1 row-start-1 self-start"
        >
          <VerdictBody
            icon={config.icon}
            accent={config.accent}
            title={config.title}
            reason={analysis.recommendationReason}
            headline={
              <VerdictHeadline
                difference={analysis.paymentDifference}
                monthsSaved={Math.max(0, analysis.monthsSaved)}
                baselineWrittenOff={analysis.baseline.writtenOff}
                recommendation={analysis.recommendation}
                discloseNominal={isPresentValue(analysis)}
              />
            }
          />
        </div>
      ) : (
        <VerdictSkeleton />
      )}
      <VerdictSizers />
    </div>
  );
}
