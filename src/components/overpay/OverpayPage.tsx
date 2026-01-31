"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { OverpayComparisonChart } from "./OverpayComparisonChart";
import { OverpayInputs } from "./OverpayInputs";
import { OverpaySummaryCards } from "./OverpaySummaryCards";
import { OverpayVerdict } from "./OverpayVerdict";
import { FloatingHeader } from "@/components/FloatingHeader";
import { useOverpayAnalysis } from "@/hooks/useOverpayAnalysis";

export function OverpayPage() {
  const analysis = useOverpayAnalysis();

  return (
    <div className="flex min-h-screen flex-col">
      <FloatingHeader />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 px-4 py-6 md:px-6 md:py-8"
      >
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to Calculator
          </Link>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Should You Overpay?
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Most graduates won&apos;t fully repay before write-off. See if
              overpaying helps or if you&apos;d be better off investing.
            </p>
          </div>
        </div>

        <div className="h-[300px] sm:h-[350px]">
          <OverpayComparisonChart analysis={analysis} />
        </div>

        <OverpayInputs />

        <OverpayVerdict
          recommendation={analysis.recommendation}
          reason={analysis.recommendationReason}
        />

        <OverpaySummaryCards analysis={analysis} />
      </main>
    </div>
  );
}

export default OverpayPage;
