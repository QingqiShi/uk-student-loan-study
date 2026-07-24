"use client";

import { ArrowLeft01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useId } from "react";
import { MetricReadout } from "@/components/instrument/MetricReadout";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Figure } from "@/components/typography/Figure";
import { Heading } from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { useLoanActions } from "@/context/LoanContext";
import { trackQuizRestarted } from "@/lib/analytics";
import {
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";
import type { PlanType } from "@/lib/loans/types";

function getPlanDisplayInfo(planType: PlanType) {
  if (planType === "POSTGRADUATE") {
    return POSTGRADUATE_DISPLAY_INFO;
  }
  return PLAN_DISPLAY_INFO[planType];
}

/**
 * One cell of the result's {@link MetricReadout}. Kept local rather than using
 * `MetricCell` because of the phone layout: the three cells stack as a
 * label-left / value-right spec list (a 7-glyph mono figure like "£26,892" can't
 * survive a ~100px column), then revert to a stacked 3-up grid at `sm`. The label
 * and figure treatment mirrors `MetricCell`'s.
 */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 bg-card px-4 py-3.5 sm:block">
      <span className="block font-sans text-xs font-semibold tracking-label text-muted-foreground uppercase">
        {label}
      </span>
      <span className="block font-mono text-xl font-semibold tracking-tight text-foreground tabular-nums sm:mt-1.5">
        <Figure value={value} />
      </span>
    </div>
  );
}

interface ResultScreenProps {
  planTypes: PlanType[];
  /** Human-readable recap of the answers that led here, e.g. ["England", …]. */
  recap: string[];
  onRestart: () => void;
  /** Re-enter the quiz from the first question (answers preserved) to revise. */
  onEditAnswers: () => void;
  onUseLoans?: () => void;
}

export function ResultScreen({
  planTypes,
  recap,
  onRestart,
  onEditAnswers,
  onUseLoans,
}: ResultScreenProps) {
  const { updateField } = useLoanActions();
  const recapId = useId();

  const handleRestart = () => {
    trackQuizRestarted();
    onRestart();
  };

  function handleStandaloneClick() {
    updateField("pendingQuizPlanTypes", planTypes);
  }

  const names = planTypes.map((p) => getPlanDisplayInfo(p).name);
  const isMulti = names.length > 1;
  // Natural-language join so a combined result reads as prose, not arithmetic:
  // "Plan 2, Plan 5 & Postgraduate" rather than "Plan 2 + Plan 5 + Postgraduate".
  const joinedNames = isMulti
    ? `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}`
    : names[0];

  // Staggered reveal: each block rises in turn (see globals.css). Delays step
  // through the badge → eyebrow → answer → recap → readouts → actions.
  const delay = (ms: number) => ({ animationDelay: `${String(ms)}ms` });
  const readoutStart = 260;
  const actionsDelay = readoutStart + planTypes.length * 80 + 40;

  return (
    <>
      <div className="text-center">
        <div
          className="mx-auto mb-5 flex size-14 animate-quiz-result-badge items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-hidden="true"
        >
          <HugeiconsIcon
            icon={Tick02Icon}
            className="size-7"
            strokeWidth={2.5}
          />
        </div>

        <Eyebrow
          as="p"
          marker={false}
          className="animate-quiz-result-item justify-center"
          style={delay(60)}
        >
          {isMulti ? "Your plan types" : "Your plan type"}
        </Eyebrow>

        <Heading
          as="h2"
          size="page"
          data-step-heading
          tabIndex={-1}
          aria-describedby={recap.length > 0 ? recapId : undefined}
          className="mt-2 animate-quiz-result-item outline-none"
          style={delay(130)}
        >
          {joinedNames}
        </Heading>

        {recap.length > 0 && (
          <p
            id={recapId}
            className="mx-auto mt-3 max-w-sm animate-quiz-result-item text-sm text-muted-foreground"
            style={delay(200)}
          >
            Matched from your answers: {recap.join(" · ")}
          </p>
        )}
      </div>

      <div className="mt-7 space-y-4">
        {planTypes.map((planType, idx) => {
          const info = getPlanDisplayInfo(planType);
          return (
            <div
              key={planType}
              className="animate-quiz-result-item"
              style={delay(readoutStart + idx * 80)}
            >
              {/* Only label each block when there are several loans to tell
                  apart — for a single plan the heading above already names it.
                  An h3 (under the result's h2) keeps each loan reachable by
                  screen-reader heading navigation. */}
              {isMulti && (
                <Heading as="h3" size="subsection" className="mb-2">
                  {info.name}
                </Heading>
              )}
              <MetricReadout columns={3}>
                <Stat
                  label="Threshold / yr"
                  value={currencyFormatter.format(info.yearlyThreshold)}
                />
                <Stat
                  label="Repayment rate"
                  value={`${String(info.repaymentRate * 100)}%`}
                />
                <Stat
                  label="Write-off / yrs"
                  value={String(info.writeOffYears)}
                />
              </MetricReadout>
            </div>
          );
        })}
      </div>

      <div
        className="mt-8 animate-quiz-result-item space-y-4"
        style={delay(actionsDelay)}
      >
        {onUseLoans ? (
          <Button size="lg" className="min-h-11 w-full" onClick={onUseLoans}>
            Use these loans →
          </Button>
        ) : (
          <Button
            size="lg"
            className="min-h-11 w-full"
            render={<Link href="/" />}
            nativeButton={false}
            onClick={handleStandaloneClick}
          >
            Enter your balances →
          </Button>
        )}

        <div className="flex items-center justify-center gap-2 text-sm">
          <button
            type="button"
            onClick={onEditAnswers}
            className="inline-flex items-center gap-1 p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Change your answers
          </button>
          <span aria-hidden="true" className="text-faint">
            ·
          </span>
          <button
            type="button"
            onClick={handleRestart}
            className="p-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            Start over
          </button>
        </div>
      </div>
    </>
  );
}
