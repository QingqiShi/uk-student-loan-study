import {
  MetricCell,
  MetricReadout,
} from "@/components/instrument/MetricReadout";
import { currencyFormatter } from "@/constants";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";
import type { OverpayAnalysisResult } from "@/lib/loans/overpayTypes";

interface OverpaySummaryCardsProps {
  analysis: OverpayAnalysisResult;
}

// Unit words (yrs, y, m) drop to small sans so only the digits stay mono —
// the Figures-Are-Mono / Subordinated-Unit rule.
function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-sans text-xs font-normal text-muted-foreground">
      {children}
    </span>
  );
}

function DetailRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          tone === "muted"
            ? "font-mono text-muted-foreground tabular-nums"
            : "font-mono text-foreground tabular-nums"
        }
      >
        {value}
      </span>
    </div>
  );
}

export function OverpaySummaryCards({ analysis }: OverpaySummaryCardsProps) {
  const showPresentValue = useShowPresentValue();
  const { baseline, overpay, monthsSaved } = analysis;

  // Use PV-adjusted values when available
  const displayBaselineTotalPaid =
    analysis.pvBaseline?.totalPaid ?? baseline.totalPaid;
  const displayOverpayTotalPaid =
    analysis.pvOverpay?.totalPaid ?? overpay.totalPaid;
  const paymentDifference =
    analysis.pvPaymentDifference ?? analysis.paymentDifference;

  const formatYears = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return (
        <>
          {years} <Unit>{years === 1 ? "yr" : "yrs"}</Unit>
        </>
      );
    }
    return (
      <>
        {years}
        <Unit>y</Unit> {remainingMonths}
        <Unit>m</Unit>
      </>
    );
  };

  const hasSavings = paymentDifference > 0;
  const hasExtraCost = paymentDifference < 0;

  // Money figures are inflation-adjusted when the present-value toggle is on;
  // disclose that on the money labels (the time figures stay nominal).
  const pvSuffix = showPresentValue ? " (real)" : "";
  const savingsLabel = `${hasExtraCost ? "Extra cost" : "Your savings"}${pvSuffix}`;
  const savingsValue = hasExtraCost
    ? `+${currencyFormatter.format(Math.abs(paymentDifference))}`
    : currencyFormatter.format(Math.max(0, paymentDifference));
  const savingsTone = hasSavings
    ? "emphasis"
    : hasExtraCost
      ? "cost"
      : "default";

  return (
    <MetricReadout columns={1} aria-live="polite">
      <MetricCell label={savingsLabel} value={savingsValue} tone={savingsTone}>
        <DetailRow
          label="Time saved"
          value={formatYears(Math.max(0, monthsSaved))}
        />
      </MetricCell>

      <MetricCell
        label={`Without overpaying${pvSuffix}`}
        value={currencyFormatter.format(displayBaselineTotalPaid)}
      >
        <div className="space-y-1">
          <DetailRow
            label="Payoff time"
            value={formatYears(baseline.monthsToPayoff)}
          />
          {baseline.writtenOff && (
            <DetailRow
              label="Written off"
              value={currencyFormatter.format(baseline.amountWrittenOff)}
              tone="muted"
            />
          )}
        </div>
      </MetricCell>

      <MetricCell
        label={`With overpaying${pvSuffix}`}
        value={currencyFormatter.format(displayOverpayTotalPaid)}
      >
        <div className="space-y-1">
          <DetailRow
            label="Payoff time"
            value={formatYears(overpay.monthsToPayoff)}
          />
          {overpay.writtenOff ? (
            <DetailRow
              label="Written off"
              value={currencyFormatter.format(overpay.amountWrittenOff)}
              tone="muted"
            />
          ) : baseline.writtenOff ? (
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-cta">Paid off</span>
            </div>
          ) : null}
        </div>
      </MetricCell>
    </MetricReadout>
  );
}
