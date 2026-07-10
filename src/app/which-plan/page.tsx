import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { QuizContainer } from "@/components/quiz/QuizContainer";
import { Heading } from "@/components/typography/Heading";
import { currencyFormatter } from "@/constants";
import {
  PLAN_DISPLAY_INFO,
  POSTGRADUATE_DISPLAY_INFO,
} from "@/lib/loans/plans";
import { PLAN_PAGE_ORDER, PLAN_PAGES } from "@/lib/planContent";

const DISPLAY_BY_KEY = {
  PLAN_1: PLAN_DISPLAY_INFO.PLAN_1,
  PLAN_2: PLAN_DISPLAY_INFO.PLAN_2,
  PLAN_4: PLAN_DISPLAY_INFO.PLAN_4,
  PLAN_5: PLAN_DISPLAY_INFO.PLAN_5,
  POSTGRADUATE: POSTGRADUATE_DISPLAY_INFO,
} as const;

export default function WhichPlanPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <main id="main-content" className="flex-1">
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
                Tap any plan for the full breakdown.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PLAN_PAGE_ORDER.map((key) => {
                const plan = DISPLAY_BY_KEY[key];
                const slug = PLAN_PAGES[key].slug;
                return (
                  <Link
                    key={key}
                    href={`/plans/${slug}`}
                    className="group block h-full"
                  >
                    <div className="flex h-full flex-col rounded-xl border bg-card p-5 transition-all duration-200 hover:bg-accent hover:ring-1 hover:ring-primary/30">
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
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                        {plan.name} explained
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/plans"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Compare all UK student loan plans
                <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
