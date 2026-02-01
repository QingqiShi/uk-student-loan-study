"use client";

import { Cancel01Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import AdvancedInputs from "./AdvancedInputs";
import { BrandLogo } from "./brand/BrandLogo";
import { PresetPills } from "./PresetPills";
import { ShareButton } from "./ShareButton";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { currencyFormatter } from "@/constants";
import { useLoanContext } from "@/context/LoanContext";
import { getAnnualInterestRate } from "@/lib/loans/interest";
import {
  CURRENT_RATES,
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";

// Selector for popover content rendered in portals.
const POPOVER_CONTENT_SELECTOR = '[data-slot="popover-content"]';

interface HeaderProps {
  /** "simple" shows only logo and theme toggle; "full" includes loan controls */
  variant?: "simple" | "full";
  repaymentYear?: number;
}

export function Header({ variant = "full", repaymentYear }: HeaderProps) {
  if (variant === "simple") {
    return <SimpleHeaderContent />;
  }
  return <FullHeaderContent repaymentYear={repaymentYear} />;
}

function SimpleHeaderContent() {
  return (
    <div className="sticky top-0 z-50 px-4 pt-3">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className="mx-auto max-w-4xl">
        <header className="rounded-xl border bg-muted/50 px-3 py-2 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Go to home page">
              <BrandLogo size="small" />
            </Link>
            <ThemeToggle />
          </div>
        </header>
      </div>
    </div>
  );
}

interface FullHeaderContentProps {
  repaymentYear?: number;
}

function FullHeaderContent({ repaymentYear }: FullHeaderContentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

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

  function renderSummary() {
    if (hasUndergrad && hasPostgrad) {
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

    return <span>Add loan balances to get started</span>;
  }

  // Close on click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (headerRef.current?.contains(target)) return;
      if (target.closest(POPOVER_CONTENT_SELECTOR)) return;
      setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const SUMMARY_HEIGHT = "6rem";

  return (
    <div className="sticky top-0 z-50 px-4 pt-3">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className="relative mx-auto max-w-4xl">
        <div style={{ height: SUMMARY_HEIGHT }} aria-hidden="true" />

        <header
          ref={headerRef}
          className="absolute inset-x-0 top-0 max-h-[85dvh] overflow-hidden rounded-xl border bg-muted/50 shadow-lg backdrop-blur-sm"
        >
          <div className="py-2 pr-2 pl-3">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" aria-label="Go to home page">
                <BrandLogo size="small" />
              </Link>
              <div className="flex shrink-0 items-center gap-2">
                <ThemeToggle />
                <ShareButton repaymentYear={repaymentYear} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                  className="shrink-0 gap-1.5"
                  aria-label={isOpen ? "Close settings" : "Personalise settings"}
                >
                  <HugeiconsIcon
                    icon={isOpen ? Cancel01Icon : Settings02Icon}
                    className="size-4"
                    strokeWidth={2}
                  />
                  <span className="hidden sm:inline">
                    {isOpen ? "Close" : "Personalise"}
                  </span>
                </Button>
              </div>
            </div>

            <div
              className="mt-2 overflow-x-auto border-t pt-2 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <PresetPills />
            </div>

            <div
              className="mt-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="flex items-center gap-2 text-xs whitespace-nowrap text-muted-foreground sm:text-sm">
                {renderSummary()}
              </p>
            </div>
          </div>

          <div
            className={`border-t transition-all duration-500 ease-in-out ${
              isOpen
                ? "max-h-[calc((100dvh-6rem)*0.85)] opacity-100 supports-[height:calc-size(auto,size)]:h-[calc-size(auto,size)]"
                : "h-0 max-h-0 border-t-transparent opacity-0"
            } ${isOpen && isFullyOpen ? "overflow-y-auto" : "overflow-hidden"}`}
            onTransitionEnd={(e) => {
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
