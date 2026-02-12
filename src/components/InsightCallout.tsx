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
    className: "bg-status-info border-status-info-border",
    icon: InformationCircleIcon,
  },
  "middle-earner": {
    className: "bg-status-danger border-status-danger-border",
    icon: Alert02Icon,
  },
  "high-earner": {
    className: "bg-status-success border-status-success-border",
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
        className="size-5 text-foreground/70"
        strokeWidth={2}
      />
      <AlertTitle>{insight.title}</AlertTitle>
      <AlertDescription>
        {insight.description}
        {insight.cta && (
          <>
            {" "}
            <Link
              href={insight.cta.href}
              className="inline-flex items-center gap-0.5 font-medium hover:underline"
            >
              {insight.cta.text}
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
            </Link>
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}

export default InsightCallout;
