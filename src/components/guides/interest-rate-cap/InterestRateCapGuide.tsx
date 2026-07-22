import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import { PageLayout } from "@/components/layout/PageLayout";
import { Heading } from "@/components/typography/Heading";
import { formatGBP, formatPercent } from "@/lib/format";
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";
import { getCurrentTaxYearLabel } from "@/lib/taxYear";
import { GuideArticle, KeyTakeaways } from "../guide-parts";
import { BalanceWithCapChart } from "./BalanceWithCapChart";
import { CurrentCapTable } from "./CurrentCapTable";
import { TOTAL_YEARS, YEARS_ABOVE_CAP } from "./historical-rates";
import { HistoricalRatesChart } from "./HistoricalRatesChart";
import { TotalCostComparisonChart } from "./TotalCostComparisonChart";

const rpi = CURRENT_RATES.rpi;
const currentMaxRate = rpi + 3;

// Derived from the current date so the label tracks the live plans.ts figures.
const currentTaxYear = getCurrentTaxYearLabel();

export function InterestRateCapGuide() {
  return (
    <PageLayout>
      <GuideArticle
        breadcrumbLabel="Interest Rate Cap"
        title="Plan 2 interest rate capped at 6%: what it means for you"
        intro={
          <>
            On 7 April 2026, the government announced a 6% cap on Plan 2 and
            Plan 3 student loan interest rates from September 2026. Here is what
            that means in practice and how much it could save you.
          </>
        }
      >
        <section className="space-y-3">
          <Heading as="h2" size="section">
            What Changed
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Plan 2 loans charge interest on a sliding scale: from RPI
              (currently {formatPercent(rpi)}) for lower earners up to RPI + 3%
              (currently {formatPercent(currentMaxRate)}) for those earning
              above{" "}
              <strong className="text-foreground">
                {formatGBP(PLAN_CONFIGS.PLAN_2.interestUpperThreshold)}
              </strong>
              . While studying, borrowers are charged the full RPI + 3%.
            </p>
            <p>
              From 1 September 2026, the maximum interest rate on Plan 2 and
              Plan 3 loans will be capped at{" "}
              <strong className="text-foreground">6%</strong>, regardless of
              what the RPI + 3% formula produces. This cap applies for the
              2026/27 academic year.
            </p>
            <p>
              At current rates, this barely bites &mdash; the maximum is{" "}
              {formatPercent(currentMaxRate)}, only{" "}
              {formatPercent(Math.round((currentMaxRate - 6) * 100) / 100)}{" "}
              above the cap. But the cap is designed as insurance: if inflation
              surges again, your interest rate will not follow it above 6%.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Plan 2 Interest Rates at a Glance ({currentTaxYear})
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              The key Plan 2 interest figures for the {currentTaxYear} tax year,
              alongside the 6% cap that applies from September 2026.
            </p>
          </div>
          <CurrentCapTable />
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Why the Government Acted
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Skills Minister Jacqui Smith cited the risk of inflation pressures
              from Middle East conflicts and global instability. When RPI
              spikes, the RPI + 3% formula can push interest rates well into
              double digits &mdash; exactly what happened in 2022&ndash;2024.
            </p>
            <p>
              The government had previously used the &ldquo;prevailing market
              rate&rdquo; (PMR) mechanism to intervene when rates became
              unreasonable. The 6% cap formalises this protection with a clear,
              predictable ceiling instead of ad-hoc adjustments.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            How Often Has the Rate Exceeded 6%?
          </Heading>
          <p className="text-muted-foreground">
            The maximum Plan 2 interest rate has exceeded 6% in{" "}
            <strong className="text-foreground">
              {String(YEARS_ABOVE_CAP)} out of {String(TOTAL_YEARS)} academic
              years
            </strong>{" "}
            since Plan 2 was introduced in 2012. During the inflation crisis of
            2022&ndash;2024, rates hit 7.7% even after the PMR cap was applied
            &mdash; without that intervention, the formula rate would have
            reached 16.5%.
          </p>
          <ChartFrame
            caption="Fig. 1 — Maximum Plan 2 rate charged by year"
            figure="Cap 6%"
            figureTone="cost"
          >
            <HistoricalRatesChart />
          </ChartFrame>
          <p className="text-sm text-muted-foreground">
            The bars show the maximum rate actually charged each year (after any
            PMR intervention). The dashed line marks the new 6% cap.
          </p>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Impact on Your Balance
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              The real impact of the cap depends on future inflation. At current
              RPI ({formatPercent(rpi)}), the difference is small. But if
              inflation returns to levels seen in 2022&ndash;2023, the cap
              prevents your balance from compounding at extreme rates.
            </p>
            <p>
              The chart below starts at today&apos;s RPI ({formatPercent(rpi)}),
              where the two lines nearly overlap. Try selecting 7% or 9% to see
              why the cap was introduced &mdash; at those levels the gap between
              capped and uncapped balances becomes dramatic. The scenario
              assumes a {formatGBP(45_000)} loan, a {formatGBP(35_000)} starting
              salary, and 3% annual growth.
            </p>
          </div>
          <ChartFrame
            caption="Fig. 2 — Balance with and without the 6% cap"
            figure="Cap 6%"
            figureTone="cost"
            bodyClassName="h-80 sm:h-100"
          >
            <BalanceWithCapChart />
          </ChartFrame>
          <p className="text-sm text-muted-foreground">
            At higher RPI values, the gap between the capped and uncapped
            balance widens significantly. At 7% RPI, the uncapped rate would be
            10% &mdash; the cap saves borrowers from this compounding effect.
          </p>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            How Much Less Could You Repay?
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Because Plan 2 loans are written off after 30 years regardless of
              the remaining balance, most borrowers will not repay in full. The
              cap matters most for middle-to-high earners who do repay
              everything &mdash; they accumulate less interest, so their total
              bill is lower.
            </p>
            <p>
              The chart below compares total repayment across salary levels,
              assuming a sustained 7% RPI scenario. Lower earners see little
              difference because their loans are written off either way. Higher
              earners see meaningful savings.
            </p>
          </div>
          <ChartFrame caption="Fig. 3 — Total repaid by salary · sustained 7% RPI">
            <TotalCostComparisonChart />
          </ChartFrame>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Who Benefits Most?
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">
                  Current students on Plan 2 or Plan 3
                </strong>{" "}
                &mdash; while studying, you are charged the maximum rate (RPI +
                3%). The cap means this will not exceed 6%, slowing the growth
                of your balance before you even start repaying.
              </li>
              <li>
                <strong className="text-foreground">
                  Higher earners with large balances
                </strong>{" "}
                &mdash; if you earn above{" "}
                {formatGBP(PLAN_CONFIGS.PLAN_2.interestUpperThreshold)}, you are
                on the maximum rate. The cap gives you the biggest absolute
                reduction in interest.
              </li>
              <li>
                <strong className="text-foreground">
                  Graduates who will repay in full
                </strong>{" "}
                &mdash; if your salary is high enough to pay off the loan before
                the 30-year write-off, lower interest means you repay less
                overall.
              </li>
            </ul>
            <p>
              Lower earners who will never repay in full are less directly
              affected &mdash; the cap reduces the balance that eventually gets
              written off, but does not change their monthly repayments (which
              are based purely on income).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What This Does Not Change
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">
                  Monthly repayments are unchanged
                </strong>{" "}
                &mdash; you still repay 9% of income above the threshold (
                {formatGBP(PLAN_CONFIGS.PLAN_2.monthlyThreshold * 12)}/year).
                The cap only affects how fast your balance grows.
              </li>
              <li>
                <strong className="text-foreground">
                  Plan 1, 4, and 5 are not affected
                </strong>{" "}
                &mdash; Plan 1 and 4 rates are already capped at the lower of
                RPI or Bank of England base rate + 1%. Plan 5 charges RPI only,
                with no +3% component.
              </li>
              <li>
                <strong className="text-foreground">
                  The cap is for 2026/27 only
                </strong>{" "}
                &mdash; it has been announced for one academic year. Whether it
                becomes permanent depends on future policy decisions.
              </li>
            </ul>
          </div>
        </section>

        <KeyTakeaways>
          <li>
            Plan 2 and Plan 3 interest will be capped at 6% from September 2026.
          </li>
          <li>
            The maximum rate has exceeded 6% in {String(YEARS_ABOVE_CAP)} of the{" "}
            {String(TOTAL_YEARS)} years since Plan 2 was introduced.
          </li>
          <li>
            The biggest beneficiaries are higher earners and current students,
            especially if inflation rises again.
          </li>
          <li>
            Monthly repayments do not change &mdash; the cap only slows balance
            growth.
          </li>
          <li>
            The cap is announced for one year only (2026/27), though it may be
            extended.
          </li>
        </KeyTakeaways>

        <RelatedGuides
          current="interest-rate-cap"
          order={["how-interest-works", "rpi-vs-cpi", "plan-2-vs-plan-5"]}
          tools={["/interest", "/repaid"]}
        />
      </GuideArticle>
    </PageLayout>
  );
}
