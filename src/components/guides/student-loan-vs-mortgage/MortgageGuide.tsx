import Link from "next/link";
import { RepaymentImpactChart } from "./RepaymentImpactChart";
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
import { PLAN_CONFIGS, PLAN_DISPLAY_INFO } from "@/lib/loans/plans";

const plan2Threshold = PLAN_DISPLAY_INFO.PLAN_2.yearlyThreshold;
const plan5Threshold = PLAN_DISPLAY_INFO.PLAN_5.yearlyThreshold;
const repaymentRate = PLAN_CONFIGS.PLAN_2.repaymentRate;
const repaymentRateDisplay = `${String(repaymentRate * 100)}%`;

// Example: £40k salary on Plan 2
const example40kMonthly = Math.round(
  (40000 / 12 - PLAN_CONFIGS.PLAN_2.monthlyThreshold) * repaymentRate,
);
const example40kAnnual = example40kMonthly * 12;
const example40kMortgageReduction = Math.round(example40kAnnual * 4.5);

// Example: £60k salary on Plan 2
const example60kMonthly = Math.round(
  (60000 / 12 - PLAN_CONFIGS.PLAN_2.monthlyThreshold) * repaymentRate,
);
const example60kAnnual = example60kMonthly * 12;
const example60kMortgageReduction = Math.round(example60kAnnual * 4.5);

export function MortgageGuide() {
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
                <BreadcrumbPage>Student Loans & Mortgages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Heading as="h1">
            Does Your Student Loan Affect Your Mortgage?
          </Heading>

          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Your student loan won&rsquo;t stop you getting a mortgage, but the
            monthly repayments reduce how much lenders think you can afford.
            Here&rsquo;s how it works.
          </p>
        </div>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            How Lenders See Your Student Loan
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Unlike credit cards or car finance, a UK student loan is not
              treated as conventional debt. It doesn&rsquo;t appear on your
              credit report and won&rsquo;t lower your credit score.
            </p>
            <p>
              However, mortgage lenders do factor in the monthly repayment. When
              they assess your affordability, they look at your net disposable
              income after tax, National Insurance, pension contributions, and
              student loan repayments. A higher repayment means less income
              available for mortgage payments.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            The Repayment &ldquo;Tax&rdquo;
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Student loan repayments work like an extra income tax. You pay{" "}
              {repaymentRateDisplay} of everything you earn above your
              plan&rsquo;s repayment threshold. The higher your salary, the more
              you repay each month, and the bigger the impact on your mortgage
              affordability.
            </p>
            <p>
              Plan 5 has a lower threshold than Plan 2, so repayments start
              sooner and are slightly higher at every salary level. The chart
              below shows exactly how much you&rsquo;d repay each month.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Monthly Repayment by Salary
          </Heading>
          <div className="h-75 sm:h-90">
            <RepaymentImpactChart />
          </div>
          <p className="text-sm text-muted-foreground">
            Based on current thresholds: Plan 2 at {formatGBP(plan2Threshold)}{" "}
            and Plan 5 at {formatGBP(plan5Threshold)} per year. Both charge{" "}
            {repaymentRateDisplay} on income above the threshold.
          </p>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What This Means for Your Borrowing Capacity
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Most lenders offer roughly 4 to 4.5 times your annual income as a
              mortgage. But they calculate that multiple based on your income
              after committed expenditure, including student loan repayments.
            </p>
            <p>
              For example, someone earning &pound;40,000 on Plan 2 repays about{" "}
              {formatGBP(example40kMonthly)} per month. Annualised, that&rsquo;s
              around {formatGBP(example40kAnnual)} which a lender might
              effectively subtract from income before applying their multiplier.
              On a 4.5x basis, that reduces the maximum mortgage by roughly{" "}
              {formatGBP(example40kMortgageReduction)}.
            </p>
            <p>
              At higher salaries the gap grows. At &pound;60,000 the monthly
              repayment is roughly {formatGBP(example60kMonthly)}, trimming
              potential borrowing by about{" "}
              {formatGBP(example60kMortgageReduction)} on the same multiplier.
              Use the{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                student loan repayment calculator
              </Link>{" "}
              to see your exact monthly repayment at your salary.
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
          <Heading as="h2" size="subsection">
            Key Takeaways
          </Heading>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>
              A student loan is <strong>not</strong> conventional debt &mdash;
              it won&rsquo;t appear on your credit report.
            </li>
            <li>
              Lenders deduct your monthly repayment when calculating how much
              you can borrow, reducing your affordability.
            </li>
            <li>
              Your credit score is <strong>not</strong> affected by having a
              student loan.
            </li>
            <li>
              Any remaining balance is written off after{" "}
              {PLAN_CONFIGS.PLAN_2.writeOffYears} years (Plan 2) or{" "}
              {PLAN_CONFIGS.PLAN_5.writeOffYears} years (Plan 5) &mdash; you are
              never chased for unpaid amounts.
            </li>
            <li>
              <Link
                href="/overpay"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Overpaying your student loan
              </Link>{" "}
              to boost mortgage affordability rarely makes sense &mdash; the
              reduction in borrowing power is modest compared to deposit
              savings.
            </li>
          </ul>
        </section>

        <RelatedGuides
          current="student-loan-vs-mortgage"
          order={["plan-2-vs-plan-5", "how-interest-works"]}
        />
      </article>
    </PageLayout>
  );
}
