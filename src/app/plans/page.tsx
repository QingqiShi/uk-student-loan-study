import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";
import { AllPlansTable } from "@/components/plans/AllPlansTable";
import { PlanCtaCards } from "@/components/plans/PlanCtaCards";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { currencyFormatter } from "@/constants";
import { formatPercent } from "@/lib/format";
import { PLAN_PAGE_ORDER, PLAN_PAGES } from "@/lib/planContent";

const LINK_CLASS =
  "text-primary underline underline-offset-4 hover:text-primary/80";

export default function PlansHubPage() {
  return (
    <PageLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Loan Plans</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <Heading as="h1">UK Student Loan Plans Explained</Heading>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              The UK has five student loan plans, and which one you are on
              decides your repayment threshold, interest rate and write-off
              date. Compare Plan 1, Plan 2, Plan 4, Plan 5 and the Postgraduate
              Loan below, then open a plan for the full detail. Whatever your
              plan, it is middle earners who repay the most.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            All UK student loan plans compared
          </Heading>
          <p className="text-sm text-muted-foreground sm:text-base">
            Every plan&rsquo;s repayment threshold, rate, interest and write-off
            period at a glance. Figures update automatically from GOV.UK and the
            Bank of England.
          </p>
          <AllPlansTable />
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Explore each plan
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PLAN_PAGE_ORDER.map((key) => {
              const plan = PLAN_PAGES[key];
              return (
                <Link
                  key={key}
                  href={`/plans/${plan.slug}`}
                  className="group block h-full"
                >
                  <div className="flex h-full flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-all duration-200 hover:bg-accent hover:ring-primary/30">
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {plan.region} &middot; {plan.years}
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
                          {formatPercent(plan.repaymentRate * 100)}
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
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Which plan am I on?
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              You cannot choose your plan &mdash; it is set by when and where
              you started studying. English students who began before September
              2012 are on Plan 1; those who started between 2012 and 2023 are on
              Plan 2; and those from September 2023 are on Plan 5. Scottish
              students are on Plan 4, and Northern Irish students are on Plan 1.
              A Postgraduate Loan sits on top of any of these.
            </p>
            <p>
              Not sure?{" "}
              <Link href="/which-plan" className={LINK_CLASS}>
                Take the 3-question which plan quiz
              </Link>{" "}
              to find out in under a minute.
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
          <Heading as="h2" size="subsection">
            Why middle earners repay the most
          </Heading>
          <p className="text-muted-foreground">
            Whichever plan you are on, the total you repay follows the same
            shape. Low earners repay little and reach the write-off with a
            balance forgiven. High earners clear the loan quickly, before much
            interest builds. It is the middle &mdash; graduates earning enough
            to make real repayments, but not enough to outrun the interest
            &mdash; who repay the most, often far more than they borrowed.
          </p>
          <p className="text-muted-foreground">
            That is the whole reason this site exists. Put your salary into the{" "}
            <Link href="/" className={LINK_CLASS}>
              student loan repayment calculator
            </Link>{" "}
            to see where you fall on the curve for your plan.
          </p>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Work out your repayments
          </Heading>
          <PlanCtaCards />
        </section>
      </div>
    </PageLayout>
  );
}
