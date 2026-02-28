import { useEffect, useState } from "react";
import type { PlanType } from "@/lib/loans/types";
import type { Preset } from "@/lib/presets";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import {
  trackPresetApplied,
  trackWizardCompleted,
  trackWizardRestarted,
  trackWizardStarted,
} from "@/lib/analytics";
import { isPresetConfig } from "@/lib/presets";

export type InputMode =
  | { view: "summary" }
  | { view: "loan-config"; initialPlanTypes?: PlanType[] };

interface UseInputPanelModeOptions {
  initialMode?: InputMode;
}

export function useInputPanelMode(options?: UseInputPanelModeOptions) {
  const [mode, setMode] = useState<InputMode>(
    options?.initialMode ?? { view: "summary" },
  );
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

  return {
    mode,
    setMode,
    hasPersonalized,
    handlePersonalise,
    handleWizardComplete,
    handlePresetApplied,
    handleWizardClose,
  };
}
