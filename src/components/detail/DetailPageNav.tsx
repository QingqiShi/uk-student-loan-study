"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DETAIL_PAGES } from "@/lib/detail-pages";
import { cn } from "@/lib/utils";

export function DetailPageNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Loan breakdown pages"
      className="relative -mx-3 overflow-hidden sm:mx-0 sm:overflow-visible"
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-linear-to-l from-background to-transparent sm:hidden" />
      <div className="flex gap-1.5 overflow-x-auto px-3 pr-8 scrollbar-none sm:px-0 sm:pr-0">
        {DETAIL_PAGES.map((page) => {
          const isActive = pathname === page.href;
          return (
            <Link
              key={page.href}
              href={page.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-card shadow-sm ring-1 ring-foreground/10"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full",
                  isActive && "ring-2 ring-offset-1 ring-offset-card",
                )}
                style={{ backgroundColor: page.color }}
              />
              <span className="hidden sm:inline">{page.label}</span>
              <span className="sm:hidden">{page.shortLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
