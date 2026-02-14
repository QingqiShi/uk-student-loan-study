"use client";

import { useEffect, useState } from "react";
import { InputPanel } from "./InputPanel";
import { ResultSummary } from "./ResultSummary";
import { SalaryExplorer } from "./SalaryExplorer";
import type { InputMode } from "./InputPanel";
import type { Preset } from "@/lib/presets";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import {
  trackPresetApplied,
  trackWizardCompleted,
  trackWizardRestarted,
  trackWizardStarted,
} from "@/lib/analytics";

export function HeroSection() {
  const { applyPreset, updateField } = useLoanActions();
  const { pendingQuizPlanTypes } = useLoanConfigState();

  const [mode, setMode] = useState<InputMode>(() => {
    if (pendingQuizPlanTypes && pendingQuizPlanTypes.length > 0) {
      return { view: "loan-config", initialPlanTypes: pendingQuizPlanTypes };
    }
    return { view: "summary" };
  });
  const [hasPersonalized, setHasPersonalized] = useState(false);

  useEffect(() => {
    if (pendingQuizPlanTypes && pendingQuizPlanTypes.length > 0) {
      updateField("pendingQuizPlanTypes", null);
    }
  }, [pendingQuizPlanTypes, updateField]);

  useEffect(() => {
    if (mode.view !== "summary") {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mode.view]);

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
    setHasPersonalized(true);
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
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]">
          Student Loans Hurt{" "}
          <span className="text-primary">Middle Earners</span> Most
        </h1>
        <ul className="max-w-2xl space-y-1 text-sm text-muted-foreground sm:text-base">
          <li className="flex items-baseline gap-2">
            <span
              className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary/40"
              aria-hidden="true"
            />
            Low earners get their loans written off.
          </li>
          <li className="flex items-baseline gap-2">
            <span
              className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary/40"
              aria-hidden="true"
            />
            High earners pay them off quickly.
          </li>
          <li className="flex items-baseline gap-2 text-foreground">
            <span
              className="size-1.5 shrink-0 -translate-y-px rounded-full bg-primary"
              aria-hidden="true"
            />
            Middle earners pay the most in total - and the most interest.
          </li>
        </ul>
      </div>

      <InputPanel
        hasPersonalized={hasPersonalized}
        mode={mode}
        onPersonalise={handlePersonalise}
        onPresetApplied={handlePresetApplied}
        onWizardComplete={handleWizardComplete}
        onWizardClose={handleWizardClose}
      />

      <div className="space-y-4">
        <ResultSummary />
        <SalaryExplorer />
      </div>
    </section>
  );
}
