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

const monthlyRepaymentCurrent = Math.round(
  ((EXAMPLE_SALARY - plan2Threshold) * REPAYMENT_RATE) / 12,
);

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
            <Heading as="h1">
              The Plan 2 Threshold Has Been Frozen Three Times Now
            </Heading>
          </div>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Every few years, the government freezes the salary at which Plan 2
            graduates start repaying. Each freeze quietly increases what you pay
            each month. It&apos;s happened before, it&apos;s happening again,
            and Parliament is finally asking whether it&apos;s fair.
          </p>
        </div>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Where Things Stand Today
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Right now (2025/26), the Plan 2 repayment threshold sits at{" "}
              <strong className="text-foreground">
                {formatGBP(plan2Threshold)}
              </strong>
              . You pay 9% of everything you earn above that figure. At a salary
              of {formatGBP(EXAMPLE_SALARY)}, that works out to roughly{" "}
              <strong className="text-foreground">
                {formatGBP(monthlyRepaymentCurrent)}/month
              </strong>
              .
            </p>
            <p>
              In April 2026, the threshold rises to{" "}
              {formatGBP(FREEZE_THRESHOLD)} &mdash; a small bump that lowers
              monthly repayments to around{" "}
              <strong className="text-foreground">
                {formatGBP(monthlyRepaymentFrozen)}/month
              </strong>{" "}
              at the same salary. So far, so normal. But what comes next
              isn&apos;t.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            The 2025 Budget: Another Three-Year Freeze
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              In the Autumn Budget on 30 October 2025, Chancellor Rachel Reeves
              announced that the Plan 2 threshold will{" "}
              <strong className="text-foreground">
                freeze at {formatGBP(FREEZE_THRESHOLD)} for three years
              </strong>{" "}
              from April 2027 to April 2030. Inflation-linked rises won&apos;t
              resume until 2030/31.
            </p>
            <p>
              The effect is straightforward: if your salary rises but the
              threshold doesn&apos;t, a bigger slice of your income sits above
              the line each year. Every pay rise becomes a slightly larger
              student loan bill &mdash; without any change to the 9% rate on
              your payslip.
            </p>
            <p>
              By 2029/30, an inflation-linked threshold would be roughly{" "}
              {formatGBP(PROJECTED_INFLATION_LINKED)}. Instead it&apos;ll be{" "}
              {formatGBP(FREEZE_THRESHOLD)} &mdash; a gap of{" "}
              <strong className="text-foreground">
                {formatGBP(THRESHOLD_GAP)}
              </strong>
              . At {formatGBP(EXAMPLE_SALARY)}, that gap costs you about{" "}
              <strong className="text-foreground">
                {formatGBP(EXTRA_ANNUAL)} extra per year
              </strong>{" "}
              in repayments.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            This Is the Third Time
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Freezing the Plan 2 threshold isn&apos;t new. It&apos;s a pattern:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">
                  2012&ndash;2018: Frozen at £21,000 for six years.
                </strong>{" "}
                When Plan 2 launched, the threshold was set at £21,000 and never
                moved. In November 2015, the government confirmed it would stay
                frozen until at least 2021. Theresa May reversed this in October
                2017, raising it to £25,000 from April 2018.
              </li>
              <li>
                <strong className="text-foreground">
                  2021&ndash;2025: Frozen at £27,295 for four years.
                </strong>{" "}
                After rising with average earnings for a few years, the
                threshold was frozen again at £27,295 from 2021/22 through
                2024/25. Without this freeze, it would have been closer to
                £31,000 by now.
              </li>
              <li>
                <strong className="text-foreground">
                  2027&ndash;2030: Frozen at {formatGBP(FREEZE_THRESHOLD)} for
                  three years.
                </strong>{" "}
                The threshold gets one year of growth (to{" "}
                {formatGBP(FREEZE_THRESHOLD)} in April 2026), then freezes
                again.
              </li>
            </ul>
            <p>
              In the 14 years since Plan 2 began, the threshold has only risen
              with inflation for about four of them. The rest of the time,
              it&apos;s been frozen.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What the Threshold Would Look Like Without Freezes
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              The chart below compares three trajectories for the Plan 2
              threshold from 2025/26 to 2030/31:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong className="text-foreground">Inflation-linked</strong>{" "}
                &mdash; if the threshold had always kept pace with RPI.
              </li>
              <li>
                <strong className="text-foreground">Old policy</strong> &mdash;
                what was in place before the Budget (frozen at{" "}
                {formatGBP(plan2Threshold)} through April 2027, then resuming
                RPI).
              </li>
              <li>
                <strong className="text-foreground">New policy</strong> &mdash;
                bumped to {formatGBP(FREEZE_THRESHOLD)} in April 2026, then
                frozen again through 2029/30.
              </li>
            </ul>
            <p>
              The new policy trades a short-term bump for a longer freeze. By
              2029/30, it falls well behind where an inflation-linked threshold
              would be.
            </p>
          </div>
        </section>

        <ThresholdComparisonChart />

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What About Other Plans?
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              The freeze only applies to{" "}
              <strong className="text-foreground">Plan 2</strong> (2012&ndash;23
              borrowers in England and Wales) &mdash; the largest cohort. Other
              plans are unaffected:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong className="text-foreground">Plan 5</strong> (2023+
                borrowers): The{" "}
                {formatGBP(PLAN_CONFIGS.PLAN_5.monthlyThreshold * 12)} threshold
                actually <em>starts rising</em> with RPI from April 2027.
              </li>
              <li>
                <strong className="text-foreground">Plan 1</strong> and{" "}
                <strong className="text-foreground">Plan 4</strong>: Continue
                annual RPI adjustments as normal.
              </li>
            </ul>
            <p>
              Wales has also indicated it will not apply the freeze for Welsh
              Plan 2 borrowers.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Parliament Is Asking Questions
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              On 12 March 2026, the Treasury Committee launched an inquiry into{" "}
              <strong className="text-foreground">
                &ldquo;Student Loans and Taxation of Graduates&rdquo;
              </strong>
              . Chair Dame Meg Hillier framed it directly: &ldquo;What
              we&apos;re asking is, have the goalposts been moved in a way which
              is unfair to graduates?&rdquo;
            </p>
            <p>
              The inquiry focuses on whether the repeated freezes &mdash;
              combined with Plan 2&apos;s complex interest rules &mdash; mean
              graduates are repaying far more than they were led to expect. The
              average Plan 2 balance is £43,645, compared to £10,252 for Plan 1
              borrowers.
            </p>
            <p>
              The evidence deadline is{" "}
              <strong className="text-foreground">14 April 2026</strong>, and
              anyone over 16 can submit their experience. The outcome could
              shape future threshold policy.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            See the Impact on Your Repayments
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              The numbers above use a {formatGBP(EXAMPLE_SALARY)} salary as an
              example. To see what the freeze means at your income, try the{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                repayment calculator
              </Link>{" "}
              &mdash; set threshold growth to 0% to model the freeze, or 3% for
              inflation-linked growth.
            </p>
            <p>
              Our calculator updates automatically when GOV.UK publishes new
              figures &mdash; we check daily. See{" "}
              <Link
                href="/our-data"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                how we stay current
              </Link>{" "}
              for details.
            </p>
          </div>
        </section>

        <RelatedGuides
          current="threshold-freeze"
          order={["plan-2-vs-plan-5", "how-interest-works"]}
          extraLinks={[
            {
              href: "https://committees.parliament.uk/work/9682/student-loans-and-taxation-of-graduates/",
              label:
                "Treasury Committee: Student Loans and Taxation of Graduates",
            },
          ]}
        />
      </article>
    </PageLayout>
  );
}
