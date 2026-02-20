import Link from "next/link";
import { InflationComparisonChart } from "./InflationComparisonChart";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { formatPercent } from "@/lib/format";
import { CURRENT_RATES } from "@/lib/loans/plans";

const rpi = CURRENT_RATES.rpi;
const cpiTarget = 2;
const gap = +(rpi - cpiTarget).toFixed(1);
const maxRate = rpi + 3;
const plan1Rate = Math.min(rpi, CURRENT_RATES.boeBaseRate + 1);

export function RpiVsCpiGuide() {
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
              currentTitle="RPI vs CPI"
            />

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              RPI vs CPI: Why Your Student Loan Interest Outpaces Inflation
            </h1>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              Your student loan interest is tied to RPI, but when the calculator
              shows &ldquo;adjusted for inflation,&rdquo; it uses CPI. RPI
              typically runs 0.5&ndash;1% higher. That gap means your balance
              grows faster than the general cost of living.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              What Are RPI and CPI?
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">
                    RPI (Retail Prices Index)
                  </strong>
                  : includes housing costs such as mortgage interest and council
                  tax. The Student Loans Company uses RPI to set loan interest
                  rates. Currently {formatPercent(rpi)}.
                </li>
                <li>
                  <strong className="text-foreground">
                    CPI (Consumer Prices Index)
                  </strong>
                  : the Bank of England&apos;s target measure with a 2% target.
                  Excludes housing costs. This is what the calculator&apos;s
                  &ldquo;Adjust for inflation&rdquo; toggle uses.
                </li>
                <li>
                  <strong className="text-foreground">
                    CPIH (CPI including Housing)
                  </strong>
                  : the ONS&apos;s preferred headline measure since 2017. Not
                  used for student loans.
                </li>
              </ul>
              <p>
                The government stopped using RPI for most purposes because it
                overstates inflation, but student loans remain tied to it.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Why Student Loans Use RPI
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Plan 2 was introduced in 2012 when RPI was still widely used
                across government policy. The government has since acknowledged
                that RPI overstates inflation due to the &ldquo;formula
                effect&rdquo; &mdash; it uses an arithmetic mean rather than a
                geometric mean, which systematically produces higher figures.
              </p>
              <p>
                Plans exist to align RPI with CPIH by 2030, but current loan
                terms are unlikely to change retroactively. Each plan uses RPI
                in its interest formula:
              </p>
              <ul className="list-disc space-y-1 pl-6">
                <li>
                  <strong className="text-foreground">Plan 5</strong>: RPI only
                  ({formatPercent(rpi)})
                </li>
                <li>
                  <strong className="text-foreground">Plan 2</strong>: RPI to
                  RPI + 3% ({formatPercent(rpi)} &ndash;{" "}
                  {formatPercent(maxRate)}) depending on income
                </li>
                <li>
                  <strong className="text-foreground">Plan 1 &amp; 4</strong>:
                  lesser of RPI or base rate + 1% (currently{" "}
                  {formatPercent(plan1Rate)})
                </li>
                <li>
                  <strong className="text-foreground">Postgraduate</strong>: RPI
                  + 3% ({formatPercent(maxRate)})
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              The Gap Between RPI and CPI
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <p>
                RPI historically exceeds CPI by roughly 0.5&ndash;1 percentage
                points. With RPI at {formatPercent(rpi)} and the CPI target at{" "}
                {formatPercent(cpiTarget)}, the current gap is {gap} percentage
                points.
              </p>
              <p>
                Two factors drive the gap: RPI includes housing costs that CPI
                excludes, and RPI uses an arithmetic mean formula while CPI uses
                a geometric mean. The arithmetic mean always produces a higher
                result when prices are changing, which is why statisticians call
                it the &ldquo;formula effect.&rdquo;
              </p>
              <p>
                The chart below shows what this gap looks like over the life of
                a Plan 5 loan.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Inflation Comparison
            </h2>
            <div className="h-85 sm:h-105">
              <InflationComparisonChart />
            </div>
            <p className="text-sm text-muted-foreground">
              Plan 5, {"\u00a3"}45,000 balance. The gap between the CPI-adjusted
              and RPI-adjusted lines is the real above-inflation cost.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Nominal, CPI-Adjusted, and RPI-Adjusted: Three Ways to See Your
              Loan
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Nominal</strong>: the raw
                  balance on your SLC account. Grows at the loan interest rate.
                </li>
                <li>
                  <strong className="text-foreground">CPI-adjusted</strong>:
                  discounted by CPI &mdash; this is what the calculator&apos;s
                  &ldquo;Adjust for inflation&rdquo; toggle shows. It tells you
                  what the balance is worth in today&apos;s money.
                </li>
                <li>
                  <strong className="text-foreground">RPI-adjusted</strong>:
                  discounted by RPI. The balance appears roughly flat because
                  RPI is close to the interest rate itself. But this is
                  misleading because RPI overstates general inflation.
                </li>
              </ul>
              <p>
                The key insight: the gap between the CPI-adjusted and
                RPI-adjusted lines is the real above-inflation cost of the loan.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              What This Means for Your Plan
            </h2>
            <div className="space-y-2 text-muted-foreground">
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong className="text-foreground">Plan 5</strong>:
                  &ldquo;RPI only&rdquo; sounds gentle, but since RPI runs
                  higher than CPI, the loan still grows faster than general
                  prices.
                </li>
                <li>
                  <strong className="text-foreground">Plan 2</strong>: the
                  sliding scale starts at RPI (already above CPI). High earners
                  face RPI + 3%.
                </li>
                <li>
                  <strong className="text-foreground">Plan 1 &amp; 4</strong>:
                  capped at the lesser of RPI or base rate + 1%, so these
                  borrowers are somewhat shielded.
                </li>
                <li>
                  <strong className="text-foreground">Postgraduate</strong>: RPI
                  + 3% means the largest gap above CPI of any plan.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-3">
            <div className="rounded-xl border bg-muted/50 p-5">
              <h2 className="mb-3 text-lg font-semibold tracking-tight">
                Key Takeaways
              </h2>
              <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                <li>
                  RPI typically runs 0.5&ndash;1% higher than CPI &mdash; your
                  loan interest is tied to the higher measure.
                </li>
                <li>
                  &ldquo;Adjusted for inflation&rdquo; in the calculator uses
                  CPI, not RPI. Remaining growth after toggling is real
                  above-inflation cost.
                </li>
                <li>
                  Plan 5&apos;s &ldquo;inflation-only&rdquo; interest is
                  RPI-inflation, not CPI-inflation.
                </li>
                <li>
                  RPI may align with CPIH by 2030, but current borrowers are
                  unlikely to benefit.
                </li>
                <li>
                  See how inflation affects your total repayment with the{" "}
                  <Link
                    href="/"
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    student loan calculator
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </section>

          <RelatedGuides
            current="rpi-vs-cpi"
            order={["how-interest-works", "plan-2-vs-plan-5"]}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
