"use client";

import type { AssumptionsWizardStep } from "./wizard/wizardReducer";
import type { PlanType } from "@/lib/loans/types";
import type { Preset } from "@/lib/presets";
import { ConfigSummary } from "@/components/ConfigSummary";
import { LoanConfigPanel } from "@/components/LoanConfigPanel";
import { AssumptionsWizard } from "@/components/wizard/AssumptionsWizard";

export type InputMode =
  | { view: "summary" }
  | { view: "loan-config"; initialPlanTypes?: PlanType[] }
  | { view: "assumptions-wizard"; entryStep?: AssumptionsWizardStep };

interface InputPanelProps {
  hasPersonalized: boolean;
  mode: InputMode;
  onPersonalise: () => void;
  onPresetApplied: (preset: Preset) => void;
  onWizardComplete: () => void;
  onAssumptionsComplete: () => void;
  onWizardClose: () => void;
}

export function InputPanel({
  hasPersonalized,
  mode,
  onPersonalise,
  onPresetApplied,
  onWizardComplete,
  onAssumptionsComplete,
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

  if (mode.view === "assumptions-wizard") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Adjust assumptions"
        className="fixed inset-0 z-50 flex min-h-dvh flex-col overflow-y-auto bg-background"
      >
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg">
            <AssumptionsWizard
              onComplete={onAssumptionsComplete}
              onClose={onWizardClose}
              entryStep={mode.entryStep}
            />
          </div>
        </div>
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
