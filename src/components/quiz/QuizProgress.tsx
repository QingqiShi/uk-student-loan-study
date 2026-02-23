"use client";

import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onClose?: () => void;
  closeIcon?: IconSvgElement;
  closeLabel?: string;
}

export function QuizProgress({
  currentStep,
  totalSteps,
  onBack,
  onClose,
  closeIcon = Cancel01Icon,
  closeLabel = "Exit quiz",
}: QuizProgressProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
        <div className="w-10">
          {onBack && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onBack}
              aria-label="Go back"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5" />
            </Button>
          )}
        </div>

        <div
          className="flex gap-2"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-label={`Step ${String(currentStep + 1)} of ${String(totalSteps)}`}
        >
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition-colors duration-200 ${
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
              aria-label={closeLabel}
            >
              <HugeiconsIcon icon={closeIcon} className="size-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
