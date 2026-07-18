import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SHELL_WIDE } from "@/lib/layout";
import { GovUkBadge } from "./GovUkBadge";
import { ShareButton } from "./ShareButton";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  repaymentYear?: number;
}

// The header is global chrome: it is always the full-bleed shell (3440px cap +
// fluid gutter) so the logo and controls sit in the exact same place on every
// route. Page bodies vary their own width (PageLayout's reading column vs the
// full-bleed WideLayout) — the header must not, or navigating between page
// types would shift it.
export function Header({ repaymentYear }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 border-b-2 border-rule bg-background/85 backdrop-blur-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className={`mx-auto ${SHELL_WIDE}`}>
        <header className="flex items-center justify-between gap-3 py-3">
          <Link href="/" aria-label="Go to home page">
            <BrandLogo size="sm" />
          </Link>
          <div className="flex shrink-0 items-center gap-2">
            <div className="hidden xs:block">
              <GovUkBadge />
            </div>
            <ThemeToggle />
            <ShareButton repaymentYear={repaymentYear} />
          </div>
        </header>
      </div>
    </div>
  );
}
