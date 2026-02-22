import Link from "next/link";
import { BalanceComparisonChart } from "./BalanceComparisonChart";
import { ComparisonTable } from "./ComparisonTable";
import { TotalRepaymentBySalaryChart } from "./TotalRepaymentBySalaryChart";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
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

const EXAMPLE_BALANCE = 45_000;
const EXAMPLE_SALARY = 30_000;
const plan2Threshold = PLAN_DISPLAY_INFO.PLAN_2.yearlyThreshold;
const plan5Threshold = PLAN_DISPLAY_INFO.PLAN_5.yearlyThreshold;
const repaymentRate = PLAN_CONFIGS.PLAN_2.repaymentRate;
const plan2Annual = Math.round(
  (EXAMPLE_SALARY - plan2Threshold) * repaymentRate,
);
const plan5Annual = Math.round(
  (EXAMPLE_SALARY - plan5Threshold) * repaymentRate,
);

export function Plan2VsPlan5Guide() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 space-y-8 overflow-x-hidden px-3 pt-13 pb-6 md:pb-8"
      >
        <article className="space-y-8">
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/" />}>
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link href="/guides" />}>
                    Guides
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Plan 2 vs Plan 5</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-2">
              <Heading as="h1">Plan 2 vs Plan 5: Which Is Better?</Heading>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                Plan 2 and Plan 5 are the two loan types most English university
                students will encounter. Plan 2 covers those who started between
                2012 and 2023, while Plan 5 applies from 2023 onwards. They
                differ in repayment threshold, interest rate, and write-off
                period — and these differences can mean tens of thousands of
                pounds more or less repaid over your career.
              </p>
            </div>
          </div>

          <section className="space-y-4">
            <Heading as="h2" size="section">
              Side-by-Side Comparison
            </Heading>
            <p className="text-sm text-muted-foreground sm:text-base">
              The key terms of each plan at a glance. Plan 5 has a lower
              threshold and longer write-off, but simpler (and lower) interest.
            </p>
            <ComparisonTable />
          </section>

          <section className="space-y-4">
            <Heading as="h2" size="section">
              Total Repayment by Salary
            </Heading>
            <p className="text-sm text-muted-foreground sm:text-base">
              How much you repay in total depends heavily on your salary. This
              chart shows the total amount repaid over the life of each loan for
              a range of starting salaries, assuming a balance of
              {"\u00a0"}
              {formatGBP(EXAMPLE_BALANCE)}.
            </p>
            <div className="h-75 sm:h-95">
              <TotalRepaymentBySalaryChart />
            </div>
          </section>

          <section className="space-y-4">
            <Heading as="h2" size="section">
              Balance Over Time
            </Heading>
            <p className="text-sm text-muted-foreground sm:text-base">
              See how the outstanding balance changes month by month. Toggle
              between salary levels to see how income affects the repayment
              trajectory for each plan.
            </p>
            <div className="h-85 sm:h-105">
              <BalanceComparisonChart />
            </div>
          </section>

          <section className="space-y-3">
            <Heading as="h2" size="section">
              Which Plan Do I Have?
            </Heading>
            <div className="space-y-2 text-muted-foreground">
              <p>
                You cannot choose between Plan 2 and Plan 5 &mdash; your plan is
                determined by when and where you started your course. Plan 2
                covers English and Welsh students who started university between
                September 2012 and July 2023. Plan 5 applies to English students
                who started from September 2023 onwards.
              </p>
              <p>
                The cutoff is August 2023. If you started in the 2022&ndash;23
                academic year, you are on Plan 2. If you started in September
                2023 or later, you are on Plan 5. Note that Plan 5 is
                England-only &mdash; Welsh students who started after August
                2023 remain on Plan 2.
              </p>
              <p>
                Not sure?{" "}
                <Link
                  href="/which-plan"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  Take the which plan quiz
                </Link>{" "}
                to find out.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <Heading as="h2" size="section">
              How the Threshold Difference Affects You
            </Heading>
            <div className="space-y-2 text-muted-foreground">
              <p>
                Plan 5&rsquo;s lower repayment threshold means you start
                repaying sooner and pay more each month at the same salary. Both
                plans charge 9% on income above the threshold, but the
                thresholds are different: {formatGBP(plan2Threshold)} for Plan 2
                versus {formatGBP(plan5Threshold)} for Plan 5.
              </p>
              <p>
                For example, at a {formatGBP(EXAMPLE_SALARY)} salary, a Plan 2
                borrower repays just {formatGBP(plan2Annual)} per year, while a
                Plan 5 borrower repays {formatGBP(plan5Annual)} per year &mdash;
                over three times as much. This gap narrows at higher salaries
                where both plans collect substantial repayments, but at lower
                salaries the threshold difference is the dominant factor.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <Heading as="h2" size="section">
              Can You Switch Plans?
            </Heading>
            <div className="space-y-2 text-muted-foreground">
              <p>
                No. Your plan is permanently determined by your course start
                date. There is no mechanism to switch between Plan 2 and Plan 5.
              </p>
              <p>
                If you take out a second degree after August 2023, the new loan
                will be on Plan 5, but your original Plan 2 loan stays on Plan
                2. The two loans are repaid separately under their own terms.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <Heading as="h2" size="section">
              Which Plan Should You Worry About?
            </Heading>
            <div className="space-y-2 text-muted-foreground">
              <p>
                For most borrowers, repayments are automatic through PAYE
                &mdash; you do not need to do anything. The real question is
                whether it makes sense to{" "}
                <Link
                  href="/overpay"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  overpay your loan
                </Link>
                .
              </p>
              <p>
                Plan 2 middle earners are hit hardest. They earn too much for
                the 30-year write-off to help significantly, but not enough to
                pay off the balance quickly before{" "}
                <Link
                  href="/guides/how-interest-works"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  interest
                </Link>{" "}
                (up to RPI + 3%) compounds over decades. These borrowers often
                end up repaying more in total than Plan 5 borrowers on the same
                salary.
              </p>
              <p>
                Use the{" "}
                <Link
                  href="/"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  student loan repayment calculator
                </Link>{" "}
                to model your specific scenario and see exactly how much
                you&rsquo;ll repay under your plan.
              </p>
            </div>
          </section>

          <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
            <Heading as="h2" size="subsection">
              Key Takeaways
            </Heading>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
              <li>
                Lower earners often pay <strong>more</strong> on Plan 5 because
                the 40-year term and lower threshold mean more months of
                repayments.
              </li>
              <li>
                Middle earners may pay <strong>more</strong> on Plan 2 because
                interest can reach RPI + 3%, and they earn too much for
                write-off to help but not enough to pay off the balance quickly.
              </li>
              <li>
                Plan 5&rsquo;s simpler interest (RPI only) makes the balance
                more predictable, but the longer write-off window is the real
                cost driver.
              </li>
              <li>
                Plan 5&rsquo;s lower threshold ({formatGBP(plan5Threshold)} vs{" "}
                {formatGBP(plan2Threshold)}) means earlier and larger repayments
                at the same salary.
              </li>
              <li>
                Model your own salary in the{" "}
                <Link
                  href="/"
                  className="text-primary underline underline-offset-4 hover:text-primary/80"
                >
                  student loan calculator
                </Link>{" "}
                to see the total cost under each plan.
              </li>
            </ul>
          </section>

          <RelatedGuides
            current="plan-2-vs-plan-5"
            order={["how-interest-works", "pay-upfront-or-take-loan"]}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
}
