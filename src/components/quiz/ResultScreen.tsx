"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { Heading } from "@/components/typography/Heading";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { useLoanActions } from "@/context/LoanContext";
import { trackQuizCompleted, trackQuizRestarted } from "@/lib/analytics";
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

interface ResultScreenProps {
  planTypes: PlanType[];
  onRestart: () => void;
  direction: "forward" | "backward";
  onUseLoans?: () => void;
}

export function ResultScreen({
  planTypes,
  onRestart,
  direction,
  onUseLoans,
}: ResultScreenProps) {
  const { updateField } = useLoanActions();

  useEffect(() => {
    trackQuizCompleted(planTypes.join(","));
  }, [planTypes]);

  const handleRestart = () => {
    trackQuizRestarted();
    onRestart();
  };

  function handleStandaloneClick() {
    updateField("pendingQuizPlanTypes", planTypes);
  }

  return (
    <div
      className={
        direction === "backward"
          ? "animate-quiz-slide-in-reverse"
          : "animate-quiz-result-enter"
      }
      aria-live="polite"
    >
      <div className="text-center">
        <Eyebrow as="p" marker={false} className="mb-3 justify-center">
          {planTypes.length === 1 ? "Your plan type" : "Your plan types"}
        </Eyebrow>

        <Heading as="h1" size="page-hero" className="mb-2">
          {planTypes.map((p) => getPlanDisplayInfo(p).name).join(" + ")}
        </Heading>
      </div>

      <div className="mt-8 space-y-6">
        {planTypes.map((planType) => {
          const info = getPlanDisplayInfo(planType);
          return (
            <div key={planType} className="space-y-3">
              <Heading as="h2" size="subsection">
                {info.name}
              </Heading>
              <MetricReadout columns={3}>
                <MetricCell
                  label="Threshold / yr"
                  value={currencyFormatter.format(info.yearlyThreshold)}
                />
                <MetricCell
                  label="Repayment rate"
                  value={`${String(info.repaymentRate * 100)}%`}
                />
                <MetricCell
                  label="Write-off / yrs"
                  value={String(info.writeOffYears)}
                />
              </MetricReadout>
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-3">
        {onUseLoans ? (
          <Button size="lg" className="w-full" onClick={onUseLoans}>
            Use these loans →
          </Button>
        ) : (
          <Button
            size="lg"
            className="w-full"
            render={<Link href="/" />}
            nativeButton={false}
            onClick={handleStandaloneClick}
          >
            Enter your balances →
          </Button>
        )}

        <button
          type="button"
          onClick={handleRestart}
          className="w-full py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Not sure? Take the quiz again
        </button>
      </div>
    </div>
  );
}
