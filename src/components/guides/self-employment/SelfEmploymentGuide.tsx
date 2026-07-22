import {
  AlertCircleIcon,
  Calculator01Icon,
  Briefcase01Icon,
  Coins01Icon,
  BulbIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Heading } from "@/components/typography/Heading";
import { PLAN_CONFIGS } from "@/lib/loans/plans";
import {
  GuideArticle,
  guideLink,
  KeyTakeaways,
  SeamCell,
  SeamGrid,
} from "../guide-parts";

const undergradRate = `${String(PLAN_CONFIGS.PLAN_2.repaymentRate * 100)}%`;
const postgradRate = `${String(PLAN_CONFIGS.POSTGRADUATE.repaymentRate * 100)}%`;

const linkClasses = guideLink;

export function SelfEmploymentGuide() {
  return (
    <GuideArticle
      breadcrumbLabel="Self-Employment"
      title="Student loans and self-employment"
      intro={
        <>
          If you&rsquo;re self-employed, your student loan repayments work
          differently from PAYE. Instead of automatic monthly deductions from
          your payslip, you repay through your annual{" "}
          <a
            href="https://www.gov.uk/self-assessment-tax-returns"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClasses}
          >
            Self Assessment tax return
          </a>{" "}
          — and that changes how you need to plan your finances.
        </>
      }
      related={{
        current: "self-employment",
        order: ["moving-abroad", "plan-2-vs-plan-5"],
        tools: ["/", "/repaid"],
        extraLinks: [
          {
            href: "https://www.gov.uk/repaying-your-student-loan/repaying-student-loans-overview",
            label: "GOV.UK: Repaying Your Student Loan",
          },
        ],
      }}
    >
      <section className="space-y-4">
        <Heading as="h2" size="section">
          How Repayments Work Through Self Assessment
        </Heading>

        <SeamGrid columns={2}>
          <SeamCell eyebrow="PAYE (employed)">
            <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
              <li>Monthly deductions from payslip</li>
              <li>Automatic — employer handles it</li>
              <li>Based on salary each pay period</li>
            </ul>
          </SeamCell>
          <SeamCell eyebrow="Self Assessment (self-employed)">
            <ul className="list-disc space-y-1.5 pl-5 marker:text-primary">
              <li>Annual lump sums (Jan &amp; Jul)</li>
              <li>You calculate and submit</li>
              <li>Based on net profit for the year</li>
            </ul>
          </SeamCell>
        </SeamGrid>

        <div className="space-y-3 text-muted-foreground">
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
            This means your repayments are <strong>annual</strong>, not monthly.
            You typically pay in two lump sums: one in January and one in July
            (as part of HMRC&rsquo;s{" "}
            <a
              href="https://www.gov.uk/understand-self-assessment-bill/payments-on-account"
              target="_blank"
              rel="noopener noreferrer"
              className={linkClasses}
            >
              payment on account
            </a>{" "}
            system). The repayment is {undergradRate} of your net profit above
            the repayment threshold for Plan 2 and Plan 5, or {postgradRate} for
            Postgraduate Loans.
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
        <p className="text-muted-foreground">
          HMRC looks at your total taxable income when calculating student loan
          repayments. For the self-employed, this includes:
        </p>
        <SeamGrid columns={3}>
          <SeamCell
            icon={
              <HugeiconsIcon
                icon={Calculator01Icon}
                className="size-5 text-primary"
              />
            }
            title="Net profit"
          >
            Revenue minus allowable business expenses from self-employment.
          </SeamCell>
          <SeamCell
            icon={
              <HugeiconsIcon
                icon={Briefcase01Icon}
                className="size-5 text-primary"
              />
            }
            title="Employment income"
          >
            Salary from a PAYE job if you also have one alongside freelancing.
          </SeamCell>
          <SeamCell
            icon={
              <HugeiconsIcon
                icon={Coins01Icon}
                className="size-5 text-primary"
              />
            }
            title="Other taxable income"
          >
            Rental income, dividends, interest above your personal savings
            allowance, etc.
          </SeamCell>
        </SeamGrid>
        <p className="text-muted-foreground">
          All of these sources are combined to determine whether you exceed the
          repayment threshold and how much you owe.
        </p>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Mixed Employment
        </Heading>
        <div className="space-y-3 text-muted-foreground">
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
              Your Self Assessment tops up the difference based on your combined
              total income
            </li>
          </ul>
          <p>
            For example, if your PAYE salary is below the threshold but your
            combined income (salary + freelance profit) is above it,
            you&rsquo;ll owe the full repayment through Self Assessment. If your
            PAYE income alone exceeds the threshold, your employer already
            deducts repayments — and Self Assessment adds further repayments on
            your self-employment profit.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Common Mistakes to Avoid
        </Heading>
        <SeamGrid columns={2}>
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
          ].map((mistake) => (
            <SeamCell
              key={mistake.title}
              icon={
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  className="size-5 text-signal"
                />
              }
              title={mistake.title}
            >
              {mistake.description}
            </SeamCell>
          ))}
        </SeamGrid>
      </section>

      <section className="space-y-4">
        <Heading as="h2" size="section">
          Practical Tips for Freelancers
        </Heading>
        <SeamGrid columns={2}>
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
          ].map((tip) => (
            <SeamCell
              key={tip.title}
              icon={
                <HugeiconsIcon
                  icon={BulbIcon}
                  className="size-5 text-primary"
                />
              }
              title={tip.title}
            >
              {tip.description}
            </SeamCell>
          ))}
        </SeamGrid>
      </section>

      <KeyTakeaways>
        <li>
          Self-employed borrowers repay through Self Assessment, not PAYE —
          expect annual lump-sum payments, not monthly deductions.
        </li>
        <li>
          Repayments are based on <strong>net profit</strong>, so claiming all
          legitimate business expenses directly reduces what you owe.
        </li>
        <li>
          If you have mixed income (PAYE + freelance), HMRC collects through
          both mechanisms based on your combined total income.
        </li>
        <li>
          Budget monthly by setting aside {undergradRate} of profit above the
          threshold to avoid being caught out by large tax bills.
        </li>
        <li>
          Estimate your annual repayments with the{" "}
          <Link href="/" className={guideLink}>
            student loan calculator
          </Link>
          .
        </li>
      </KeyTakeaways>
    </GuideArticle>
  );
}
