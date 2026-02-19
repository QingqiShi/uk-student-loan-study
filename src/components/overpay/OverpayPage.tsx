"use client";

import { useEffect, useState } from "react";
import { OverpayComparisonChart } from "./OverpayComparisonChart";
import { OverpayPrimaryInputs } from "./OverpayPrimaryInputs";
import { OverpaySummaryCards } from "./OverpaySummaryCards";
import { OverpayVerdict } from "./OverpayVerdict";
import type { InputMode } from "@/components/InputPanel";
import type { Preset } from "@/lib/presets";
import { AssumptionsCallout } from "@/components/AssumptionsCallout";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InputPanel } from "@/components/InputPanel";
import { PlanFromQuery } from "@/components/PlanFromQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { useOverpayAnalysis } from "@/hooks/useOverpayAnalysis";
import {
  trackPresetApplied,
  trackWizardCompleted,
  trackWizardRestarted,
  trackWizardStarted,
} from "@/lib/analytics";
import { isPresetConfig, REPAYMENT_START_MONTH } from "@/lib/presets";

function OverpayPageSkeleton() {
  return (
    <>
      {/* Verdict skeleton */}
      <Skeleton className="h-28 w-full rounded-lg" />

      {/* Chart + cards grid skeleton */}
      <div className="grid gap-6 md:flex">
        <div className="h-65 min-w-0 sm:h-75 md:h-auto md:min-h-75 md:flex-1">
          <Skeleton className="size-full" />
        </div>
        <div className="-mx-4 flex gap-3 px-4 py-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:p-1 md:w-65 md:shrink-0 md:grid-cols-1">
          <Skeleton className="h-36 min-w-50 shrink-0 sm:min-w-0" />
          <Skeleton className="h-36 min-w-50 shrink-0 sm:min-w-0" />
          <Skeleton className="h-36 min-w-50 shrink-0 sm:min-w-0" />
        </div>
      </div>
    </>
  );
}

export function OverpayPage() {
  const [repaymentDate, setRepaymentDate] = useState<Date>(
    () => new Date(new Date().getFullYear(), REPAYMENT_START_MONTH, 1),
  );
  const analysis = useOverpayAnalysis(repaymentDate);
  const [mode, setMode] = useState<InputMode>({ view: "summary" });
  const { applyPreset } = useLoanActions();
  const config = useLoanConfigState();
  const hasPersonalized = !isPresetConfig(config.loans);

  useEffect(() => {
    if (mode.view !== "summary") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mode.view]);

  const handleRepaymentYearChange = (year: number) => {
    setRepaymentDate(new Date(year, REPAYMENT_START_MONTH, 1));
  };

  function handlePersonalise() {
    if (hasPersonalized) {
      trackWizardRestarted("loan");
    } else {
      trackWizardStarted("loan");
    }
    setMode({ view: "loan-config" });
  }

  function handleWizardComplete() {
    trackWizardCompleted("loan");
    setMode({ view: "summary" });
  }

  function handlePresetApplied(preset: Preset) {
    trackPresetApplied(preset.id);
    applyPreset(preset);
    setMode({ view: "summary" });
  }

  function handleWizardClose() {
    setMode({ view: "summary" });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <PlanFromQuery onRepaymentYearChange={handleRepaymentYearChange} />
      <Header repaymentYear={repaymentDate.getFullYear()} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-6 overflow-x-hidden px-3 pt-13 pb-6 md:pb-8"
      >
        <div className="space-y-4">
          <Breadcrumb currentTitle="Overpay Calculator" />

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Should You Overpay?
            </h2>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              See how much overpaying could save you.
            </p>
          </div>
        </div>

        <InputPanel
          hasPersonalized={hasPersonalized}
          mode={mode}
          onPersonalise={handlePersonalise}
          onPresetApplied={handlePresetApplied}
          onWizardComplete={handleWizardComplete}
          onWizardClose={handleWizardClose}
        />

        {analysis ? (
          <>
            <OverpayVerdict
              recommendation={analysis.recommendation}
              reason={analysis.recommendationReason}
            />

            <div className="grid gap-6 md:flex">
              <div className="h-65 min-w-0 sm:h-75 md:h-auto md:min-h-75 md:flex-1">
                <OverpayComparisonChart analysis={analysis} />
              </div>
              <div className="min-w-0 md:w-65 md:shrink-0">
                <OverpaySummaryCards analysis={analysis} />
              </div>
            </div>
          </>
        ) : (
          <OverpayPageSkeleton />
        )}

        <OverpayPrimaryInputs
          repaymentDate={repaymentDate}
          onRepaymentDateChange={setRepaymentDate}
        />

        <AssumptionsCallout />
      </main>
      <Footer />
    </div>
  );
}
