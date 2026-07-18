import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SHELL_WIDE } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { GovUkBadge } from "./GovUkBadge";
import { ShareButton } from "./ShareButton";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  repaymentYear?: number;
  /** Full-bleed shell (homepage): 3440px cap + fold gutter instead of the
   *  default max-w-4xl reading column. */
  wide?: boolean;
}

export function Header({ repaymentYear, wide = false }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 border-b-2 border-rule bg-background/85 backdrop-blur-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className={cn("mx-auto", wide ? SHELL_WIDE : "max-w-4xl px-3")}>
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
