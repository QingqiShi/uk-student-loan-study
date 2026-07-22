import Link from "next/link";
import { ChartFrame } from "@/components/instrument/ChartFrame";
import { Heading } from "@/components/typography/Heading";
import { formatGBP, formatPercent } from "@/lib/format";
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";
import { getCurrentTaxYearLabel } from "@/lib/taxYear";
import { GuideArticle, guideBreakout, guideLink } from "../guide-parts";
import { CurrentRatesTable } from "./CurrentRatesTable";
import { InterestRateChart } from "./InterestRateChart";

const EXAMPLE_BALANCE = 45_000;
const rpi = CURRENT_RATES.rpi;
const maxRate = rpi + 3;
const plan1Rate = Math.min(rpi, CURRENT_RATES.boeBaseRate + 1);
const boeRatePlus1 = CURRENT_RATES.boeBaseRate + 1;
const monthlyInterest = Math.round((EXAMPLE_BALANCE * maxRate) / 100 / 12);

// Derived from the current date so the label tracks the live plans.ts figures.
const currentTaxYear = getCurrentTaxYearLabel();

export function InterestGuide() {
  return (
    <GuideArticle
      breadcrumbLabel="How Interest Works"
      title="How interest works on UK student loans"
      intro={
        <>
          Interest is one of the most confusing parts of student loans. Each
          plan type calculates it differently, which means the amount your
          balance grows varies depending on when you started university and how
          much you earn.
        </>
      }
      related={{
        current: "how-interest-works",
        order: ["rpi-vs-cpi", "plan-2-vs-plan-5"],
        tools: ["/interest", "/effective-rate"],
      }}
    >
      <section className="space-y-3">
        <Heading as="h2" size="section">
          Plan 2: The Sliding Scale
        </Heading>
        <div className="space-y-2 text-muted-foreground">
          <p>
            Plan 2 has the most complex interest calculation. It uses a sliding
            scale tied to your income, ranging from RPI (currently{" "}
            {formatPercent(rpi)}) up to RPI + 3% (currently{" "}
            {formatPercent(maxRate)}).
          </p>
          <ul className="list-disc space-y-1 pl-6">
            <li>
              Earning below the lower threshold of{" "}
              <strong className="text-foreground">
                {formatGBP(PLAN_CONFIGS.PLAN_2.interestLowerThreshold)}
              </strong>
              : you pay RPI only ({formatPercent(rpi)})
            </li>
            <li>
              Earning above the upper threshold of{" "}
              <strong className="text-foreground">
                {formatGBP(PLAN_CONFIGS.PLAN_2.interestUpperThreshold)}
              </strong>
              : you pay the maximum of RPI + 3% ({formatPercent(maxRate)})
            </li>
            <li>
              Earning between the two: the rate scales linearly from{" "}
              {formatPercent(rpi)} up to {formatPercent(maxRate)}
            </li>
          </ul>
          <p>
            While studying, Plan 2 borrowers are charged the maximum rate of RPI
            + 3%. This means your balance starts growing before you even
            graduate.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="section">
          Plan 5: RPI Only
        </Heading>
        <div className="space-y-2 text-muted-foreground">
          <p>
            Plan 5, introduced for students starting from September 2023, has a
            much simpler formula. Regardless of how much you earn, the interest
            rate is just RPI &mdash; currently {formatPercent(rpi)}.
          </p>
          <p>
            This is a significant change from Plan 2. A high earner on Plan 2
            could be paying {formatPercent(maxRate)} interest, while the same
            earner on Plan 5 would pay only {formatPercent(rpi)}. The chart
            below illustrates this difference clearly.
          </p>
        </div>
      </section>

      <ChartFrame
        className={guideBreakout}
        caption="Fig. 1 — Annual interest rate by salary · Plan 2 vs Plan 5"
        figure={`${formatPercent(maxRate)} max`}
        figureTone="cost"
      >
        <InterestRateChart />
      </ChartFrame>

      <section className="space-y-3">
        <Heading as="h2" size="section">
          Plan 1 and Plan 4
        </Heading>
        <div className="space-y-2 text-muted-foreground">
          <p>
            Plan 1 (England, Wales &amp; Northern Ireland pre-2012) and Plan 4
            (Scotland) use the same interest formula: the lesser of RPI or the
            Bank of England base rate plus 1%.
          </p>
          <p>
            With RPI at {formatPercent(rpi)} and the base rate at{" "}
            {formatPercent(CURRENT_RATES.boeBaseRate)}, the current interest
            rate for these plans is{" "}
            <strong className="text-foreground">
              {formatPercent(plan1Rate)}
            </strong>{" "}
            (the lower of {formatPercent(rpi)} and {formatPercent(boeRatePlus1)}
            ).
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="section">
          Postgraduate Loans
        </Heading>
        <div className="space-y-2 text-muted-foreground">
          <p>
            Postgraduate (Master&apos;s and Doctoral) loans always charge RPI +
            3%, regardless of your income. At current rates, that means{" "}
            <strong className="text-foreground">
              {formatPercent(maxRate)}
            </strong>{" "}
            interest per year &mdash; the highest rate of any UK student loan
            plan.
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <Heading as="h2" size="section" id="current-interest-rates-by-plan">
          Current Interest Rates by Plan ({currentTaxYear})
        </Heading>
        <div className="space-y-2 text-muted-foreground">
          <p>
            Here are the interest rates in force across every plan for the{" "}
            {currentTaxYear} tax year, based on RPI of {formatPercent(rpi)}.
            Middle earners on Plan 2 feel this most: they sit on the sliding
            scale, charged above RPI without earning enough to pay off the
            balance before interest compounds.
          </p>
        </div>
      </section>

      <div className={guideBreakout}>
        <CurrentRatesTable />
      </div>

      <section className="space-y-3">
        <Heading as="h2" size="section">
          Why Your Balance Grows
        </Heading>
        <div className="space-y-2 text-muted-foreground">
          <p>
            Many graduates are surprised to see their loan balance increase
            despite making repayments. This happens when the interest added each
            month exceeds what you repay.
          </p>
          <p>
            For example, on a {formatGBP(EXAMPLE_BALANCE)} balance at{" "}
            {formatPercent(maxRate)} interest, you would accrue roughly{" "}
            {formatGBP(monthlyInterest)} per month in interest alone. If your
            monthly repayment is less than that, the balance will keep growing.
          </p>
          <p>
            This is most common early in your career when salaries are lower and
            balances are at their highest. Over time, salary growth increases
            your repayments while the balance (hopefully) shrinks, eventually
            tipping the scales. Use the{" "}
            <Link href="/" className={guideLink}>
              repayment calculator
            </Link>{" "}
            to see when this tipping point occurs at your salary, or explore
            whether{" "}
            <Link href="/overpay" className={guideLink}>
              overpaying your loan
            </Link>{" "}
            could reduce the total cost.
          </p>
        </div>
      </section>
    </GuideArticle>
  );
}
