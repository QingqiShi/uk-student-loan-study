"use client";

import Link from "next/link";
import { useEffect } from "react";
import type { PlanType } from "@/lib/loans/types";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { useLoanActions } from "@/context/LoanContext";
import { trackQuizCompleted, trackQuizRestarted } from "@/lib/analytics";
import {
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";

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
        <p className="mb-3 text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {planTypes.length === 1 ? "Your plan type" : "Your plan types"}
        </p>

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {planTypes.map((p) => getPlanDisplayInfo(p).name).join(" + ")}
        </h1>
      </div>

      <div className="mt-8 space-y-4">
        {planTypes.map((planType) => {
          const info = getPlanDisplayInfo(planType);
          return (
            <div
              key={planType}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <h2 className="mb-4 text-lg font-semibold">{info.name}</h2>
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Repayment threshold</dt>
                  <dd className="font-semibold">
                    {currencyFormatter.format(info.yearlyThreshold)}/year
                  </dd>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Repayment rate</dt>
                  <dd className="font-semibold">
                    {String(info.repaymentRate * 100)}% of income above
                    threshold
                  </dd>
                </div>

                <div className="h-px bg-border" />

                <div className="flex items-center justify-between">
                  <dt className="text-muted-foreground">Write-off period</dt>
                  <dd className="font-semibold">{info.writeOffYears} years</dd>
                </div>
              </dl>
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
