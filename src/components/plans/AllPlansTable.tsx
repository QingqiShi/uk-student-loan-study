import Link from "next/link";
import { currencyFormatter } from "@/constants";
import { formatPercent } from "@/lib/format";
import { PROSE_LINK } from "@/lib/layout";
import type { PlanPageKey } from "@/lib/planContent";
import { PLAN_PAGE_ORDER, PLAN_PAGES } from "@/lib/planContent";
import { surfaceCard } from "@/lib/surfaces";
import { cn } from "@/lib/utils";

interface AllPlansTableProps {
  /** Plan whose row should be visually emphasised (its own page). */
  highlight?: PlanPageKey;
}

/**
 * At-a-glance comparison of every UK student loan plan. All figures are derived
 * from src/lib/loans/plans.ts via the plan content module, so they stay in sync
 * with the daily GOV.UK automation. Reused on the /plans hub and each plan page.
 */
export function AllPlansTable({ highlight }: AllPlansTableProps) {
  const headClass =
    "px-4 py-3 font-sans text-xs font-semibold tracking-wider text-muted-foreground uppercase";
  return (
    <div className={cn(surfaceCard, "overflow-x-auto")}>
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Comparison of UK student loan plans: repayment threshold, rate,
          interest and write-off period.
        </caption>
        <thead>
          <tr className="border-b border-border bg-muted/40 text-left">
            <th scope="col" className={headClass}>
              Plan
            </th>
            <th scope="col" className={headClass}>
              Who &amp; when
            </th>
            <th scope="col" className={cn(headClass, "text-right")}>
              Threshold
            </th>
            <th scope="col" className={cn(headClass, "text-right")}>
              Rate
            </th>
            <th scope="col" className={headClass}>
              Interest
            </th>
            <th scope="col" className={cn(headClass, "text-right")}>
              Write-off
            </th>
          </tr>
        </thead>
        <tbody>
          {PLAN_PAGE_ORDER.map((key) => {
            const plan = PLAN_PAGES[key];
            const isActive = key === highlight;
            return (
              <tr
                key={key}
                className={cn(
                  "border-b border-border last:border-b-0",
                  isActive && "bg-accent-wash",
                )}
              >
                <th
                  scope="row"
                  className="px-4 py-3 text-left align-top font-semibold whitespace-nowrap"
                >
                  {isActive ? (
                    <span className="text-cta" aria-current="page">
                      {plan.name}
                    </span>
                  ) : (
                    <Link href={`/plans/${plan.slug}`} className={PROSE_LINK}>
                      {plan.name}
                    </Link>
                  )}
                </th>
                <td className="px-4 py-3 align-top text-muted-foreground">
                  <span className="block">{plan.region}</span>
                  <span className="block text-xs">{plan.years}</span>
                </td>
                <td className="px-4 py-3 text-right align-top font-mono tabular-nums">
                  {currencyFormatter.format(plan.yearlyThreshold)}
                </td>
                <td className="px-4 py-3 text-right align-top font-mono tabular-nums">
                  {formatPercent(plan.repaymentRate * 100)}
                </td>
                <td className="px-4 py-3 align-top text-muted-foreground">
                  <span className="block">{plan.interestShort}</span>
                  <span className="block text-xs">
                    {plan.interestCurrent} now
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-top font-mono whitespace-nowrap tabular-nums">
                  {plan.writeOffYears}
                  <span className="ml-0.5 font-sans text-xs font-medium text-muted-foreground">
                    yrs
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
