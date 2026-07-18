import {
  Alert02Icon,
  Tick02Icon,
  Cancel01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { RecommendationType } from "@/lib/loans/overpayTypes";
import { cn } from "@/lib/utils";

const verdictConfig: Record<
  RecommendationType,
  {
    title: string;
    surface: string;
    accent: string;
    icon: typeof Alert02Icon;
  }
> = {
  "dont-overpay": {
    title: "Overpaying costs more",
    surface: "bg-signal-wash ring-signal/30",
    accent: "text-signal",
    icon: Cancel01Icon,
  },
  overpay: {
    title: "Overpaying saves money",
    surface: "bg-accent-wash ring-primary/30",
    accent: "text-cta",
    icon: Tick02Icon,
  },
  marginal: {
    title: "Marginal difference",
    surface: "bg-muted ring-border",
    accent: "text-muted-foreground",
    icon: Alert02Icon,
  },
  idle: {
    title: "Ready to compare",
    surface: "bg-muted ring-border",
    accent: "text-muted-foreground",
    icon: InformationCircleIcon,
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
  const isIdle = recommendation === "idle";

  return (
    <div className="-mb-4 min-h-43 xs:min-h-38 sm:min-h-29 md:mb-0 md:min-h-0">
      <div
        role="status"
        aria-live="polite"
        className={cn("rounded-xl p-4 ring-1 sm:p-5", config.surface)}
      >
        <div className="flex items-start gap-3">
          <HugeiconsIcon
            icon={config.icon}
            className={cn("mt-0.5 size-5 shrink-0", config.accent)}
            strokeWidth={2}
          />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Verdict
            </p>
            <p className={cn("text-lg font-semibold", config.accent)}>
              {config.title}
            </p>
            <p className="max-w-prose text-sm text-muted-foreground">
              {reason}
            </p>
          </div>
        </div>
        <p className="mt-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          {isIdle
            ? "Adjust the inputs below to explore different scenarios."
            : "This is an estimate, not financial advice. Consider speaking to a financial adviser."}
        </p>
      </div>
    </div>
  );
}
