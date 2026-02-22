import {
  Alert02Icon,
  Tick02Icon,
  Cancel01Icon,
  InformationCircleIcon,
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
  idle: {
    title: "Ready to Compare",
    className: "bg-muted/50 border-border",
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
      <Alert
        className={`${config.className} py-3`}
        role="status"
        aria-live="polite"
      >
        <HugeiconsIcon
          icon={config.icon}
          className="size-5 text-foreground/70"
          strokeWidth={2}
        />
        <AlertTitle>{config.title}</AlertTitle>
        <AlertDescription>{reason}</AlertDescription>
        <p className="col-span-full mt-2 text-xs text-muted-foreground">
          {isIdle
            ? "Adjust the inputs below to explore different scenarios."
            : "This is an estimate, not financial advice. Consider speaking to a financial adviser."}
        </p>
      </Alert>
    </div>
  );
}

export default OverpayVerdict;
