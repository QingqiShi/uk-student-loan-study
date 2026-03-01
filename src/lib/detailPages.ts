export interface DetailPageConfig {
  href: string;
  label: string;
  shortLabel: string;
  color: string;
}

export const DETAIL_PAGES: DetailPageConfig[] = [
  {
    href: "/repaid",
    label: "Payoff Timeline",
    shortLabel: "Payoff",
    color: "var(--chart-1)",
  },
  {
    href: "/balance",
    label: "Balance Over Time",
    shortLabel: "Balance",
    color: "var(--chart-2)",
  },
  {
    href: "/interest",
    label: "Interest Paid",
    shortLabel: "Interest",
    color: "var(--chart-3)",
  },
  {
    href: "/effective-rate",
    label: "Effective Rate",
    shortLabel: "Eff. Rate",
    color: "var(--chart-4)",
  },
];

export const DETAIL_PAGE_COLOR: Record<string, string> = Object.fromEntries(
  DETAIL_PAGES.map((p) => [p.href, p.color]),
);

export interface ToolPageConfig extends DetailPageConfig {
  separated?: boolean;
}

export const TOOL_PAGES: ToolPageConfig[] = [
  {
    href: "/",
    label: "Overview",
    shortLabel: "Overview",
    color: "var(--primary)",
  },
  ...DETAIL_PAGES,
  {
    href: "/overpay",
    label: "Overpay",
    shortLabel: "Overpay",
    color: "var(--chart-overpay)",
    separated: true,
  },
];
