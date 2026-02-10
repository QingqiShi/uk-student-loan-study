"use client";

import {
  InformationCircleIcon,
  Alert02Icon,
  Tick02Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import type { InsightType } from "@/utils/insights";
import { currencyFormatter } from "@/constants";
import { usePersonalizedInsight } from "@/hooks/usePersonalizedInsight";
import { useResultSummary } from "@/hooks/useResultSummary";

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
    iconClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50/60 dark:bg-blue-950/20",
    borderClass: "border-blue-200 dark:border-blue-800",
  },
  "middle-earner": {
    icon: Alert02Icon,
    iconClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50/60 dark:bg-red-950/20",
    borderClass: "border-red-200 dark:border-red-800",
  },
  "high-earner": {
    icon: Tick02Icon,
    iconClass: "text-emerald-600 dark:text-emerald-400",
    bgClass: "bg-emerald-50/60 dark:bg-emerald-950/20",
    borderClass: "border-emerald-200 dark:border-emerald-800",
  },
};

const pluralRules = new Intl.PluralRules("en-GB");

export function ResultSummary() {
  const summary = useResultSummary();
  const insight = usePersonalizedInsight();

  if (!summary) return null;

  const years = summary.monthsToPayoff / 12;
  const rounded = Math.max(1, Math.round(years));
  const yearsDisplay = years >= 1 ? String(rounded) : "<1";
  const yearsUnit = pluralRules.select(rounded) === "one" ? "year" : "years";

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

      <div className="relative flex flex-col gap-4 p-4 min-[30rem]:flex-row min-[30rem]:items-end min-[30rem]:gap-6 min-[30rem]:p-5">
        {/* Hero stat — total repayment */}
        <div className="flex-1">
          <p className="text-[0.6875rem] font-medium tracking-widest text-muted-foreground uppercase min-[30rem]:text-xs">
            Total repayment
          </p>
          <p className="mt-1 font-mono text-2xl font-bold tracking-tight text-primary tabular-nums min-[30rem]:text-3xl">
            {currencyFormatter.format(summary.totalPaid)}
          </p>
        </div>

        {/* Vertical divider — row layout only */}
        <div className="hidden h-12 w-px bg-border min-[30rem]:block" />

        {/* Supporting stats */}
        <div className="grid grid-cols-2 gap-6 border-t border-border pt-3 min-[30rem]:flex min-[30rem]:gap-8 min-[30rem]:border-t-0 min-[30rem]:pt-0">
          <div>
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
          <div>
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
          </div>
        </div>
      </div>

      {/* Personalized insight footer */}
      {insight && (
        <div className="relative flex items-start gap-2.5 border-t border-border px-4 py-3 min-[30rem]:px-5">
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
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
