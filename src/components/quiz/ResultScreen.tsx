"use client";

import Link from "next/link";
import type { UndergraduatePlanType } from "@/lib/loans/types";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { PLAN_DISPLAY_INFO } from "@/lib/loans/plans";

interface ResultScreenProps {
  planType: UndergraduatePlanType;
  onRestart: () => void;
  direction: "forward" | "backward";
}

export function ResultScreen({
  planType,
  onRestart,
  direction,
}: ResultScreenProps) {
  const planInfo = PLAN_DISPLAY_INFO[planType];
  const calculatorUrl = `/?plan=${planType}`;

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
          Your plan type
        </p>

        <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          {planInfo.name}
        </h1>

        <p className="text-muted-foreground">{planInfo.description}</p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <dl className="space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Repayment threshold</dt>
            <dd className="font-semibold">
              {currencyFormatter.format(planInfo.yearlyThreshold)}/year
            </dd>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Repayment rate</dt>
            <dd className="font-semibold">
              {String(planInfo.repaymentRate * 100)}% of income above threshold
            </dd>
          </div>

          <div className="h-px bg-border" />

          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Write-off period</dt>
            <dd className="font-semibold">{planInfo.writeOffYears} years</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          size="lg"
          className="w-full"
          render={<Link href={calculatorUrl} />}
          nativeButton={false}
        >
          Calculate your repayments →
        </Button>

        <button
          type="button"
          onClick={onRestart}
          className="w-full py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Not sure? Take the quiz again
        </button>
      </div>
    </div>
  );
}
