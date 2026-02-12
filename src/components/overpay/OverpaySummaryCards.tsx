import type { OverpayAnalysisResult } from "@/lib/loans/overpay-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormatter } from "@/constants";

interface OverpaySummaryCardsProps {
  analysis: OverpayAnalysisResult;
}

export function OverpaySummaryCards({ analysis }: OverpaySummaryCardsProps) {
  const { baseline, overpay, paymentDifference, monthsSaved } = analysis;

  const formatYears = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${String(years)} ${years === 1 ? "year" : "years"}`;
    }
    return `${String(years)}y ${String(remainingMonths)}m`;
  };

  const hasSavings = paymentDifference > 0;
  const hasExtraCost = paymentDifference < 0;

  const getCardClassName = () => {
    if (hasSavings) {
      return "border-status-success-border bg-status-success-bg";
    }
    if (hasExtraCost) {
      return "border-status-danger-border bg-status-danger-bg";
    }
    return "";
  };

  const getValueClassName = () => {
    if (hasSavings) {
      return "text-status-success";
    }
    if (hasExtraCost) {
      return "text-status-danger";
    }
    return "";
  };

  return (
    <div className="-mx-4 flex snap-x scroll-pl-4 gap-3 overflow-x-auto px-4 py-1 sm:mx-0 sm:grid sm:scroll-pl-0 sm:grid-cols-3 sm:p-1 md:grid-cols-1 md:overflow-visible">
      <Card
        size="sm"
        className={`min-w-[200px] shrink-0 snap-start sm:min-w-0 sm:shrink ${getCardClassName()}`}
      >
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            {hasExtraCost ? "Extra Cost" : "Your Savings"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p
              className={`text-2xl font-bold tabular-nums ${getValueClassName()}`}
            >
              {hasExtraCost
                ? `+${currencyFormatter.format(Math.abs(paymentDifference))}`
                : currencyFormatter.format(Math.max(0, paymentDifference))}
            </p>
            <p className="text-xs text-muted-foreground">
              {hasExtraCost ? "Extra you'd pay" : "Money saved"}
            </p>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time saved</span>
            <span className={`font-medium tabular-nums ${getValueClassName()}`}>
              {formatYears(Math.max(0, monthsSaved))}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="min-w-[200px] shrink-0 snap-start sm:min-w-0 sm:shrink"
      >
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            Without Overpaying
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {currencyFormatter.format(baseline.totalPaid)}
            </p>
            <p className="text-xs text-muted-foreground">Total paid</p>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium tabular-nums">
              {formatYears(baseline.monthsToPayoff)}
            </span>
          </div>
          {baseline.writtenOff && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Written off</span>
              <span className="font-medium text-status-info tabular-nums">
                {currencyFormatter.format(baseline.amountWrittenOff)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card
        size="sm"
        className="min-w-[200px] shrink-0 snap-start sm:min-w-0 sm:shrink"
      >
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            With Overpaying
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {currencyFormatter.format(overpay.totalPaid)}
            </p>
            <p className="text-xs text-muted-foreground">Total paid</p>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="font-medium tabular-nums">
              {formatYears(overpay.monthsToPayoff)}
            </span>
          </div>
          {overpay.writtenOff && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Written off</span>
              <span className="font-medium text-status-info tabular-nums">
                {currencyFormatter.format(overpay.amountWrittenOff)}
              </span>
            </div>
          )}
          {!overpay.writtenOff && baseline.writtenOff && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-status-success">Paid off</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default OverpaySummaryCards;
