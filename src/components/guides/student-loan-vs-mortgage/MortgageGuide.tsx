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
import { PLAN_CONFIGS, PLAN_DISPLAY_INFO } from "@/lib/loans/plans";
import { BorrowingReductionChart } from "./BorrowingReductionChart";
import { RepaymentImpactChart } from "./RepaymentImpactChart";

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
              The chart below shows the full picture across the salary range.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Estimated Mortgage Reduction by Salary
          </Heading>
          <div className="h-75 sm:h-90">
            <BorrowingReductionChart />
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated reduction based on a 4.5&times; income multiplier applied
            to the annualised student loan repayment. Actual lending criteria
            vary by provider.
          </p>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Does a Student Loan Count as Debt for a Mortgage?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              No. A UK student loan is <strong>not</strong> treated as
              conventional debt by mortgage lenders. Unlike a personal loan or
              credit card balance, your student loan does not appear on your
              credit report and is not included in debt-to-income ratios.
            </p>
            <p>
              What lenders do care about is the monthly repayment. Because
              repayments are deducted from your salary before you receive it
              (like tax), lenders treat it as a committed outgoing that reduces
              your disposable income. The loan balance itself &mdash; whether
              it&rsquo;s &pound;20,000 or &pound;60,000 &mdash; is irrelevant to
              the mortgage application.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Does a Student Loan Affect Your Credit Score?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              No. The Student Loans Company (SLC) does not report to credit
              reference agencies like Experian, Equifax, or TransUnion. Your
              student loan balance and repayment history are completely
              invisible on your credit file.
            </p>
            <p>
              This means a student loan cannot lower your credit score, trigger
              a hard search, or show up as an outstanding liability. Lenders
              learn about your repayment only through payslips and bank
              statements during the affordability assessment, not from your
              credit report.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Should You Pay Off Your Student Loan Before Buying a House?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Almost certainly not. The money you would use to clear (or reduce)
              your student loan balance would likely be better spent on a larger
              deposit. Here&rsquo;s why:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                A larger deposit unlocks lower mortgage interest rates (lower
                LTV bands), saving you far more over the mortgage term than the
                student loan repayment costs.
              </li>
              <li>
                Paying off &pound;10,000 of student loan debt would only reduce
                your monthly repayment if it brings the balance to zero. If you
                still owe money afterwards, your monthly repayment stays exactly
                the same because it&rsquo;s based on salary, not balance.
              </li>
              <li>
                Any remaining student loan balance is written off after{" "}
                {PLAN_CONFIGS.PLAN_2.writeOffYears} years (Plan 2) or{" "}
                {PLAN_CONFIGS.PLAN_5.writeOffYears} years (Plan 5). Many
                graduates never repay the full amount, so overpaying can mean
                giving away money you would never have had to pay.
              </li>
            </ul>
            <p>
              The only scenario where clearing the loan first might help is if
              you are very close to paying it off anyway and eliminating the
              monthly repayment would meaningfully boost your affordability. Use
              the{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                student loan repayment calculator
              </Link>{" "}
              to check how close you are.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Tips for Mortgage Applicants with Student Loans
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <ol className="list-inside list-decimal space-y-2">
              <li>
                <strong>Know your monthly repayment.</strong> Lenders will ask
                for it. Check a recent payslip or use the{" "}
                <Link
                  href="/"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  calculator
                </Link>{" "}
                to confirm the exact amount.
              </li>
              <li>
                <strong>Prioritise your deposit over loan repayment.</strong>{" "}
                Every extra pound in your deposit does more for your mortgage
                rate than paying down a student loan that may eventually be
                written off.
              </li>
              <li>
                <strong>Factor in salary growth.</strong> If you expect a pay
                rise, your student loan repayment will increase too. Some
                lenders stress-test affordability at a higher salary, so be
                prepared for questions about future income.
              </li>
              <li>
                <strong>Compare lenders.</strong> Different lenders treat
                student loan repayments differently in their affordability
                models. A mortgage broker can help identify lenders whose
                criteria are more favourable for borrowers with student loans.
              </li>
              <li>
                <strong>Keep other debts low.</strong> Since your student loan
                repayment already reduces disposable income, minimising credit
                card balances, car finance, and other committed spending will
                maximise the amount you can borrow.
              </li>
            </ol>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
          <Heading as="h2" size="subsection">
            Key Takeaways
          </Heading>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>
              A student loan is <strong>not</strong> conventional debt &mdash;
              it won&rsquo;t appear on your credit report or affect your credit
              score.
            </li>
            <li>
              Lenders deduct your monthly repayment when calculating how much
              you can borrow, reducing your affordability.
            </li>
            <li>
              The loan balance is irrelevant &mdash; only the monthly repayment
              matters to lenders.
            </li>
            <li>
              Any remaining balance is written off after{" "}
              {PLAN_CONFIGS.PLAN_2.writeOffYears} years (Plan 2) or{" "}
              {PLAN_CONFIGS.PLAN_5.writeOffYears} years (Plan 5) &mdash; you are
              never chased for unpaid amounts.
            </li>
            <li>
              Prioritise a bigger deposit over paying off your student loan
              &mdash; it unlocks better mortgage rates and saves more long-term.
            </li>
            <li>
              <Link
                href="/overpay"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Overpaying your student loan
              </Link>{" "}
              to boost mortgage affordability rarely makes sense unless
              you&rsquo;re very close to clearing the balance entirely.
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
