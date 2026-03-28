import Link from "next/link";
import { GUIDES } from "@/lib/guides";

const NAV_LINK_CLASS =
  "text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-4xl px-3 py-8 sm:py-10">
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-1 gap-8 text-sm xs:grid-cols-2 md:grid-cols-4"
        >
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Calculators
            </h3>
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
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Charts
            </h3>
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
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Guides
            </h3>
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
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              About
            </h3>
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
