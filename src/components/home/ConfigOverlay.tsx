"use client";

import { LoanConfigPanel } from "@/components/home/LoanConfigPanel";
import { ModalOverlay } from "@/components/shared/ModalOverlay";
import type { InputMode } from "@/hooks/useInputPanelMode";

interface ConfigOverlayProps {
  mode: InputMode;
  hasPersonalised: boolean;
  onComplete: () => void;
  onClose: () => void;
}

/** Full-screen modal dialog wrapping the loan-config panel. */
export function ConfigOverlay({
  mode,
  hasPersonalised,
  onComplete,
  onClose,
}: ConfigOverlayProps) {
  if (mode.view !== "loan-config") return null;

  return (
    <ModalOverlay
      label="Configure your loans"
      onClose={onClose}
      className="flex min-h-dvh flex-col overflow-y-auto bg-background"
    >
      <LoanConfigPanel
        isEditing={hasPersonalised}
        initialPlanTypes={mode.initialPlanTypes}
        onComplete={onComplete}
        onClose={onClose}
      />
    </ModalOverlay>
  );
}
