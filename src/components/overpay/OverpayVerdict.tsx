import {
  Alert02Icon,
  Tick02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { RecommendationType } from "@/lib/loans/overpay-types";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const verdictConfig: Record<
  RecommendationType,
  {
    title: string;
    className: string;
    icon: typeof Alert02Icon;
  }
> = {
  "dont-overpay": {
    title: "Overpaying Costs More",
    className: "bg-status-danger border-status-danger-border",
    icon: Cancel01Icon,
  },
  overpay: {
    title: "Overpaying Saves Money",
    className: "bg-status-success border-status-success-border",
    icon: Tick02Icon,
  },
  marginal: {
    title: "Marginal Difference",
    className: "bg-status-warning border-status-warning-border",
    icon: Alert02Icon,
  },
};

interface OverpayVerdictProps {
  recommendation: RecommendationType;
  reason: string;
  showDisclaimer: boolean;
}

export function OverpayVerdict({
  recommendation,
  reason,
  showDisclaimer,
}: OverpayVerdictProps) {
  const config = verdictConfig[recommendation];

  return (
    <Alert className={config.className} role="status" aria-live="polite">
      <HugeiconsIcon
        icon={config.icon}
        className="size-5 text-foreground/70"
        strokeWidth={2}
      />
      <AlertTitle>{config.title}</AlertTitle>
      <AlertDescription>{reason}</AlertDescription>
      {showDisclaimer && (
        <p className="col-span-full mt-2 text-xs text-muted-foreground">
          This is an estimate, not financial advice. Consider speaking to a
          financial adviser.
        </p>
      )}
    </Alert>
  );
}

export default OverpayVerdict;
