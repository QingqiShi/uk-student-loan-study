import { LinkIndex, LinkIndexRow } from "@/components/instrument/LinkIndex";
import { Heading } from "@/components/typography/Heading";
import type { GuideEntry, GuideSlug } from "@/lib/guides";
import { GUIDES } from "@/lib/guides";

interface ExtraLink {
  href: string;
  label: string;
}

interface ToolLink {
  href: string;
  title: string;
  description: string;
}

/** Calculator/tool destinations a guide can cross-link to. */
const TOOLS: Partial<Record<string, ToolLink>> = {
  "/": {
    href: "/",
    title: "Student loan repayment calculator",
    description: "See how much you will repay in total at your salary.",
  },
  "/overpay": {
    href: "/overpay",
    title: "Overpay calculator",
    description: "Pay off faster or invest instead?",
  },
  "/repaid": {
    href: "/repaid",
    title: "When will it be paid off?",
    description: "Your payoff year and total lifetime repayments.",
  },
  "/balance": {
    href: "/balance",
    title: "Payoff timeline",
    description: "Watch your balance rise and fall year by year.",
  },
  "/interest": {
    href: "/interest",
    title: "Interest paid",
    description: "How much of your repayments is pure interest.",
  },
  "/effective-rate": {
    href: "/effective-rate",
    title: "Effective rate",
    description: "Your effective rate vs the Bank of England base rate.",
  },
  "/which-plan": {
    href: "/which-plan",
    title: "Which plan quiz",
    description: "Find out which repayment plan you are on.",
  },
  "/plans": {
    href: "/plans",
    title: "Compare loan plans",
    description: "Thresholds, interest and write-off for every plan.",
  },
};

const DEFAULT_TOOLS = ["/", "/overpay"];

interface RelatedGuidesProps {
  current: GuideSlug;
  order: GuideSlug[];
  extraLinks?: ExtraLink[];
  /** Calculator hrefs to feature under "More tools" (keys of TOOLS). */
  tools?: string[];
}

export function RelatedGuides({
  current,
  order,
  extraLinks,
  tools = DEFAULT_TOOLS,
}: RelatedGuidesProps) {
  const guidesBySlug = new Map(GUIDES.map((g) => [g.slug, g]));
  const orderedGuides = order
    .filter((slug) => slug !== current)
    .map((slug) => guidesBySlug.get(slug))
    .filter((g): g is GuideEntry => g !== undefined)
    .slice(0, 2);

  const toolLinks = tools
    .map((href) => TOOLS[href])
    .filter((t): t is ToolLink => t !== undefined);

  return (
    <div className="space-y-10 border-t border-border pt-10">
      <section className="space-y-4" aria-labelledby="related-guides-h">
        <Heading as="h2" size="section" id="related-guides-h">
          Related guides
        </Heading>
        <LinkIndex>
          {orderedGuides.map((guide) => (
            <LinkIndexRow
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              title={guide.title}
              description={guide.description}
            />
          ))}
        </LinkIndex>
      </section>

      {extraLinks && extraLinks.length > 0 && (
        <section className="space-y-4" aria-labelledby="references-h">
          <Heading as="h2" size="section" id="references-h">
            References
          </Heading>
          <LinkIndex>
            {extraLinks.map((link) => (
              <LinkIndexRow
                key={link.href}
                href={link.href}
                title={link.label}
                external
              />
            ))}
          </LinkIndex>
        </section>
      )}

      {toolLinks.length > 0 && (
        <section className="space-y-4" aria-labelledby="more-tools-h">
          <Heading as="h2" size="section" id="more-tools-h">
            More tools
          </Heading>
          <LinkIndex>
            {toolLinks.map((tool) => (
              <LinkIndexRow
                key={tool.href}
                href={tool.href}
                title={tool.title}
                description={tool.description}
              />
            ))}
          </LinkIndex>
        </section>
      )}
    </div>
  );
}
