"use client";

import { currencyFormatter } from "@/constants";
import { useResultSummary } from "@/hooks/useResultSummary";

export function LivePreview() {
  const summary = useResultSummary();

  if (!summary) return null;

  const years = summary.monthsToPayoff / 12;
  const durationDisplay = years >= 1 ? `${String(Math.round(years))}y` : "<1y";

  return (
    <div
      className="flex items-center justify-center gap-6 border-t py-3 text-sm"
      role="status"
      aria-live="polite"
    >
      <span>
        <span className="font-mono font-medium tabular-nums">
          {currencyFormatter.format(summary.totalPaid)}
        </span>{" "}
        total
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
  );
}
