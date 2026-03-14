import Link from "next/link";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { PageLayout } from "@/components/layout/PageLayout";
import { Heading } from "@/components/typography/Heading";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { formatGBP } from "@/lib/format";
import { PLAN_CONFIGS } from "@/lib/loans/plans";
import { ThresholdComparisonChart } from "./ThresholdComparisonChart";

const plan2Threshold = PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12;
const FREEZE_THRESHOLD = 29_385;
const EXAMPLE_SALARY = 35_000;
const REPAYMENT_RATE = PLAN_CONFIGS.PLAN_2.repaymentRate;

// Monthly repayment at £35k with current threshold
const monthlyRepaymentCurrent = Math.round(
  ((EXAMPLE_SALARY - plan2Threshold) * REPAYMENT_RATE) / 12,
);

// Monthly repayment at £35k with the frozen threshold (£29,385)
const monthlyRepaymentFrozen = Math.round(
  ((EXAMPLE_SALARY - FREEZE_THRESHOLD) * REPAYMENT_RATE) / 12,
);

// By 2029/30, inflation-linked would be ~£32,250 (3.2% growth for 4 years from £28,470)
const PROJECTED_INFLATION_LINKED = 32_250;
const THRESHOLD_GAP = PROJECTED_INFLATION_LINKED - FREEZE_THRESHOLD;
const EXTRA_ANNUAL = Math.round(THRESHOLD_GAP * REPAYMENT_RATE);

