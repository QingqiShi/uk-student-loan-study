import {
  AlertCircleIcon,
  Calculator01Icon,
  Briefcase01Icon,
  Coins01Icon,
  BulbIcon,
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
import { PLAN_CONFIGS } from "@/lib/loans/plans";

const undergradRate = `${String(PLAN_CONFIGS.PLAN_2.repaymentRate * 100)}%`;
const postgradRate = `${String(PLAN_CONFIGS.POSTGRADUATE.repaymentRate * 100)}%`;

const linkClasses =
  "text-primary underline-offset-2 hover:underline font-medium";

export function SelfEmploymentGuide() {
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
                <BreadcrumbPage>Self-Employment</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="space-y-2">
            <Heading as="h1">Student Loans and Self-Employment</Heading>
            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
              If you&rsquo;re self-employed, your student loan repayments work
              differently from PAYE. Instead of automatic monthly deductions
              from your payslip, you repay through your annual{" "}
              <a
                href="https://www.gov.uk/self-assessment-tax-returns"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                Self Assessment tax return
              </a>{" "}
              — and that changes how you need to plan your finances.
            </p>
          </div>
        </div>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            How Repayments Work Through Self Assessment
          </Heading>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                PAYE (Employed)
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">&#x2022;</span>Monthly
                  deductions from payslip
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&#x2022;</span>Automatic —
                  employer handles it
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&#x2022;</span>Based on salary
                  each pay period
                </li>
              </ul>
            </div>
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Self Assessment (Self-employed)
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">&#x2022;</span>Annual lump sums
                  (Jan &amp; Jul)
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&#x2022;</span>You calculate
                  and submit
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">&#x2022;</span>Based on net
                  profit for the year
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <p>
              When you&rsquo;re employed, your employer deducts student loan
              repayments from your salary each month via PAYE. When you&rsquo;re
              self-employed, there is no employer to do this — HMRC calculates
              your repayment based on your{" "}
              <a
                href="https://www.gov.uk/self-assessment-tax-returns"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                Self Assessment tax return
              </a>{" "}
              instead.
            </p>
            <p>
              This means your repayments are <strong>annual</strong>, not
              monthly. You typically pay in two lump sums: one in January and
              one in July (as part of HMRC&rsquo;s{" "}
              <a
                href="https://www.gov.uk/understand-self-assessment-bill/payments-on-account"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClasses}
              >
                payment on account
              </a>{" "}
              system). The repayment is {undergradRate} of your net profit above
              the repayment threshold for Plan 2 and Plan 5, or {postgradRate}{" "}
              for Postgraduate Loans.
            </p>
            <p>
              Because payments are based on your <strong>profit</strong> — not
              your total revenue — business expenses you claim directly reduce
              your student loan repayment as well as your tax bill.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            What Counts as Income?
          </Heading>
          <p className="text-sm text-muted-foreground sm:text-base">
            HMRC looks at your total taxable income when calculating student
            loan repayments. For the self-employed, this includes:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon
                  icon={Calculator01Icon}
                  className="size-5 text-primary"
                />
              </div>
              <p className="font-medium">Net Profit</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Revenue minus allowable business expenses from self-employment.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  className="size-5 text-primary"
                />
              </div>
              <p className="font-medium">Employment Income</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Salary from a PAYE job if you also have one alongside
                freelancing.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10">
              <div className="mb-2 flex size-9 items-center justify-center rounded-full bg-primary/10">
                <HugeiconsIcon
                  icon={Coins01Icon}
                  className="size-5 text-primary"
                />
              </div>
              <p className="font-medium">Other Taxable Income</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Rental income, dividends, interest above your personal savings
                allowance, etc.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:text-base">
            All of these sources are combined to determine whether you exceed
            the repayment threshold and how much you owe.
          </p>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Mixed Employment
          </Heading>
          <div className="space-y-3 text-sm text-muted-foreground sm:text-base">
            <p>
              Many freelancers also have a part-time or full-time PAYE job. If
              this applies to you, HMRC collects repayments through both
              mechanisms:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Your employer deducts repayments from your salary automatically
                via PAYE
              </li>
              <li>
                Your Self Assessment tops up the difference based on your
                combined total income
              </li>
            </ul>
            <p>
              For example, if your PAYE salary is below the threshold but your
              combined income (salary + freelance profit) is above it,
              you&rsquo;ll owe the full repayment through Self Assessment. If
              your PAYE income alone exceeds the threshold, your employer
              already deducts repayments — and Self Assessment adds further
              repayments on your self-employment profit.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Common Mistakes to Avoid
          </Heading>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: "Not budgeting for annual payments",
                description:
                  "Unlike monthly PAYE deductions, Self Assessment repayments arrive as large lump sums. A sudden bill of several thousand pounds in January can catch freelancers off guard.",
              },
              {
                title: "Late filing penalties",
                description:
                  "Missing the 31 January Self Assessment deadline means a \u00A3100 penalty \u2014 plus your student loan repayment is delayed, which can lead to estimated charges from HMRC.",
              },
              {
                title: "Underestimating income",
                description:
                  "If your payments on account are based on a lower previous year, you may face a balancing payment when your actual profit is higher than expected.",
              },
              {
                title: "Not claiming legitimate expenses",
                description:
                  "Every pound of allowable business expense you miss increases your net profit \u2014 and therefore your student loan repayment. Common overlooked expenses include home office costs, professional subscriptions, and travel.",
              },
            ].map((mistake, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-sm font-semibold text-destructive">
                    <HugeiconsIcon icon={AlertCircleIcon} className="size-4" />
                  </span>
                  <p className="font-medium">{mistake.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {mistake.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <Heading as="h2" size="section">
            Practical Tips for Freelancers
          </Heading>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                title: `Set aside ${undergradRate} monthly`,
                description: `Calculate ${undergradRate} of your profit above the repayment threshold each month and put it in a separate savings account. This avoids a nasty surprise when your tax bill arrives.`,
              },
              {
                title: "Register for Self Assessment early",
                description: (
                  <>
                    You must{" "}
                    <a
                      href="https://www.gov.uk/register-for-self-assessment"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClasses}
                    >
                      register with HMRC by 5 October
                    </a>{" "}
                    following the end of the tax year in which you became
                    self-employed. Registering late can result in penalties.
                  </>
                ),
              },
              {
                title: "Keep good records",
                description:
                  "Track all income and expenses throughout the year. Good record-keeping makes filing easier and ensures you claim every expense you\u2019re entitled to.",
              },
              {
                title: "Consider an accountant",
                description:
                  "An accountant familiar with student loans can help you optimise your expenses, avoid mistakes, and ensure your repayments are calculated correctly.",
              },
            ].map((tip, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-4 ring-1 ring-foreground/10"
              >
                <div className="mb-2 flex items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <HugeiconsIcon
                      icon={BulbIcon}
                      className="size-4 text-primary"
                    />
                  </span>
                  <p className="font-medium">{tip.title}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-lg border bg-muted/30 p-4 sm:p-6">
          <Heading as="h2" size="subsection">
            Key Takeaways
          </Heading>
          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground sm:text-base">
            <li>
              Self-employed borrowers repay through Self Assessment, not PAYE —
              expect annual lump-sum payments, not monthly deductions.
            </li>
            <li>
              Repayments are based on <strong>net profit</strong>, so claiming
              all legitimate business expenses directly reduces what you owe.
            </li>
            <li>
              If you have mixed income (PAYE + freelance), HMRC collects through
              both mechanisms based on your combined total income.
            </li>
            <li>
              Budget monthly by setting aside {undergradRate} of profit above
              the threshold to avoid being caught out by large tax bills.
            </li>
            <li>
              Estimate your annual repayments with the{" "}
              <Link
                href="/"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                student loan calculator
              </Link>
              .
            </li>
          </ul>
        </section>

        <RelatedGuides
          current="self-employment"
          order={["moving-abroad", "plan-2-vs-plan-5"]}
          extraLinks={[
            {
              href: "https://www.gov.uk/repaying-your-student-loan/repaying-student-loans-overview",
              label: "GOV.UK: Repaying Your Student Loan",
            },
          ]}
        />
      </article>
    </PageLayout>
  );
}
