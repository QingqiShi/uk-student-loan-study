import Link from "next/link";
import { CostComparisonChart } from "./CostComparisonChart";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { formatGBP } from "@/lib/format";
import {
  PLAN_CONFIGS,
  PLAN_DISPLAY_INFO,
  TUITION_FEE_CAP,
} from "@/lib/loans/plans";

const tuitionTotal = TUITION_FEE_CAP * 3;
const writeOffYears = PLAN_CONFIGS.PLAN_5.writeOffYears;
const threshold = formatGBP(PLAN_DISPLAY_INFO.PLAN_5.yearlyThreshold);
const tuitionFormatted = formatGBP(tuitionTotal);
const feeCapFormatted = formatGBP(TUITION_FEE_CAP);

export function PayUpfrontGuide() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 px-3 pt-13 pb-6 md:pb-8"
      >
        <article className="space-y-8">
          <div className="space-y-4">
            <Breadcrumb
              parents={[{ label: "Guides", href: "/guides" }]}
              currentTitle="Pay Upfront or Take the Loan?"
            />

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Should You Pay Tuition Upfront or Take the Loan?
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              The answer depends on how much the graduate will earn over their
              career &mdash; and starting salary alone doesn&rsquo;t tell the
              whole story.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              The Cost of Paying Upfront
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                At the current maximum tuition fee of {feeCapFormatted} per
                year, a standard three-year undergraduate degree costs{" "}
                <strong className="text-foreground">{tuitionFormatted}</strong>{" "}
                in tuition fees alone. Paying this upfront means handing over
                that sum before the student even starts, with no possibility of
                getting any of it back.
              </p>
              <p>
                That money is gone regardless of what happens next &mdash;
                whether the graduate earns &pound;25,000 or &pound;100,000 a
                year, the cost is fixed at {tuitionFormatted}.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              What Happens If You Take the Loan Instead
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Under Plan 5, tuition fee loans are written off{" "}
                <strong className="text-foreground">
                  {writeOffYears} years
                </strong>{" "}
                after the graduate becomes eligible to repay. Repayments are 9%
                of earnings above the {threshold} threshold, and interest is
                charged at RPI only.
              </p>
              <p>
                The total you end up paying depends on your earning trajectory
                over those {writeOffYears} years, and graduates broadly fall
                into three groups:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Low earners</strong>{" "}
                  &mdash; repayments stay small and the loan is partially
                  written off. Total cost ends up well below {tuitionFormatted}.
                  The loan is clearly cheaper than paying upfront.
                </li>
                <li>
                  <strong className="text-foreground">Middle earners</strong>{" "}
                  &mdash; this is the trap. You earn enough to keep repaying for
                  decades but not enough to clear the balance before interest
                  compounds. Total repayments can exceed the upfront cost,
                  sometimes significantly. This is the group that ends up paying
                  the most.
                </li>
                <li>
                  <strong className="text-foreground">High earners</strong>{" "}
                  &mdash; clear the loan relatively quickly, so interest
                  doesn&rsquo;t compound much. Total cost is close to or
                  slightly above the upfront price, and you kept your capital in
                  the meantime.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              The Salary Growth Trap
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                A graduate starting on &pound;30,000 might think &ldquo;at this
                salary I&rsquo;ll barely repay anything.&rdquo; But salaries
                grow. At 4% annual growth &mdash; a typical career progression
                &mdash; a &pound;30k starting salary reaches roughly &pound;65k
                after 20 years.
              </p>
              <p>
                As salary grows, repayments increase, and many graduates who
                expected to be in the &ldquo;low earner&rdquo; category end up
                firmly in the middle-earner zone, paying more than the upfront
                cost over the life of the loan.
              </p>
              <p>
                The chart below shows how this plays out. Notice the gap between
                the flat-salary line and the growing-salary line &mdash; that
                gap is the hidden cost of salary growth that a snapshot of your
                starting salary won&rsquo;t reveal.
              </p>
            </div>
          </section>

          <CostComparisonChart />

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              When Paying Upfront Makes Sense
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Paying upfront can save money for graduates who will land in the
                middle-earner zone &mdash; not just the highest earners.
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  The graduate expects moderate-to-high earnings over their
                  career (the middle-earner zone where total repayments exceed
                  the upfront cost)
                </li>
                <li>
                  The family has the funds available without impacting their own
                  financial security
                </li>
                <li>
                  The graduate wants to avoid decades of repayments that end up
                  exceeding the original tuition cost
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              When Taking the Loan Makes Sense
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                The loan works best at the extremes of the earning spectrum, and
                as a safety net for uncertainty.
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  The graduate expects to stay on a lower salary &mdash; the
                  loan will be partially written off, costing less than paying
                  upfront
                </li>
                <li>
                  The graduate expects very high earnings &mdash; they clear the
                  loan quickly and kept their capital invested in the meantime
                </li>
                <li>
                  The family would rather keep the {tuitionFormatted} as a
                  financial safety net
                </li>
                <li>
                  Repayments adjust automatically if earnings drop &mdash;
                  built-in insurance that paying upfront doesn&rsquo;t offer
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Key Takeaways
            </h2>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
              <li>
                The loan is not universally cheaper than paying upfront &mdash;
                it depends on earning trajectory
              </li>
              <li>
                Starting salary is misleading; salary growth pushes many
                graduates into higher repayment brackets over time
              </li>
              <li>
                Middle earners often end up paying the most due to interest
                compounding over decades of repayments
              </li>
              <li>
                The loan works best for genuine low earners (partial write-off)
                or very high earners (fast repayment)
              </li>
              <li>
                <Link
                  href="/"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Use the student loan repayment calculator
                </Link>{" "}
                to model your specific scenario with your expected salary and
                growth rate
              </li>
            </ul>
          </section>

          <RelatedGuides
            current="pay-upfront-or-take-loan"
            order={["how-interest-works", "plan-2-vs-plan-5"]}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
