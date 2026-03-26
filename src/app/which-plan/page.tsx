import { QuizContainer } from "@/components/quiz/QuizContainer";
import { AppErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Heading } from "@/components/typography/Heading";
import { currencyFormatter } from "@/constants";
import {
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";

const ALL_PLANS = [
  ...Object.values(PLAN_DISPLAY_INFO),
  POSTGRADUATE_DISPLAY_INFO,
];

export default function WhichPlanPage() {
  return (
    <AppErrorBoundary>
      <QuizContainer />
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-4xl px-3 py-12">
          <div className="mb-8 text-center">
            <Heading as="h2" size="section">
              All UK Student Loan Plans
            </Heading>
            <p className="mt-2 text-muted-foreground">
              A quick reference for every UK student loan plan type —
              thresholds, repayment rates, and write-off periods at a glance.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ALL_PLANS.map((plan) => (
              <div key={plan.name} className="rounded-xl border bg-card p-5">
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-muted-foreground">Threshold</dt>
                    <dd className="font-mono font-semibold tabular-nums">
                      {currencyFormatter.format(plan.yearlyThreshold)}/yr
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-muted-foreground">Rate</dt>
                    <dd className="font-mono font-semibold tabular-nums">
                      {String(plan.repaymentRate * 100)}%
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="text-muted-foreground">Write-off</dt>
                    <dd className="font-mono font-semibold tabular-nums">
                      {String(plan.writeOffYears)} years
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppErrorBoundary>
  );
}
