"use client";

import {
  InformationCircleIcon,
  Alert02Icon,
  Tick02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import type { InsightType } from "@/utils/insights";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currencyFormatter, SALARY_GROWTH_OPTIONS } from "@/constants";
import { useLoanConfigState } from "@/context/LoanContext";
import { usePersonalizedInsight } from "@/hooks/usePersonalizedInsight";
import { useResultSummary } from "@/hooks/useResultSummary";
import { PLAN_DISPLAY_INFO } from "@/lib/loans/plans";

const insightConfig: Record<
  InsightType,
  {
    icon: typeof InformationCircleIcon;
    iconClass: string;
    bgClass: string;
    borderClass: string;
  }
> = {
  "low-earner": {
    icon: InformationCircleIcon,
    iconClass: "text-status-info-foreground",
    bgClass: "bg-status-info",
    borderClass: "border-status-info-border",
  },
  "middle-earner": {
    icon: Alert02Icon,
    iconClass: "text-status-danger-foreground",
    bgClass: "bg-status-danger",
    borderClass: "border-status-danger-border",
  },
  "high-earner": {
    icon: Tick02Icon,
    iconClass: "text-status-success-foreground",
    bgClass: "bg-status-success",
    borderClass: "border-status-success-border",
  },
};

const pluralRules = new Intl.PluralRules("en-GB");

interface ResultSummaryProps {
  onOpenAssumptions: () => void;
}

