"use client";

import {
  InformationCircleIcon,
  Alert02Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { RecommendationType } from "@/lib/loans";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const verdictConfig: Record<
  RecommendationType,
  {
    title: string;
    className: string;
    icon: typeof InformationCircleIcon;
  }
> = {
  "dont-overpay": {
    title: "Don't Overpay",
    className:
      "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    icon: Cancel01Icon,
  },
  "invest-instead": {
    title: "Invest Instead",
    className:
      "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
    icon: InformationCircleIcon,
  },
  overpay: {
    title: "Overpay Your Loan",
    className:
      "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
    icon: Tick02Icon,
  },
  marginal: {
    title: "Personal Preference",
    className:
      "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    icon: Alert02Icon,
  },
};

interface OverpayVerdictProps {
  recommendation: RecommendationType;
  reason: string;
}

export function OverpayVerdict({
  recommendation,
  reason,
}: OverpayVerdictProps) {
  const config = verdictConfig[recommendation];

  return (
    <Alert className={config.className} role="status" aria-live="polite">
      <HugeiconsIcon
        icon={config.icon}
        className="text-foreground/70 size-5"
        strokeWidth={2}
      />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>{reason}</AlertDescription>
    </Alert>
  );
}

export default OverpayVerdict;
