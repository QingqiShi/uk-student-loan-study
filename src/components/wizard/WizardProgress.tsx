"use client";

import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onClose?: () => void;
}

export function WizardProgress({
  currentStep,
  totalSteps,
  onBack,
  onClose,
}: WizardProgressProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="w-10">
        {onBack && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onBack}
            aria-label="Go back"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
          </Button>
        )}
      </div>

      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${String(currentStep + 1)} of ${String(totalSteps)}`}
      >
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full ${
              i <= currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="w-10">
        {onClose && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close wizard"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
