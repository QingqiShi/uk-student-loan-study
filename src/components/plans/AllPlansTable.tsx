import Link from "next/link";
import { currencyFormatter } from "@/constants";
import { formatPercent } from "@/lib/format";
import type { PlanPageKey } from "@/lib/planContent";
import { PLAN_PAGE_ORDER, PLAN_PAGES } from "@/lib/planContent";
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
  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">
          Comparison of UK student loan plans: repayment threshold, rate,
          interest and write-off period.
        </caption>
        <thead>
          <tr className="border-b bg-muted/50 text-left">
            <th scope="col" className="px-4 py-3 font-semibold">
              Plan
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Who &amp; when
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Threshold
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
              Rate
            </th>
            <th scope="col" className="px-4 py-3 font-semibold">
              Interest
            </th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">
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
                  "border-b last:border-b-0",
                  isActive && "bg-primary/5",
                )}
              >
                <th
                  scope="row"
                  className="px-4 py-3 text-left align-top font-medium whitespace-nowrap"
                >
                  {isActive ? (
                    <span className="text-primary">{plan.name}</span>
                  ) : (
                    <Link
                      href={`/plans/${plan.slug}`}
                      className="text-primary underline underline-offset-4 hover:text-primary/80"
                    >
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
                  {String(plan.writeOffYears)} yrs
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
