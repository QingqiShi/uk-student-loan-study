"use client";

import { currencyFormatter } from "@/constants";
import { useResultSummary } from "@/hooks/useResultSummary";
import { useShowPresentValue } from "@/hooks/useStoreSelectors";

export function LivePreview() {
  const summary = useResultSummary();
  const showPresentValue = useShowPresentValue();

  if (!summary) return null;

  const years = summary.monthsToPayoff / 12;
  const durationDisplay = years >= 1 ? `${String(Math.round(years))}y` : "<1y";

  return (
    <footer
      className="sticky bottom-0 border-t border-border/50 bg-background/80 py-3 text-sm backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex max-w-lg items-center justify-center gap-6 px-4">
        <span>
          <span className="font-mono font-medium tabular-nums">
            {currencyFormatter.format(summary.totalPaid)}
          </span>{" "}
          {showPresentValue ? "total (adj.)" : "total"}
        </span>
        <span>
          <span className="font-mono font-medium tabular-nums">
            {currencyFormatter.format(summary.monthlyRepayment)}
          </span>
          /month
        </span>
        <span>
          <span className="font-mono font-medium tabular-nums">
            {durationDisplay}
          </span>
        </span>
      </div>
    </footer>
  );
}
