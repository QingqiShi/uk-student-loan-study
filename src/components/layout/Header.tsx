"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { ShareButton } from "./ShareButton";
import ThemeToggle from "./ThemeToggle";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { LAST_UPDATED } from "@/lib/loans/plans";

const formattedDate = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
}).format(new Date(LAST_UPDATED));

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
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <Badge className="bg-green-200 text-green-800 dark:bg-green-950 dark:text-green-300">
                      <HugeiconsIcon icon={Tick02Icon} className="size-3" />
                      GOV.UK {formattedDate}
                    </Badge>
                  }
                />
                <HoverCardContent className="w-auto max-w-64 space-y-1.5">
                  <p className="text-sm font-medium">
                    Rates &amp; thresholds as of {formattedDate}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verified daily against GOV.UK and the Bank of England.
                  </p>
                  <Link
                    href="/our-data"
                    className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    How we stay current&nbsp;&rarr;
                  </Link>
                </HoverCardContent>
              </HoverCard>
              <ThemeToggle />
              <ShareButton repaymentYear={repaymentYear} />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