export function ResultSummary({ onOpenAssumptions }: ResultSummaryProps) {
  const summary = useResultSummary();
  const insight = usePersonalizedInsight();
  const config = useLoanConfigState();
  const [popoverOpen, setPopoverOpen] = useState(false);

  if (!summary) return null;

  const years = summary.monthsToPayoff / 12;
  const rounded = Math.max(1, Math.round(years));
  const yearsDisplay = years >= 1 ? String(rounded) : "<1";
  const yearsUnit = pluralRules.select(rounded) === "one" ? "year" : "years";

  const ugLoans = config.loans.filter((l) => l.planType !== "POSTGRADUATE");
  const pgLoans = config.loans.filter((l) => l.planType === "POSTGRADUATE");
  const ugBalance = ugLoans.reduce((s, l) => s + l.balance, 0);
  const pgBalance = pgLoans.reduce((s, l) => s + l.balance, 0);

  const growthLabel =
    SALARY_GROWTH_OPTIONS.find((o) => o.value === config.salaryGrowthRate)
      ?.label ?? `${(config.salaryGrowthRate * 100).toFixed(0)}%`;

  const thresholdInfo =
    config.thresholdGrowthRate === 0
      ? "Frozen thresholds"
      : `+${(config.thresholdGrowthRate * 100).toFixed(0)}%/yr threshold`;

  const hasUG = ugBalance > 0;
  const hasPostgrad = pgBalance > 0;

  const ugSummary = ugLoans
    .map((l) => {
      const info =
        PLAN_DISPLAY_INFO[l.planType as keyof typeof PLAN_DISPLAY_INFO];
      return `${info.name} with ${currencyFormatter.format(l.balance)} balance`;
    })
    .join(" + ");

  const balanceSummary = hasUG
    ? ugSummary +
      (hasPostgrad ? ` + ${currencyFormatter.format(pgBalance)} postgrad` : "")
    : `${currencyFormatter.format(pgBalance)} postgrad loan`;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${
        insight
          ? `${insightConfig[insight.type].bgClass} ${insightConfig[insight.type].borderClass}`
          : "border-border bg-card"
      }`}
      role="status"
      aria-live="polite"
    >
      {/* Subtle gradient wash behind the hero stat */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/6 via-transparent to-transparent dark:from-primary/10" />

      <div className="relative grid grid-cols-2 gap-0 p-4 min-[30rem]:grid-cols-3 min-[30rem]:p-5 lg:grid-cols-[1fr_1fr_1fr_2fr] lg:items-center">
        <div className="col-span-2 pb-3 min-[30rem]:col-span-1 min-[30rem]:border-r min-[30rem]:border-border min-[30rem]:pr-5 min-[30rem]:pb-0">
          <p className="text-[0.6875rem] font-medium tracking-widest whitespace-nowrap text-muted-foreground uppercase min-[30rem]:text-xs">
            Total repayment
          </p>
          <p className="mt-0.5 font-mono text-xl font-semibold tracking-tight text-primary tabular-nums min-[30rem]:text-2xl">
            {currencyFormatter.format(summary.totalPaid)}
          </p>
        </div>

        <div className="border-t border-border py-3 pr-4 min-[30rem]:border-t-0 min-[30rem]:border-r min-[30rem]:border-border min-[30rem]:px-5 min-[30rem]:py-0">
          <p className="text-[0.6875rem] font-medium tracking-widest text-muted-foreground uppercase min-[30rem]:text-xs">
            Monthly
          </p>
          <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums min-[30rem]:text-2xl">
            {currencyFormatter.format(summary.monthlyRepayment)}
            <span className="text-sm font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </div>

        <div className="relative border-t border-border py-3 pl-4 min-[30rem]:border-t-0 min-[30rem]:py-0 min-[30rem]:pl-5 lg:border-r lg:border-border lg:px-5">
          <p className="text-[0.6875rem] font-medium tracking-widest text-muted-foreground uppercase min-[30rem]:text-xs">
            Duration
          </p>
          <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums min-[30rem]:text-2xl">
            {yearsDisplay}
            <span className="text-sm font-normal text-muted-foreground">
              {" "}
              {yearsUnit}
            </span>
          </p>

          {/* Info icon — small screens only */}
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="absolute top-0 right-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"
                  aria-label="View configuration details"
                >
                  <HugeiconsIcon
                    icon={InformationCircleIcon}
                    className="size-4"
                  />
                </button>
              }
            />
            <PopoverContent align="end" className="w-64 p-3">
              <p className="text-sm font-medium">{balanceSummary}</p>
              <div className="my-2 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  setPopoverOpen(false);
                  onOpenAssumptions();
                }}
                className="w-full rounded-md px-2 py-1.5 text-left text-sm text-primary hover:bg-accent"
              >
                {growthLabel} salary growth &middot; {thresholdInfo} &rarr;
              </button>
            </PopoverContent>
          </Popover>
        </div>

        {/* Config summary — desktop inline */}
        <div className="hidden lg:block lg:pl-5">
          <p className="text-sm/snug font-medium">{balanceSummary}</p>
          <button
            type="button"
            onClick={onOpenAssumptions}
            className="mt-0.5 text-xs text-primary underline-offset-4 hover:underline"
          >
            {growthLabel} salary growth &middot; {thresholdInfo} &rarr;
          </button>
        </div>
      </div>

      {/* Personalized insight footer — fixed min-h to prevent layout shift */}
      <div className="relative flex min-h-26.5 items-center gap-2.5 border-t border-border px-4 py-3 min-[30rem]:px-5 sm:min-h-21.5 lg:min-h-16.5">
        {insight && (
          <>
            <HugeiconsIcon
              icon={insightConfig[insight.type].icon}
              className={`mt-0.5 size-4 shrink-0 ${insightConfig[insight.type].iconClass}`}
              strokeWidth={2}
            />
            <div className="min-w-0 text-sm">
              <span className="font-medium">{insight.title}</span>
              <span className="text-muted-foreground">
                {" \u2014 "}
                {insight.description}
              </span>
              {insight.cta && (
                <>
                  {" "}
                  <Link
                    href={insight.cta.href}
                    className="inline-flex items-center gap-0.5 font-medium text-foreground hover:underline"
                  >
                    {insight.cta.text}
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      className="size-3.5"
                    />
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
