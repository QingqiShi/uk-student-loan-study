"use client";

import {
  Cancel01Icon,
  HelpCircleIcon,
  Quiz01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import type { PlanType } from "@/lib/loans/types";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useLoanActions, useLoanConfigState } from "@/context/LoanContext";
import { trackLoanToggled, trackBalanceChanged } from "@/lib/analytics";
import {
  toggleLoanPlan,
  setLoanBalance,
  getSelectedPlanTypes,
} from "@/lib/loanHelpers";
import {
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";
import { cn } from "@/lib/utils";

const LEFT_COLUMN: PlanType[] = ["PLAN_1", "PLAN_2", "PLAN_4"];
const RIGHT_COLUMN: PlanType[] = ["PLAN_5", "POSTGRADUATE"];

const QUICK_PICKS: Record<PlanType, number[]> = {
  PLAN_1: [10_000, 15_000, 20_000, 25_000],
  PLAN_2: [20_000, 30_000, 45_000, 50_000],
  PLAN_4: [15_000, 20_000, 25_000, 30_000],
  PLAN_5: [30_000, 40_000, 50_000, 60_000],
  POSTGRADUATE: [8_000, 10_000, 12_000, 15_000],
};

function getPlanInfo(planType: PlanType) {
  if (planType === "POSTGRADUATE") {
    return POSTGRADUATE_DISPLAY_INFO;
  }
  return PLAN_DISPLAY_INFO[planType];
}

function formatQuickPick(amount: number): string {
  return amount >= 1000 ? `£${String(amount / 1000)}k` : `£${String(amount)}`;
}

function BalanceHelper() {
  return (
    <Popover>
      <PopoverTrigger
        className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        aria-label="How to find your balance"
      >
        <HugeiconsIcon icon={HelpCircleIcon} className="size-3.5" />
        How do I find this?
      </PopoverTrigger>
      <PopoverContent side="top" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Finding your loan balance</PopoverTitle>
        </PopoverHeader>
        <ol className="list-inside list-decimal space-y-1.5 text-xs text-muted-foreground">
          <li>
            Log in to your{" "}
            <a
              href="https://www.gov.uk/sign-in-to-manage-your-student-loan-balance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              Student Loan account
            </a>
          </li>
          <li>
            Go to <strong className="text-foreground">Loan summary</strong>
          </li>
          <li>Your current balance is shown under each plan type</li>
        </ol>
        <p className="mt-2 text-xs text-muted-foreground">
          Don&apos;t have access? Check your latest payslip or annual statement
          from SLC for an estimate.
        </p>
      </PopoverContent>
    </Popover>
  );
}

interface LoanConfigPanelProps {
  isEditing: boolean;
  initialPlanTypes?: PlanType[];
  onComplete: () => void;
  onClose: () => void;
}

export function LoanConfigPanel({
  isEditing,
  initialPlanTypes,
  onComplete,
  onClose,
}: LoanConfigPanelProps) {
  const [view, setView] = useState<"config" | "quiz">("config");
  const { updateField } = useLoanActions();
  const { loans: globalLoans } = useLoanConfigState();
  const [localLoans, setLocalLoans] = useState(() => {
    if (isEditing) return globalLoans;
    if (initialPlanTypes && initialPlanTypes.length > 0) {
      return initialPlanTypes.map((pt) => ({ planType: pt, balance: 0 }));
    }
    return [];
  });

  const selectedPlanTypes = getSelectedPlanTypes(localLoans);

  const hasValidSelection = localLoans.some(
    (l) => selectedPlanTypes.has(l.planType) && l.balance > 0,
  );

  function handleToggle(planType: PlanType) {
    const isSelected = selectedPlanTypes.has(planType);
    trackLoanToggled(planType, !isSelected);
    setLocalLoans(toggleLoanPlan(localLoans, planType));
  }

  function handleBalanceChange(planType: PlanType, value: number) {
    setLocalLoans(setLoanBalance(localLoans, planType, value));
  }

  function handleBalanceBlur(planType: PlanType) {
    const loan = localLoans.find((l) => l.planType === planType);
    if (loan) {
      trackBalanceChanged(planType, loan.balance);
    }
  }

  function handleQuickPick(planType: PlanType, amount: number) {
    trackBalanceChanged(planType, amount);
    setLocalLoans(setLoanBalance(localLoans, planType, amount));
  }

  function handleComplete() {
    updateField("loans", localLoans);
    onComplete();
  }

  function handleLoansDiscovered(planTypes: PlanType[]) {
    const newLoans = planTypes.map((pt) => ({ planType: pt, balance: 0 }));
    setLocalLoans(newLoans);
    setView("config");
  }

  function handleBackToConfig() {
    setView("config");
  }

  function renderCard(planType: PlanType) {
    const info = getPlanInfo(planType);
    const isSelected = selectedPlanTypes.has(planType);
    const loan = localLoans.find((l) => l.planType === planType);

    return (
      <div
        key={planType}
        className={cn(
          "rounded-xl border-2 transition-all duration-150",
          isSelected
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-border bg-card",
        )}
      >
        {/* Toggle header */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isSelected}
          onClick={() => {
            handleToggle(planType);
          }}
          className={cn(
            "flex w-full items-center gap-3 px-4 py-3.5 text-left",
            "hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
            isSelected ? "rounded-t-xl" : "rounded-xl",
          )}
        >
          {/* Checkbox */}
          <div
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              isSelected
                ? "border-primary bg-primary"
                : "border-muted-foreground",
            )}
          >
            {isSelected && (
              <svg
                className="size-3.5 text-primary-foreground"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2.5 7.5L5.5 10.5L11.5 3.5" />
              </svg>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <span
              className={cn(
                "block leading-tight font-medium",
                isSelected ? "text-primary" : "text-foreground",
              )}
            >
              {info.name}
            </span>
            <span className="mt-0.5 block text-xs/tight text-muted-foreground">
              {info.region} · {info.years}
            </span>
          </div>
        </button>

        {/* Balance section — inline inside the card */}
        <div
          className="grid transition-all duration-200"
          style={{
            gridTemplateRows: isSelected ? "1fr" : "0fr",
          }}
        >
          <div className="overflow-hidden">
            <div className="border-t border-border/50 px-4 pt-3 pb-4">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor={`balance-${planType}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  {info.name} balance
                </label>
                <BalanceHelper />
              </div>
              <CurrencyInput
                id={`balance-${planType}`}
                value={loan?.balance ?? 0}
                onChange={(value) => {
                  handleBalanceChange(planType, value);
                }}
                onBlur={() => {
                  handleBalanceBlur(planType);
                }}
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {QUICK_PICKS[planType].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    aria-pressed={loan?.balance === amount}
                    onClick={() => {
                      handleQuickPick(planType, amount);
                    }}
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs transition-colors",
                      loan?.balance === amount
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {formatQuickPick(amount)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "quiz") {
    return (
      <QuizContainer
        onLoansDiscovered={handleLoansDiscovered}
        onBack={handleBackToConfig}
        onClose={handleBackToConfig}
      />
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold">Customise your loans</h2>
          <div className="flex items-center gap-2">
            {localLoans.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setLocalLoans([]);
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Reset
              </button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-6">
        <div className="mx-auto w-full max-w-3xl space-y-6">
          <div className="space-y-3 md:flex md:gap-3 md:space-y-0">
            <div className="space-y-3 md:flex-1">
              {LEFT_COLUMN.map((pt) => renderCard(pt))}
            </div>
            <div className="space-y-3 md:flex-1">
              {RIGHT_COLUMN.map((pt) => renderCard(pt))}
            </div>
          </div>

          {/* Divider with centered "or" */}
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
              or
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Quiz CTA button */}
          <div className="text-center">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setView("quiz");
              }}
              className="gap-2"
            >
              <HugeiconsIcon
                icon={Quiz01Icon}
                className="size-4 text-primary"
                data-icon="inline-start"
              />
              Not sure? Take the quiz
            </Button>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t border-border/50 bg-background/80 p-4 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl">
          <Button
            size="lg"
            className="w-full"
            disabled={!hasValidSelection}
            onClick={handleComplete}
          >
            Done
          </Button>
        </div>
      </footer>
    </div>
  );
}
