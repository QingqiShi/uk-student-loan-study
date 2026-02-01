"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import { OverpayComparisonChart } from "./OverpayComparisonChart";
import { OverpayPrimaryInputs } from "./OverpayPrimaryInputs";
import { OverpaySecondaryInputs } from "./OverpaySecondaryInputs";
import { OverpaySummaryCards } from "./OverpaySummaryCards";
import { OverpayVerdict } from "./OverpayVerdict";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PlanFromQuery } from "@/components/PlanFromQuery";
import { useOverpayAnalysis } from "@/hooks/useOverpayAnalysis";
import { REPAYMENT_START_MONTH } from "@/lib/presets";

export function OverpayPage() {
  const [repaymentDate, setRepaymentDate] = useState<Date>(
    () => new Date(new Date().getFullYear(), REPAYMENT_START_MONTH, 1),
  );
  const analysis = useOverpayAnalysis(repaymentDate);

  const handleRepaymentYearChange = (year: number) => {
    setRepaymentDate(new Date(year, REPAYMENT_START_MONTH, 1));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <PlanFromQuery onRepaymentYearChange={handleRepaymentYearChange} />
      <Header repaymentYear={repaymentDate.getFullYear()} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-6 overflow-x-hidden px-4 py-6 md:px-6 md:py-8"
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
              See how much overpaying could save you.
            </p>
          </div>
        </div>

        <OverpayVerdict
          recommendation={analysis.recommendation}
          reason={analysis.recommendationReason}
        />

        <div className="grid gap-6 md:grid-cols-[1fr_260px]">
          <div className="h-[260px] min-w-0 sm:h-[300px] md:h-auto md:min-h-[300px]">
            <OverpayComparisonChart analysis={analysis} />
          </div>
          <div className="min-w-0">
            <OverpaySummaryCards analysis={analysis} />
          </div>
        </div>

        <OverpayPrimaryInputs
          repaymentDate={repaymentDate}
          onRepaymentDateChange={setRepaymentDate}
        />

        <OverpaySecondaryInputs />
      </main>
      <Footer />
    </div>
  );
}
