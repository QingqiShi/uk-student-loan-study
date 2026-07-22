import Link from "next/link";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import { PageLayout } from "@/components/layout/PageLayout";
import { Heading } from "@/components/typography/Heading";
import { formatPercent } from "@/lib/format";
import { CURRENT_RATES } from "@/lib/loans/plans";
import { GuideArticle, guideLink, KeyTakeaways } from "../guide-parts";
import { InflationComparisonChart } from "./InflationComparisonChart";

const rpi = CURRENT_RATES.rpi;
const cpiTarget = 2;
const gap = +(rpi - cpiTarget).toFixed(1);
const maxRate = rpi + 3;
const plan1Rate = Math.min(rpi, CURRENT_RATES.boeBaseRate + 1);

export function RpiVsCpiGuide() {
  return (
    <PageLayout>
      <GuideArticle
        breadcrumbLabel="RPI vs CPI"
        title="RPI vs CPI: why your student loan interest outpaces inflation"
        intro={
          <>
            Your student loan interest is tied to RPI, but when the calculator
            shows &ldquo;adjusted for inflation,&rdquo; it uses CPI. RPI
            typically runs 0.5&ndash;1% higher. That gap means your balance
            grows faster than the general cost of living.
          </>
        }
      >
        <section className="space-y-3">
          <Heading as="h2" size="section">
            What Are RPI and CPI?
          </Heading>
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
                : the ONS&apos;s preferred headline measure since 2017. Not used
                for student loans.
              </li>
            </ul>
            <p>
              The government stopped using RPI for most purposes because it
              overstates inflation, but student loans remain tied to it.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Why Student Loans Use RPI
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Plan 2 was introduced in 2012 when RPI was still widely used
              across government policy. The government has since acknowledged
              that RPI overstates inflation due to the &ldquo;formula
              effect&rdquo; &mdash; it uses an arithmetic mean rather than a
              geometric mean, which systematically produces higher figures.
            </p>
            <p>
              Plans exist to align RPI with CPIH by 2030, but current loan terms
              are unlikely to change retroactively. Each plan uses RPI in its
              interest formula:
            </p>
            <ul className="list-disc space-y-1 pl-6">
              <li>
                <strong className="text-foreground">Plan 5</strong>: RPI only (
                {formatPercent(rpi)})
              </li>
              <li>
                <strong className="text-foreground">Plan 2</strong>: RPI to RPI
                + 3% ({formatPercent(rpi)} &ndash; {formatPercent(maxRate)})
                depending on income
              </li>
              <li>
                <strong className="text-foreground">Plan 1 &amp; 4</strong>:
                lesser of RPI or base rate + 1% (currently{" "}
                {formatPercent(plan1Rate)})
              </li>
              <li>
                <strong className="text-foreground">Postgraduate</strong>: RPI +
                3% ({formatPercent(maxRate)})
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            The Gap Between RPI and CPI
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              RPI historically exceeds CPI by roughly 0.5&ndash;1 percentage
              points. With RPI at {formatPercent(rpi)} and the CPI target at{" "}
              {formatPercent(cpiTarget)}, the current gap is {gap} percentage
              points.
            </p>
            <p>
              Two factors drive the gap: RPI includes housing costs that CPI
              excludes, and RPI uses an arithmetic mean formula while CPI uses a
              geometric mean. The arithmetic mean always produces a higher
              result when prices are changing, which is why statisticians call
              it the &ldquo;formula effect.&rdquo;
            </p>
            <p>
              The chart below shows what this gap looks like over the life of a
              Plan 5 loan.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Inflation comparison
          </Heading>
          <ChartFrame
            caption={`Fig. 1 \u2014 Balance (present value) \u00b7 Plan 5, \u00a345,000`}
            figure={`RPI ${formatPercent(rpi)}`}
            figureTone="cost"
            bodyClassName="h-85 sm:h-105"
          >
            <InflationComparisonChart />
          </ChartFrame>
          <p className="text-sm text-muted-foreground">
            Plan 5, {"\u00a3"}45,000 balance. The gap between the CPI-adjusted
            and RPI-adjusted lines is the real above-inflation cost.
          </p>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Nominal, CPI-Adjusted, and RPI-Adjusted: Three Ways to See Your Loan
          </Heading>
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
                discounted by RPI. The balance appears roughly flat because RPI
                is close to the interest rate itself. But this is misleading
                because RPI overstates general inflation.
              </li>
            </ul>
            <p>
              The key insight: the gap between the CPI-adjusted and RPI-adjusted
              lines is the real above-inflation cost of the loan.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What This Means for Your Plan
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Plan 5</strong>: &ldquo;RPI
                only&rdquo; sounds gentle, but since RPI runs higher than CPI,
                the loan still grows faster than general prices.
              </li>
              <li>
                <strong className="text-foreground">Plan 2</strong>: the sliding
                scale starts at RPI (already above CPI). High earners face RPI +
                3%.
              </li>
              <li>
                <strong className="text-foreground">Plan 1 &amp; 4</strong>:
                capped at the lesser of RPI or base rate + 1%, so these
                borrowers are somewhat shielded.
              </li>
              <li>
                <strong className="text-foreground">Postgraduate</strong>: RPI +
                3% means the largest gap above CPI of any plan.
              </li>
            </ul>
            <p>
              If your loan is growing faster than general prices, explore
              whether{" "}
              <Link href="/overpay" className={guideLink}>
                overpaying
              </Link>{" "}
              could reduce the above-inflation cost.
            </p>
          </div>
        </section>

        <KeyTakeaways>
          <li>
            RPI typically runs 0.5&ndash;1% higher than CPI &mdash; your loan
            interest is tied to the higher measure.
          </li>
          <li>
            &ldquo;Adjusted for inflation&rdquo; in the calculator uses CPI, not
            RPI. Remaining growth after toggling is real above-inflation cost.
          </li>
          <li>
            Plan 5&apos;s &ldquo;inflation-only&rdquo; interest is
            RPI-inflation, not CPI-inflation.
          </li>
          <li>
            RPI may align with CPIH by 2030, but current borrowers are unlikely
            to benefit.
          </li>
          <li>
            See how inflation affects your total repayment with the{" "}
            <Link href="/" className={guideLink}>
              student loan calculator
            </Link>
            .
          </li>
        </KeyTakeaways>

        <RelatedGuides
          current="rpi-vs-cpi"
          order={["how-interest-works", "plan-2-vs-plan-5"]}
          tools={["/interest", "/effective-rate"]}
        />
      </GuideArticle>
    </PageLayout>
  );
}
