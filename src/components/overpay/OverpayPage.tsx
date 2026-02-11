"use client";

import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OverpayComparisonChart } from "./OverpayComparisonChart";
import { OverpayPrimaryInputs } from "./OverpayPrimaryInputs";
import { OverpaySummaryCards } from "./OverpaySummaryCards";
import { OverpayVerdict } from "./OverpayVerdict";
import type { InputMode } from "@/components/InputPanel";
import type { Preset } from "@/lib/presets";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { InputPanel } from "@/components/InputPanel";
import { PlanFromQuery } from "@/components/PlanFromQuery";
import { SALARY_GROWTH_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { useOverpayAnalysis } from "@/hooks/useOverpayAnalysis";
import {
  trackPresetApplied,
  trackWizardCompleted,
  trackWizardRestarted,
  trackWizardStarted,
} from "@/lib/analytics";
import { REPAYMENT_START_MONTH } from "@/lib/presets";

export function OverpayPage() {
  const [repaymentDate, setRepaymentDate] = useState<Date>(
    () => new Date(new Date().getFullYear(), REPAYMENT_START_MONTH, 1),
  );
  const analysis = useOverpayAnalysis(repaymentDate);
  const [mode, setMode] = useState<InputMode>({ view: "summary" });
  const [hasPersonalized, setHasPersonalized] = useState(false);
  const { applyPreset } = useLoanActions();
  const config = useLoanConfigState();

  const growthLabel =
    SALARY_GROWTH_OPTIONS.find((o) => o.value === config.salaryGrowthRate)
      ?.label ?? `${(config.salaryGrowthRate * 100).toFixed(0)}%`;
  const thresholdInfo =
    config.thresholdGrowthRate === 0
      ? "Frozen thresholds"
      : `+${(config.thresholdGrowthRate * 100).toFixed(0)}%/yr threshold`;

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
    setMode({ view: "loan-wizard" });
  }

  function handleOpenAssumptions() {
    trackWizardStarted("assumptions");
    setMode({ view: "assumptions-wizard" });
  }

  function handleWizardComplete() {
    trackWizardCompleted("loan");
    setHasPersonalized(true);
    setMode({ view: "summary" });
  }

  function handleAssumptionsComplete() {
    trackWizardCompleted("assumptions");
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

        <InputPanel
          hasPersonalized={hasPersonalized}
          mode={mode}
          onPersonalise={handlePersonalise}
          onPresetApplied={handlePresetApplied}
          onWizardComplete={handleWizardComplete}
          onAssumptionsComplete={handleAssumptionsComplete}
          onWizardClose={handleWizardClose}
          onOpenAssumptions={handleOpenAssumptions}
        />

        <OverpayVerdict
          recommendation={analysis.recommendation}
          reason={analysis.recommendationReason}
          showDisclaimer={analysis.overpaymentContributions > 0}
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

        <button
          type="button"
          onClick={handleOpenAssumptions}
          className="text-sm text-primary underline-offset-4 hover:underline"
          aria-label="Edit growth assumptions"
        >
          {growthLabel} salary growth &middot; {thresholdInfo} &rarr;
        </button>
      </main>
      <Footer />
    </div>
  );
}
