"use client";

import { Cancel01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useEffect, useRef } from "react";
import AdvancedInputs from "./AdvancedInputs";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { useLoanContext } from "@/context";
import {
  CURRENT_RATES,
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
  getAnnualInterestRate,
} from "@/lib/loans";

// Selector for popover content rendered in portals.
// This matches data-slot="popover-content" set by our own @/components/ui/popover.tsx wrapper.
const POPOVER_CONTENT_SELECTOR = '[data-slot="popover-content"]';

export function FloatingHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  const { state } = useLoanContext();
  const { underGradPlanType, underGradBalance, postGradBalance, salary } =
    state;

  const hasUndergrad = underGradBalance > 0;
  const hasPostgrad = postGradBalance > 0;

  const undergradPlanInfo = PLAN_DISPLAY_INFO[underGradPlanType];
  const undergradInterestRate = getAnnualInterestRate(
    underGradPlanType,
    salary,
    CURRENT_RATES.rpi,
    CURRENT_RATES.boeBaseRate,
  );
  const postgradInterestRate = getAnnualInterestRate(
    "POSTGRADUATE",
    salary,
    CURRENT_RATES.rpi,
    CURRENT_RATES.boeBaseRate,
  );

  // Build summary based on loan combination
  function renderSummary() {
    if (hasUndergrad && hasPostgrad) {
      // Both loans: "Plan 2 + Postgraduate • £75,000 total"
      const totalBalance = underGradBalance + postGradBalance;
      return (
        <>
          <span>
            {undergradPlanInfo.name} + {POSTGRADUATE_DISPLAY_INFO.name}
          </span>
          <span className="text-muted-foreground/50">•</span>
          <span>{currencyFormatter.format(totalBalance)} total</span>
        </>
      );
    }

    if (hasUndergrad) {
      // Only undergrad: "Plan 2 • £50,000 • 5.2% interest • 30yr write-off"
      return (
        <>
          <span>{undergradPlanInfo.name}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{currencyFormatter.format(underGradBalance)}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{undergradInterestRate.toFixed(1)}% interest</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{undergradPlanInfo.writeOffYears}yr write-off</span>
        </>
      );
    }

    if (hasPostgrad) {
      // Only postgrad: "Postgraduate • £25,000 • 6.2% interest • 30yr write-off"
      return (
        <>
          <span>{POSTGRADUATE_DISPLAY_INFO.name}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{currencyFormatter.format(postGradBalance)}</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{postgradInterestRate.toFixed(1)}% interest</span>
          <span className="text-muted-foreground/50">•</span>
          <span>{POSTGRADUATE_DISPLAY_INFO.writeOffYears}yr write-off</span>
        </>
      );
    }

    // No loans - show prompt to add loans
    return <span>Add loan balances to get started</span>;
  }

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if clicking inside the header
      if (headerRef.current?.contains(target)) {
        return;
      }
      // Don't close if clicking inside a popover (rendered in portal outside header DOM)
      if (target.closest(POPOVER_CONTENT_SELECTOR)) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Height of summary bar (py-2 = 0.5rem*2, plus content ~2.5rem, plus border)
  const SUMMARY_HEIGHT = "4.5rem";

  return (
    <div className="sticky top-0 z-50 px-4 pt-3">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className="relative mx-auto max-w-4xl">
        {/* Spacer - reserves layout space for the summary bar only */}
        <div style={{ height: SUMMARY_HEIGHT }} aria-hidden="true" />

        {/* Absolutely positioned card - expands without affecting page layout */}
        <header
          ref={headerRef}
          className="absolute inset-x-0 top-0 overflow-hidden rounded-xl border bg-muted/50 shadow-lg backdrop-blur-sm"
        >
          {/* Title and Summary Bar */}
          <div className="py-2 pr-2 pl-4">
            <h1 className="text-base font-medium text-foreground">
              UK Student Loan Calculator
            </h1>
            <div className="mt-1 flex items-center gap-3">
              {/* Scrollable tags container - hidden scrollbar */}
              <div
                className="min-w-0 flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
                style={{ scrollbarWidth: "none" }}
              >
                <p className="flex items-center gap-2 text-xs whitespace-nowrap text-muted-foreground sm:text-sm">
                  {renderSummary()}
                </p>
              </div>
              {/* Theme toggle and settings button */}
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(!isOpen);
                }}
                className="shrink-0 gap-1.5"
              >
                <HugeiconsIcon
                  icon={isOpen ? Cancel01Icon : Settings02Icon}
                  className="size-4"
                  strokeWidth={2}
                />
                {isOpen ? "Close" : "Personalise"}
              </Button>
            </div>
          </div>

          {/* Expandable Panel - inside the card for unified expand animation */}
          <div
            className={`border-t transition-all duration-500 ease-in-out ${
              isOpen
                ? // eslint-disable-next-line better-tailwindcss/no-conflicting-classes -- Intentional: calc-size() progressive enhancement with viewport fallback
                  "max-h-[calc((100dvh-6rem)*0.85)] max-h-[calc-size(auto,size)] opacity-100"
                : "max-h-0 border-t-transparent opacity-0"
            } ${isOpen && isFullyOpen ? "overflow-y-auto" : "overflow-hidden"}`}
            onTransitionEnd={(e) => {
              // Only react to max-height transitions on this element
              if (
                e.propertyName === "max-height" &&
                e.target === e.currentTarget
              ) {
                setIsFullyOpen(isOpen);
              }
            }}
          >
            <div className="px-4 py-6">
              <AdvancedInputs />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}

export default FloatingHeader;
