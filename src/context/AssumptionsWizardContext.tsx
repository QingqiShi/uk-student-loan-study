"use client";

import { createContext, use, useState, type ReactNode } from "react";
import { ModalOverlay } from "@/components/shared/ModalOverlay";
import { AssumptionsWizard } from "@/components/wizard/AssumptionsWizard";
import type { AssumptionsWizardStep } from "@/components/wizard/wizardReducer";
import { trackWizardCompleted, trackWizardStarted } from "@/lib/analytics";

// --- Context type ---

interface AssumptionsWizardValue {
  openAssumptions: (entryStep?: AssumptionsWizardStep) => void;
}

// --- Context ---

const AssumptionsWizardContext = createContext<AssumptionsWizardValue | null>(
  null,
);

// --- Provider ---

interface AssumptionsWizardProviderProps {
  children: ReactNode;
}

export function AssumptionsWizardProvider({
  children,
}: AssumptionsWizardProviderProps) {
  const [wizardState, setWizardState] = useState<{
    open: boolean;
    entryStep?: AssumptionsWizardStep;
  }>({ open: false });

  function openAssumptions(entryStep?: AssumptionsWizardStep) {
    trackWizardStarted("assumptions");
    setWizardState({ open: true, entryStep });
  }

  function handleComplete() {
    trackWizardCompleted("assumptions");
    setWizardState({ open: false });
  }

  function handleClose() {
    setWizardState({ open: false });
  }

  const value: AssumptionsWizardValue = { openAssumptions };

  return (
    <AssumptionsWizardContext value={value}>
      {children}
      {wizardState.open && (
        <ModalOverlay
          label="Adjust assumptions"
          onClose={handleClose}
          className="overflow-y-auto"
        >
          <AssumptionsWizard
            onComplete={handleComplete}
            onClose={handleClose}
            entryStep={wizardState.entryStep}
          />
        </ModalOverlay>
      )}
    </AssumptionsWizardContext>
  );
}

// --- Hook ---

export function useAssumptionsWizard(): AssumptionsWizardValue {
  const ctx = use(AssumptionsWizardContext);
  if (!ctx) {
    throw new Error(
      "useAssumptionsWizard must be used within an AssumptionsWizardProvider",
    );
  }
  return ctx;
}
