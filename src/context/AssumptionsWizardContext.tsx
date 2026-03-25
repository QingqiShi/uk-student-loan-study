"use client";

import {
  createContext,
  use,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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

  useEffect(() => {
    if (wizardState.open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [wizardState.open]);

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

  const dialogRef = useRef<HTMLDivElement>(null);

  // Auto-focus the dialog container when it opens so keyboard events work
  // and the next Tab lands inside the dialog rather than on page content.
  useEffect(() => {
    if (wizardState.open) {
      dialogRef.current?.focus();
    }
  }, [wizardState.open]);

  const value: AssumptionsWizardValue = { openAssumptions };

  return (
    <AssumptionsWizardContext value={value}>
      {children}
      {wizardState.open && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Adjust assumptions"
          className="fixed inset-0 z-50 overflow-y-auto"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              handleClose();
            }
          }}
        >
          <AssumptionsWizard
            onComplete={handleComplete}
            onClose={handleClose}
            entryStep={wizardState.entryStep}
          />
        </div>
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
