import Link from "next/link";
import { LinkArrow } from "@/components/instrument/LinkArrow";
import { cn } from "@/lib/utils";

/**
 * The Instrument row-index: a flat, borderless list of hairline-separated links
 * used wherever the site presents a related-content or tools list — the guide
 * footers, the calculator detail pages, and the plan CTAs. Per DESIGN §5 these
 * editorial lists are "not cards, no boxes": rows are separated by 1px seams
 * alone, each a bold title + dek + spruce arrow that slides on hover, matching
 * the homepage "Go deeper" rail. One code path keeps every such list reading as
 * the same instrument.
 */

/**
 * Two columns from `work`, seamed vertically instead of horizontally — for a
 * short index standing in a section cell wide enough that one stacked column
 * would leave most of the band empty. Below `work` it is the ordinary list.
 */
const TWO_UP =
  "work:grid work:grid-cols-2 work:divide-x work:divide-y-0 work:divide-border work:[&>*]:py-0 work:[&>*:not(:first-child)]:pl-[clamp(1.5rem,2.5vw,3rem)] work:[&>*:not(:last-child)]:pr-[clamp(1.5rem,2.5vw,3rem)]";

/** A flat, borderless linked index wrapping {@link LinkIndexRow}s. */
export function LinkIndex({
  columns = 1,
  children,
  className,
}: {
  /** Lay the rows out in two columns from `work`. Defaults to one. */
  columns?: 1 | 2;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "divide-y divide-border",
        columns === 2 && TWO_UP,
        className,
      )}
    >
      {children}
    </div>
  );
}

const ROW_CLASS =
  "group flex flex-col gap-1 py-4 no-underline transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset first:pt-0 sm:py-5";

function RowInner({
  title,
  description,
  badge,
  external,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  external?: boolean;
}) {
  return (
    <>
      <div className="flex items-center gap-2.5">
        <span className="font-semibold text-foreground transition-colors group-hover:text-cta group-focus-visible:text-cta">
          {title}
        </span>
        {badge != null && (
          <span className="rounded-full bg-accent-wash px-2 py-0.5 text-xs font-semibold tracking-wide text-cta uppercase">
            {badge}
          </span>
        )}
        <LinkArrow
          external={external}
          className={cn(
            "ml-auto text-faint transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-primary group-focus-visible:translate-x-0.5 group-focus-visible:text-primary",
            external && "group-focus-visible:-translate-y-0.5",
          )}
        />
        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </div>
      {description != null && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </>
  );
}

/** One row of a {@link LinkIndex}: bold title, spruce arrow, dek beneath. */
export function LinkIndexRow({
  href,
  title,
  description,
  badge,
  external,
}: {
  href: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  external?: boolean;
}) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={ROW_CLASS}
      >
        <RowInner
          title={title}
          description={description}
          badge={badge}
          external
        />
      </a>
    );
  }
  return (
    <Link href={href} className={ROW_CLASS}>
      <RowInner title={title} description={description} badge={badge} />
    </Link>
  );
}
