"use client";

import type { PlanType } from "@/lib/loans/types";
import type { Preset } from "@/lib/presets";
import { ConfigSummary } from "@/components/ConfigSummary";
import { LoanConfigPanel } from "@/components/LoanConfigPanel";

export type InputMode =
  | { view: "summary" }
  | { view: "loan-config"; initialPlanTypes?: PlanType[] };

interface InputPanelProps {
  hasPersonalized: boolean;
  mode: InputMode;
  onPersonalise: () => void;
  onPresetApplied: (preset: Preset) => void;
  onWizardComplete: () => void;
  onWizardClose: () => void;
}

export function InputPanel({
  hasPersonalized,
  mode,
  onPersonalise,
  onPresetApplied,
  onWizardComplete,
  onWizardClose,
}: InputPanelProps) {
  if (mode.view === "loan-config") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Configure your loans"
        className="fixed inset-0 z-50 flex min-h-dvh flex-col overflow-y-auto bg-background"
      >
        <LoanConfigPanel
          isEditing={hasPersonalized}
          initialPlanTypes={mode.initialPlanTypes}
          onComplete={onWizardComplete}
          onClose={onWizardClose}
        />
      </div>
    );
  }

  return (
    <ConfigSummary
      hasPersonalized={hasPersonalized}
      onPersonalise={onPersonalise}
      onPresetApplied={onPresetApplied}
    />
  );
}
