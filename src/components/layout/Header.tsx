import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { GovUkBadge } from "./GovUkBadge";
import { ShareButton } from "./ShareButton";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  repaymentYear?: number;
}

export function Header({ repaymentYear }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 p-3 sm:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className="mx-auto max-w-4xl">
        <header className="relative rounded-xl border bg-muted/50 px-3 pt-2 pb-4 shadow-lg backdrop-blur-sm sm:pb-2">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Go to home page">
              <BrandLogo size="sm" />
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden sm:block">
                <GovUkBadge />
              </div>
              <ThemeToggle />
              <ShareButton repaymentYear={repaymentYear} />
            </div>
          </div>
          {/* Mobile: floating trust seal straddling the header card edge */}
          <div className="absolute inset-x-0 bottom-0 flex justify-center sm:hidden">
            <div className="translate-y-1/2">
              <GovUkBadge className="shadow-md ring-2 ring-background" />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
