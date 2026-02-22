import Link from "next/link";
import { InterestRateChart } from "./InterestRateChart";
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
import { formatGBP, formatPercent } from "@/lib/format";
import { CURRENT_RATES, PLAN_CONFIGS } from "@/lib/loans/plans";

const EXAMPLE_BALANCE = 45_000;
const rpi = CURRENT_RATES.rpi;
const maxRate = rpi + 3;
const plan1Rate = Math.min(rpi, CURRENT_RATES.boeBaseRate + 1);
const boeRatePlus1 = CURRENT_RATES.boeBaseRate + 1;
const monthlyInterest = Math.round((EXAMPLE_BALANCE * maxRate) / 100 / 12);

export function InterestGuide() {
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
                <BreadcrumbPage>How Interest Works</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Heading as="h1">How Interest Works on UK Student Loans</Heading>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Interest is one of the most confusing parts of student loans. Each
            plan type calculates it differently, which means the amount your
            balance grows varies depending on when you started university and
            how much you earn.
          </p>
        </div>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Plan 2: The Sliding Scale
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Plan 2 has the most complex interest calculation. It uses a
              sliding scale tied to your income, ranging from RPI (currently{" "}
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
              While studying, Plan 2 borrowers are charged the maximum rate of
              RPI + 3%. This means your balance starts growing before you even
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
              Plan 5, introduced for students starting from September 2023, has
              a much simpler formula. Regardless of how much you earn, the
              interest rate is just RPI &mdash; currently {formatPercent(rpi)}.
            </p>
            <p>
              This is a significant change from Plan 2. A high earner on Plan 2
              could be paying {formatPercent(maxRate)} interest, while the same
              earner on Plan 5 would pay only {formatPercent(rpi)}. The chart
              below illustrates this difference clearly.
            </p>
          </div>
        </section>

        <InterestRateChart />

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
              (the lower of {formatPercent(rpi)} and{" "}
              {formatPercent(boeRatePlus1)}).
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Postgraduate Loans
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Postgraduate (Master&apos;s and Doctoral) loans always charge RPI
              + 3%, regardless of your income. At current rates, that means{" "}
              <strong className="text-foreground">
                {formatPercent(maxRate)}
              </strong>{" "}
              interest per year &mdash; the highest rate of any UK student loan
              plan.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Why Your Balance Grows
          </Heading>
          <div className="space-y-2 text-muted-foreground">
            <p>
              Many graduates are surprised to see their loan balance increase
              despite making repayments. This happens when the interest added
              each month exceeds what you repay.
            </p>
            <p>
              For example, on a {formatGBP(EXAMPLE_BALANCE)} balance at{" "}
              {formatPercent(maxRate)} interest, you would accrue roughly{" "}
              {formatGBP(monthlyInterest)} per month in interest alone. If your
              monthly repayment is less than that, the balance will keep
              growing.
            </p>
            <p>
              This is most common early in your career when salaries are lower
              and balances are at their highest. Over time, salary growth
              increases your repayments while the balance (hopefully) shrinks,
              eventually tipping the scales. Use the{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                repayment calculator
              </Link>{" "}
              to see when this tipping point occurs at your salary, or explore
              whether{" "}
              <Link
                href="/overpay"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                overpaying your loan
              </Link>{" "}
              could reduce the total cost.
            </p>
          </div>
        </section>

        <RelatedGuides
          current="how-interest-works"
          order={["rpi-vs-cpi", "plan-2-vs-plan-5"]}
        />
      </article>
    </PageLayout>
  );
}
