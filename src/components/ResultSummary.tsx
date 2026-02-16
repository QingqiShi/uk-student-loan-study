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
import { Skeleton } from "@/components/ui/skeleton";
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

function StatBlockSkeleton() {
  return (
    <div>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="mt-0.5 h-7 w-24 min-[30rem]:h-8" />
    </div>
  );
}

export function ResultSummary() {
  const summary = useResultSummary();
  const insight = usePersonalizedInsight();

  if (!summary) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-border bg-card"
        role="status"
        aria-label="Loading results"
      >
        <div className="relative grid grid-cols-2 gap-0 p-4 min-[30rem]:grid-cols-3 min-[30rem]:items-center min-[30rem]:p-5">
          <div className="col-span-2 pb-3 min-[30rem]:col-span-1 min-[30rem]:border-r min-[30rem]:border-border min-[30rem]:pr-5 min-[30rem]:pb-0">
            <StatBlockSkeleton />
          </div>
          <div className="border-t border-border py-3 pr-4 min-[30rem]:border-t-0 min-[30rem]:border-r min-[30rem]:border-border min-[30rem]:px-5 min-[30rem]:py-0">
            <StatBlockSkeleton />
          </div>
          <div className="border-t border-border py-3 pl-4 min-[30rem]:border-t-0 min-[30rem]:py-0 min-[30rem]:pl-5">
            <StatBlockSkeleton />
          </div>
        </div>
        <div className="relative flex min-h-26.5 items-center gap-2.5 border-t border-border px-4 py-3 min-[30rem]:px-5 sm:min-h-21.5 lg:min-h-16.5">
          <Skeleton className="h-4 w-full max-w-md" />
        </div>
      </div>
    );
  }

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

      <div className="relative grid grid-cols-2 gap-0 p-4 min-[30rem]:grid-cols-3 min-[30rem]:items-center min-[30rem]:p-5">
        <div className="col-span-2 pb-3 min-[30rem]:col-span-1 min-[30rem]:border-r min-[30rem]:border-border min-[30rem]:pr-5 min-[30rem]:pb-0">
          <p className="text-xs font-medium tracking-widest whitespace-nowrap text-muted-foreground uppercase">
            Total repayment
          </p>
          <p className="mt-0.5 font-mono text-xl font-semibold tracking-tight text-primary tabular-nums min-[30rem]:text-2xl">
            {currencyFormatter.format(summary.totalPaid)}
          </p>
        </div>

        <div className="border-t border-border py-3 pr-4 min-[30rem]:border-t-0 min-[30rem]:border-r min-[30rem]:border-border min-[30rem]:px-5 min-[30rem]:py-0">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            Monthly
          </p>
          <p className="mt-0.5 font-mono text-xl font-semibold tabular-nums min-[30rem]:text-2xl">
            {currencyFormatter.format(summary.monthlyRepayment)}
            <span className="text-sm font-normal text-muted-foreground">
              /mo
            </span>
          </p>
        </div>

        <div className="border-t border-border py-3 pl-4 min-[30rem]:border-t-0 min-[30rem]:py-0 min-[30rem]:pl-5">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
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

      {/* Personalized insight footer — fixed min-h to prevent layout shift */}
      <div className="relative flex min-h-26.5 items-center gap-2.5 border-t border-border px-4 py-3 min-[30rem]:px-5 sm:min-h-21.5 lg:min-h-16.5">
        {insight ? (
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
        ) : (
          <Skeleton className="h-4 w-full max-w-md" />
        )}
      </div>
    </div>
  );
}
