"use client";

import { ArrowDown01Icon, ArrowUp01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import type { SalaryGrowthRate } from "@/types/store";
import { Button } from "@/components/ui/button";
import { useLoanContext } from "@/context/LoanContext";

const salaryGrowthOptions: {
  value: SalaryGrowthRate;
  label: string;
  description: string;
}[] = [
  { value: "none", label: "0%", description: "No salary growth" },
  { value: "conservative", label: "2%", description: "Matches inflation only" },
  { value: "moderate", label: "4%", description: "Typical career progression" },
  {
    value: "aggressive",
    label: "6%",
    description: "Fast-track careers (tech, finance)",
  },
];

export function AdvancedConfigSection() {
  const [isOpen, setIsOpen] = useState(false);
  // Track animation completion to enable overflow only after expanding finishes.
  // This matches the Header personalise panel animation pattern (CSS transitions)
  // rather than shadcn Collapsible's accordion animation.
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const { state, updateField } = useLoanContext();

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
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
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        } ${isOpen && isFullyOpen ? "overflow-visible" : "overflow-hidden"}`}
        onTransitionEnd={(e) => {
          if (e.propertyName === "max-height" && e.target === e.currentTarget) {
            setIsFullyOpen(isOpen);
          }
        }}
      >
        <div className="pt-2 pb-2.5">
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Salary Growth</legend>
            <div
              role="group"
              aria-label="Salary growth rate options"
              className="flex gap-1"
            >
              {salaryGrowthOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={
                    state.salaryGrowthRate === option.value
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => {
                    updateField("salaryGrowthRate", option.value);
                  }}
                  aria-pressed={state.salaryGrowthRate === option.value}
                  className="flex-1"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {
                salaryGrowthOptions.find(
                  (o) => o.value === state.salaryGrowthRate,
                )?.description
              }
            </p>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
