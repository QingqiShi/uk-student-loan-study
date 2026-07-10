import {
  CreditCardIcon,
  Home05Icon,
  PercentCircleIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

const goodBadge = "bg-primary/10 text-primary";
const watchBadge = "bg-destructive/10 text-destructive";

const quickAnswers = [
  {
    icon: Home05Icon,
    question: "Will it stop you getting a mortgage?",
    answer: "No",
    answerClass: goodBadge,
  },
  {
    icon: PercentCircleIcon,
    question: "Does it lower how much you can borrow?",
    answer: "Yes",
    answerClass: watchBadge,
  },
  {
    icon: Wallet01Icon,
    question: "Does it count as income?",
    answer: "No",
    answerClass: goodBadge,
  },
  {
    icon: CreditCardIcon,
    question: "Does it show on your credit file?",
    answer: "No",
    answerClass: goodBadge,
  },
];

const linkClasses =
  "text-primary underline underline-offset-4 hover:text-primary/80";

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
                <BreadcrumbPage>Student Loans &amp; Mortgages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Heading as="h1">Does a Student Loan Affect Your Mortgage?</Heading>

          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            A UK student loan won&rsquo;t stop you getting a mortgage, and it
            isn&rsquo;t treated as normal debt. But the monthly repayment does
            quietly shrink how much a lender will let you borrow &mdash; and, as
            ever, it&rsquo;s middle earners who feel the squeeze most.
            Here&rsquo;s exactly what lenders look at.
          </p>
        </div>

        <section className="grid gap-3 sm:grid-cols-2">
          {quickAnswers.map((item) => (
            <div
              key={item.question}
              className="flex items-center gap-3 rounded-lg border bg-card p-4 ring-1 ring-foreground/10"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={item.icon} className="size-5" />
              </div>
              <p className="flex-1 text-sm font-medium">{item.question}</p>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.answerClass}`}
              >
                {item.answer}
              </span>
            </div>
          ))}
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Does a Student Loan Affect Mortgage Affordability?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Yes &mdash; this is the one real way a student loan touches your
              mortgage. When you apply, a lender doesn&rsquo;t just look at your
              salary; they run an affordability assessment. They start from your
              income and subtract your committed monthly outgoings &mdash; tax,
              National Insurance, pension contributions, childcare, existing
              credit, and your student loan repayment &mdash; to see
              what&rsquo;s genuinely left to cover a mortgage.
            </p>
            <p>
              Your student loan repayment is one of those committed deductions.
              Because it comes straight off your pay, it lowers the net income
              figure the lender works from, which can reduce the size of
              mortgage you&rsquo;re offered. In debt-to-income terms, the
              repayment nudges your ratio the wrong way.
            </p>
            <p>
              The repayment behaves like an extra slice of income tax: you pay{" "}
              {repaymentRateDisplay} of everything you earn above your
              plan&rsquo;s threshold. The more you earn, the larger the monthly
              deduction &mdash; and the bigger the dent in your borrowing power.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            How Much You Repay at Each Salary
          </Heading>
          <div className="h-75 sm:h-90">
            <RepaymentImpactChart />
          </div>
          <p className="text-sm text-muted-foreground">
            Based on current thresholds: Plan 2 at {formatGBP(plan2Threshold)}{" "}
            and Plan 5 at {formatGBP(plan5Threshold)} per year. Both charge{" "}
            {repaymentRateDisplay} on income above the threshold, so Plan
            5&rsquo;s lower threshold means repayments start sooner.
          </p>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            What It Does to Your Borrowing Power
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Most lenders offer roughly 4 to 4.5 times income as a mortgage,
              but they apply that multiple after committed expenditure &mdash;
              including your student loan repayment.
            </p>
            <p>
              Someone earning &pound;40,000 on Plan 2 repays about{" "}
              {formatGBP(example40kMonthly)} a month, or around{" "}
              {formatGBP(example40kAnnual)} a year. On a 4.5x basis that could
              trim the maximum mortgage by roughly{" "}
              {formatGBP(example40kMortgageReduction)}. At &pound;60,000 the
              repayment climbs to about {formatGBP(example60kMonthly)} a month,
              knocking off closer to {formatGBP(example60kMortgageReduction)} on
              the same multiplier.
            </p>
            <p>
              These are illustrative &mdash; every lender assesses affordability
              slightly differently &mdash; but they show the direction of
              travel. Use the{" "}
              <Link href="/" className={linkClasses}>
                student loan repayment calculator
              </Link>{" "}
              to see your exact monthly repayment at your salary.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Do Student Loans Count as Income for a Mortgage?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              No &mdash; and this trips people up in two ways, both with the
              same answer.
            </p>
            <p>
              A student loan is money you borrowed, not money you earn, so a
              lender will never count your maintenance loan or tuition loan as
              income to boost how much you can borrow. Only earned income
              &mdash; and sometimes guaranteed bonuses or overtime &mdash;
              counts towards affordability.
            </p>
            <p>
              The repayment isn&rsquo;t income either; it&rsquo;s a deduction.
              It only ever reduces the income figure a lender uses, and never
              adds to it. In short, a student loan can lower your affordability
              but can never raise it.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Do You Have to Declare Your Student Loan?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              Yes &mdash; be upfront about it. A mortgage application asks you
              to set out your income and regular outgoings honestly, and your
              student loan repayment is one of those outgoings.
            </p>
            <p>
              If you&rsquo;re employed, the repayment already shows on your
              payslips, so a lender will usually see it during their checks
              whether or not you list it separately. Leaving it off
              doesn&rsquo;t help you and can undermine the application.
            </p>
            <p>
              Exactly where it goes on the form is lender-specific: some ask
              about student loan repayments directly, others fold them into
              &ldquo;regular commitments&rdquo;. A mortgage broker can tell you
              how a particular lender treats it. The key point is to declare the
              monthly amount honestly &mdash; it&rsquo;s a deduction from
              income, not a conventional debt like a credit card.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Does a Student Loan Show on Your Credit File?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              No. Income-contingent UK student loans (Plan 1, 2, 4, 5 and
              Postgraduate Loans) are run by the Student Loans Company, which
              doesn&rsquo;t share your balance or repayments with credit
              reference agencies. The loan won&rsquo;t appear on your credit
              report and doesn&rsquo;t affect your credit score.
            </p>
            <p>
              That&rsquo;s good news for a mortgage: however large your balance,
              it can&rsquo;t drag down the credit score a lender checks, and it
              can&rsquo;t trigger a credit-based rejection. The only way it
              touches your mortgage is through affordability &mdash; the monthly
              repayment described above.
            </p>
            <p>
              It&rsquo;s still worth keeping the rest of your credit file
              healthy &mdash; on-time bills and low card balances &mdash;
              because that is what lenders actually score.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <Heading as="h2" size="section">
            Should You Pay Off Your Student Loan Before Applying?
          </Heading>
          <div className="space-y-3 text-muted-foreground">
            <p>
              It&rsquo;s tempting to think clearing the loan will unlock a
              bigger mortgage. Occasionally it does: if you&rsquo;re a small
              amount short of the borrowing you need and close to the end of
              your loan term, removing the monthly repayment can tip an
              application over the line.
            </p>
            <p>
              For most people, though, the maths doesn&rsquo;t favour it. Cash
              you throw at the loan is cash that isn&rsquo;t in your deposit,
              and a bigger deposit usually does far more for a mortgage &mdash;
              a lower loan-to-value ratio unlocks better interest rates and more
              lenders. The affordability you gain by clearing the repayment is
              often modest next to that.
            </p>
            <p>
              This is where the middle-earner squeeze bites hardest. Low earners
              repay little, so the affordability hit is small; the highest
              earners can absorb the repayment easily. It&rsquo;s middle earners
              &mdash; comfortably over the threshold but nowhere near clearing
              the balance &mdash; who lose the most borrowing power now and go
              on to repay the most over the life of the loan. The student loan
              works against them at exactly the moment they&rsquo;re trying to
              buy.
            </p>
            <p>
              Before overpaying to boost a mortgage, model it. The{" "}
              <Link href="/overpay" className={linkClasses}>
                overpay calculator
              </Link>{" "}
              shows whether putting a lump sum against your loan actually pays
              off, or whether that money is better kept for your deposit. And
              get independent mortgage advice for your own situation.
            </p>
          </div>
        </section>

        <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
          <Heading as="h2" size="subsection">
            Key Takeaways
          </Heading>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>
              A UK student loan <strong>won&rsquo;t stop</strong> you getting a
              mortgage and isn&rsquo;t treated as conventional debt.
            </li>
            <li>
              It <strong>does</strong> affect affordability: lenders deduct your
              monthly repayment from income, reducing how much you can borrow.
            </li>
            <li>
              It <strong>doesn&rsquo;t count as income</strong> &mdash; it can
              only lower the figure a lender uses, never raise it.
            </li>
            <li>
              <strong>Declare</strong> the monthly repayment honestly; on PAYE
              it shows on your payslips anyway.
            </li>
            <li>
              It <strong>doesn&rsquo;t appear</strong> on your credit file or
              affect your credit score.
            </li>
            <li>
              Paying it off to boost borrowing rarely beats a bigger deposit
              &mdash; middle earners feel the squeeze most, so model it with the{" "}
              <Link href="/overpay" className={linkClasses}>
                overpay calculator
              </Link>
              .
            </li>
          </ul>
        </section>

        <RelatedGuides
          current="student-loan-vs-mortgage"
          order={["plan-2-vs-plan-5", "how-interest-works"]}
          tools={["/", "/repaid"]}
          extraLinks={[
            {
              href: "https://www.gov.uk/repaying-your-student-loan/what-you-pay",
              label: "GOV.UK: What You Pay",
            },
          ]}
        />
      </article>
    </PageLayout>
  );
}
