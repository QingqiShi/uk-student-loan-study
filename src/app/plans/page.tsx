import Link from "next/link";
import { LinkIndex, LinkIndexRow } from "@/components/instrument/LinkIndex";
import { Panel } from "@/components/instrument/Panel";
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
import { PROSE_LINK } from "@/lib/layout";
import { PLAN_PAGE_ORDER, PLAN_PAGES } from "@/lib/planContent";

export default function PlansHubPage() {
  return (
    <PageLayout>
      <div className="space-y-12">
        <header className="space-y-4">
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

          <div className="space-y-3">
            <Heading as="h1">UK Student Loan Plans Explained</Heading>
            <p className="max-w-2xl text-lead text-muted-foreground">
              The UK has five student loan plans, and which one you are on
              decides your repayment threshold, interest rate and write-off
              date. Compare Plan 1, Plan 2, Plan 4, Plan 5 and the Postgraduate
              Loan below, then open a plan for the full detail. Whatever your
              plan, it is middle earners who repay the most.
            </p>
          </div>
        </header>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            All UK student loan plans compared
          </Heading>
          <p className="max-w-2xl text-muted-foreground">
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
          <LinkIndex>
            {PLAN_PAGE_ORDER.map((key) => {
              const plan = PLAN_PAGES[key];
              return (
                <LinkIndexRow
                  key={key}
                  href={`/plans/${plan.slug}`}
                  title={plan.name}
                  description={`${plan.region} · ${plan.years}`}
                />
              );
            })}
          </LinkIndex>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Which plan am I on?
          </Heading>
          <div className="max-w-2xl space-y-3 text-muted-foreground">
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
              <Link href="/which-plan" className={PROSE_LINK}>
                Take the 3-question which plan quiz
              </Link>{" "}
              to find out in under a minute.
            </p>
          </div>
        </section>

        <Panel className="space-y-3" padding>
          <Heading as="h2" size="subsection">
            Why middle earners repay the most
          </Heading>
          <p className="max-w-2xl text-muted-foreground">
            Whichever plan you are on, the total you repay follows the same
            shape. Low earners repay little and reach the write-off with a
            balance forgiven. High earners clear the loan quickly, before much
            interest builds. It is the middle &mdash; graduates earning enough
            to make real repayments, but not enough to outrun the interest
            &mdash; who repay the most, often far more than they borrowed.
          </p>
          <p className="max-w-2xl text-muted-foreground">
            That is the whole reason this site exists. Put your salary into the{" "}
            <Link href="/" className={PROSE_LINK}>
              student loan repayment calculator
            </Link>{" "}
            to see where you fall on the curve for your plan.
          </p>
        </Panel>

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
