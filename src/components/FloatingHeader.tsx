"use client";

import { useState, useEffect, useRef } from "react";
import { useLoanContext } from "@/context";
import { currencyFormatter } from "@/constants";
import { CURRENT_RATES } from "@/lib/loans";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import AdvancedInputs from "./AdvancedInputs";

export function FloatingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const { state } = useLoanContext();
  const { underGradPlanType, underGradBalance } = state;

  const isPost2023 = underGradPlanType === "PLAN_5";
  const planName = isPost2023 ? "Plan 5" : "Plan 2";
  const balance = currencyFormatter.format(underGradBalance);
  const rate = isPost2023 ? CURRENT_RATES.rpi : CURRENT_RATES.rpi + 3;
  const writeOff = isPost2023 ? "40yr" : "30yr";

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="sticky top-0 z-50 px-4 pt-3">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <header
        ref={headerRef}
        className="mx-auto max-w-4xl overflow-hidden rounded-xl border bg-muted/50 shadow-lg backdrop-blur-sm"
      >
        {/* Title and Summary Bar */}
        <div className="py-2 pl-4 pr-2">
          <h1 className="text-foreground text-base font-medium">
            UK Student Loan Calculator
          </h1>
          <div className="mt-1 flex items-center gap-3">
            {/* Scrollable tags container - hidden scrollbar */}
            <div
              className="min-w-0 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="text-muted-foreground flex items-center gap-2 whitespace-nowrap text-xs sm:text-sm">
                <span>{planName}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{balance}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{rate}% interest</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{writeOff} write-off</span>
              </p>
            </div>
            {/* Fixed button - always visible */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="shrink-0 gap-1.5"
            >
              <HugeiconsIcon
                icon={isOpen ? Cancel01Icon : Settings02Icon}
                className="size-4"
                strokeWidth={2}
              />
              {isOpen ? "Close" : "Edit"}
            </Button>
          </div>
        </div>

        {/* Expandable Panel */}
        <div
          className={`overflow-hidden border-t transition-all duration-300 ease-out ${
            isOpen
              ? "max-h-[calc((100dvh-6rem)*0.85)] overflow-y-auto opacity-100"
              : "max-h-0 border-t-transparent opacity-0"
          }`}
        >
          <div className="px-4 py-6">
            <AdvancedInputs />
          </div>
        </div>
      </header>
    </div>
  );
}

export default FloatingHeader;
