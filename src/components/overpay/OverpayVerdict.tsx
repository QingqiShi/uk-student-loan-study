import {
  Alert02Icon,
  Tick02Icon,
  Cancel01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton } from "@/components/ui/skeleton";
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

const DISCLAIMER =
  "This is an estimate, not financial advice. Consider speaking to a financial adviser.";

/**
 * Representative copies of the longest verdict reasons, rendered invisibly
 * into the same grid cell as the live card so the row reserves the tallest
 * realistic height at every viewport width. Switching verdicts (or swapping
 * in from the skeleton) then never shifts the content below. The reasons
 * mirror the longest templates in determineRecommendation — keep them in
 * sync if that copy changes.
 */
const sizerVariants = [
  {
    key: "marginal",
    reason:
      "A lump sum of £10,000 and £250/month overpayment would only cost an extra £999. Other factors like flexibility and peace of mind may be worth considering.",
  },
  {
    key: "written-off",
    reason:
      "Without overpaying, £123,456 would be written off. A lump sum of £10,000 and £250/month overpayment would increase total repayments by £12,345.",
  },
];

interface VerdictBodyProps {
  icon: typeof Alert02Icon;
  accent: string;
  title: string;
  reason: string;
  footer: string;
}

function VerdictBody({
  icon,
  accent,
  title,
  reason,
  footer,
}: VerdictBodyProps) {
  return (
    <>
      <div className="flex items-start gap-3 pb-3">
        <HugeiconsIcon
          icon={icon}
          className={cn("mt-0.5 size-5 shrink-0", accent)}
          strokeWidth={2}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Verdict
          </p>
          <p className={cn("text-lg font-semibold", accent)}>{title}</p>
          <p className="max-w-prose text-sm text-muted-foreground">{reason}</p>
        </div>
      </div>
      <p className="mt-auto border-t border-border/60 pt-3 text-xs text-muted-foreground">
        {footer}
      </p>
    </>
  );
}

function VerdictSizers() {
  return (
    <>
      {sizerVariants.map(({ key, reason }) => (
        <div
          key={key}
          aria-hidden
          className="invisible col-start-1 row-start-1 flex flex-col p-4 sm:p-5"
        >
          <VerdictBody
            icon={verdictConfig.overpay.icon}
            accent={verdictConfig.overpay.accent}
            title={verdictConfig.overpay.title}
            reason={reason}
            footer={DISCLAIMER}
          />
        </div>
      ))}
    </>
  );
}

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
    <div className="grid">
      <div
        role="status"
        aria-live="polite"
        aria-label="Overpay recommendation"
        className={cn(
          "col-start-1 row-start-1 flex flex-col rounded-xl p-4 ring-1 sm:p-5",
          config.surface,
        )}
      >
        <VerdictBody
          icon={config.icon}
          accent={config.accent}
          title={config.title}
          reason={reason}
          footer={
            isIdle
              ? "Adjust the inputs below to explore different scenarios."
              : DISCLAIMER
          }
        />
      </div>
      <VerdictSizers />
    </div>
  );
}

export function OverpayVerdictSkeleton() {
  return (
    <div className="grid">
      <Skeleton className="col-start-1 row-start-1 rounded-xl" />
      <VerdictSizers />
    </div>
  );
}
