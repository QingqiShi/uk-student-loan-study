export interface DetailPageConfig {
  href: string;
  label: string;
  shortLabel: string;
  color: string;
}

/**
 * The four drill-down metrics.
 *
 * `label` is the site's one name for each metric, and it has to be that one name
 * everywhere the reader can see it — the homepage cell they click, the h1 they
 * land on, and this band repeating the set on the far page. A metric that
 * renames itself across a click reads as a different metric. Names follow
 * CONTEXT.md.
 */
export const DETAIL_PAGES: DetailPageConfig[] = [
  {
    href: "/repaid",
    label: "Total repaid",
    shortLabel: "Repaid",
    color: "var(--chart-1)",
  },
  {
    href: "/balance",
    label: "Payoff timeline",
    shortLabel: "Payoff",
    color: "var(--chart-2)",
  },
  {
    href: "/interest",
    label: "Interest paid",
    shortLabel: "Interest",
    color: "var(--chart-3)",
  },
  {
    href: "/effective-rate",
    label: "Effective rate",
    shortLabel: "Eff. rate",
    color: "var(--chart-4)",
  },
];

export const DETAIL_PAGE_COLOR: Record<string, string> = Object.fromEntries(
  DETAIL_PAGES.map((p) => [p.href, p.color]),
);
