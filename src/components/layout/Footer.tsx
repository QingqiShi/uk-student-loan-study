import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Eyebrow } from "@/components/typography/Eyebrow";
import { GUIDES } from "@/lib/guides";
import { SHELL_WIDE } from "@/lib/layout";

const NAV_LINK_CLASS =
  "text-muted-foreground transition-colors hover:text-foreground";

// Global chrome — always the full-bleed shell so the footer aligns with the
// header and never shifts between page types (see Header for the rationale).
export function Footer() {
  return (
    <footer className="border-t-2 border-rule bg-background">
      <div className={`mx-auto py-10 sm:py-12 ${SHELL_WIDE}`}>
        <div className="mb-10 flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <BrandLogo size="sm" />
            <p className="max-w-sm text-sm text-muted-foreground">
              Independent UK student loan calculator. Figures sourced from
              GOV.UK and the Bank of England.
            </p>
          </div>
          <Eyebrow marker={false}>studentloanstudy.uk</Eyebrow>
        </div>
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-1 gap-8 text-sm xs:grid-cols-2 md:grid-cols-4"
        >
          <div className="space-y-3">
            <Eyebrow as="h3" marker={false}>
              Calculators
            </Eyebrow>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={NAV_LINK_CLASS}>
                  Repayment Forecast
                </Link>
              </li>
              <li>
                <Link href="/overpay" className={NAV_LINK_CLASS}>
                  Overpay Calculator
                </Link>
              </li>
              <li>
                <Link href="/which-plan" className={NAV_LINK_CLASS}>
                  Which Plan Quiz
                </Link>
              </li>
              <li>
                <Link href="/plans" className={NAV_LINK_CLASS}>
                  Loan Plans Explained
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <Eyebrow as="h3" marker={false}>
              Charts
            </Eyebrow>
            <ul className="space-y-2">
              <li>
                <Link href="/balance" className={NAV_LINK_CLASS}>
                  Payoff Timeline
                </Link>
              </li>
              <li>
                <Link href="/interest" className={NAV_LINK_CLASS}>
                  Interest Paid
                </Link>
              </li>
              <li>
                <Link href="/effective-rate" className={NAV_LINK_CLASS}>
                  Effective Rate
                </Link>
              </li>
              <li>
                <Link href="/repaid" className={NAV_LINK_CLASS}>
                  Total Repayments
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <Eyebrow as="h3" marker={false}>
              Guides
            </Eyebrow>
            <ul className="space-y-2">
              {GUIDES.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    href={`/guides/${guide.slug}`}
                    className={NAV_LINK_CLASS}
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <Eyebrow as="h3" marker={false}>
              About
            </Eyebrow>
            <ul className="space-y-2">
              <li>
                <Link href="/our-data" className={NAV_LINK_CLASS}>
                  Our Data
                </Link>
              </li>
              <li>
                <Link href="/brand" className={NAV_LINK_CLASS}>
                  Brand Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground sm:text-sm">
            This calculator is for illustrative purposes only and does not
            constitute financial advice. Calculations are based on current UK
            student loan rules and may change. For personalised guidance,
            consult a qualified financial adviser.
          </p>
        </div>
      </div>
    </footer>
  );
}
