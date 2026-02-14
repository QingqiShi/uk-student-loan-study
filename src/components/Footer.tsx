import Link from "next/link";

const NAV_LINK_CLASS =
  "text-muted-foreground/70 transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-4xl px-3 py-8 sm:py-10">
        <nav
          aria-label="Footer navigation"
          className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3"
        >
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground/50 uppercase">
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
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground/50 uppercase">
              Learn
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className={NAV_LINK_CLASS}>
                  All Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/plan-2-vs-plan-5"
                  className={NAV_LINK_CLASS}
                >
                  Plan 2 vs Plan 5
                </Link>
              </li>
              <li>
                <Link
                  href="/guides/how-interest-works"
                  className={NAV_LINK_CLASS}
                >
                  How Interest Works
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-span-2 space-y-3 sm:col-span-1">
            <h3 className="text-xs font-semibold tracking-wider text-muted-foreground/50 uppercase">
              About
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/brand" className={NAV_LINK_CLASS}>
                  Brand Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground/60 sm:text-sm">
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
