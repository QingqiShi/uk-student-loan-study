"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  InformationCircleIcon,
  Alert02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { usePersonalizedInsight } from "@/hooks/usePersonalizedInsight";
import type { InsightType } from "@/utils/insights";

const insightStyles: Record<
  InsightType,
  { bg: string; border: string; icon: typeof InformationCircleIcon }
> = {
  "low-earner": {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
    icon: InformationCircleIcon,
  },
  "middle-earner": {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    icon: Alert02Icon,
  },
  "high-earner": {
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
    icon: Tick02Icon,
  },
};

export function InsightCallout() {
  const insight = usePersonalizedInsight();

  if (!insight) {
    return null;
  }

  const styles = insightStyles[insight.type];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        styles.bg,
        styles.border,
      )}
      role="status"
      aria-live="polite"
    >
      <HugeiconsIcon
        icon={styles.icon}
        className="text-foreground/70 mt-0.5 size-5 shrink-0"
        strokeWidth={2}
      />
      <div className="space-y-1">
        <p className="text-sm font-medium">{insight.title}</p>
        <p className="text-muted-foreground text-sm">{insight.description}</p>
      </div>
    </div>
  );
}

export default InsightCallout;
