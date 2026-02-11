"use client";

import Link from "next/link";
import { BrandLogo } from "./brand/BrandLogo";
import { ShareButton } from "./ShareButton";
import ThemeToggle from "./ThemeToggle";

interface HeaderProps {
  repaymentYear?: number;
}

export function Header({ repaymentYear }: HeaderProps) {
  return (
    <div className="sticky top-0 z-50 px-3 pt-3">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-2 focus:text-foreground"
      >
        Skip to main content
      </a>
      <div className="mx-auto max-w-4xl">
        <header className="rounded-xl border bg-muted/50 px-3 py-2 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <Link href="/" aria-label="Go to home page">
              <BrandLogo size="small" />
            </Link>
            <div className="flex shrink-0 items-center gap-2">
              <ThemeToggle />
              <ShareButton repaymentYear={repaymentYear} />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
