"use client";

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { THRESHOLD_GROWTH_OPTIONS } from "@/constants";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackThresholdGrowthSelected } from "@/lib/analytics";

export function AdvancedConfigSection() {
  const [isOpen, setIsOpen] = useState(false);
  // Track animation completion to enable overflow only after expanding finishes.
  // This matches the Header personalise panel animation pattern (CSS transitions)
  // rather than shadcn Collapsible's accordion animation.
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const { updateField } = useLoanActions();
  const { thresholdGrowthRate } = useLoanConfigState();

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const newState = !isOpen;
          setIsOpen(newState);
        }}
        className="flex w-full items-center justify-between rounded-lg py-2.5 text-left text-sm font-medium transition-all hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-controls="advanced-config-content"
      >
        Advanced
        <HugeiconsIcon
          icon={isOpen ? ArrowUp01Icon : ArrowDown01Icon}
          strokeWidth={2}
          className="size-4 shrink-0 text-muted-foreground"
        />
      </button>

      <div
        id="advanced-config-content"
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } ${isOpen && isFullyOpen ? "overflow-visible" : "overflow-hidden"}`}
        onTransitionEnd={(e) => {
          if (e.propertyName === "max-height" && e.target === e.currentTarget) {
            setIsFullyOpen(isOpen);
          }
        }}
      >
        <div className="space-y-4 pt-2 pb-2.5">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">
              Simulate threshold rising
            </legend>
            <div
              role="group"
              aria-label="Threshold growth rate options"
              className="flex gap-1"
            >
              {THRESHOLD_GROWTH_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  variant={
                    thresholdGrowthRate === option.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    trackThresholdGrowthSelected(option.value);
                    updateField("thresholdGrowthRate", option.value);
                  }}
                  aria-pressed={thresholdGrowthRate === option.value}
                  className="flex-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                THRESHOLD_GROWTH_OPTIONS.find(
                  (o) => o.value === thresholdGrowthRate,
                )?.description
              }
            </p>
            {/* UPDATE: Remove or revise this note once thresholds unfreeze (expected after 2027) */}
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Note: Government has frozen thresholds through 2027.
            </p>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
