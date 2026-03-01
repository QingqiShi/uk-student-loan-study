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
import { usePersonalizedResults } from "@/context/PersonalizedResultsContext";

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

/**
 * Desktop: compact badge shown on the chart heading row.
 * Mobile: full-width banner above the chart title.
 */
export function InsightCallout() {
  const { insight } = usePersonalizedResults();

  if (!insight) return null;

  const config = insightConfig[insight.type];

  return (
    <>
      {/* Mobile — full-width banner */}
      <div
        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 sm:hidden ${config.bgClass} ${config.borderClass}`}
        role="status"
        aria-live="polite"
      >
        <HugeiconsIcon
          icon={config.icon}
          className={`size-4 shrink-0 ${config.iconClass}`}
          strokeWidth={2}
        />
        <div className="min-w-0 text-sm">
          <span className="font-medium">{insight.title}</span>
          {insight.cta && (
            <>
              {" — "}
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
    </>
  );
}

/**
 * Small pill badge for the desktop chart heading row.
 * Rendered via SalaryExplorer's `badge` prop.
 */
export function InsightBadge() {
  const { insight } = usePersonalizedResults();

  if (!insight) return null;

  const config = insightConfig[insight.type];

  return (
    <div
      className={`hidden items-center gap-1.5 rounded-md border px-2 py-1 sm:flex ${config.bgClass} ${config.borderClass}`}
    >
      <HugeiconsIcon
        icon={config.icon}
        className={`size-3.5 ${config.iconClass}`}
        strokeWidth={2}
      />
      <span className="text-xs font-medium">{insight.title}</span>
      {insight.cta && (
        <>
          <span className="text-xs text-muted-foreground">·</span>
          <Link
            href={insight.cta.href}
            className="inline-flex items-center gap-0.5 text-xs font-medium text-foreground hover:underline"
          >
            {insight.cta.text}
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          </Link>
        </>
      )}
    </div>
  );
}
