"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { currencyFormatter } from "@/constants";
import { PLAN2_LT, PLAN5_MONTHLY_THRESHOLD } from "@/constants";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import AdvancedInputs from "./AdvancedInputs";

export function AssumptionsFooter() {
  const [isOpen, setIsOpen] = useState(false);

  const { isPost2023, plan2UTRate, plan5Rate, underGradBalance } = useStore(
    useShallow((state) => ({
      isPost2023: state.isPost2023,
      plan2UTRate: state.plan2UTRate,
      plan5Rate: state.plan5Rate,
      underGradBalance: state.underGradBalance,
    })),
  );

  const planName = isPost2023 ? "Plan 5" : "Plan 2";
  const threshold = isPost2023
    ? currencyFormatter.format(PLAN5_MONTHLY_THRESHOLD * 12)
    : currencyFormatter.format(PLAN2_LT);
  const rate = isPost2023 ? plan5Rate : plan2UTRate;
  const balance = currencyFormatter.format(underGradBalance);

  return (
    <div className="sticky bottom-0 z-40">
      {/* Expandable Panel */}
      <div
        className={`bg-background/95 border-t backdrop-blur-sm transition-all duration-300 ease-out ${
          isOpen
            ? "max-h-[calc((100dvh-6.5rem)*0.9)] overflow-y-auto opacity-100"
            : "max-h-0 overflow-hidden opacity-0"
        }`}
      >
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
          {/* Panel Header */}
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Settings</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="size-8"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="size-5"
                strokeWidth={2}
              />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Panel Content */}
          <AdvancedInputs />
        </div>
      </div>

      {/* Footer Bar */}
      <footer className="bg-muted/50 border-t backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <p className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
            <span className="text-foreground font-medium">{planName}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{balance}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>9% above {threshold}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{rate}% interest</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="px-2 sm:px-3"
          >
            <HugeiconsIcon
              icon={Settings02Icon}
              className="size-4 sm:mr-1.5"
              strokeWidth={2}
            />
            <span className="hidden sm:inline">
              {isOpen ? "Close" : "Customize"}
            </span>
            <span className="sr-only sm:hidden">
              {isOpen ? "Close" : "Customize"}
            </span>
          </Button>
        </div>
      </footer>
    </div>
  );
}

export default AssumptionsFooter;
