import { BalanceComparisonChart } from "./BalanceComparisonChart";
import { ComparisonTable } from "./ComparisonTable";
import { TotalRepaymentBySalaryChart } from "./TotalRepaymentBySalaryChart";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { RelatedGuides } from "@/components/guides/RelatedGuides";
import { Header } from "@/components/Header";
import { formatGBP } from "@/lib/format";

const EXAMPLE_BALANCE = 45_000;

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
            <Breadcrumb
              parents={[{ label: "Guides", href: "/guides" }]}
              currentTitle="Plan 2 vs Plan 5"
            />

            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Plan 2 vs Plan 5: Which Is Better?
              </h1>
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
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Side-by-Side Comparison
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              The key terms of each plan at a glance. Plan 5 has a lower
              threshold and longer write-off, but simpler (and lower) interest.
            </p>
            <ComparisonTable />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Total Repayment by Salary
            </h2>
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
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Balance Over Time
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              See how the outstanding balance changes month by month. Toggle
              between salary levels to see how income affects the repayment
              trajectory for each plan.
            </p>
            <div className="h-85 sm:h-105">
              <BalanceComparisonChart />
            </div>
          </section>

          <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Key Takeaways
            </h2>
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
              <li>
                Lower earners often pay <strong>more</strong> on Plan 5 because
                the 40-year term and lower threshold mean more months of
                repayments.
              </li>
              <li>
                Higher earners may pay <strong>more</strong> on Plan 2 because
                interest can reach RPI + 3%, growing the balance faster.
              </li>
              <li>
                Plan 5&rsquo;s simpler interest (RPI only) makes the balance
                more predictable, but the longer write-off window is the real
                cost driver.
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
