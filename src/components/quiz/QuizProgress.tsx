"use client";

import { ArrowLeft01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizProgressProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onClose?: () => void;
  closeIcon?: IconSvgElement;
  closeLabel?: string;
  /** Stick to the top of the scroll container (modal). Off on the standalone
   * page, where the site masthead is the sticky element instead. */
  sticky?: boolean;
  /** Render as an in-column rail rather than full-width page chrome: drops the
   * full-bleed divider, background and inner measure so the bar aligns to the
   * quiz column it sits inside. Used on the standalone /which-plan page. */
  flush?: boolean;
}

export function QuizProgress({
  currentStep,
  totalSteps,
  onBack,
  onClose,
  closeIcon = Cancel01Icon,
  closeLabel = "Exit quiz",
  sticky = true,
  flush = false,
}: QuizProgressProps) {
  const stepNumber = Math.min(currentStep + 1, totalSteps);
  const fillPercent = (stepNumber / totalSteps) * 100;

  return (
    <div
      className={cn(
        !flush && "z-10 border-b border-border bg-background",
        sticky && "sticky top-0",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3 py-3",
          flush ? "w-full" : "mx-auto max-w-lg px-4",
        )}
      >
        <div className="w-10 shrink-0">
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

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className="h-1 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={stepNumber}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${String(stepNumber)} of ${String(totalSteps)}`}
          >
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${String(fillPercent)}%` }}
            />
          </div>
          <span className="shrink-0 font-mono text-xs font-semibold text-muted-foreground tabular-nums">
            {String(stepNumber).padStart(2, "0")}
            <span className="text-faint">
              {" "}
              / {String(totalSteps).padStart(2, "0")}
            </span>
          </span>
        </div>

        <div className="w-10 shrink-0 text-right">
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
    </div>
  );
}
