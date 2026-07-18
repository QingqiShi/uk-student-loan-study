import { LinkIndex, LinkIndexRow } from "@/components/instrument/LinkIndex";

interface CtaLink {
  href: string;
  title: string;
  description: string;
}

const LINKS: CtaLink[] = [
  {
    href: "/",
    title: "Student loan repayment calculator",
    description: "See exactly how much you'll repay in total at your salary.",
  },
  {
    href: "/which-plan",
    title: "Which plan am I on?",
    description: "Answer 3 quick questions to confirm your plan type.",
  },
  {
    href: "/overpay",
    title: "Overpay calculator",
    description: "Should you pay your loan off faster or invest instead?",
  },
];

/**
 * The core tools shown at the foot of each plan page. One borderless linked
 * index — the same code path and treatment as the guide footers and the
 * homepage "Go deeper" rail — never floating icon-cards.
 */
export function PlanCtaCards() {
  return (
    <LinkIndex>
      {LINKS.map((link) => (
        <LinkIndexRow
          key={link.href}
          href={link.href}
          title={link.title}
          description={link.description}
        />
      ))}
    </LinkIndex>
  );
}