export function ThresholdFreezeGuide() {
  return (
    <PageLayout>
      <article className="space-y-8">
        <div className="space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/guides" />}>
                  Guides
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Threshold Freeze Explained</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                New
              </span>
              <span>March 2026</span>
            </div>
            <Heading as="h1">Student Loan Threshold Freeze Explained</Heading>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            The Plan 2 repayment threshold will freeze at{" "}
            {formatGBP(FREEZE_THRESHOLD)} for three years from April 2027. With
            wages still rising, that means you start repaying sooner and pay
            more each month. Here&apos;s exactly what the freeze costs you, and
            what the 2026 parliamentary inquiry means.
          </p>
        </div>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What Is the Threshold Freeze?
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Repayment thresholds normally rise with inflation each year. You
              only repay 9% of your income <em>above</em> the threshold, so when
              it rises, your monthly payments stay roughly the same in real
              terms.
            </p>
            <p>
              On 26 November 2025, the Chancellor announced that the Plan 2
              threshold will rise to {formatGBP(FREEZE_THRESHOLD)} in April
              2026, then{" "}
              <strong className="text-foreground">
                freeze at {formatGBP(FREEZE_THRESHOLD)} for three years
              </strong>{" "}
              (2027&ndash;28 through 2029&ndash;30). RPI-linked increases resume
              from April 2030.
            </p>
            <p>
              The mechanism is simple: if the threshold doesn&apos;t rise but
              your wages do, a larger share of your salary falls above the
              threshold each year. That means higher monthly repayments without
              any change to your payslip&apos;s &ldquo;Student Loan&rdquo;
              deduction rate.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Which Plans Are Affected?
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              The freeze is primarily a{" "}
              <strong className="text-foreground">Plan 2</strong> issue. Plan 2
              covers anyone who started university in England or Wales between
              September 2012 and July 2023 &mdash; the largest cohort of
              borrowers.
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong className="text-foreground">Plan 2</strong>: Threshold
                frozen at {formatGBP(FREEZE_THRESHOLD)} from 2027&ndash;28
                through 2029&ndash;30.
              </li>
              <li>
                <strong className="text-foreground">Plan 5</strong>: The{" "}
                {formatGBP(PLAN_CONFIGS.PLAN_5.monthlyThreshold * 12)} threshold
                actually <em>starts rising</em> with RPI from April 2027. Not
                subject to the same freeze.
              </li>
              <li>
                <strong className="text-foreground">Plan 1</strong>: Threshold
                continues to adjust annually with RPI. Not frozen.
              </li>
              <li>
                <strong className="text-foreground">Plan 4</strong>: Threshold
                continues to adjust annually. Not frozen.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            How the Freeze Affects Your Monthly Repayments
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Take someone earning {formatGBP(EXAMPLE_SALARY)} on Plan 2. At the
              current threshold of {formatGBP(plan2Threshold)}, they repay 9% of
              the {formatGBP(EXAMPLE_SALARY - plan2Threshold)} above the
              threshold &mdash; roughly{" "}
              <strong className="text-foreground">
                {formatGBP(monthlyRepaymentCurrent)}/month
              </strong>
              .
            </p>
            <p>
              Once the threshold moves to {formatGBP(FREEZE_THRESHOLD)} in April
              2026, that same salary gives monthly repayments of roughly{" "}
              <strong className="text-foreground">
                {formatGBP(monthlyRepaymentFrozen)}/month
              </strong>
              . But here&apos;s the catch: the threshold then stays at{" "}
              {formatGBP(FREEZE_THRESHOLD)} while salaries keep rising. Each pay
              rise pushes more income above the frozen line.
            </p>
            <p>
              If thresholds had kept pace with inflation, they&apos;d be higher
              each year, and the gap between salary and threshold would grow
              more slowly. The freeze effectively turns every pay rise into a
              bigger student loan bill.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Three Scenarios Compared
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              The chart below shows three trajectories for the Plan 2 repayment
              threshold from 2025/26 through 2030/31:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong className="text-foreground">Inflation-linked</strong>{" "}
                &mdash; what the threshold would look like with continuous RPI
                growth.
              </li>
              <li>
                <strong className="text-foreground">Old policy</strong> &mdash;
                the previous plan (threshold frozen at{" "}
                {formatGBP(plan2Threshold)} through April 2027, then resuming
                RPI).
              </li>
              <li>
                <strong className="text-foreground">New policy</strong> &mdash;
                the current policy (bumped to {formatGBP(FREEZE_THRESHOLD)} in
                April 2026, then frozen through 2029/30).
              </li>
            </ul>
            <p>
              The new policy gives a short-term bump, but the three-year freeze
              means it falls well behind inflation-linked growth by
              2029&ndash;30.
            </p>
          </div>
        </section>

        <ThresholdComparisonChart />

        <section className="space-y-3">
          <Heading as="h2" size="section">
            The Real Cost Over Time
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              By 2029&ndash;30, an inflation-linked threshold would be roughly{" "}
              {formatGBP(PROJECTED_INFLATION_LINKED)} &mdash; compared to the
              frozen {formatGBP(FREEZE_THRESHOLD)}. That&apos;s a gap of about{" "}
              <strong className="text-foreground">
                {formatGBP(THRESHOLD_GAP)}
              </strong>
              .
            </p>
            <p>
              At {formatGBP(EXAMPLE_SALARY)}, that gap translates to roughly{" "}
              <strong className="text-foreground">
                {formatGBP(EXTRA_ANNUAL)}/year
              </strong>{" "}
              more in repayments than you&apos;d pay under an inflation-linked
              threshold. Over three years, the extra cost adds up to several
              hundred pounds.
            </p>
            <p>
              To see the impact at your salary, try the{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                repayment calculator
              </Link>{" "}
              &mdash; set threshold growth to 0% to model the freeze, or 3% for
              inflation-linked growth.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            The Parliamentary Inquiry
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              On 12 March 2026, the Treasury Select Committee launched a
              parliamentary inquiry into student loans. The inquiry examines the
              fairness of repayment terms &mdash; with particular focus on the
              threshold freeze and its interaction with the tax system.
            </p>
            <p>
              The evidence deadline is 14 April 2026. While the inquiry covers
              all plan types, Plan 2 and the threshold freeze are the central
              issues. The outcome could influence future threshold policy.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Stay Up to Date
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Our calculator updates threshold figures automatically as soon as
              GOV.UK publishes changes &mdash; we check daily. When the new{" "}
              {formatGBP(FREEZE_THRESHOLD)} threshold comes into effect in April
              2026, our numbers will update automatically.
            </p>
            <p>
              See{" "}
              <Link
                href="/our-data"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                how we stay current
              </Link>{" "}
              for more on our data pipeline.
            </p>
          </div>
        </section>

        <RelatedGuides
          current="threshold-freeze"
          order={["plan-2-vs-plan-5", "how-interest-works"]}
          extraLinks={[
            {
              href: "https://committees.parliament.uk/work/8864/student-loans/",
              label: "Treasury Committee: Student Loans Inquiry",
            },
          ]}
        />
      </article>
    </PageLayout>
  );
}
