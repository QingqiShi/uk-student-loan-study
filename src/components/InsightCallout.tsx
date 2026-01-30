"use client";

import {
  InformationCircleIcon,
  Alert02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { InsightType } from "@/utils/insights";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { usePersonalizedInsight } from "@/hooks/usePersonalizedInsight";

const insightConfig: Record<
  InsightType,
  {
    className: string;
    icon: typeof InformationCircleIcon;
  }
> = {
  "low-earner": {
    className:
      "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    icon: InformationCircleIcon,
  },
  "middle-earner": {
    className:
      "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    icon: Alert02Icon,
  },
  "high-earner": {
    className:
      "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
    icon: Tick02Icon,
  },
};

export function InsightCallout() {
  const insight = usePersonalizedInsight();

  if (!insight) {
    return null;
  }

  const config = insightConfig[insight.type];

  return (
    <Alert className={config.className} role="status" aria-live="polite">
      <HugeiconsIcon
        icon={config.icon}
        className="text-foreground/70 size-5"
        strokeWidth={2}
      />
      <AlertTitle>{insight.title}</AlertTitle>
      <AlertDescription>{insight.description}</AlertDescription>
    </Alert>
  );
}

export default InsightCallout;
