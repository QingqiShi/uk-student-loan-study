import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  /** Intermediate crumbs between Home and the current page. */
  parents?: BreadcrumbItem[];
  /** Label for the current (non-linked) page. Omit if this IS the last parent. */
  currentTitle?: string;
}

export function Breadcrumb({ parents, currentTitle }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-sm text-muted-foreground"
    >
      <Link href="/" className="transition-colors hover:text-foreground">
        Home
      </Link>
      {parents?.map((crumb) => (
        <span key={crumb.href} className="contents">
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          <Link
            href={crumb.href}
            className="transition-colors hover:text-foreground"
          >
            {crumb.label}
          </Link>
        </span>
      ))}
      {currentTitle && (
        <>
          <HugeiconsIcon icon={ArrowRight01Icon} className="size-3" />
          <span className="text-foreground">{currentTitle}</span>
        </>
      )}
    </nav>
  );
}
