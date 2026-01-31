import type { OverpayAnalysisResult } from "@/lib/loans";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormatter } from "@/constants";

interface OverpaySummaryCardsProps {
  analysis: OverpayAnalysisResult;
}

export function OverpaySummaryCards({ analysis }: OverpaySummaryCardsProps) {
  const { baseline, overpay, investment } = analysis;

  const formatYears = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
      return `${String(years)} ${years === 1 ? "year" : "years"}`;
    }
    return `${String(years)}y ${String(remainingMonths)}m`;
  };

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card size="sm">
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
              <span className="font-medium text-blue-600 tabular-nums dark:text-blue-400">
                {currencyFormatter.format(baseline.amountWrittenOff)}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card size="sm">
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
              <span className="font-medium text-blue-600 tabular-nums dark:text-blue-400">
                {currencyFormatter.format(overpay.amountWrittenOff)}
              </span>
            </div>
          )}
          {!overpay.writtenOff && baseline.writtenOff && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                Paid off
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">
            If Invested Instead
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <p className="text-2xl font-bold tabular-nums">
              {currencyFormatter.format(investment.portfolioValue)}
            </p>
            <p className="text-xs text-muted-foreground">Portfolio value</p>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contributed</span>
            <span className="font-medium tabular-nums">
              {currencyFormatter.format(investment.totalContributed)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Returns</span>
            <span className="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
              +{currencyFormatter.format(investment.investmentGains)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default OverpaySummaryCards;
