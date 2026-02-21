"use client";

import { Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { ShareButton } from "./ShareButton";
import ThemeToggle from "./ThemeToggle";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
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
              <Popover>
                <PopoverTrigger
                  render={
                    <Badge
                      variant="outline"
                      className="hidden cursor-pointer gap-1 text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                    />
                  }
                >
                  <HugeiconsIcon icon={Tick02Icon} className="size-3" />
                  GOV.UK {formattedDate}
                </PopoverTrigger>
                <PopoverContent className="w-auto max-w-64">
                  <PopoverHeader>
                    <PopoverTitle>
                      Rates &amp; thresholds as of {formattedDate}
                    </PopoverTitle>
                    <PopoverDescription>
                      Verified daily against GOV.UK and the Bank of England.
                    </PopoverDescription>
                  </PopoverHeader>
                  <Link
                    href="/our-data"
                    className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    How we stay current&nbsp;&rarr;
                  </Link>
                </PopoverContent>
              </Popover>
              <ThemeToggle />
              <ShareButton repaymentYear={repaymentYear} />
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
